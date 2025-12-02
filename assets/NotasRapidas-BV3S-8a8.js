import{f as r}from"./index-m6Z5b8eQ.js";import"./idb-Dob3nYDb.js";class c{constructor(e={}){this.container=e.container||document.body,this.topicoId=e.topicoId||null,this.autoSaveInterval=e.autoSaveInterval||3e4,this.onSave=e.onSave||(()=>{}),this.onChange=e.onChange||(()=>{}),this.content="",this.lastSaved=null,this.autoSaveId=null,this.isDirty=!1,this.templates={sessao:`# Sessão de Estudo

## O que aprendi
- 
- 

## Dúvidas
- 

## Próximos passos
- `,revisao:`# Revisão

## O que lembrei
- 

## O que esqueci
- 

## Pontos importantes
- `,resumo:`# Resumo

## Conceitos principais
1. 
2. 
3. 

## Exemplos
- 

## Aplicações práticas
- `},this._createUI(),this._attachEvents(),this._loadContent().catch(t=>{console.error("Erro ao carregar conteúdo:",t)})}_createUI(){this.wrapper=document.createElement("div"),this.wrapper.className="notas-rapidas",this.wrapper.innerHTML=`
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
        `,this.container.appendChild(this.wrapper),this.editor=this.wrapper.querySelector("#notasEditor"),this.preview=this.wrapper.querySelector("#notasPreview"),this.status=this.wrapper.querySelector("#notasStatus")}_attachEvents(){this.editor.addEventListener("input",()=>this._handleInput()),this.editor.addEventListener("keydown",e=>this._handleKeyDown(e)),this.wrapper.querySelectorAll(".notas-toolbar-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.insert;this._insertText(t)})}),this.wrapper.querySelector("#notasTemplate").addEventListener("click",()=>this._showTemplateModal()),this.wrapper.querySelector("#notasExport").addEventListener("click",()=>this._exportMarkdown()),this.wrapper.querySelector("#notasSearch").addEventListener("click",()=>this._showSearchModal()),this.wrapper.querySelector("#notasTemplateCancel").addEventListener("click",()=>this._closeTemplateModal()),this.wrapper.querySelector("#notasSearchCancel").addEventListener("click",()=>this._closeSearchModal()),this._startAutoSave()}_handleInput(){this.content=this.editor.value,this.isDirty=!0,this._updatePreview(),this._updateStatus("Editando..."),this.onChange(this.content)}_handleKeyDown(e){if(e.key==="Tab"&&!e.shiftKey){e.preventDefault(),this._insertText("  ",!0);return}if((e.ctrlKey||e.metaKey)&&e.key==="s"){e.preventDefault(),this._save();return}}_insertText(e,t=!1){const a=this.editor.selectionStart,i=this.editor.selectionEnd,o=this.editor.value.substring(a,i);let s=e;e.includes("texto")&&o&&(s=e.replace("texto",o));const n=this.editor.value.substring(0,a)+s+this.editor.value.substring(i);this.editor.value=n,this.editor.focus();const l=a+s.length;this.editor.setSelectionRange(l,l),this._handleInput()}_updatePreview(){if(!this.preview)return;const e=this.content,t=this._markdownToHtml(e);this.preview.innerHTML=t}_markdownToHtml(e){let t=e;return t=t.replace(/^### (.*$)/gim,"<h3>$1</h3>"),t=t.replace(/^## (.*$)/gim,"<h2>$1</h2>"),t=t.replace(/^# (.*$)/gim,"<h1>$1</h1>"),t=t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),t=t.replace(/\*(.*?)\*/g,"<em>$1</em>"),t=t.replace(/```([\s\S]*?)```/g,"<pre><code>$1</code></pre>"),t=t.replace(/`(.*?)`/g,"<code>$1</code>"),t=t.replace(/^- (.*$)/gim,"<li>$1</li>"),t=t.replace(/^\d+\. (.*$)/gim,"<li>$1</li>"),t=t.replace(/(<li>.*<\/li>)/s,"<ul>$1</ul>"),t=t.replace(/\n/g,"<br>"),t||'<p class="notas-empty">Nenhuma nota ainda...</p>'}_startAutoSave(){this.autoSaveId=setInterval(()=>{this.isDirty&&this._save().catch(e=>{console.error("Erro no auto-save:",e)})},this.autoSaveInterval)}async _save(){if(!this.isDirty)return;const e={topicoId:this.topicoId,content:this.content,timestamp:new Date().toISOString()},t=`notas_${this.topicoId||"global"}`;try{await r.set(t,e),this.lastSaved=new Date,this.isDirty=!1,this._updateStatus("Salvo"),this.onSave(e)}catch(a){console.error("Erro ao salvar notas",a),this._updateStatus("Erro ao salvar")}}async _loadContent(){const e=`notas_${this.topicoId||"global"}`;try{let t=await r.get(e);if(!t)try{const a=localStorage.getItem(e);a&&(t=JSON.parse(a),await r.set(e,t))}catch{}t&&(this.content=t.content||"",this.editor.value=this.content,this._updatePreview(),this.lastSaved=t.timestamp?new Date(t.timestamp):null)}catch(t){console.warn("Erro ao carregar notas",t)}}_updateStatus(e){this.status&&(this.status.textContent=e,this.status.classList.toggle("saving",e==="Editando..."),this.status.classList.toggle("saved",e==="Salvo"))}_showTemplateModal(){const e=this.wrapper.querySelector("#notasTemplateModal"),t=this.wrapper.querySelector("#notasTemplatesList");t.innerHTML=Object.entries(this.templates).map(([a,i])=>{const o=document.createElement("div");return o.className="notas-template-item",o.innerHTML=`
                    <strong>${a.charAt(0).toUpperCase()+a.slice(1)}</strong>
                    <p>${i.split(`
`)[0]}...</p>
                `,o.addEventListener("click",()=>this._insertTemplate(a)),o.outerHTML}).join(""),e.style.display="flex"}_insertTemplate(e){const t=this.templates[e];t&&(this.editor.value=t,this._handleInput(),this._closeTemplateModal())}_closeTemplateModal(){const e=this.wrapper.querySelector("#notasTemplateModal");e.style.display="none"}_showSearchModal(){const e=this.wrapper.querySelector("#notasSearchModal"),t=this.wrapper.querySelector("#notasSearchInput"),a=this.wrapper.querySelector("#notasSearchResults");e.style.display="flex",t.focus(),t.value="",a.innerHTML="";const i=()=>{const o=t.value.toLowerCase();if(o.length<2){a.innerHTML="";return}const s=this._searchNotes(o);a.innerHTML=s.length>0?s.map(n=>`
                    <div class="notas-search-result">
                        <strong>${n.topico||"Global"}</strong>
                        <p>${n.preview}</p>
                    </div>
                `).join(""):"<p>Nenhuma nota encontrada</p>"};t.removeEventListener("input",this._searchHandler),this._searchHandler=i,t.addEventListener("input",i)}async _searchNotes(e){const t=[];try{const i=(await r.getAllKeys()).filter(o=>o.startsWith("notas_"));for(const o of i)try{const s=await r.get(o);s&&s.content&&s.content.toLowerCase().includes(e)&&t.push({topico:o.replace("notas_",""),preview:s.content.substring(0,100)+"...",content:s.content})}catch(s){console.warn(`Erro ao buscar nota ${o}:`,s)}for(let o=0;o<localStorage.length;o++){const s=localStorage.key(o);if(s&&s.startsWith("notas_"))try{const n=JSON.parse(localStorage.getItem(s));n.content&&n.content.toLowerCase().includes(e)&&(t.find(l=>l.topico===s.replace("notas_",""))||t.push({topico:s.replace("notas_",""),preview:n.content.substring(0,100)+"...",content:n.content}))}catch{}}return t}catch(a){return console.error("Erro ao buscar notas:",a),[]}}_closeSearchModal(){const e=this.wrapper.querySelector("#notasSearchModal");e&&(e.style.display="none")}_exportMarkdown(){if(!this.content){alert("Nenhuma nota para exportar");return}const e=new Blob([this.content],{type:"text/markdown"}),t=URL.createObjectURL(e),a=document.createElement("a");a.href=t,a.download=`notas_${this.topicoId||"global"}_${Date.now()}.md`,a.click(),URL.revokeObjectURL(t)}setContent(e){this.content=e,this.editor.value=e,this._updatePreview(),this.isDirty=!0}getContent(){return this.content}async setTopicoId(e){this.isDirty&&await this._save(),this.topicoId=e,await this._loadContent()}destroy(){this.autoSaveId&&clearInterval(this.autoSaveId),this.isDirty&&this._save(),this.wrapper&&this.wrapper.parentNode&&this.wrapper.parentNode.removeChild(this.wrapper)}}typeof module<"u"&&module.exports&&(module.exports=c);export{c as NotasRapidas,c as default};
//# sourceMappingURL=NotasRapidas-BV3S-8a8.js.map
