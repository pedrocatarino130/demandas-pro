/**
 * Sistema de Estado Global
 * Gerencia estado centralizado com sincronização automática ao Firebase Firestore
 */

import {
    firebaseService
} from './services/firebase-service.js';
import {
    firebaseCache
} from './services/firebase-cache.js';
import {
    firebaseSync
} from './services/firebase-sync.js';

class Store {
    constructor() {
        this.state = this.getDefaultState();
        this.subscribers = [];
        this.saveDebounce = null;
        this.DEBOUNCE_DELAY = 300; // ms
        this.initialized = false;
        this.initializing = false;
        this.listeners = []; // Firestore listeners
        this.userId = 'default'; // Para futuro suporte de autenticação

        // Inicializar assincronamente
        this.init();
    }

    /**
     * Inicialização assíncrona do Firebase
     */
    async init() {
        // Inicializar cache
        await firebaseCache.init();

        // Carregar estado do cache primeiro (para mostrar algo imediatamente)
        const cachedState = await this.loadFromCache();
        if (cachedState) {
            this.state = {
                ...this.getDefaultState(),
                ...cachedState
            };
            this.notify();
        }

        // Tentar carregar do Firestore
        await this.loadFromFirestore();

        // Executar migração completa do localStorage para Firestore
        this.runMigration();

        // Configurar listeners em tempo real
        this.setupRealtimeListeners();

        this.initialized = true;
        console.log('✅ Store inicializado com Firebase');
    }

    /**
     * Estado padrão da aplicação
     */
    getDefaultState() {
        return {
            // Projetos
            tarefas: [],
            contador: 0,

            // Home
            tarefasHome: [],
            contadorHome: 0,

            // Rotina
            tarefasRotina: [],
            contadorRotina: 0,
            historico: [],
            categorias: [],

            // Estudos
            areasEstudo: [],
            topicosEstudo: [],
            sessoesEstudo: [],
            contadorEstudos: 0,
            tagsEstudo: [],
            configEstudos: {
                revisaoEspacada: {
                    ativo: true,
                    intervalos: [7, 15, 30],
                },
                notificacoes: true,
                viewPadrao: 'kanban',
            },

            // Gamificação
            streak: 0,
            conquistas: {},
            avaliacoesDiarias: [],

            // UI
            darkMode: false,
            filtroStatus: null,
            diaAtual: new Date().toISOString().split('T')[0],

            // Meta
            ultimaAtualizacao: new Date().toISOString(),
        };
    }

    /**
     * Carrega estado do cache local
     */
    async loadFromCache() {
        try {
            const cached = await firebaseCache.get('store-state');
            if (cached && typeof cached === 'object') {
                return {
                    ...this.getDefaultState(),
                    ...cached
                };
            }
        } catch (error) {
            console.warn('Erro ao carregar estado do cache:', error);
        }
        return null;
    }

