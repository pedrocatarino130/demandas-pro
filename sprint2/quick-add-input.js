/**
 * TASK-013: Input Universal com Autocomplete
 * 
 * Campo de entrada inteligente com sugestões de áreas e tags
 * Suporta shortcuts (Ctrl+N) e histórico de comandos
 */

class QuickAddInput {
    constructor(options = {}) {
        this.container = options.container || document.body;
        this.onSubmit = options.onSubmit || (() => {});
        this.parser = options.parser || new QuickAddParser();
        this.areas = options.areas || [];
        this.tags = options.tags || [];
        this.history = this._loadHistory();
        
        this.currentSuggestionIndex = -1;
        this.suggestions = [];
        
        this._createInput();
        this._attachEvents();
    }

    /**
     * Cria o elemento de input
     */
    _createInput() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'quick-add-wrapper';
        this.wrapper.innerHTML = `
            <div class="quick-add-container">
                <input 
                    type="text" 
                    class="quick-add-input" 
                    id="quickAddInput"
                    placeholder="Digite para criar... Ex: Python @udemy #urgente :2h !alta"
                    autocomplete="off"
                />
                <div class="quick-add-suggestions" id="quickAddSuggestions"></div>
                <div class="quick-add-preview" id="quickAddPreview"></div>
            </div>
        `;
        
