/**
 * EstudosStore - Gerenciamento de estado para módulo de Estudos
 * 
 * Gerencia áreas, tópicos e sessões com sincronização automática no Firebase Firestore
 */

import {
    firebaseService
} from '../services/firebase-service.js';
import {
    firebaseCache
} from '../services/firebase-cache.js';

class EstudosStore {
    constructor() {
        this.state = {
            areas: [],
            topicos: [],
            contadorAreas: 0,
            contadorTopicos: 0,
            versao: 3
        };
        this.subscribers = [];
        this.revisaoEspacada = null; // Será injetado
        this.userId = 'default';
        this.initialized = false;
        this.listeners = [];
        this.saveDebounce = null;
        this.DEBOUNCE_DELAY = 300;

        // Inicializar assincronamente
        this.init();
    }

    /**
     * Inicialização assíncrona
     */
    async init() {
        // Carregar do cache primeiro
        await firebaseCache.init();
        const cached = await firebaseCache.get('estudos-store-state');
        if (cached) {
            this.state = {
                ...this.state,
                ...cached
            };
            this._notify();
        }

        // Carregar do Firestore
        await this._loadFromFirestore();

        // Migrar dados v2 se necessário
        await this._migrateFromV2();

        // Configurar listeners em tempo real
        this._setupListeners();

        this.initialized = true;
        console.log('✅ EstudosStore inicializado com Firebase');
    }

    /**
     * Carrega dados do Firestore
     */
    async _loadFromFirestore() {
        try {
            if (!firebaseService.isAvailable()) {
                return;
            }

            // Carregar estudos do Firestore
            const estudos = await firebaseService.getDocument('estudos', this.userId);

            if (estudos) {
                // Estudos já incluem áreas e tópicos no store principal
                // Mas vamos manter estrutura própria para compatibilidade
                const areas = estudos.areasEstudo || [];
                const topicos = estudos.topicosEstudo || [];

                this.state.areas = areas;
                this.state.topicos = topicos;
                this.state.contadorAreas = areas.length;
                this.state.contadorTopicos = topicos.length;

                // Salvar no cache
                await firebaseCache.set('estudos-store-state', this.state);
                this._notify();
            }
        } catch (error) {
            console.error('Erro ao carregar estudos do Firestore:', error);
        }
    }

    /**
     * Salva dados no Firestore com debounce
     */
    _saveToFirestore() {
        if (this.saveDebounce) {
            clearTimeout(this.saveDebounce);
        }

        this.saveDebounce = setTimeout(async () => {
            try {
                // Salvar no cache imediatamente
                await firebaseCache.set('estudos-store-state', this.state);

                // Salvar no Firestore
                if (firebaseService.isAvailable()) {
                    await firebaseService.setDocument('estudos', this.userId, {
                        areasEstudo: this.state.areas,
                        topicosEstudo: this.state.topicos,
                        contadorEstudos: this.state.contadorTopicos,
                        updatedAt: new Date().toISOString(),
                    }, true);
                }
            } catch (error) {
                console.error('Erro ao salvar estudos no Firestore:', error);
            }
        }, this.DEBOUNCE_DELAY);
    }

    /**
     * Configura listeners em tempo real
     */
    _setupListeners() {
        if (!firebaseService.isAvailable()) {
            return;
        }

        const unsubscribe = firebaseService.subscribeToDocument('estudos', this.userId, (estudos) => {
            if (estudos) {
                const areas = estudos.areasEstudo || [];
                const topicos = estudos.topicosEstudo || [];

                this.state.areas = areas;
                this.state.topicos = topicos;
                this.state.contadorAreas = areas.length;
                this.state.contadorTopicos = topicos.length;

                // Atualizar cache
                firebaseCache.set('estudos-store-state', this.state);
                this._notify();
            }
        });

        this.listeners.push(unsubscribe);
    }

