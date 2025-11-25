/**
 * TASK-015: Sistema de Revisão Espaçada Melhorado
 * 
 * Algoritmo SM-2 simplificado para revisão espaçada
 * Intervalos: 1, 3, 7, 15, 30 dias (progressivo)
 */

class RevisaoEspacada {
    constructor(options = {}) {
        this.intervalos = options.intervalos || [1, 3, 7, 15, 30];
        this.dificuldadeInicial = options.dificuldadeInicial || 2.5;
    }

    /**
     * Calcula próxima revisão baseado no histórico
     * @param {Object} topico - Tópico com histórico de revisões
     * @param {Date} dataAtual - Data atual (opcional)
     * @returns {Object} { proximaRevisao: Date, intervalo: number, tentativa: number }
     */
    calcularProximaRevisao(topico, dataAtual = new Date()) {
        if (!topico) {
            throw new Error('Tópico é obrigatório');
        }

        // Se nunca foi concluído, não há revisão
        if (!topico.concluidoEm) {
            return {
                proximaRevisao: null,
                intervalo: null,
                tentativa: 0
            };
        }

        // Contar revisões já feitas
        const revisoesFeitas = this._contarRevisoes(topico);
        
        // Determinar intervalo baseado no número de revisões
        const intervalo = this._getIntervalo(revisoesFeitas);
        
        // Calcular data da próxima revisão
        const dataBase = topico.ultimaRevisao 
            ? new Date(topico.ultimaRevisao)
            : new Date(topico.concluidoEm);
        
        const proximaRevisao = new Date(dataBase);
        proximaRevisao.setDate(proximaRevisao.getDate() + intervalo);

        return {
            proximaRevisao: proximaRevisao.toISOString(),
            intervalo: intervalo,
            tentativa: revisoesFeitas + 1,
            diasRestantes: Math.ceil((proximaRevisao - dataAtual) / (1000 * 60 * 60 * 24))
        };
    }

    /**
     * Obtém intervalo baseado no número de tentativas
     */
    _getIntervalo(tentativa) {
        if (tentativa < this.intervalos.length) {
            return this.intervalos[tentativa];
        }
        // Após todas as tentativas, usar o último intervalo
        return this.intervalos[this.intervalos.length - 1];
    }

    /**
     * Conta revisões feitas
     */
    _contarRevisoes(topico) {
        // Se tem histórico de revisões, usar isso
        if (topico.historicoRevisoes && Array.isArray(topico.historicoRevisoes)) {
            return topico.historicoRevisoes.length;
        }

        // Senão, inferir do status e datas
        if (topico.status === 'Concluído' && topico.concluidoEm) {
            // Se tem próxima revisão agendada, já foi revisado pelo menos uma vez
            if (topico.proximaRevisao) {
                const revisaoDate = new Date(topico.proximaRevisao);
                const concluidoDate = new Date(topico.concluidoEm);
                const diasEntre = Math.floor((revisaoDate - concluidoDate) / (1000 * 60 * 60 * 24));
                
                // Determinar tentativa baseado no intervalo
                const tentativa = this.intervalos.findIndex(i => i === diasEntre);
                return tentativa >= 0 ? tentativa : 0;
            }
            return 0; // Concluído mas nunca revisado
        }

        return 0;
    }

