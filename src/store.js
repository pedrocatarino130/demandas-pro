/**
 * Sistema de Estado Global
 * Gerencia estado centralizado com sincronização automática ao localStorage
 */

class Store {
    constructor() {
        this.state = this.loadFromStorage() || this.getDefaultState();
        this.subscribers = [];
        this.saveDebounce = null;
        this.DEBOUNCE_DELAY = 300; // ms

        // Migração automática na inicialização
        this.migrateFromV2();
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
     * Carrega estado do localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('gerenciador_v3_state');
            if (!stored) return null;

            const parsed = JSON.parse(stored);
            // Validar estrutura básica
            if (parsed && typeof parsed === 'object') {
                return {
                    ...this.getDefaultState(),
                    ...parsed
                };
            }
        } catch (error) {
            console.warn('Erro ao carregar estado do localStorage:', error);
        }
        return null;
    }

    /**
     * Salva estado no localStorage com debounce
     */
    saveToStorage() {
        if (this.saveDebounce) {
            clearTimeout(this.saveDebounce);
        }

        this.saveDebounce = setTimeout(() => {
            try {
                const stateToSave = {
                    ...this.state,
                    ultimaAtualizacao: new Date().toISOString(),
                };
                localStorage.setItem('gerenciador_v3_state', JSON.stringify(stateToSave));
            } catch (error) {
                console.error('Erro ao salvar estado no localStorage:', error);
            }
        }, this.DEBOUNCE_DELAY);
    }

    /**
     * Migração de dados v2 → v3
     */
    migrateFromV2() {
        try {
            // Chaves do v2
            const KEY_PROJETOS = 'tarefas_projetos_v2';
            const KEY_ROTINA = 'tarefas_rotina_v5';
            const KEY_HISTORICO = 'historico_rotina_v5';
            const KEY_CATEGORIAS = 'categorias_rotina_v4';
            const KEY_ESTUDOS = 'estudos_dados_v2';
            const KEY_AVALIACOES = 'avaliacoes_diarias_v1';

            // Verificar se já migrou
            if (localStorage.getItem('gerenciador_v3_migrated')) {
                return;
            }

            // Migrar projetos
            const projetos = localStorage.getItem(KEY_PROJETOS);
            if (projetos) {
                try {
                    this.state.tarefas = JSON.parse(projetos);
                } catch (e) {
                    console.warn('Erro ao migrar projetos:', e);
                }
            }

            // Migrar rotina
            const rotina = localStorage.getItem(KEY_ROTINA);
            if (rotina) {
                try {
                    this.state.tarefasRotina = JSON.parse(rotina);
                } catch (e) {
                    console.warn('Erro ao migrar rotina:', e);
                }
            }

            // Migrar histórico
            const historico = localStorage.getItem(KEY_HISTORICO);
            if (historico) {
                try {
                    this.state.historico = JSON.parse(historico);
                } catch (e) {
                    console.warn('Erro ao migrar histórico:', e);
                }
            }

            // Migrar categorias
            const categorias = localStorage.getItem(KEY_CATEGORIAS);
            if (categorias) {
                try {
                    this.state.categorias = JSON.parse(categorias);
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
                } catch (e) {
                    console.warn('Erro ao migrar estudos:', e);
                }
            }

            // Migrar avaliações
            const avaliacoes = localStorage.getItem(KEY_AVALIACOES);
            if (avaliacoes) {
                try {
                    this.state.avaliacoesDiarias = JSON.parse(avaliacoes);
                } catch (e) {
                    console.warn('Erro ao migrar avaliações:', e);
                }
            }

            // Marcar como migrado
            localStorage.setItem('gerenciador_v3_migrated', 'true');

            // Salvar estado migrado
            this.saveToStorage();
            this.notify();

            console.log('Migração v2 → v3 concluída');
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
        this.saveToStorage();
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
    forceSave() {
        if (this.saveDebounce) {
            clearTimeout(this.saveDebounce);
        }
        try {
            const stateToSave = {
                ...this.state,
                ultimaAtualizacao: new Date().toISOString(),
            };
            localStorage.setItem('gerenciador_v3_state', JSON.stringify(stateToSave));
        } catch (error) {
            console.error('Erro ao forçar salvamento:', error);
        }
    }
}

// Exportar instância singleton
export const store = new Store();