    /**
     * Migra dados da versão 2 (se existir)
     */
    async _migrateFromV2() {
        try {
            // Verificar se já migrou
            const migrated = await firebaseCache.get('estudos-firestore-migrated');
            if (migrated) {
                return;
            }

            const v2Key = 'estudos_v2';
            const v2Data = localStorage.getItem(v2Key);

            if (v2Data && this.state.areas.length === 0 && this.state.topicos.length === 0) {
                const v2 = JSON.parse(v2Data);

                // Migrar áreas
                if (v2.areas && Array.isArray(v2.areas)) {
                    this.state.areas = v2.areas.map(area => ({
                        id: area.id || `area_${Date.now()}_${Math.random()}`,
                        nome: area.nome,
                        descricao: area.descricao || '',
                        cor: area.cor || '#3b82f6',
                        icone: area.icone || '📚',
                        status: area.status || 'ativo',
                        criadoEm: area.criadoEm || new Date().toISOString()
                    }));
                }

                // Migrar tópicos
                if (v2.topicos && Array.isArray(v2.topicos)) {
                    this.state.topicos = v2.topicos.map(topico => ({
                        id: topico.id || `topico_${Date.now()}_${Math.random()}`,
                        titulo: topico.titulo,
                        descricao: topico.descricao || '',
                        areaId: topico.areaId,
                        status: topico.status || 'Não iniciado',
                        prioridade: topico.prioridade || 'Média',
                        tags: topico.tags || [],
                        tempoEstimado: topico.tempoEstimado || null,
                        sessoes: topico.sessoes || [],
                        proximaRevisao: topico.proximaRevisao || null,
                        ultimaRevisao: topico.ultimaRevisao || null,
                        historicoRevisoes: topico.historicoRevisoes || [],
                        concluidoEm: topico.concluidoEm || null,
                        criadoEm: topico.criadoEm || new Date().toISOString()
                    }));
                }

                this.state.contadorAreas = this.state.areas.length;
                this.state.contadorTopicos = this.state.topicos.length;

                // Salvar no Firestore
                await this._saveToFirestore();
                if (this.saveDebounce) {
                    clearTimeout(this.saveDebounce);
                }
                await firebaseService.setDocument('estudos', this.userId, {
                    areasEstudo: this.state.areas,
                    topicosEstudo: this.state.topicos,
                    contadorEstudos: this.state.contadorTopicos,
                    updatedAt: new Date().toISOString(),
                }, true);

                // Marcar como migrado
                await firebaseCache.set('estudos-firestore-migrated', true);
                this._notify();

                console.log('✅ Migração de dados v2 concluída');
            }
        } catch (e) {
            console.warn('Erro na migração v2', e);
        }
    }

    /**
     * Inscreve callback para mudanças de estado
     */
    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    /**
     * Notifica todos os subscribers
     */
    _notify() {
        this.subscribers.forEach(cb => {
            try {
                cb(this.state);
            } catch (e) {
                console.error('Erro ao notificar subscriber', e);
            }
        });
    }

    /**
     * Obtém todas as áreas
     */
    getAreas() {
        return [...this.state.areas];
    }

    /**
     * Obtém área por ID
     */
    getAreaById(id) {
        return this.state.areas.find(a => a.id === id);
    }

    /**
     * Adiciona uma nova área
     */
    addArea(areaData) {
        const area = {
            id: `area_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            nome: areaData.nome,
            descricao: areaData.descricao || '',
            cor: areaData.cor || '#3b82f6',
            icone: areaData.icone || '📚',
            status: 'ativo',
            criadoEm: new Date().toISOString()
        };

        this.state.areas.push(area);
        this.state.contadorAreas++;
        this._saveToFirestore();
        this._notify();

        return area;
    }

    /**
     * Atualiza uma área
     */
    updateArea(id, updates) {
        const index = this.state.areas.findIndex(a => a.id === id);
        if (index >= 0) {
            this.state.areas[index] = {
                ...this.state.areas[index],
                ...updates
            };
            this._saveToFirestore();
            this._notify();
            return this.state.areas[index];
        }
        return null;
    }

    /**
     * Remove uma área
     */
    removeArea(id) {
        const index = this.state.areas.findIndex(a => a.id === id);
        if (index >= 0) {
            this.state.areas.splice(index, 1);
            this.state.contadorAreas--;
            // Atualizar tópicos que referenciam esta área
            this.state.topicos.forEach(topico => {
                if (topico.areaId === id) {
                    topico.areaId = null;
                }
            });
            this._saveToFirestore();
            this._notify();
            return true;
        }
        return false;
    }

    /**
     * Obtém todos os tópicos
     */
    getTopicos() {
        return [...this.state.topicos];
    }

    /**
     * Obtém tópico por ID
     */
    getTopicoById(id) {
        return this.state.topicos.find(t => t.id === id);
    }

    /**
     * Obtém tópicos por área
     */
    getTopicosByArea(areaId) {
        return this.state.topicos.filter(t => t.areaId === areaId);
    }

    /**
     * Adiciona um novo tópico
     */
    addTopico(topicoData) {
        const topico = {
            id: `topico_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            titulo: topicoData.titulo,
            descricao: topicoData.descricao || '',
            areaId: topicoData.areaId || null,
            status: topicoData.status || 'Não iniciado',
            prioridade: topicoData.prioridade || 'Média',
            tags: topicoData.tags || [],
            tempoEstimado: topicoData.tempoEstimado || null,
            sessoes: [],
            proximaRevisao: null,
            ultimaRevisao: null,
            historicoRevisoes: [],
            concluidoEm: null,
            criadoEm: new Date().toISOString()
        };

        this.state.topicos.push(topico);
        this.state.contadorTopicos++;
        this._saveToFirestore();
        this._notify();

        return topico;
    }