    /**
     * Registra uma revisão realizada
     * @param {Object} topico - Tópico revisado
     * @param {number} dificuldade - Dificuldade percebida (1-5)
     * @param {Date} dataRevisao - Data da revisão (opcional)
     * @returns {Object} Tópico atualizado
     */
    registrarRevisao(topico, dificuldade = 3, dataRevisao = new Date()) {
        if (!topico) {
            throw new Error('Tópico é obrigatório');
        }

        // Inicializar histórico se não existir
        if (!topico.historicoRevisoes) {
            topico.historicoRevisoes = [];
        }

        // Adicionar revisão ao histórico
        const revisao = {
            data: dataRevisao.toISOString(),
            dificuldade: dificuldade,
            intervalo: this._getIntervalo(topico.historicoRevisoes.length)
        };

        topico.historicoRevisoes.push(revisao);
        topico.ultimaRevisao = dataRevisao.toISOString();

        // Ajustar intervalo baseado na dificuldade
        const proxima = this.calcularProximaRevisao(topico, dataRevisao);
        
        // Se dificuldade alta, reduzir intervalo
        if (dificuldade >= 4) {
            const intervaloAtual = proxima.intervalo;
            const novoIntervalo = Math.max(1, Math.floor(intervaloAtual * 0.7));
            const novaData = new Date(dataRevisao);
            novaData.setDate(novaData.getDate() + novoIntervalo);
            topico.proximaRevisao = novaData.toISOString();
        } else {
            topico.proximaRevisao = proxima.proximaRevisao;
        }

        // Se dificuldade muito baixa, aumentar intervalo
        if (dificuldade <= 2 && topico.historicoRevisoes.length > 1) {
            const intervaloAtual = proxima.intervalo;
            const novoIntervalo = Math.min(30, Math.floor(intervaloAtual * 1.3));
            const novaData = new Date(dataRevisao);
            novaData.setDate(novaData.getDate() + novoIntervalo);
            topico.proximaRevisao = novaData.toISOString();
        }

        return topico;
    }

    /**
     * Verifica se revisão está pendente
     * @param {Object} topico - Tópico a verificar
     * @param {Date} dataAtual - Data atual (opcional)
     * @returns {boolean}
     */
    isRevisaoPendente(topico, dataAtual = new Date()) {
        if (!topico || !topico.proximaRevisao) {
            return false;
        }

        const revisaoDate = new Date(topico.proximaRevisao);
        return revisaoDate <= dataAtual;
    }

    /**
     * Obtém revisões pendentes de uma lista de tópicos
     * @param {Array} topicos - Lista de tópicos
     * @returns {Array} Tópicos com revisão pendente
     */
    getRevisoesPendentes(topicos) {
        if (!Array.isArray(topicos)) {
            return [];
        }

        return topicos
            .filter(t => this.isRevisaoPendente(t))
            .sort((a, b) => {
                const aDate = new Date(a.proximaRevisao);
                const bDate = new Date(b.proximaRevisao);
                return aDate - bDate; // Mais antigas primeiro
            });
    }

    /**
     * Obtém estatísticas de revisão
     * @param {Array} topicos - Lista de tópicos
     * @returns {Object} Estatísticas
     */
    getEstatisticas(topicos) {
        if (!Array.isArray(topicos)) {
            return {
                total: 0,
                pendentes: 0,
                hoje: 0,
                estaSemana: 0,
                proximaSemana: 0
            };
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        const fimSemana = new Date(hoje);
        fimSemana.setDate(fimSemana.getDate() + 7);
        
        const fimProximaSemana = new Date(hoje);
        fimProximaSemana.setDate(fimProximaSemana.getDate() + 14);

        const stats = {
            total: topicos.filter(t => t.proximaRevisao).length,
            pendentes: 0,
            hoje: 0,
            estaSemana: 0,
            proximaSemana: 0
        };

        topicos.forEach(topico => {
            if (!topico.proximaRevisao) return;

            const revisaoDate = new Date(topico.proximaRevisao);
            
            if (revisaoDate <= hoje) {
                stats.pendentes++;
            }
            
            if (revisaoDate.toDateString() === hoje.toDateString()) {
                stats.hoje++;
            }
            
            if (revisaoDate > hoje && revisaoDate <= fimSemana) {
                stats.estaSemana++;
            }
            
            if (revisaoDate > fimSemana && revisaoDate <= fimProximaSemana) {
                stats.proximaSemana++;
            }
        });

        return stats;
    }

    /**
     * Agenda revisão inicial ao concluir tópico
     * @param {Object} topico - Tópico concluído
     * @param {Date} dataConclusao - Data de conclusão (opcional)
     * @returns {Object} Tópico atualizado
     */
    agendarRevisaoInicial(topico, dataConclusao = new Date()) {
        if (!topico) {
            throw new Error('Tópico é obrigatório');
        }

        topico.concluidoEm = dataConclusao.toISOString();
        topico.status = 'Concluído';
        
        const proxima = this.calcularProximaRevisao(topico, dataConclusao);
        topico.proximaRevisao = proxima.proximaRevisao;

        return topico;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RevisaoEspacada;
}

