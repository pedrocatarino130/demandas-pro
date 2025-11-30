/**
 * Sistema de Estado Global
 * Gerencia estado centralizado com armazenamento local (IndexedDB/localStorage)
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
     * Inicialização assíncrona - apenas local
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

        // Carregar dados antigos do localStorage (migração)
        await this.migrateFromV2();

        this.initialized = true;
        console.log('✅ Store inicializado (modo local)');
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
     * Método removido - não carrega mais do Firestore
     * Mantido apenas para compatibilidade (não faz nada)
     */
    async loadFromFirestore() {
        // Não faz nada - sistema agora é 100% local
        return;
    }

    /**
     * Salva estado localmente com debounce
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

                // Salvar no cache local
                await firebaseCache.set('store-state', stateToSave);
            } catch (error) {
                console.error('Erro ao salvar estado:', error);
            }
        }, this.DEBOUNCE_DELAY);
    }

    /**
     * Método removido - não salva mais no Firestore
     * Mantido apenas para compatibilidade (não faz nada)
     */
    async _saveCollectionsToFirestore(state) {
        // Não faz nada - sistema agora é 100% local
        return;
    }

    /**
     * Método removido - não configura mais listeners do Firestore
     * Mantido apenas para compatibilidade (não faz nada)
     */
    setupRealtimeListeners() {
        // Não faz nada - sistema agora é 100% local
        return;
    }

    /**
     * Método removido - não migra mais para Firestore
     * Mantido apenas para compatibilidade (não faz nada)
     */
    async runMigration() {
        // Não faz nada - sistema agora é 100% local
        return;
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

            // Se houver dados migrados, salvar localmente
            if (hasData) {
                await this.saveToFirestore();
                // Forçar salvamento imediato
                if (this.saveDebounce) {
                    clearTimeout(this.saveDebounce);
                }
                const stateToSave = {
                    ...this.state,
                    ultimaAtualizacao: new Date().toISOString(),
                };
                await firebaseCache.set('store-state', stateToSave);
            }

            // Marcar como migrado
            await firebaseCache.set('firestore-migrated', true);

            if (hasData) {
                console.log('✅ Migração v2/v3 concluída');
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