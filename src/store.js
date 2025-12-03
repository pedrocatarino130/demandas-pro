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
import {
    initializeFirebase
} from './config/firebase.js';

const STORE_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 dias
const STATE_COLLECTION_MAP = {
    tarefas: 'tarefas',
    tarefasHome: 'tarefasHome',
    tarefasRotina: 'tarefasRotina',
    historico: 'historico',
    categorias: 'categorias',
    areasEstudo: 'areasEstudo',
    topicosEstudo: 'topicosEstudo',
    sessoesEstudo: 'sessoesEstudo',
    tagsEstudo: 'tagsEstudo',
    avaliacoesDiarias: 'avaliacoesDiarias'
};

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
        this.notifyScheduled = false;
        this.notifyScheduler = (typeof window !== 'undefined' && window.requestAnimationFrame)
            ? (cb) => window.requestAnimationFrame(cb)
            : (cb) => setTimeout(cb, 16); // fallback para ambientes de teste/no-window

        // Inicializar assincronamente
        this.init();
    }

    /**
     * Inicialização assíncrona - local + Firebase quando disponível
     */
    async init() {
        if (this.initializing) return;
        this.initializing = true;

        // Inicializar cache
        await firebaseCache.init();

        // Tentar inicializar Firebase (pode carregar config do arquivo)
        try {
            await initializeFirebase();
            // Aguardar um pouco mais para garantir que Firebase foi completamente inicializado
            // Isso é necessário porque o carregamento do arquivo JSON é assíncrono
            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
            console.warn('⚠️ Erro ao inicializar Firebase:', error);
        }

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

        // Se Firebase está disponível, carregar e configurar sincronização
        if (firebaseService.isAvailable()) {
            try {
                // Carregar do Firestore (pode sobrescrever dados locais se mais recentes)
                await this.loadFromFirestore();
                
                // Configurar listeners real-time
                this.setupRealtimeListeners();
                
                console.log('✅ Store inicializado (modo Firebase + local)');
            } catch (error) {
                console.error('⚠️ Erro ao inicializar Firebase no Store:', error);
                console.log('✅ Store inicializado (modo local apenas)');
            }
        } else {
            console.log('✅ Store inicializado (modo local)');
        }

        this.initialized = true;
        this.initializing = false;
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
     * Persistência local com compressão e TTL
     */
    async _persistState(state) {
        try {
            await firebaseCache.setWithOptions('store-state', state, {
                compress: true,
                ttlMs: STORE_CACHE_TTL_MS
            });
        } catch (error) {
            console.error('Erro ao salvar estado no cache:', error);
        }
    }

    /**
     * Carrega estado do cache local
     */
    async loadFromCache() {
        try {
            const cached = await firebaseCache.get('store-state');
            if (cached && typeof cached === 'object') {
                const state = {
                    ...this.getDefaultState(),
                    ...cached
                };
                
                // Garantir que arrays sejam sempre arrays válidos
                const arrayKeys = ['tarefas', 'tarefasHome', 'tarefasRotina', 'historico', 'categorias', 
                                  'areasEstudo', 'topicosEstudo', 'sessoesEstudo', 'tagsEstudo', 'avaliacoesDiarias'];
                
                arrayKeys.forEach(key => {
                    if (!Array.isArray(state[key])) {
                        state[key] = [];
                    }
                });
                
                return state;
            }
        } catch (error) {
            console.warn('Erro ao carregar estado do cache:', error);
        }
        return null;
    }

    /**
     * Carrega estado do Firestore
     * Sobrescreve dados locais se mais recentes (last-write-wins)
     */
    async loadFromFirestore() {
        if (!firebaseService.isAvailable()) return;

        try {
            // Mapeamento de coleções do Firestore para chaves do estado
            const collections = [
                { collection: 'tarefas', stateKey: 'tarefas' },
                { collection: 'tarefasHome', stateKey: 'tarefasHome' },
                { collection: 'tarefasRotina', stateKey: 'tarefasRotina' },
                { collection: 'historico', stateKey: 'historico' },
                { collection: 'categorias', stateKey: 'categorias' },
                { collection: 'areasEstudo', stateKey: 'areasEstudo' },
                { collection: 'topicosEstudo', stateKey: 'topicosEstudo' },
                { collection: 'sessoesEstudo', stateKey: 'sessoesEstudo' },
                { collection: 'tagsEstudo', stateKey: 'tagsEstudo' },
                { collection: 'avaliacoesDiarias', stateKey: 'avaliacoesDiarias' }
            ];

            const updates = {};

            // Carregar cada coleção do Firestore
            for (const { collection, stateKey } of collections) {
                try {
                    const docs = await firebaseService.getCollection(
                        collection,
                        [],
                        '_lastModified',
                        'desc'
                    );
                    
                    if (docs && docs.length > 0) {
                        updates[stateKey] = docs;
                    }
                } catch (error) {
                    console.warn(`Erro ao carregar coleção ${collection}:`, error);
                }
            }

            // Carregar configurações
            try {
                const config = await firebaseService.getDocument('configEstudos', 'default');
                if (config) {
                    updates.configEstudos = config;
                }
            } catch (error) {
                console.warn('Erro ao carregar configEstudos:', error);
            }

            // Atualizar estado apenas se houver dados do Firestore
            if (Object.keys(updates).length > 0) {
                this.state = {
                    ...this.state,
                    ...updates
                };
                
                // Garantir que arrays sejam sempre arrays válidos
                const arrayKeys = ['tarefas', 'tarefasHome', 'tarefasRotina', 'historico', 'categorias', 
                                  'areasEstudo', 'topicosEstudo', 'sessoesEstudo', 'tagsEstudo', 'avaliacoesDiarias'];
                
                arrayKeys.forEach(key => {
                    if (!Array.isArray(this.state[key])) {
                        this.state[key] = [];
                    }
                });
                
                // Salvar no cache local também
                await this._persistState(this.state);
                
                console.log('✅ Dados carregados do Firestore');
                this.notify();
            }
        } catch (error) {
            console.error('Erro ao carregar do Firestore:', error);
        }
    }

    /**
     * Salva estado localmente e sincroniza com Firestore (se disponível)
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

                // Sempre salvar no cache local primeiro (offline-first)
                await this._persistState(stateToSave);

                // Se Firebase está disponível, sincronizar também
                if (firebaseService.isAvailable()) {
                    await this._saveCollectionsToFirestore(stateToSave);
                }
            } catch (error) {
                console.error('Erro ao salvar estado:', error);
            }
        }, this.DEBOUNCE_DELAY);
    }

    /**
     * Salva coleções no Firestore
     * Usa firebaseSync para garantir sincronização offline/online
     */
    async _saveCollectionsToFirestore(state) {
        if (!firebaseService.isAvailable()) return;

        try {
            // Mapeamento de chaves do estado para coleções do Firestore
            const collections = [
                { stateKey: 'tarefas', collection: 'tarefas' },
                { stateKey: 'tarefasHome', collection: 'tarefasHome' },
                { stateKey: 'tarefasRotina', collection: 'tarefasRotina' },
                { stateKey: 'historico', collection: 'historico' },
                { stateKey: 'categorias', collection: 'categorias' },
                { stateKey: 'areasEstudo', collection: 'areasEstudo' },
                { stateKey: 'topicosEstudo', collection: 'topicosEstudo' },
                { stateKey: 'sessoesEstudo', collection: 'sessoesEstudo' },
                { stateKey: 'tagsEstudo', collection: 'tagsEstudo' },
                { stateKey: 'avaliacoesDiarias', collection: 'avaliacoesDiarias' }
            ];

            const operations = [];

            // Preparar operações para cada coleção
            for (const { stateKey, collection } of collections) {
                const items = state[stateKey];
                if (!Array.isArray(items)) continue;

                // Para cada item, criar operação de sincronização
                items.forEach(item => {
                    if (item && item.id) {
                        operations.push({
                            type: 'UPDATE', // UPDATE faz merge, CREATE não
                            collection: collection,
                            docId: item.id,
                            data: item
                        });
                    }
                });
            }

            // Salvar configurações
            if (state.configEstudos) {
                operations.push({
                    type: 'UPDATE',
                    collection: 'configEstudos',
                    docId: 'default',
                    data: state.configEstudos
                });
            }

            // Se há operações, adicionar à fila de sincronização
            if (operations.length > 0) {
                // Usar batch write se online, senão adicionar à fila
                if (firebaseSync.getOnlineStatus()) {
                    try {
                        // Tentar sincronizar imediatamente se online
                        await firebaseService.batchWrite(operations);
                    } catch (error) {
                        console.warn('Erro ao sincronizar imediatamente, adicionando à fila:', error);
                        // Se falhar, adicionar à fila para retry
                        for (const op of operations) {
                            await firebaseSync.addToQueue(op);
                        }
                    }
                } else {
                    // Offline: adicionar todas à fila
                    for (const op of operations) {
                        await firebaseSync.addToQueue(op);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao salvar coleções no Firestore:', error);
        }
    }

    /**
     * Configura listeners real-time do Firestore
     * Atualiza estado local quando há mudanças remotas
     */
    setupRealtimeListeners() {
        if (!firebaseService.isAvailable()) return;

        try {
            // Limpar listeners antigos
            this.destroy();

            // Coleções principais para listeners real-time
            const collections = [
                { collection: 'tarefas', stateKey: 'tarefas' },
                { collection: 'tarefasHome', stateKey: 'tarefasHome' },
                { collection: 'tarefasRotina', stateKey: 'tarefasRotina' },
                { collection: 'historico', stateKey: 'historico' },
                { collection: 'categorias', stateKey: 'categorias' },
                { collection: 'areasEstudo', stateKey: 'areasEstudo' },
                { collection: 'topicosEstudo', stateKey: 'topicosEstudo' },
                { collection: 'sessoesEstudo', stateKey: 'sessoesEstudo' },
                { collection: 'tagsEstudo', stateKey: 'tagsEstudo' },
                { collection: 'avaliacoesDiarias', stateKey: 'avaliacoesDiarias' }
            ];

            // Configurar listener para cada coleção
            collections.forEach(({ collection, stateKey }) => {
                const unsubscribe = firebaseService.subscribeToCollection(
                    collection,
                    (docs) => {
                        // Atualizar estado quando coleção muda no Firestore
                        if (Array.isArray(docs)) {
                            this.state[stateKey] = docs;
                            // Salvar no cache local também
                            this._persistState(this.state).catch(err => {
                                console.error('Erro ao salvar no cache após atualização remota:', err);
                            });
                            this.notify();
                        }
                    },
                    [] // Sem filtros por enquanto
                );

                this.listeners.push(unsubscribe);
            });

            // Listener para configurações
            const configUnsubscribe = firebaseService.subscribeToDocument(
                'configEstudos',
                'default',
                (doc) => {
                    if (doc) {
                        this.state.configEstudos = doc;
                        this._persistState(this.state).catch(err => {
                            console.error('Erro ao salvar config no cache:', err);
                        });
                        this.notify();
                    }
                }
            );

            this.listeners.push(configUnsubscribe);

            console.log('✅ Listeners real-time configurados');
        } catch (error) {
            console.error('Erro ao configurar listeners real-time:', error);
        }
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
                    const parsed = JSON.parse(projetos);
                    // Garantir que seja um array
                    this.state.tarefas = Array.isArray(parsed) ? parsed : [];
                    hasData = true;
                } catch (e) {
                    console.warn('Erro ao migrar projetos:', e);
                    this.state.tarefas = [];
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
                await this._persistState(stateToSave);
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
        if (this.notifyScheduled) {
            return;
        }

        this.notifyScheduled = true;
        this.notifyScheduler(() => {
            this.notifyScheduled = false;
            this.subscribers.forEach((callback) => {
                try {
                    callback(this.state);
                } catch (error) {
                    console.error('Erro ao notificar subscriber:', error);
                }
            });
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
     * Garante que arrays sejam sempre arrays válidos
     */
    getState() {
        const state = { ...this.state };
        
        // Garantir que arrays sejam sempre arrays válidos
        const arrayKeys = ['tarefas', 'tarefasHome', 'tarefasRotina', 'historico', 'categorias', 
                          'areasEstudo', 'topicosEstudo', 'sessoesEstudo', 'tagsEstudo', 'avaliacoesDiarias'];
        
        arrayKeys.forEach(key => {
            if (!Array.isArray(state[key])) {
                state[key] = [];
            }
        });
        
        return state;
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
        } else {
            // Se não for array, inicializar como array
            this.setState({
                [key]: [item]
            });
        }
    }

    /**
     * Remove item de uma lista no estado
     */
    removeItem(key, predicate) {
        const current = this.state[key];
        if (Array.isArray(current)) {
            const removedItems = current.filter((item) => predicate(item));
            this.setState({
                [key]: current.filter((item) => !predicate(item))
            });
            this._enqueueDeletes(key, removedItems).catch(err => {
                console.warn('Erro ao enfileirar deleções:', err);
            });
        } else {
            // Se não for array, inicializar como array vazio
            this.setState({
                [key]: []
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
        } else {
            // Se não for array, não fazer nada (ou inicializar como array vazio)
            console.warn(`Tentativa de atualizar item em ${key} que não é um array`);
            this.setState({
                [key]: []
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
            await this._persistState(stateToSave);
        } catch (error) {
            console.error('Erro ao forçar salvamento:', error);
        }
    }

    _getCollectionForStateKey(stateKey) {
        return STATE_COLLECTION_MAP[stateKey] || null;
    }

    _getDocId(item) {
        if (!item) return null;
        return item.id || item.contador || item.key || null;
    }

    async _enqueueDeletes(stateKey, items = []) {
        const collection = this._getCollectionForStateKey(stateKey);
        if (!collection || !items.length) return;

        const ops = items
            .map((item) => {
                const docId = this._getDocId(item);
                if (!docId) return null;
                return {
                    type: 'DELETE',
                    collection,
                    docId,
                    data: null
                };
            })
            .filter(Boolean);

        for (const op of ops) {
            await firebaseSync.addToQueue(op);
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
