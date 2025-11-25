/**
 * Script de Migração: localStorage → Firebase Firestore
 * 
 * Migra todos os dados do localStorage para o Firestore.
 * Executado uma vez na primeira inicialização.
 */

import { firebaseService } from '../services/firebase-service.js';
import { firebaseCache } from '../services/firebase-cache.js';

const USER_ID = 'default';

/**
 * Executa migração completa do localStorage para Firestore
 */
export async function migrateLocalStorageToFirebase() {
    console.log('🔄 Iniciando migração localStorage → Firestore...');

    try {
        // Verificar se já migrou
        const migrated = await firebaseCache.get('firestore-migration-completed');
        if (migrated) {
            console.log('✅ Migração já foi concluída anteriormente');
            return { success: true, skipped: true };
        }

        // Inicializar cache
        await firebaseCache.init();

        const results = {
            tarefas: 0,
            rotina: 0,
            categorias: 0,
            estudos: 0,
            notas: 0,
            config: 0,
            errors: []
        };

        // 1. Migrar tarefas de projetos e home
        await migrateTarefas(results);

        // 2. Migrar rotina
        await migrateRotina(results);

        // 3. Migrar categorias
        await migrateCategorias(results);

        // 4. Migrar estudos
        await migrateEstudos(results);

        // 5. Migrar notas
        await migrateNotas(results);

        // 6. Migrar configurações
        await migrateConfig(results);

        // Marcar migração como concluída
        await firebaseCache.set('firestore-migration-completed', {
            timestamp: new Date().toISOString(),
            results
        });

        console.log('✅ Migração concluída:', results);
        return { success: true, results };
    } catch (error) {
        console.error('❌ Erro na migração:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Migra tarefas de projetos e home
 */
async function migrateTarefas(results) {
    try {
        // Tentar estado v3 primeiro
        const v3State = localStorage.getItem('gerenciador_v3_state');
        let tarefas = [];
        let tarefasHome = [];

        if (v3State) {
            const state = JSON.parse(v3State);
            tarefas = state.tarefas || [];
            tarefasHome = state.tarefasHome || [];
        } else {
            // Fallback para v2
            const projetos = localStorage.getItem('tarefas_projetos_v2');
            if (projetos) {
                tarefas = JSON.parse(projetos);
            }
        }

        // Salvar tarefas no Firestore
        const batch = [];
        for (const tarefa of tarefas) {
            if (tarefa.id) {
                batch.push({
                    type: 'set',
                    collection: 'tarefas',
                    docId: tarefa.id,
                    data: {
                        ...tarefa,
                        tipo: 'projeto',
                        updatedAt: new Date().toISOString(),
                    },
                    merge: false,
                });
            }
        }

        for (const tarefa of tarefasHome) {
            if (tarefa.id) {
                batch.push({
                    type: 'set',
                    collection: 'tarefas',
                    docId: tarefa.id,
                    data: {
                        ...tarefa,
                        tipo: 'home',
                        updatedAt: new Date().toISOString(),
                    },
                    merge: false,
                });
            }
        }

        if (batch.length > 0 && firebaseService.isAvailable()) {
            await firebaseService.batchWrite(batch);
            results.tarefas = batch.length;
            console.log(`✅ Migradas ${batch.length} tarefas`);
        }
    } catch (error) {
        results.errors.push({ type: 'tarefas', error: error.message });
        console.error('Erro ao migrar tarefas:', error);
    }
}

/**
 * Migra dados de rotina
 */
async function migrateRotina(results) {
    try {
        let tarefasRotina = [];
        let historico = [];

        // Tentar estado v3 primeiro
        const v3State = localStorage.getItem('gerenciador_v3_state');
        if (v3State) {
            const state = JSON.parse(v3State);
            tarefasRotina = state.tarefasRotina || [];
            historico = state.historico || [];
        } else {
            // Fallback para v2
            const rotina = localStorage.getItem('tarefas_rotina_v5');
            if (rotina) {
                tarefasRotina = JSON.parse(rotina);
            }

            const hist = localStorage.getItem('historico_rotina_v5');
            if (hist) {
                historico = JSON.parse(hist);
            }
        }

        if ((tarefasRotina.length > 0 || historico.length > 0) && firebaseService.isAvailable()) {
            await firebaseService.setDocument('rotina', USER_ID, {
                tarefasRotina,
                historico,
                contadorRotina: tarefasRotina.length,
                updatedAt: new Date().toISOString(),
            }, false);

            results.rotina = tarefasRotina.length + historico.length;
            console.log(`✅ Migrados dados de rotina (${tarefasRotina.length} tarefas, ${historico.length} histórico)`);
        }
    } catch (error) {
        results.errors.push({ type: 'rotina', error: error.message });
        console.error('Erro ao migrar rotina:', error);
    }
}

/**
 * Migra categorias
 */
async function migrateCategorias(results) {
    try {
        let categorias = [];

        // Tentar estado v3 primeiro
        const v3State = localStorage.getItem('gerenciador_v3_state');
        if (v3State) {
            const state = JSON.parse(v3State);
            categorias = state.categorias || [];
        } else {
            // Fallback para v2
            const cats = localStorage.getItem('categorias_rotina_v4');
            if (cats) {
                categorias = JSON.parse(cats);
            }
        }

        if (categorias.length > 0 && firebaseService.isAvailable()) {
            const batch = [];
            for (const categoria of categorias) {
                if (categoria.id) {
                    batch.push({
                        type: 'set',
                        collection: 'categorias',
                        docId: categoria.id,
                        data: {
                            ...categoria,
                            updatedAt: new Date().toISOString(),
                        },
                        merge: false,
                    });
                }
            }

            if (batch.length > 0) {
                await firebaseService.batchWrite(batch);
                results.categorias = batch.length;
                console.log(`✅ Migradas ${batch.length} categorias`);
            }
        }
    } catch (error) {
        results.errors.push({ type: 'categorias', error: error.message });
        console.error('Erro ao migrar categorias:', error);
    }
}

/**
 * Migra dados de estudos
 */
async function migrateEstudos(results) {
    try {
        let areasEstudo = [];
        let topicosEstudo = [];
        let tagsEstudo = [];
        let configEstudos = {};

        // Tentar estado v3 primeiro
        const v3State = localStorage.getItem('gerenciador_v3_state');
        if (v3State) {
            const state = JSON.parse(v3State);
            areasEstudo = state.areasEstudo || [];
            topicosEstudo = state.topicosEstudo || [];
            tagsEstudo = state.tagsEstudo || [];
            configEstudos = state.configEstudos || {};
        } else {
            // Fallback para estudos v2
            const estudos = localStorage.getItem('estudos_dados_v2');
            if (estudos) {
                const estudosData = JSON.parse(estudos);
                areasEstudo = estudosData.areas || [];
                topicosEstudo = estudosData.topicos || [];
                tagsEstudo = estudosData.tags || [];
                configEstudos = estudosData.config || {};
            }
        }

        // Também tentar estudos-store v3
        const estudosStore = localStorage.getItem('estudos_v3');
        if (estudosStore && areasEstudo.length === 0 && topicosEstudo.length === 0) {
            const estudosData = JSON.parse(estudosStore);
            areasEstudo = estudosData.areas || [];
            topicosEstudo = estudosData.topicos || [];
        }

        if ((areasEstudo.length > 0 || topicosEstudo.length > 0) && firebaseService.isAvailable()) {
            await firebaseService.setDocument('estudos', USER_ID, {
                areasEstudo,
                topicosEstudo,
                tagsEstudo,
                configEstudos,
                contadorEstudos: topicosEstudo.length,
                updatedAt: new Date().toISOString(),
            }, false);

            results.estudos = areasEstudo.length + topicosEstudo.length;
            console.log(`✅ Migrados dados de estudos (${areasEstudo.length} áreas, ${topicosEstudo.length} tópicos)`);
        }
    } catch (error) {
        results.errors.push({ type: 'estudos', error: error.message });
        console.error('Erro ao migrar estudos:', error);
    }
}

/**
 * Migra notas rápidas
 */
async function migrateNotas(results) {
    try {
        const notas = [];
        
        // Buscar todas as notas no localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('notas_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    notas.push({
                        key: key.replace('notas_', ''),
                        data
                    });
                } catch (e) {
                    console.warn(`Erro ao migrar nota ${key}:`, e);
                }
            }
        }

        if (notas.length > 0 && firebaseService.isAvailable()) {
            const batch = [];
            for (const nota of notas) {
                batch.push({
                    type: 'set',
                    collection: 'notas',
                    docId: `notas_${nota.key}`,
                    data: {
                        topicoId: nota.data.topicoId || nota.key,
                        content: nota.data.content || '',
                        timestamp: nota.data.timestamp || new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                    merge: false,
                });
            }

            if (batch.length > 0) {
                await firebaseService.batchWrite(batch);
                results.notas = batch.length;
                console.log(`✅ Migradas ${batch.length} notas`);
            }
        }
    } catch (error) {
        results.errors.push({ type: 'notas', error: error.message });
        console.error('Erro ao migrar notas:', error);
    }
}

