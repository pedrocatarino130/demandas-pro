/**
 * TASK-017: Campo de Notas Rápidas
 * 
 * Área para anotações durante estudo com:
 * - Markdown básico
 * - Auto-save a cada 30s
 * - Snippets/templates
 * - Exportar como .md
 * - Busca em notas antigas
 */

import {
    firebaseCache
} from '../../services/firebase-cache.js';

class NotasRapidas {
    constructor(options = {}) {
        this.container = options.container || document.body;
        this.topicoId = options.topicoId || null;
        this.autoSaveInterval = options.autoSaveInterval || 30000; // 30 segundos
        this.onSave = options.onSave || (() => {});
        this.onChange = options.onChange || (() => {});

        this.content = '';
        this.lastSaved = null;
        this.autoSaveId = null;
        this.isDirty = false;

        this.templates = {
            'sessao': `# Sessão de Estudo

## O que aprendi
- 
- 

## Dúvidas
- 

## Próximos passos
- `,
            'revisao': `# Revisão

## O que lembrei
- 

## O que esqueci
- 

## Pontos importantes
- `,
            'resumo': `# Resumo

## Conceitos principais
1. 
2. 
3. 

## Exemplos
- 

## Aplicações práticas
- `
        };

        this._createUI();
        this._attachEvents();
        // Carregar conteúdo assincronamente
        this._loadContent().catch(err => {
            console.error('Erro ao carregar conteúdo:', err);
        });
    }

    /**
     * Cria interface
     */
    _createUI() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'notas-rapidas';
        this.wrapper.innerHTML = `
            <div class="notas-container">
                <div class="notas-header">
                    <h3>📝 Notas Rápidas</h3>
                    <div class="notas-actions">
                        <button class="notas-btn" id="notasTemplate" title="Inserir template">📄</button>
                        <button class="notas-btn" id="notasExport" title="Exportar">💾</button>
                        <button class="notas-btn" id="notasSearch" title="Buscar">🔍</button>
                        <span class="notas-status" id="notasStatus">Salvo</span>
                    </div>
                </div>
                
                <div class="notas-editor-container">
                    <textarea 
                        class="notas-editor" 
                        id="notasEditor"
                        placeholder="Digite suas anotações aqui...&#10;&#10;Suporta Markdown:&#10;**negrito** *itálico*&#10;# Título&#10;- Lista"
                    ></textarea>
                    <div class="notas-preview" id="notasPreview"></div>
                </div>
                
                <div class="notas-toolbar">
                    <button class="notas-toolbar-btn" data-insert="**texto**">B</button>
                    <button class="notas-toolbar-btn" data-insert="*texto*">I</button>
                    <button class="notas-toolbar-btn" data-insert="# Título">H1</button>
                    <button class="notas-toolbar-btn" data-insert="- Item">Lista</button>
                    <button class="notas-toolbar-btn" data-insert="\`\`\`&#10;código&#10;\`\`\`">Code</button>
                </div>
            </div>
            
            <!-- Modal de templates -->
            <div class="notas-modal" id="notasTemplateModal" style="display:none">
                <div class="notas-modal-content">
                    <h4>Escolha um template</h4>
                    <div class="notas-templates-list" id="notasTemplatesList"></div>
                    <button class="notas-btn" id="notasTemplateCancel">Cancelar</button>
                </div>
            </div>
            
            <!-- Modal de busca -->
            <div class="notas-modal" id="notasSearchModal" style="display:none">
                <div class="notas-modal-content">
                    <h4>Buscar em notas</h4>
                    <input type="text" class="notas-search-input" id="notasSearchInput" placeholder="Digite para buscar...">
                    <div class="notas-search-results" id="notasSearchResults"></div>
                    <button class="notas-btn" id="notasSearchCancel">Fechar</button>
                </div>
            </div>
        `;