        this.container.appendChild(this.wrapper);
        this.input = this.wrapper.querySelector('#quickAddInput');
        this.suggestionsEl = this.wrapper.querySelector('#quickAddSuggestions');
        this.previewEl = this.wrapper.querySelector('#quickAddPreview');
    }

    /**
     * Anexa event listeners
     */
    _attachEvents() {
        // Input events
        this.input.addEventListener('input', (e) => this._handleInput(e));
        this.input.addEventListener('keydown', (e) => this._handleKeyDown(e));
        this.input.addEventListener('focus', () => this._handleFocus());
        this.input.addEventListener('blur', () => {
            // Delay para permitir click em sugestões
            setTimeout(() => this._hideSuggestions(), 200);
        });

        // Shortcut global Ctrl+N
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.focus();
            }
        });

        // Click fora para fechar
        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target)) {
                this._hideSuggestions();
            }
        });
    }

    /**
     * Handler de input
     */
    _handleInput(e) {
        const value = e.target.value;
        
        if (!value) {
            this._hideSuggestions();
            this._hidePreview();
            return;
        }

        // Parse do input
        const parsed = this.parser.parse(value);
        
        // Mostrar preview
        this._showPreview(parsed);
        
        // Mostrar sugestões baseadas no cursor
        this._updateSuggestions(value);
    }

    /**
     * Handler de teclas
     */
    _handleKeyDown(e) {
        // Enter: submit
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this._submit();
            return;
        }

        // Escape: limpar
        if (e.key === 'Escape') {
            this.clear();
            this._hideSuggestions();
            return;
        }

        // Arrow keys: navegar sugestões
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this._navigateSuggestions(1);
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            this._navigateSuggestions(-1);
            return;
        }

        // Tab: completar sugestão
        if (e.key === 'Tab' && this.currentSuggestionIndex >= 0) {
            e.preventDefault();
            this._selectSuggestion(this.currentSuggestionIndex);
            return;
        }
    }

    /**
     * Handler de focus
     */
    _handleFocus() {
        const value = this.input.value;
        if (value) {
            this._updateSuggestions(value);
        }
    }

    /**
     * Atualiza sugestões baseado no input
     */
    _updateSuggestions(value) {
        const cursorPos = this.input.selectionStart;
        const textBeforeCursor = value.substring(0, cursorPos);
        
        // Detectar contexto (@ para áreas, # para tags)
        if (textBeforeCursor.endsWith('@')) {
            this.suggestions = this._getAreaSuggestions('');
            this._showSuggestions();
            return;
        }

        const areaMatch = textBeforeCursor.match(/@(\w*)$/);
        if (areaMatch) {
            const areaPrefix = areaMatch[1].toLowerCase();
            this.suggestions = this._getAreaSuggestions(areaPrefix);
            this._showSuggestions();
            return;
        }

        if (textBeforeCursor.endsWith('#')) {
            this.suggestions = this._getTagSuggestions('');
            this._showSuggestions();
            return;
        }

        const tagMatch = textBeforeCursor.match(/#(\w*)$/);
        if (tagMatch) {
            const tagPrefix = tagMatch[1].toLowerCase();
            this.suggestions = this._getTagSuggestions(tagPrefix);
            this._showSuggestions();
            return;
        }

        // Sugestões de histórico
        if (value.length > 0) {
            this.suggestions = this._getHistorySuggestions(value);
            if (this.suggestions.length > 0) {
                this._showSuggestions();
                return;
            }
        }

        this._hideSuggestions();
    }

    /**
     * Obtém sugestões de áreas
     */
    _getAreaSuggestions(prefix) {
        const filtered = this.areas
            .filter(area => 
                area.nome.toLowerCase().startsWith(prefix) &&
                area.status === 'ativo'
            )
            .slice(0, 5)
            .map(area => ({
                type: 'area',
                value: `@${area.nome}`,
                display: `📚 ${area.nome}`,
                data: area
            }));

        // Adicionar opção de criar nova área
        if (prefix && !this.areas.some(a => a.nome.toLowerCase() === prefix)) {
            filtered.push({
                type: 'new-area',
                value: `@${prefix}`,
                display: `➕ Criar área "${prefix}"`,
                data: { nome: prefix }
            });
        }

        return filtered;
    }

    /**
     * Obtém sugestões de tags
     */
    _getTagSuggestions(prefix) {
        // Tags existentes de tópicos
        const existingTags = [...new Set(this.tags)]
            .filter(tag => tag.toLowerCase().startsWith(prefix))
            .slice(0, 5)
            .map(tag => ({
                type: 'tag',
                value: `#${tag}`,
                display: `🏷️ ${tag}`,
                data: tag
            }));

        // Tags comuns
        const commonTags = ['urgente', 'importante', 'revisão', 'prática', 'teoria'];
        const common = commonTags
            .filter(tag => 
                tag.toLowerCase().startsWith(prefix) &&
                !this.tags.some(t => t.toLowerCase() === tag.toLowerCase())
            )
            .slice(0, 3)
            .map(tag => ({
                type: 'tag',
                value: `#${tag}`,
                display: `🏷️ ${tag}`,
                data: tag
            }));

        return [...existingTags, ...common];
    }

    /**
     * Obtém sugestões do histórico
     */
    _getHistorySuggestions(prefix) {
        return this.history
            .filter(item => item.toLowerCase().includes(prefix.toLowerCase()))
            .slice(0, 3)
            .map(item => ({
                type: 'history',
                value: item,
                display: `🕐 ${item}`,
                data: item
            }));
    }

    /**
     * Mostra sugestões
     */
    _showSuggestions() {
        if (this.suggestions.length === 0) {
            this._hideSuggestions();
            return;
        }

        this.suggestionsEl.innerHTML = this.suggestions
            .map((sug, index) => `
                <div 
                    class="quick-add-suggestion ${index === this.currentSuggestionIndex ? 'active' : ''}"
                    data-index="${index}"
                    onclick="this._selectSuggestion(${index})"
                >
                    ${sug.display}
                </div>
            `)
            .join('');

        this.suggestionsEl.style.display = 'block';
        this.currentSuggestionIndex = -1;
    }

    /**
     * Esconde sugestões
     */
    _hideSuggestions() {
        this.suggestionsEl.style.display = 'none';
        this.currentSuggestionIndex = -1;
    }

    /**
     * Navega entre sugestões
     */
    _navigateSuggestions(direction) {
        if (this.suggestions.length === 0) return;

        this.currentSuggestionIndex += direction;
        
        if (this.currentSuggestionIndex < 0) {
            this.currentSuggestionIndex = this.suggestions.length - 1;
        } else if (this.currentSuggestionIndex >= this.suggestions.length) {
            this.currentSuggestionIndex = 0;
        }

        // Atualizar visual
        const items = this.suggestionsEl.querySelectorAll('.quick-add-suggestion');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSuggestionIndex);
        });

        // Scroll para item ativo
        const activeItem = items[this.currentSuggestionIndex];
        if (activeItem) {
            activeItem.scrollIntoView({ block: 'nearest' });
        }
    }

    /**
     * Seleciona uma sugestão
     */
    _selectSuggestion(index) {
        if (index < 0 || index >= this.suggestions.length) return;

        const suggestion = this.suggestions[index];
        const currentValue = this.input.value;
        const cursorPos = this.input.selectionStart;
        
        // Encontrar onde inserir
        const textBefore = currentValue.substring(0, cursorPos);
        let insertPos = cursorPos;
        
        if (textBefore.endsWith('@') || textBefore.match(/@\w*$/)) {
            const match = textBefore.match(/@\w*$/);
            if (match) {
                insertPos = cursorPos - match[0].length;
            }
        } else if (textBefore.endsWith('#') || textBefore.match(/#\w*$/)) {
            const match = textBefore.match(/#\w*$/);
            if (match) {
                insertPos = cursorPos - match[0].length;
            }
        }

        // Inserir sugestão
        const newValue = 
            currentValue.substring(0, insertPos) + 
            suggestion.value + ' ' + 
            currentValue.substring(cursorPos);

        this.input.value = newValue;
        this.input.focus();
        this.input.setSelectionRange(
            insertPos + suggestion.value.length + 1,
            insertPos + suggestion.value.length + 1
        );

        this._hideSuggestions();
        this._handleInput({ target: this.input });
    }

    /**
     * Mostra preview
     */
    _showPreview(parsed) {
        if (!parsed.isValid) {
            this._hidePreview();
            return;
        }

        const preview = this.parser.generatePreview(parsed);
        this.previewEl.innerHTML = preview;
        this.previewEl.style.display = 'block';
    }

    /**
     * Esconde preview
     */
    _hidePreview() {
        this.previewEl.style.display = 'none';
    }

    /**
     * Submete o formulário
     */
    _submit() {
        const value = this.input.value.trim();
        if (!value) return;

        const parsed = this.parser.parse(value);
        
        if (!parsed.isValid) {
            this._showError('Título inválido');
            return;
        }

        // Salvar no histórico
        this._saveToHistory(value);

        // Limpar input
        this.clear();

        // Callback
        this.onSubmit(parsed);
    }

    /**
     * Salva no histórico
     */
    _saveToHistory(value) {
        // Remove se já existe
        this.history = this.history.filter(h => h !== value);
        
        // Adiciona no início
        this.history.unshift(value);
        
        // Limita a 10 itens
        this.history = this.history.slice(0, 10);
        
        // Salva no localStorage
        try {
            localStorage.setItem('quickAddHistory', JSON.stringify(this.history));
        } catch (e) {
            console.warn('Não foi possível salvar histórico', e);
        }
    }

    /**
     * Carrega histórico
     */
    _loadHistory() {
        try {
            const stored = localStorage.getItem('quickAddHistory');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Mostra erro
     */
    _showError(message) {
        // Implementar toast ou feedback visual
        console.warn(message);
    }

    /**
     * Limpa o input
     */
    clear() {
        this.input.value = '';
        this._hideSuggestions();
        this._hidePreview();
    }

    /**
     * Foca no input
     */
    focus() {
        this.input.focus();
    }

    /**
     * Atualiza áreas e tags
     */
    updateData(areas, tags) {
        this.areas = areas || [];
        this.tags = tags || [];
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuickAddInput;
}