    /**
     * Carrega estado do Firestore
     */
    async loadFromFirestore() {
        try {
            if (!firebaseService.isAvailable()) {
                console.warn('Firestore não disponível, usando cache apenas');
                return;
            }

            // Carregar dados de diferentes coleções
            const [tarefas, rotina, categorias, estudos, config] = await Promise.all([
                firebaseService.getCollection('tarefas'),
                firebaseService.getDocument('rotina', this.userId),
                firebaseService.getCollection('categorias'),
                firebaseService.getDocument('estudos', this.userId),
                firebaseService.getDocument('config', this.userId),
            ]);

            // Montar estado a partir dos dados do Firestore
            const newState = {
                ...this.getDefaultState(),
            };

            // Tarefas (projetos e home)
            if (Array.isArray(tarefas)) {
                tarefas.forEach(task => {
                    if (task.tipo === 'projeto') {
                        newState.tarefas.push(task);
                    } else if (task.tipo === 'home') {
                        newState.tarefasHome.push(task);
                    }
                });
                newState.contador = newState.tarefas.length;
                newState.contadorHome = newState.tarefasHome.length;
            }

            // Rotina
            if (rotina) {
                newState.tarefasRotina = rotina.tarefasRotina || [];
                newState.contadorRotina = rotina.contadorRotina || 0;
                newState.historico = rotina.historico || [];
            }

            // Categorias
            if (Array.isArray(categorias)) {
                newState.categorias = categorias;
            }

            // Estudos
            if (estudos) {
                newState.areasEstudo = estudos.areasEstudo || [];
                newState.topicosEstudo = estudos.topicosEstudo || [];
                newState.sessoesEstudo = estudos.sessoesEstudo || [];
                newState.contadorEstudos = estudos.contadorEstudos || 0;
                newState.tagsEstudo = estudos.tagsEstudo || [];
                if (estudos.configEstudos) {
                    newState.configEstudos = {
                        ...newState.configEstudos,
                        ...estudos.configEstudos
                    };
                }
            }

            // Config
            if (config) {
                newState.streak = config.streak || 0;
                newState.conquistas = config.conquistas || {};
                newState.avaliacoesDiarias = config.avaliacoesDiarias || [];
                newState.darkMode = config.darkMode || false;
                newState.filtroStatus = config.filtroStatus || null;
                if (config.diaAtual) {
                    newState.diaAtual = config.diaAtual;
                }
                if (config.ultimaAtualizacao) {
                    newState.ultimaAtualizacao = config.ultimaAtualizacao;
                }
            }

            // Atualizar estado
            this.state = newState;
            await firebaseCache.set('store-state', newState);
            this.notify();
        } catch (error) {
            console.error('Erro ao carregar estado do Firestore:', error);
        }
    }

    /**
     * Salva estado no Firestore com debounce
     */
    saveToFirestore() {
        if (this.saveDebounce) {
            clearTimeout(this.saveDebounce);
        }

        this.saveDebounce = setTimeout(async () => {
            try {
                const stateToSave = {
                    ...this.state,
                    ultimaAtualizacao: new Date().toISOString(),
                };

                // Salvar no cache imediatamente
                await firebaseCache.set('store-state', stateToSave);

                // Organizar dados em coleções do Firestore
                if (firebaseService.isAvailable()) {
                    await this._saveCollectionsToFirestore(stateToSave);
                }
            } catch (error) {
                console.error('Erro ao salvar estado no Firestore:', error);
            }
        }, this.DEBOUNCE_DELAY);
    }

    /**
     * Salva estado organizado em coleções do Firestore
     */
    async _saveCollectionsToFirestore(state) {
        try {
            const batch = [];

            // Tarefas (projetos e home)
            const allTarefas = [
                ...state.tarefas.map(t => ({
                    ...t,
                    tipo: 'projeto'
                })),
                ...state.tarefasHome.map(t => ({
                    ...t,
                    tipo: 'home'
                }))
            ];

            // Limpar tarefas antigas e salvar novas
            // Nota: Em produção, seria melhor atualizar apenas os documentos modificados
            for (const tarefa of allTarefas) {
                if (tarefa.id) {
                    batch.push({
                        type: 'set',
                        collection: 'tarefas',
                        docId: tarefa.id,
                        data: tarefa,
                        merge: true,
                    });
                }
            }

            // Rotina
            batch.push({
                type: 'set',
                collection: 'rotina',
                docId: this.userId,
                data: {
                    tarefasRotina: state.tarefasRotina,
                    contadorRotina: state.contadorRotina,
                    historico: state.historico,
                    updatedAt: new Date().toISOString(),
                },
                merge: true,
            });

            // Categorias
            for (const categoria of state.categorias) {
                if (categoria.id) {
                    batch.push({
                        type: 'set',
                        collection: 'categorias',
                        docId: categoria.id,
                        data: categoria,
                        merge: true,
                    });
                }
            }

            // Estudos
            batch.push({
                type: 'set',
                collection: 'estudos',
                docId: this.userId,
                data: {
                    areasEstudo: state.areasEstudo,
                    topicosEstudo: state.topicosEstudo,
                    sessoesEstudo: state.sessoesEstudo,
                    contadorEstudos: state.contadorEstudos,
                    tagsEstudo: state.tagsEstudo,
                    configEstudos: state.configEstudos,
                    updatedAt: new Date().toISOString(),
                },
                merge: true,
            });

            // Config
            batch.push({
                type: 'set',
                collection: 'config',
                docId: this.userId,
                data: {
                    streak: state.streak,
                    conquistas: state.conquistas,
                    avaliacoesDiarias: state.avaliacoesDiarias,
                    darkMode: state.darkMode,
                    filtroStatus: state.filtroStatus,
                    diaAtual: state.diaAtual,
                    ultimaAtualizacao: state.ultimaAtualizacao,
                    updatedAt: new Date().toISOString(),
                },
                merge: true,
            });

            // Executar batch write
            if (batch.length > 0) {
                await firebaseService.batchWrite(batch);
            }
        } catch (error) {
            console.error('Erro ao salvar coleções no Firestore:', error);
            throw error;
        }
    }