/**
 * Migra configurações
 */
async function migrateConfig(results) {
    try {
        let streak = 0;
        let conquistas = {};
        let avaliacoesDiarias = [];
        let darkMode = false;
        let filtroStatus = null;

        // Tentar estado v3 primeiro
        const v3State = localStorage.getItem('gerenciador_v3_state');
        if (v3State) {
            const state = JSON.parse(v3State);
            streak = state.streak || 0;
            conquistas = state.conquistas || {};
            avaliacoesDiarias = state.avaliacoesDiarias || [];
            darkMode = state.darkMode || false;
            filtroStatus = state.filtroStatus || null;
        } else {
            // Fallback para avaliações v1
            const avaliacoes = localStorage.getItem('avaliacoes_diarias_v1');
            if (avaliacoes) {
                avaliacoesDiarias = JSON.parse(avaliacoes);
            }
        }

        if (firebaseService.isAvailable()) {
            await firebaseService.setDocument('config', USER_ID, {
                streak,
                conquistas,
                avaliacoesDiarias,
                darkMode,
                filtroStatus,
                ultimaAtualizacao: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }, false);

            results.config = 1;
            console.log('✅ Migradas configurações');
        }
    } catch (error) {
        results.errors.push({ type: 'config', error: error.message });
        console.error('Erro ao migrar configurações:', error);
    }
}

/**
 * Cria backup dos dados do localStorage antes da migração
 */
export async function createBackup() {
    const backup = {};
    
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                try {
                    backup[key] = localStorage.getItem(key);
                } catch (e) {
                    console.warn(`Erro ao fazer backup de ${key}:`, e);
                }
            }
        }

        // Salvar backup no cache
        await firebaseCache.init();
        await firebaseCache.set('localStorage-backup', {
            timestamp: new Date().toISOString(),
            data: backup
        });

        console.log('✅ Backup criado com sucesso');
        return { success: true, itemCount: Object.keys(backup).length };
    } catch (error) {
        console.error('❌ Erro ao criar backup:', error);
        return { success: false, error: error.message };
    }
}

// Exportar função principal
export default migrateLocalStorageToFirebase;