        this.container.appendChild(this.wrapper);
        this.editor = this.wrapper.querySelector('#notasEditor');
        this.preview = this.wrapper.querySelector('#notasPreview');
        this.status = this.wrapper.querySelector('#notasStatus');
    }

    /**
     * Anexa eventos
     */
    _attachEvents() {
        // Editor events
        this.editor.addEventListener('input', () => this._handleInput());
        this.editor.addEventListener('keydown', (e) => this._handleKeyDown(e));

        // Toolbar buttons
        this.wrapper.querySelectorAll('.notas-toolbar-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const insert = btn.dataset.insert;
                this._insertText(insert);
            });
        });

        // Action buttons
        this.wrapper.querySelector('#notasTemplate').addEventListener('click', () => this._showTemplateModal());
        this.wrapper.querySelector('#notasExport').addEventListener('click', () => this._exportMarkdown());
        this.wrapper.querySelector('#notasSearch').addEventListener('click', () => this._showSearchModal());
        this.wrapper.querySelector('#notasTemplateCancel').addEventListener('click', () => this._closeTemplateModal());
        this.wrapper.querySelector('#notasSearchCancel').addEventListener('click', () => this._closeSearchModal());

        // Auto-save
        this._startAutoSave();
    }

    /**
     * Handler de input
     */
    _handleInput() {
        this.content = this.editor.value;
        this.isDirty = true;
        this._updatePreview();
        this._updateStatus('Editando...');
        this.onChange(this.content);
    }

    /**
     * Handler de teclas
     */
    _handleKeyDown(e) {
        // Tab para indentação
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            this._insertText('  ', true);
            return;
        }

        // Ctrl+S para salvar
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this._save();
            return;
        }
    }

    /**
     * Insere texto no cursor
     */
    _insertText(text, replaceSelection = false) {
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const selectedText = this.editor.value.substring(start, end);

        let insertText = text;
        if (text.includes('texto') && selectedText) {
            insertText = text.replace('texto', selectedText);
        }

        const newValue =
            this.editor.value.substring(0, start) +
            insertText +
            this.editor.value.substring(end);

        this.editor.value = newValue;
        this.editor.focus();

        // Reposicionar cursor
        const newPos = replaceSelection ?
            start + insertText.length :
            start + insertText.length;
        this.editor.setSelectionRange(newPos, newPos);

        this._handleInput();
    }

    /**
     * Atualiza preview
     */
    _updatePreview() {
        if (!this.preview) return;

        const markdown = this.content;
        const html = this._markdownToHtml(markdown);
        this.preview.innerHTML = html;
    }

    /**
     * Converte markdown básico para HTML
     */
    _markdownToHtml(markdown) {
        let html = markdown;

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Code blocks
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');

        // Lists
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Line breaks
        html = html.replace(/\n/g, '<br>');

        return html || '<p class="notas-empty">Nenhuma nota ainda...</p>';
    }

    /**
     * Inicia auto-save
     */
    _startAutoSave() {
        this.autoSaveId = setInterval(() => {
            if (this.isDirty) {
                this._save().catch(err => {
                    console.error('Erro no auto-save:', err);
                });
            }
        }, this.autoSaveInterval);
    }

    /**
     * Salva conteúdo
     */
    async _save() {
        if (!this.isDirty) return;

        const data = {
            topicoId: this.topicoId,
            content: this.content,
            timestamp: new Date().toISOString()
        };

        // Salvar apenas localmente (cache)
        const key = `notas_${this.topicoId || 'global'}`;
        try {
            // Salvar no cache local
            await firebaseCache.set(key, data);

            this.lastSaved = new Date();
            this.isDirty = false;
            this._updateStatus('Salvo');
            this.onSave(data);
        } catch (e) {
            console.error('Erro ao salvar notas', e);
            this._updateStatus('Erro ao salvar');
        }
    }

    /**
     * Carrega conteúdo
     */
    async _loadContent() {
        const key = `notas_${this.topicoId || 'global'}`;
        try {
            // Tentar carregar do cache primeiro
            let data = await firebaseCache.get(key);

            // Fallback para localStorage (migração)
            if (!data) {
                try {
                    const stored = localStorage.getItem(key);
                    if (stored) {
                        data = JSON.parse(stored);
                        // Migrar para cache
                        await firebaseCache.set(key, data);
                    }
                } catch (e) {
                    // Ignorar erros de localStorage
                }
            }

            if (data) {
                this.content = data.content || '';
                this.editor.value = this.content;
                this._updatePreview();
                this.lastSaved = data.timestamp ? new Date(data.timestamp) : null;
            }
        } catch (e) {
            console.warn('Erro ao carregar notas', e);
        }
    }

    /**
     * Atualiza status
     */
    _updateStatus(text) {
        if (this.status) {
            this.status.textContent = text;
            this.status.classList.toggle('saving', text === 'Editando...');
            this.status.classList.toggle('saved', text === 'Salvo');
        }
    }

    /**
     * Mostra modal de templates
     */
    _showTemplateModal() {
        const modal = this.wrapper.querySelector('#notasTemplateModal');
        const list = this.wrapper.querySelector('#notasTemplatesList');

        list.innerHTML = Object.entries(this.templates)
            .map(([name, template]) => {
                const item = document.createElement('div');
                item.className = 'notas-template-item';
                item.innerHTML = `
                    <strong>${name.charAt(0).toUpperCase() + name.slice(1)}</strong>
                    <p>${template.split('\n')[0]}...</p>
                `;
                item.addEventListener('click', () => this._insertTemplate(name));
                return item.outerHTML;
            })
            .join('');

        modal.style.display = 'flex';
    }

    /**
     * Insere template
     */
    _insertTemplate(name) {
        const template = this.templates[name];
        if (template) {
            this.editor.value = template;
            this._handleInput();
            this._closeTemplateModal();
        }
    }

    /**
     * Fecha modal de templates
     */
    _closeTemplateModal() {
        const modal = this.wrapper.querySelector('#notasTemplateModal');
        modal.style.display = 'none';
    }

    /**
     * Mostra modal de busca
     */
    _showSearchModal() {
        const modal = this.wrapper.querySelector('#notasSearchModal');
        const input = this.wrapper.querySelector('#notasSearchInput');
        const results = this.wrapper.querySelector('#notasSearchResults');

        modal.style.display = 'flex';
        input.focus();
        input.value = '';
        results.innerHTML = '';

        const searchHandler = () => {
            const query = input.value.toLowerCase();
            if (query.length < 2) {
                results.innerHTML = '';
                return;
            }

            const matches = this._searchNotes(query);
            results.innerHTML = matches.length > 0 ?
                matches.map(m => `
                    <div class="notas-search-result">
                        <strong>${m.topico || 'Global'}</strong>
                        <p>${m.preview}</p>
                    </div>
                `).join('') :
                '<p>Nenhuma nota encontrada</p>';
        };

        // Remover listener anterior se existir
        input.removeEventListener('input', this._searchHandler);
        this._searchHandler = searchHandler;
        input.addEventListener('input', searchHandler);
    }

    /**
     * Busca em notas
     */
    async _searchNotes(query) {
        const matches = [];

        try {
            // Buscar no cache primeiro
            const allKeys = await firebaseCache.getAllKeys();
            const notasKeys = allKeys.filter(key => key.startsWith('notas_'));

            for (const key of notasKeys) {
                try {
                    const data = await firebaseCache.get(key);
                    if (data && data.content && data.content.toLowerCase().includes(query)) {
                        matches.push({
                            topico: key.replace('notas_', ''),
                            preview: data.content.substring(0, 100) + '...',
                            content: data.content
                        });
                    }
                } catch (e) {
                    console.warn(`Erro ao buscar nota ${key}:`, e);
                }
            }

            // Fallback para localStorage (migração)
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('notas_')) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data.content && data.content.toLowerCase().includes(query)) {
                            // Evitar duplicatas
                            if (!matches.find(m => m.topico === key.replace('notas_', ''))) {
                                matches.push({
                                    topico: key.replace('notas_', ''),
                                    preview: data.content.substring(0, 100) + '...',
                                    content: data.content
                                });
                            }
                        }
                    } catch (e) {
                        // Ignorar erros
                    }
                }
            }

            return matches;
        } catch (e) {
            console.error('Erro ao buscar notas:', e);
            return [];
        }
    }

    /**
     * Fecha modal de busca
     */
    _closeSearchModal() {
        const modal = this.wrapper.querySelector('#notasSearchModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Exporta como markdown
     */
    _exportMarkdown() {
        if (!this.content) {
            alert('Nenhuma nota para exportar');
            return;
        }

        const blob = new Blob([this.content], {
            type: 'text/markdown'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notas_${this.topicoId || 'global'}_${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Define conteúdo
     */
    setContent(content) {
        this.content = content;
        this.editor.value = content;
        this._updatePreview();
        this.isDirty = true;
    }

    /**
     * Obtém conteúdo
     */
    getContent() {
        return this.content;
    }

    /**
     * Define tópico
     */
    async setTopicoId(topicoId) {
        // Salvar conteúdo atual antes de trocar
        if (this.isDirty) {
            await this._save();
        }

        this.topicoId = topicoId;
        await this._loadContent();
    }

    /**
     * Destrói componente
     */
    destroy() {
        if (this.autoSaveId) {
            clearInterval(this.autoSaveId);
        }

        if (this.isDirty) {
            this._save();
        }

        if (this.wrapper && this.wrapper.parentNode) {
            this.wrapper.parentNode.removeChild(this.wrapper);
        }
    }
}

// Export ES6
export {
    NotasRapidas
};
export default NotasRapidas;

// Export para uso global (compatibilidade)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotasRapidas;
}