import{_ as c}from"./index-MN1TRC4W.js";class l{constructor(t,o){this.container=t,this.store=o,this.quickAdd=null,this.kanban=null,this.modal=null,this.pomodoro=null,this.notas=null,this.revisaoEspacada=null,this.currentTopico=null,this._init()}async _init(){await this._loadComponents(),this.revisaoEspacada=new RevisaoEspacada,this.store.setRevisaoEspacada(this.revisaoEspacada),this._createStructure(),this._initQuickAdd(),this._initKanban(),this._setupEventListeners(),this.store.subscribe(()=>{this._updateView()}),this._updateView()}async _loadComponents(){}_createStructure(){this.container.innerHTML=`
            <div class="estudos-view">
                <div class="estudos-header">
                    <h1>📚 Estudos</h1>
                    <div class="estudos-header-controls">
                        <button class="btn btn-primary" id="btnAddTopico" title="Adicionar novo tópico">➕ Novo Tópico</button>
                    </div>
                    <div id="quickAddContainer"></div>
                </div>
                <div id="kanbanContainer" class="estudos-kanban"></div>
            </div>
            
            <!-- Modal de Estudo -->
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
        `}_initQuickAdd(){const t=this.container.querySelector("#quickAddContainer"),o=this.store.getAreas(),e=this.store.getAllTags();this.quickAdd=new QuickAddInput({container:t,parser:new QuickAddParser,areas:o,tags:e,onSubmit:i=>this._handleQuickAdd(i)})}_handleQuickAdd(t){let o=null;if(t.area){const i=this.store.getAreas().find(s=>s.nome.toLowerCase()===t.area.toLowerCase());i?o=i.id:o=this.store.addArea({nome:t.area,cor:"#3b82f6",icone:"📚"}).id}const e=this.store.addTopico({titulo:t.titulo,areaId:o,prioridade:t.prioridade,tags:t.tags,tempoEstimado:t.tempoEstimado});this.quickAdd.updateData(this.store.getAreas(),this.store.getAllTags()),this._showToast(`✅ Tópico "${e.titulo}" criado!`)}_initKanban(){const t=this.container.querySelector("#kanbanContainer");this.kanban=new KanbanEstudos({container:t,topicos:this.store.getTopicos(),areas:this.store.getAreas(),onStatusChange:(o,e)=>this._handleStatusChange(o,e),onCardClick:o=>this._openModal(o)})}_handleStatusChange(t,o){const e=this.store.updateTopico(t,{status:o});e&&o==="Concluído"&&!e.concluidoEm&&(this.revisaoEspacada.agendarRevisaoInicial(e),this.store.updateTopico(t,{concluidoEm:new Date().toISOString(),proximaRevisao:e.proximaRevisao})),this._showToast(`✅ Status atualizado para "${o}"`)}_openModal(t){this.currentTopico=t;const o=this.container.querySelector("#estudoModal"),e=o.querySelector("#modalTopicoTitulo");e.textContent=t.titulo,o.style.display="flex",this._initPomodoro(t),this._initNotas(t),o.querySelector("#modalClose").addEventListener("click",()=>this._closeModal()),o.querySelector("#fecharModalBtn").addEventListener("click",()=>this._closeModal()),o.querySelector("#salvarSessaoBtn").addEventListener("click",()=>this._salvarSessao()),o.querySelector(".estudo-modal-overlay").addEventListener("click",()=>this._closeModal())}_closeModal(){const t=this.container.querySelector("#estudoModal");t.style.display="none",this.pomodoro&&(this.pomodoro.destroy(),this.pomodoro=null),this.notas&&(this.notas.destroy(),this.notas=null),this.currentTopico=null}_initPomodoro(t){const o=this.container.querySelector("#pomodoroContainer");o.innerHTML="",this.pomodoro=new PomodoroTimer({duration:25*60,onComplete:(e,i)=>{e==="work"&&this._showToast(`🎉 Pomodoro ${i} concluído!`)},onAutoSave:e=>{console.log("Auto-save pomodoro",e)}}),o.appendChild(this.pomodoro.getElement())}_initNotas(t){const o=this.container.querySelector("#notasContainer");o.innerHTML="",this.notas=new NotasRapidas({container:o,topicoId:t.id,onSave:e=>{console.log("Notas salvas",e)}})}_salvarSessao(){if(!this.currentTopico)return;const t=this.pomodoro?Math.floor((this.pomodoro.duration-this.pomodoro.timeRemaining)/60):0,o=this.notas?this.notas.getContent():"";if(t===0&&!o){this._showToast("⚠️ Nenhuma sessão para salvar");return}this.store.addSessao(this.currentTopico.id,{duracao:t,notas:o,data:new Date().toISOString()})&&(this._showToast("✅ Sessão salva com sucesso!"),this._closeModal())}_updateView(){this.kanban&&(this.kanban.updateTopicos(this.store.getTopicos()),this.kanban.updateAreas(this.store.getAreas())),this.quickAdd&&this.quickAdd.updateData(this.store.getAreas(),this.store.getAllTags())}_setupEventListeners(){const t=this.container.querySelector("#btnAddTopico");t&&t.addEventListener("click",()=>this._handleAddTopico());const o=this.container.querySelector("#kanbanContainer");o&&o.addEventListener("click",e=>{const i=e.target.closest("[data-action]");if(!i)return;const s=i.getAttribute("data-action"),a=i.getAttribute("data-topico-id");s==="edit"&&a?this._handleEditTopico(a):s==="delete"&&a&&this._handleDeleteTopico(a)})}_handleAddTopico(){const t=this.store.getAreas(),e={titulo:"Novo Tópico",descricao:"",areaId:t.length>0?t[0].id:null,status:"Não iniciado",prioridade:"Média",tags:[]};this._openTopicoModal(e,i=>{const s=this.store.addTopico(i);this._showToast(`✅ Tópico "${s.titulo}" criado!`)})}_handleEditTopico(t){const o=this.store.getTopicoById(t);if(!o){this._showToast("⚠️ Tópico não encontrado");return}this._openTopicoModal(o,e=>{this.store.updateTopico(t,e),this._showToast(`✅ Tópico "${e.titulo}" atualizado!`)})}async _handleDeleteTopico(t){const o=this.store.getTopicoById(t);if(!o){this._showToast("⚠️ Tópico não encontrado");return}const{confirmAction:e}=await c(async()=>{const{confirmAction:s}=await import("./ConfirmModal-BsncAfHd.js");return{confirmAction:s}},[]);await e(`Tem certeza que deseja excluir "${o.titulo}"?`)&&(this.store.removeTopico(t),this._showToast(`✅ Tópico "${o.titulo}" excluído!`))}_openTopicoModal(t,o){const e=document.createElement("div");e.className="estudo-topico-modal";const s=this.store.getAreas().map(d=>`<option value="${d.id}" ${t.areaId===d.id?"selected":""}>${d.nome}</option>`).join("");e.innerHTML=`
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
                    <label class="estudo-topico-form-label">Área</label>
                    <select id="topico-area" class="estudo-topico-form-select">
                        <option value="">Sem área</option>
                        ${s}
                    </select>
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
                    <input type="text" id="topico-tags" class="estudo-topico-form-input" value="${(t.tags||[]).join(", ")}" 
                           placeholder="ex: javascript, frontend">
                </div>
                <div class="estudo-topico-modal-footer">
                    <button id="topico-cancel" class="estudo-topico-btn estudo-topico-btn-cancel">Cancelar</button>
                    <button id="topico-save" class="estudo-topico-btn estudo-topico-btn-save">Salvar</button>
                </div>
            </div>
        `,document.body.appendChild(e);const a=()=>{document.body.removeChild(e)};e.querySelector("#topico-cancel").addEventListener("click",a),e.querySelector(".estudo-topico-modal").addEventListener("click",d=>{d.target===e&&a()}),e.querySelector("#topico-save").addEventListener("click",()=>{const d=e.querySelector("#topico-titulo").value.trim();if(!d){alert("O título é obrigatório");return}const r={titulo:d,descricao:e.querySelector("#topico-descricao").value.trim(),areaId:e.querySelector("#topico-area").value||null,prioridade:e.querySelector("#topico-prioridade").value,tags:e.querySelector("#topico-tags").value.split(",").map(n=>n.trim()).filter(n=>n.length>0)};o(r),a()}),setTimeout(()=>e.querySelector("#topico-titulo").focus(),100)}_escapeHtml(t){const o=document.createElement("div");return o.textContent=t,o.innerHTML}_showToast(t){const o=document.createElement("div");o.className="toast",o.textContent=t,o.style.cssText=`
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
        `,document.body.appendChild(o),setTimeout(()=>{o.style.animation="slideOut 0.3s ease",setTimeout(()=>{o.parentNode&&o.parentNode.removeChild(o)},300)},3e3)}destroy(){this.quickAdd&&this.quickAdd.destroy(),this.kanban,this.pomodoro&&this.pomodoro.destroy(),this.notas&&this.notas.destroy(),this.container.innerHTML=""}}typeof module<"u"&&module.exports&&(module.exports=l);export{l as EstudosView,l as default};
//# sourceMappingURL=EstudosView-Gw_zjM3X.js.map
