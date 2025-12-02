import{_ as h}from"./index-JMGHwSEN.js";import"./idb-Dob3nYDb.js";class v{constructor(t,o){this.container=t,this.store=o,this.quickAdd=null,this.kanban=null,this.pomodoro=null,this.notas=null,this.revisaoEspacada=null,this.currentTopico=null,this._init()}async _init(){this.revisaoEspacada=new RevisaoEspacada,this.store.setRevisaoEspacada(this.revisaoEspacada),this._createStructure(),this._initQuickAdd(),this._initKanban(),this._setupEventListeners(),this.store.subscribe(()=>this._updateView()),this._updateView()}_createStructure(){this.container.innerHTML=`
            <div class="estudos-view">
                <div class="estudos-hero">
                    <div class="estudos-hero-glow"></div>
                    <div class="estudos-hero-grid"></div>
                    <div class="estudos-hero-content">
                        <div class="estudos-hero-text">
                            <span class="estudos-kicker">Workspace</span>
                            <h1>📚 Estudos</h1>
                            <p class="estudos-subtitle">Kanban + Revisão + Pomodoro + Notas em um só fluxo.</p>
                            <div class="estudos-chips">
                                <span class="chip neon">Kanban</span>
                                <span class="chip pink">Pomodoro</span>
                                <span class="chip blue">Notas</span>
                            </div>
                        </div>
                        <div class="estudos-hero-actions">
                            <button class="btn btn-primary estudos-hero-btn" id="btnAddTopico" title="Adicionar novo tópico">➕ Novo Tópico</button>
                        </div>
                    </div>
                    <div id="quickAddContainer" class="estudos-quickadd-shell"></div>
                </div>
                <div id="kanbanContainer" class="estudos-kanban"></div>
            </div>

            <div id="estudoModal" class="estudo-modal" style="display: none;">
                <div class="estudo-modal-overlay"></div>
                <div class="estudo-modal-content">
                    <div class="estudo-modal-header">
                        <h2 id="modalTopicoTitulo">Tópico</h2>
                        <button class="estudo-modal-close" id="modalClose">✕</button>
                    </div>
                    <div class="estudo-modal-body">
                        <div id="pomodoroContainer"></div>
                        <div id="notasContainer"></div>
                    </div>
                    <div class="estudo-modal-footer">
                        <button class="btn btn-primary" id="salvarSessaoBtn">💾 Salvar Sessão</button>
                        <button class="btn btn-secondary" id="fecharModalBtn">Fechar</button>
                    </div>
                </div>
            </div>
        `}_initQuickAdd(){const t=this.container.querySelector("#quickAddContainer");this.quickAdd=new QuickAddInput({container:t,parser:new QuickAddParser,areas:this.store.getAreas(),tags:this.store.getAllTags(),onSubmit:o=>this._handleQuickAdd(o)})}_handleQuickAdd(t){const o=this.store.addTopico({titulo:t.titulo,areaId:null,prioridade:t.prioridade,tags:t.tags,tempoEstimado:t.tempoEstimado});this.quickAdd.updateData(this.store.getAreas(),this.store.getAllTags()),this._showToast(`✅ Tópico "${o.titulo}" criado!`)}_initKanban(){const t=this.container.querySelector("#kanbanContainer");this.kanban=new KanbanEstudos({container:t,topicos:this.store.getTopicos(),areas:this.store.getAreas(),onStatusChange:(o,e)=>this._handleStatusChange(o,e),onCardClick:o=>this._openModal(o),onEdit:o=>this._handleEditTopico(o),onDelete:o=>this._handleDeleteTopico(o)})}_handleStatusChange(t,o){const e=this.store.updateTopico(t,{status:o});e&&o==="Concluído"&&!e.concluidoEm&&(this.revisaoEspacada.agendarRevisaoInicial(e),this.store.updateTopico(t,{concluidoEm:new Date().toISOString(),proximaRevisao:e.proximaRevisao})),this._showToast(`✅ Status atualizado para "${o}"`)}_openModal(t){var i,a,d,s;this.currentTopico=t;const o=this.container.querySelector("#estudoModal"),e=o.querySelector("#modalTopicoTitulo");e.textContent=t.titulo,o.style.display="flex",this._initPomodoro(t),this._initNotas(t),(i=o.querySelector("#modalClose"))==null||i.addEventListener("click",()=>this._closeModal()),(a=o.querySelector("#fecharModalBtn"))==null||a.addEventListener("click",()=>this._closeModal()),(d=o.querySelector("#salvarSessaoBtn"))==null||d.addEventListener("click",()=>this._salvarSessao()),(s=o.querySelector(".estudo-modal-overlay"))==null||s.addEventListener("click",()=>this._closeModal())}_closeModal(){const t=this.container.querySelector("#estudoModal");t.style.display="none",this.pomodoro&&(this.pomodoro.destroy(),this.pomodoro=null),this.notas&&(this.notas.destroy(),this.notas=null),this.currentTopico=null}_initPomodoro(t){const o=this.container.querySelector("#pomodoroContainer");o.innerHTML="",this.pomodoro=new PomodoroTimer({duration:25*60,onComplete:(e,i)=>{e==="work"&&this._showToast(`⚡ Pomodoro ${i} concluído!`)}}),o.appendChild(this.pomodoro.getElement())}_initNotas(t){const o=this.container.querySelector("#notasContainer");o.innerHTML="",this.notas=new NotasRapidas({container:o,topicoId:t.id,onSave:()=>{}})}_salvarSessao(){if(!this.currentTopico)return;const t=this.pomodoro?Math.floor((this.pomodoro.duration-this.pomodoro.timeRemaining)/60):0,o=this.notas?this.notas.getContent():"";if(t===0&&!o){this._showToast("⚠️ Nenhuma sessão para salvar");return}this.store.addSessao(this.currentTopico.id,{duracao:t,notas:o,data:new Date().toISOString()})&&(this._showToast("✅ Sessão salva com sucesso!"),this._closeModal())}_updateView(){this.kanban&&(this.kanban.updateTopicos(this.store.getTopicos()),this.kanban.updateAreas(this.store.getAreas())),this.quickAdd&&this.quickAdd.updateData(this.store.getAreas(),this.store.getAllTags())}_setupEventListeners(){const t=this.container.querySelector("#btnAddTopico");t&&t.addEventListener("click",()=>this._handleAddTopico())}_handleAddTopico(){const t={titulo:"Novo Tópico",descricao:"",areaId:null,status:"Não iniciado",prioridade:"Média",tags:[]};this._openTopicoModal(t,o=>{const e=this.store.addTopico(o);this._showToast(`✅ Tópico "${e.titulo}" criado!`)})}_handleEditTopico(t){const o=this.store.getTopicoById(t);if(!o)return this._showToast("⚠️ Tópico não encontrado");this._openTopicoModal(o,e=>{this.store.updateTopico(t,e),this._showToast(`✅ Tópico "${e.titulo}" atualizado!`)})}async _handleDeleteTopico(t){const o=this.store.getTopicoById(t);if(!o)return this._showToast("⚠️ Tópico não encontrado");const{confirmAction:e}=await h(async()=>{const{confirmAction:a}=await import("./ConfirmModal-BsncAfHd.js");return{confirmAction:a}},[]);await e(`Excluir "${o.titulo}"?`)&&(this.store.removeTopico(t),this._showToast(`✅ Tópico "${o.titulo}" excluído!`))}_openTopicoModal(t,o){var a,d;const e=document.createElement("div");e.className="estudo-topico-modal",e.innerHTML=`
            <div class="estudo-topico-modal-content">
                <h2 class="estudo-topico-modal-title">${t.id?"Editar":"Novo"} Tópico</h2>
                <div class="estudo-topico-form-group">
                    <label class="estudo-topico-form-label">Título *</label>
                    <input type="text" id="topico-titulo" class="estudo-topico-form-input" value="${this._escapeHtml(t.titulo||"")}" required>
                </div>
                <div class="estudo-topico-form-group">
                    <label class="estudo-topico-form-label">Descrição</label>
                    <textarea id="topico-descricao" rows="4" class="estudo-topico-form-textarea">${this._escapeHtml(t.descricao||"")}</textarea>
                </div>
                <div class="estudo-topico-form-group">
                    <label class="estudo-topico-form-label">Prioridade</label>
                    <select id="topico-prioridade" class="estudo-topico-form-select">
                        <option value="Alta" ${t.prioridade==="Alta"?"selected":""}>Alta</option>
                        <option value="Média" ${t.prioridade==="Média"?"selected":""}>Média</option>
                        <option value="Baixa" ${t.prioridade==="Baixa"?"selected":""}>Baixa</option>
                    </select>
                </div>
                <div class="estudo-topico-form-group">
                    <label class="estudo-topico-form-label">Tags (separadas por vírgula)</label>
                    <input type="text" id="topico-tags" class="estudo-topico-form-input" value="${(t.tags||[]).join(", ")}" placeholder="ex: javascript, frontend">
                </div>
                <div class="estudo-topico-modal-footer">
                    <button id="topico-cancel" class="estudo-topico-btn estudo-topico-btn-cancel">Cancelar</button>
                    <button id="topico-save" class="estudo-topico-btn estudo-topico-btn-save">Salvar</button>
                </div>
            </div>
        `,document.body.appendChild(e);const i=()=>{e.parentNode&&e.parentNode.removeChild(e)};e.addEventListener("click",s=>{s.target===e&&i()}),(a=e.querySelector("#topico-cancel"))==null||a.addEventListener("click",i),(d=e.querySelector("#topico-save"))==null||d.addEventListener("click",()=>{var c,l,u;const s=e.querySelector("#topico-titulo"),r=s?s.value.trim():"";if(!r){alert("O título é obrigatório");return}const p={titulo:r,descricao:((c=e.querySelector("#topico-descricao"))==null?void 0:c.value.trim())||"",areaId:null,prioridade:((l=e.querySelector("#topico-prioridade"))==null?void 0:l.value)||"Média",tags:(((u=e.querySelector("#topico-tags"))==null?void 0:u.value)||"").split(",").map(n=>n.trim()).filter(n=>n.length>0)};o(p),i()}),setTimeout(()=>{var s;(s=e.querySelector("#topico-titulo"))==null||s.focus()},100)}_escapeHtml(t){const o=document.createElement("div");return o.textContent=t,o.innerHTML}_showToast(t){const o=document.createElement("div");o.className="toast",o.textContent=t,o.style.cssText=`
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--surface, #fff);
            color: var(--text-primary, #000);
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `,document.body.appendChild(o),setTimeout(()=>{o.style.animation="slideOut 0.3s ease",setTimeout(()=>o.parentNode&&o.parentNode.removeChild(o),300)},3e3)}destroy(){var t,o;(t=this.quickAdd)!=null&&t.destroy&&this.quickAdd.destroy(),(o=this.kanban)!=null&&o.destroy&&this.kanban.destroy(),this.container.innerHTML=""}}typeof module<"u"&&module.exports&&(module.exports=v);export{v as EstudosView,v as default};
//# sourceMappingURL=EstudosView-BdeVndZm.js.map