    /**
     * Atualiza um tópico
     */
    updateTopico(id, updates) {
        const index = this.state.topicos.findIndex(t => t.id === id);
        if (index >= 0) {
            const topico = this.state.topicos[index];
            const updated = {
                ...topico,
                ...updates
            };

            // Se mudou para Concluído, agendar revisão inicial
            if (updates.status === 'Concluído' && topico.status !== 'Concluído' && this.revisaoEspacada) {
                this.revisaoEspacada.agendarRevisaoInicial(updated);
            }

            this.state.topicos[index] = updated;
            this._saveToFirestore();
            this._notify();
            return updated;
        }
        return null;
    }

    /**
     * Remove um tópico
     */
    removeTopico(id) {
        const index = this.state.topicos.findIndex(t => t.id === id);
        if (index >= 0) {
            this.state.topicos.splice(index, 1);
            this.state.contadorTopicos--;
            this._saveToFirestore();
            this._notify();
            return true;
        }
        return false;
    }

    /**
     * Adiciona uma sessão de estudo a um tópico
     */
    addSessao(topicoId, sessaoData) {
        const topico = this.getTopicoById(topicoId);
        if (!topico) return null;

        const sessao = {
            id: `sessao_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            data: sessaoData.data || new Date().toISOString(),
            duracao: sessaoData.duracao || 0, // em minutos
            notas: sessaoData.notas || '',
            tags: sessaoData.tags || [],
            dificuldade: sessaoData.dificuldade || 3,
            recursos: sessaoData.recursos || []
        };

        if (!topico.sessoes) {
            topico.sessoes = [];
        }

        topico.sessoes.push(sessao);

        // Se concluiu o estudo, atualizar status
        if (sessaoData.concluiu) {
            topico.status = 'Concluído';
            topico.concluidoEm = sessao.data;

            // Agendar revisão inicial se tiver revisaoEspacada
            if (this.revisaoEspacada) {
                this.revisaoEspacada.agendarRevisaoInicial(topico);
            }
        } else if (topico.status === 'Não iniciado') {
            topico.status = 'Estudando';
        }

        this._saveToFirestore();
        this._notify();

        return sessao;
    }

    /**
     * Obtém todas as tags únicas de todos os tópicos
     */
    getAllTags() {
        const tags = new Set();
        this.state.topicos.forEach(topico => {
            if (topico.tags && Array.isArray(topico.tags)) {
                topico.tags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags);
    }

    /**
     * Define instância de RevisaoEspacada
     */
    setRevisaoEspacada(revisaoEspacada) {
        this.revisaoEspacada = revisaoEspacada;
    }

    /**
     * Obtém estado completo
     */
    getState() {
        return {
            ...this.state
        };
    }

    /**
     * Limpa todos os listeners
     */
    destroy() {
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners = [];
    }
}

// Export ES6
export {
    EstudosStore
};
export default EstudosStore;

// Export para uso global (compatibilidade)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EstudosStore;
}