    /**
     * Configura listeners em tempo real do Firestore
     */
    setupRealtimeListeners() {
        if (!firebaseService.isAvailable()) {
            return;
        }

        // Listener para tarefas
        const unsubscribeTarefas = firebaseService.subscribeToCollection('tarefas', (tarefas) => {
            const projetos = tarefas.filter(t => t.tipo === 'projeto');
            const home = tarefas.filter(t => t.tipo === 'home');

            this.state.tarefas = projetos;
            this.state.tarefasHome = home;
            this.state.contador = projetos.length;
            this.state.contadorHome = home.length;
            this.notify();
        });
        this.listeners.push(unsubscribeTarefas);

        // Listener para rotina
        const unsubscribeRotina = firebaseService.subscribeToDocument('rotina', this.userId, (rotina) => {
            if (rotina) {
                this.state.tarefasRotina = rotina.tarefasRotina || [];
                this.state.contadorRotina = rotina.contadorRotina || 0;
                this.state.historico = rotina.historico || [];
                this.notify();
            }
        });
        this.listeners.push(unsubscribeRotina);

        // Listener para categorias
        const unsubscribeCategorias = firebaseService.subscribeToCollection('categorias', (categorias) => {
            this.state.categorias = categorias;
            this.notify();
        });
        this.listeners.push(unsubscribeCategorias);

        // Listener para estudos
        const unsubscribeEstudos = firebaseService.subscribeToDocument('estudos', this.userId, (estudos) => {
            if (estudos) {
                this.state.areasEstudo = estudos.areasEstudo || [];
                this.state.topicosEstudo = estudos.topicosEstudo || [];
                this.state.sessoesEstudo = estudos.sessoesEstudo || [];
                this.state.contadorEstudos = estudos.contadorEstudos || 0;
                this.state.tagsEstudo = estudos.tagsEstudo || [];
                if (estudos.configEstudos) {
                    this.state.configEstudos = {
                        ...this.state.configEstudos,
                        ...estudos.configEstudos
                    };
                }
                this.notify();
            }
        });
        this.listeners.push(unsubscribeEstudos);

        // Listener para config
        const unsubscribeConfig = firebaseService.subscribeToDocument('config', this.userId, (config) => {
            if (config) {
                this.state.streak = config.streak || 0;
                this.state.conquistas = config.conquistas || {};
                this.state.avaliacoesDiarias = config.avaliacoesDiarias || [];
                this.state.darkMode = config.darkMode || false;
                this.state.filtroStatus = config.filtroStatus || null;
                if (config.diaAtual) {
                    this.state.diaAtual = config.diaAtual;
                }
                if (config.ultimaAtualizacao) {
                    this.state.ultimaAtualizacao = config.ultimaAtualizacao;
                }
                this.notify();
            }
        });
        this.listeners.push(unsubscribeConfig);
    }

