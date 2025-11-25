/**
 * TASK-012: Parser de Comandos Natural Language
 * 
 * Interpreta texto natural para criação rápida de tópicos de estudo
 * Formato: "Python @udemy #urgente :2h !alta"
 * 
 * Padrões suportados:
 * - @área: Define ou referencia área de estudo
 * - #tag: Adiciona tags (múltiplas permitidas)
 * - :tempo: Define duração estimada (ex: :2h, :30m, :1d)
 * - !prioridade: Define prioridade (alta, média, baixa, urgente)
 */

class QuickAddParser {
    constructor() {
        this.patterns = {
            area: /@(\w+)/g,
            tags: /#(\w+)/g,
            time: /:(\d+[dhm])/g,
            priority: /!(\w+)/g
        };
        
        // Mapeamento de tags para prioridade automática
        this.tagPriorityMap = {
            'urgente': 'Alta',
            'urgent': 'Alta',
            'importante': 'Alta',
            'important': 'Alta',
            'alta': 'Alta',
            'high': 'Alta',
            'média': 'Média',
            'media': 'Média',
            'medium': 'Média',
            'baixa': 'Baixa',
            'low': 'Baixa'
        };
    }

    /**
     * Parse do texto de entrada
     * @param {string} input - Texto do usuário
     * @returns {Object} Objeto estruturado com os dados extraídos
     */
    parse(input) {
        if (!input || typeof input !== 'string') {
            return this._createEmptyResult();
        }

        const trimmed = input.trim();
        if (!trimmed) {
            return this._createEmptyResult();
        }

        // Extrair padrões
        const area = this._extractArea(trimmed);
        const tags = this._extractTags(trimmed);
        const time = this._extractTime(trimmed);
        const priority = this._extractPriority(trimmed, tags);
        
        // Remover padrões do título
        const title = this._extractTitle(trimmed);

        return {
            titulo: title,
            area: area,
            tags: tags,
            tempoEstimado: time,
            prioridade: priority,
            raw: trimmed,
            isValid: title.length > 0
        };
    }

    /**
     * Extrai área do texto (@área)
     */
    _extractArea(text) {
        const matches = [...text.matchAll(this.patterns.area)];
        if (matches.length > 0) {
            return matches[0][1];
        }
        return null;
    }

    /**
     * Extrai tags do texto (#tag)
     */
    _extractTags(text) {
        const matches = [...text.matchAll(this.patterns.tags)];
        return matches.map(m => m[1].toLowerCase());
    }

    /**
     * Extrai tempo estimado do texto (:2h, :30m, :1d)
     */
    _extractTime(text) {
        const matches = [...text.matchAll(this.patterns.time)];
        if (matches.length > 0) {
            const timeStr = matches[0][1];
            const value = parseInt(timeStr);
            const unit = timeStr.slice(-1);
            
            // Converter para minutos
            let minutes = 0;
            switch(unit) {
                case 'h':
                    minutes = value * 60;
                    break;
                case 'm':
                    minutes = value;
                    break;
                case 'd':
                    minutes = value * 24 * 60;
                    break;
            }
            
            return {
                raw: timeStr,
                minutes: minutes,
                display: this._formatTime(minutes)
            };
        }
        return null;
    }

    /**
     * Extrai prioridade do texto (!alta) ou infere de tags
     */
    _extractPriority(text, tags) {
        // Primeiro, tenta extrair do padrão !prioridade
        const matches = [...text.matchAll(this.patterns.priority)];
        if (matches.length > 0) {
            const priorityStr = matches[0][1].toLowerCase();
            return this._normalizePriority(priorityStr);
        }
        
        // Se não encontrou, tenta inferir das tags
        for (const tag of tags) {
            if (this.tagPriorityMap[tag]) {
                return this.tagPriorityMap[tag];
            }
        }
        
        return 'Média'; // Default
    }

    /**
     * Normaliza string de prioridade para formato padrão
     */
    _normalizePriority(priority) {
        const normalized = priority.toLowerCase();
        const map = {
            'alta': 'Alta',
            'high': 'Alta',
            'urgente': 'Alta',
            'urgent': 'Alta',
            'média': 'Média',
            'media': 'Média',
            'medium': 'Média',
            'baixa': 'Baixa',
            'low': 'Baixa'
        };
        return map[normalized] || 'Média';
    }

    /**
     * Remove padrões do texto para obter o título limpo
     */
    _extractTitle(text) {
        let title = text;
        
        // Remove todos os padrões
        title = title.replace(this.patterns.area, '');
        title = title.replace(this.patterns.tags, '');
        title = title.replace(this.patterns.time, '');
        title = title.replace(this.patterns.priority, '');
        
        // Limpa espaços extras
        title = title.trim().replace(/\s+/g, ' ');
        
        return title;
    }

    /**
     * Formata minutos para exibição
     */
    _formatTime(minutes) {
        if (minutes < 60) {
            return `${minutes}min`;
        } else if (minutes < 1440) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
        } else {
            const days = Math.floor(minutes / 1440);
            const hours = Math.floor((minutes % 1440) / 60);
            return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
        }
    }

    /**
     * Cria resultado vazio
     */
    _createEmptyResult() {
        return {
            titulo: '',
            area: null,
            tags: [],
            tempoEstimado: null,
            prioridade: 'Média',
            raw: '',
            isValid: false
        };
    }

    /**
     * Valida se uma área existe ou deve ser criada
     * @param {string} areaName - Nome da área
     * @param {Array} existingAreas - Lista de áreas existentes
     * @returns {Object} { exists: boolean, area: Object|null }
     */
    validateArea(areaName, existingAreas) {
        if (!areaName) {
            return { exists: false, area: null };
        }

        const normalized = areaName.toLowerCase();
        const found = existingAreas.find(a => 
            a.nome.toLowerCase() === normalized
        );

        return {
            exists: !!found,
            area: found || null,
            shouldCreate: !found
        };
    }

    /**
     * Gera preview do que será criado
     * @param {Object} parsed - Resultado do parse
     * @returns {string} Preview formatado
     */
    generatePreview(parsed) {
        if (!parsed.isValid) {
            return '⚠️ Título inválido';
        }

        const parts = [];
        parts.push(`📝 **${parsed.titulo}**`);
        
        if (parsed.area) {
            parts.push(`📚 Área: ${parsed.area}`);
        }
        
        if (parsed.tags.length > 0) {
            parts.push(`🏷️ Tags: ${parsed.tags.map(t => `#${t}`).join(', ')}`);
        }
        
        if (parsed.tempoEstimado) {
            parts.push(`⏱️ Tempo: ${parsed.tempoEstimado.display}`);
        }
        
        parts.push(`🎯 Prioridade: ${parsed.prioridade}`);

        return parts.join('\n');
    }
}

// Export para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuickAddParser;
}