    /**
     * Executa migração completa do localStorage para Firestore
     */
    async runMigration() {
        try {
            // Importar script de migração dinamicamente
            const {
                migrateLocalStorageToFirebase,
                createBackup
            } = await import('./utils/migrate-localStorage-to-firebase.js');

            // Criar backup primeiro
            await createBackup();

            // Executar migração
            await migrateLocalStorageToFirebase();
        } catch (error) {
            console.error('Erro ao executar migração:', error);
            // Continuar com migração v2 se disponível
            this.migrateFromV2();
        }
    }

    /**
     * Migração de dados v2 → v3 (do localStorage)
     * Mantido para compatibilidade, mas será executado apenas uma vez
     */
    async migrateFromV2() {
        try {
            // Verificar se já migrou para Firestore
            const migrated = await firebaseCache.get('firestore-migrated');
            if (migrated) {
                return;
            }

            // Chaves do v2 no localStorage
            const KEY_PROJETOS = 'tarefas_projetos_v2';
            const KEY_ROTINA = 'tarefas_rotina_v5';
            const KEY_HISTORICO = 'historico_rotina_v5';
            const KEY_CATEGORIAS = 'categorias_rotina_v4';
            const KEY_ESTUDOS = 'estudos_dados_v2';
            const KEY_AVALIACOES = 'avaliacoes_diarias_v1';
            const KEY_V3_STATE = 'gerenciador_v3_state';

            let hasData = false;

            // Migrar projetos
            const projetos = localStorage.getItem(KEY_PROJETOS);
            if (projetos) {
                try {
                    this.state.tarefas = JSON.parse(projetos);
                    hasData = true;
                } catch (e) {
                    console.warn('Erro ao migrar projetos:', e);
                }
            }

            // Migrar rotina
            const rotina = localStorage.getItem(KEY_ROTINA);
            if (rotina) {
                try {
                    this.state.tarefasRotina = JSON.parse(rotina);
                    hasData = true;
                } catch (e) {
                    console.warn('Erro ao migrar rotina:', e);
                }
            }

            // Migrar histórico
            const historico = localStorage.getItem(KEY_HISTORICO);
            if (historico) {
                try {
                    this.state.historico = JSON.parse(historico);
                    hasData = true;
                } catch (e) {
                    console.warn('Erro ao migrar histórico:', e);
                }
            }

            // Migrar categorias
            const categorias = localStorage.getItem(KEY_CATEGORIAS);
            if (categorias) {
                try {
                    this.state.categorias = JSON.parse(categorias);
                    hasData = true;
                } catch (e) {
                    console.warn('Erro ao migrar categorias:', e);
                }
            }

            // Migrar estudos
            const estudos = localStorage.getItem(KEY_ESTUDOS);
            if (estudos) {
                try {
                    const estudosData = JSON.parse(estudos);
                    this.state.areasEstudo = estudosData.areas || [];
                    this.state.topicosEstudo = estudosData.topicos || [];
                    this.state.sessoesEstudo = estudosData.sessoes || [];
                    this.state.tagsEstudo = estudosData.tags || [];
                    if (estudosData.config) {
                        this.state.configEstudos = {
                            ...this.state.configEstudos,
                            ...estudosData.config
                        };
                    }
                    hasData = true;
                } catch (e) {
                    console.warn('Erro ao migrar estudos:', e);
                }
            }

            // Migrar avaliações
            const avaliacoes = localStorage.getItem(KEY_AVALIACOES);
            if (avaliacoes) {
                try {
                    this.state.avaliacoesDiarias = JSON.parse(avaliacoes);
                    hasData = true;
                } catch (e) {
                    console.warn('Erro ao migrar avaliações:', e);
                }
            }

            // Tentar migrar estado v3 completo
            const v3State = localStorage.getItem(KEY_V3_STATE);
            if (v3State) {
                try {
                    const parsed = JSON.parse(v3State);
                    this.state = {
                        ...this.state,
                        ...parsed
                    };
                    hasData = true;
                } catch (e) {
                    console.warn('Erro ao migrar estado v3:', e);
                }
            }

            // Se houver dados migrados, salvar no Firestore
            if (hasData) {
                await this.saveToFirestore();
                // Forçar salvamento imediato
                if (this.saveDebounce) {
                    clearTimeout(this.saveDebounce);
                }
                await this._saveCollectionsToFirestore(this.state);
            }

            // Marcar como migrado
            await firebaseCache.set('firestore-migrated', true);

            if (hasData) {
                console.log('✅ Migração v2/v3 → Firestore concluída');
                this.notify();
            }
        } catch (error) {
            console.error('Erro na migração:', error);
        }
    }

    /**
     * Inscreve callback para mudanças de estado
     */
    subscribe(callback) {
        this.subscribers.push(callback);
        // Retorna função para desinscrever
        return () => {
            this.subscribers = this.subscribers.filter((cb) => cb !== callback);
        };
    }

    /**
     * Notifica todos os subscribers
     */
    notify() {
        this.subscribers.forEach((callback) => {
            try {
                callback(this.state);
            } catch (error) {
                console.error('Erro ao notificar subscriber:', error);
            }
        });
    }

    /**
     * Atualiza estado e notifica subscribers
     */
    setState(updates) {
        this.state = {
            ...this.state,
            ...updates
        };
        this.saveToFirestore();
        this.notify();
    }

    /**
     * Retorna estado atual
     */
    getState() {
        return {
            ...this.state
        };
    }

    /**
     * Retorna parte específica do estado
     */
    getStateSlice(key) {
        return this.state[key];
    }

    /**
     * Atualiza parte específica do estado (merge)
     */
    updateStateSlice(key, updates) {
        const current = this.state[key];
        if (Array.isArray(current)) {
            this.setState({
                [key]: [...current, ...updates]
            });
        } else if (typeof current === 'object' && current !== null) {
            this.setState({
                [key]: {
                    ...current,
                    ...updates
                }
            });
        } else {
            this.setState({
                [key]: updates
            });
        }
    }

    /**
     * Adiciona item a uma lista no estado
     */
    addItem(key, item) {
        const current = this.state[key];
        if (Array.isArray(current)) {
            this.setState({
                [key]: [...current, item]
            });
        }
    }

    /**
     * Remove item de uma lista no estado
     */
    removeItem(key, predicate) {
        const current = this.state[key];
        if (Array.isArray(current)) {
            this.setState({
                [key]: current.filter((item) => !predicate(item))
            });
        }
    }

    /**
     * Atualiza item em uma lista no estado
     */
    updateItem(key, predicate, updates) {
        const current = this.state[key];
        if (Array.isArray(current)) {
            this.setState({
                [key]: current.map((item) => (predicate(item) ? {
                    ...item,
                    ...updates
                } : item)),
            });
        }
    }

    /**
     * Força salvamento imediato (sem debounce)
     */
    async forceSave() {
        if (this.saveDebounce) {
            clearTimeout(this.saveDebounce);
        }
        try {
            const stateToSave = {
                ...this.state,
                ultimaAtualizacao: new Date().toISOString(),
            };
            await firebaseCache.set('store-state', stateToSave);
            if (firebaseService.isAvailable()) {
                await this._saveCollectionsToFirestore(stateToSave);
            }
        } catch (error) {
            console.error('Erro ao forçar salvamento:', error);
        }
    }

    /**
     * Limpa todos os listeners
     */
    destroy() {
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners = [];
    }
}

// Exportar instância singleton
export const store = new Store();
export default store;