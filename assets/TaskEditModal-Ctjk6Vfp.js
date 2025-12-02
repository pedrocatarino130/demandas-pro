class y{constructor(e={}){this.text=e.text||"Button",this.variant=e.variant||"primary",this.onClick=e.onClick||(()=>{}),this.icon=e.icon||null,this.className=e.className||"",this.id=e.id||null,this.disabled=e.disabled||!1,this.type=e.type||"button"}render(){const e=document.createElement("button");if(e.type=this.type,e.className=`neon-button neon-button-${this.variant} ${this.className}`.trim(),this.id&&(e.id=this.id),this.disabled&&(e.disabled=!0,e.classList.add("disabled"),e.style.opacity="0.5",e.style.cursor="not-allowed"),this.variant==="primary"){const i=document.createElement("div");i.className="neon-button-glow",e.appendChild(i)}const t=document.createElement("span");if(t.className="neon-button-content",this.icon){const i=typeof this.icon=="string"?this.createIconFromString(this.icon):this.icon;t.appendChild(i)}const s=document.createTextNode(this.text);return t.appendChild(s),e.appendChild(t),this.disabled||e.addEventListener("click",i=>{i.preventDefault(),this.onClick(i)}),this._element=e,e}createIconFromString(e){const t=document.createElement("span");return t.textContent=e,t.setAttribute("aria-hidden","true"),t}setDisabled(e){this.disabled=e,this._element&&(this._element.disabled=e,e?(this._element.style.opacity="0.5",this._element.style.cursor="not-allowed"):(this._element.style.opacity="1",this._element.style.cursor="pointer"))}setText(e){if(this.text=e,this._element){const t=this._element.querySelector(".neon-button-content");if(t){const s=t.querySelector('[aria-hidden="true"]');t.textContent="",s&&t.appendChild(s),t.appendChild(document.createTextNode(e))}}}}class b{constructor(){this.modal=null,this.currentTask=null,this.onSave=null,this.init()}init(){document.getElementById("task-edit-modal")?this.modal=document.getElementById("task-edit-modal"):(this.modal=document.createElement("div"),this.modal.id="task-edit-modal",this.modal.className="task-edit-modal",this.modal.style.display="none",document.body.appendChild(this.modal)),this.render(),this.setupEventListeners(),setTimeout(()=>{this.modal.classList.contains("task-edit-modal-redesign")&&this.setupRedesignButtons()},100)}render(){const e=!!document.querySelector(".home-view-redesign"),t=e?"task-edit-modal-redesign":"task-edit-modal";e&&(this.modal.className=t),e?this.renderRedesign():this.renderClassic()}renderRedesign(){this.modal.innerHTML=`
            <div class="task-edit-modal-redesign-overlay"></div>
            <div class="task-edit-modal-redesign-container">
                <div class="task-edit-modal-redesign-border"></div>
                <div class="task-edit-modal-redesign-inner"></div>
                <div class="task-edit-modal-redesign-content">
                    <div class="task-edit-modal-redesign-header">
                        <h2 id="task-edit-modal-title" class="task-edit-modal-redesign-title">Editar Tarefa</h2>
                        <button class="task-edit-modal-redesign-close" aria-label="Fechar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="task-edit-modal-redesign-body">
                        <div class="task-edit-modal-redesign-form-group">
                            <label for="task-edit-titulo" class="task-edit-modal-redesign-label">Título *</label>
                            <input 
                                type="text" 
                                id="task-edit-titulo" 
                                class="task-edit-modal-redesign-input" 
                                required 
                                placeholder="Ex: Refatorar Homepage"
                            />
                        </div>
                        <div class="task-edit-modal-redesign-form-group">
                            <label for="task-edit-descricao" class="task-edit-modal-redesign-label">Descrição</label>
                            <textarea 
                                id="task-edit-descricao" 
                                class="task-edit-modal-redesign-input task-edit-modal-redesign-textarea" 
                                rows="3" 
                                placeholder="Detalhes da tarefa..."
                            ></textarea>
                        </div>
                        <div class="task-edit-modal-redesign-row">
                            <div class="task-edit-modal-redesign-form-group">
                                <label for="task-edit-prioridade" class="task-edit-modal-redesign-label">Prioridade</label>
                                <select id="task-edit-prioridade" class="task-edit-modal-redesign-input">
                                    <option value="baixa">Baixa</option>
                                    <option value="media" selected>Média</option>
                                    <option value="alta">Alta</option>
                                    <option value="urgente">Urgente</option>
                                </select>
                            </div>
                            <div class="task-edit-modal-redesign-form-group">
                                <label for="task-edit-responsavel" class="task-edit-modal-redesign-label">Responsável</label>
                                <input 
                                    type="text" 
                                    id="task-edit-responsavel" 
                                    class="task-edit-modal-redesign-input" 
                                    placeholder="Nome"
                                />
                            </div>
                        </div>
                        <div class="task-edit-modal-redesign-form-group">
                            <label for="task-edit-tags" class="task-edit-modal-redesign-label">Tags (separadas por vírgula)</label>
                            <input 
                                type="text" 
                                id="task-edit-tags" 
                                class="task-edit-modal-redesign-input" 
                                placeholder="frontend, urgente, bug"
                            />
                        </div>
                        <div class="task-edit-modal-redesign-row" id="task-edit-time-row" style="display: none;">
                            <div class="task-edit-modal-redesign-form-group">
                                <label for="task-edit-time" class="task-edit-modal-redesign-label">Hora</label>
                                <input 
                                    type="time" 
                                    id="task-edit-time" 
                                    class="task-edit-modal-redesign-input"
                                />
                            </div>
                        </div>
                        <div class="task-edit-modal-redesign-row">
                            <div class="task-edit-modal-redesign-form-group">
                                <label for="task-edit-date" class="task-edit-modal-redesign-label">Data</label>
                                <input 
                                    type="date" 
                                    id="task-edit-date" 
                                    class="task-edit-modal-redesign-input"
                                />
                            </div>
                            <div class="task-edit-modal-redesign-form-group">
                                <label for="task-edit-status" class="task-edit-modal-redesign-label">Status</label>
                                <select id="task-edit-status" class="task-edit-modal-redesign-input">
                                    <option value="todo">A Fazer</option>
                                    <option value="doing">Fazendo</option>
                                    <option value="done">Feito</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="task-edit-modal-redesign-footer">
                        <button class="task-edit-modal-redesign-cancel" id="task-edit-cancel">Cancelar</button>
                        <div class="task-edit-modal-redesign-save-container" id="task-edit-save-container"></div>
                    </div>
                </div>
            </div>
        `,setTimeout(()=>{this.setupRedesignButtons()},0)}renderClassic(){this.modal.innerHTML=`
            <div class="task-edit-modal-overlay"></div>
            <div class="task-edit-modal-content">
                <div class="task-edit-modal-header">
                    <h2 id="task-edit-modal-title">Editar Tarefa</h2>
                    <button class="task-edit-modal-close" aria-label="Fechar">✕</button>
                </div>
                <div class="task-edit-modal-body">
                    <div class="form-group">
                        <label for="task-edit-titulo">Título *</label>
                        <input 
                            type="text" 
                            id="task-edit-titulo" 
                            class="input" 
                            required 
                            placeholder="Título da tarefa"
                        />
                    </div>
                    <div class="form-group">
                        <label for="task-edit-descricao">Descrição</label>
                        <textarea 
                            id="task-edit-descricao" 
                            class="input" 
                            rows="4" 
                            placeholder="Descrição da tarefa"
                        ></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="task-edit-prioridade">Prioridade</label>
                            <select id="task-edit-prioridade" class="input">
                                <option value="baixa">Baixa</option>
                                <option value="media" selected>Média</option>
                                <option value="alta">Alta</option>
                                <option value="urgente">Urgente</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="task-edit-responsavel">Responsável</label>
                            <input 
                                type="text" 
                                id="task-edit-responsavel" 
                                class="input" 
                                placeholder="Nome do responsável"
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="task-edit-tags">Tags (separadas por vírgula)</label>
                        <input 
                            type="text" 
                            id="task-edit-tags" 
                            class="input" 
                            placeholder="ex: importante, frontend, bloqueado"
                        />
                    </div>
                    <div class="form-group">
                        <label for="task-edit-status">Status</label>
                        <select id="task-edit-status" class="input">
                            <option value="todo">A Fazer</option>
                            <option value="doing">Fazendo</option>
                            <option value="done">Feito</option>
                        </select>
                    </div>
                    <div class="form-row" id="task-edit-time-row" style="display: none;">
                        <div class="form-group">
                            <label for="task-edit-date">Data</label>
                            <input 
                                type="date" 
                                id="task-edit-date" 
                                class="input"
                            />
                        </div>
                        <div class="form-group">
                            <label for="task-edit-time">Hora</label>
                            <input 
                                type="time" 
                                id="task-edit-time" 
                                class="input"
                            />
                        </div>
                    </div>
                </div>
                <div class="task-edit-modal-footer">
                    <button class="btn btn-secondary" id="task-edit-cancel">Cancelar</button>
                    <button class="btn btn-primary" id="task-edit-save">Salvar</button>
                </div>
            </div>
        `}setupRedesignButtons(){const e=this.modal.querySelector("#task-edit-save-container");if(!e||e.hasChildNodes())return;const t=new y({text:"Salvar",variant:"primary",icon:"💾",type:"button",onClick:()=>this.handleSave()});e.appendChild(t.render())}setupEventListeners(){const e=this.modal.classList.contains("task-edit-modal-redesign"),t=this.modal.querySelector(e?".task-edit-modal-redesign-overlay":".task-edit-modal-overlay"),s=this.modal.querySelector(e?".task-edit-modal-redesign-close":".task-edit-modal-close"),i=this.modal.querySelector("#task-edit-cancel"),o=()=>this.close();if(t&&t.addEventListener("click",o),s&&s.addEventListener("click",o),i&&i.addEventListener("click",o),!e){const a=this.modal.querySelector("#task-edit-save");a&&a.addEventListener("click",()=>this.handleSave())}const n=a=>{a.key==="Escape"&&this.modal.style.display!=="none"&&o()};document.addEventListener("keydown",n),e&&this.modal.querySelectorAll(".task-edit-modal-redesign-input").forEach(d=>{d.addEventListener("focus",()=>{d.classList.add("focused")}),d.addEventListener("blur",()=>{d.classList.remove("focused")})})}open(e,t){if(!e)return;this.currentTask=e,this.onSave=t;const s=!!document.querySelector(".home-view-redesign");(s&&!this.modal.classList.contains("task-edit-modal-redesign")||!s&&this.modal.classList.contains("task-edit-modal-redesign"))&&(this.render(),this.setupEventListeners());const o=this.modal.querySelector("#task-edit-modal-title");if(o){const r=!e.id||e.titulo==="Nova Tarefa";o.textContent=r?"Criar Tarefa":"Editar Tarefa"}const n=this.modal.querySelector("#task-edit-titulo"),a=this.modal.querySelector("#task-edit-descricao"),d=this.modal.querySelector("#task-edit-prioridade"),m=this.modal.querySelector("#task-edit-responsavel"),p=this.modal.querySelector("#task-edit-tags"),l=this.modal.querySelector("#task-edit-status"),c=this.modal.querySelector("#task-edit-date"),v=this.modal.querySelector("#task-edit-time"),u=this.modal.querySelector("#task-edit-time-row");if(n&&(n.value=e.titulo||e.nome||""),a&&(a.value=e.descricao||""),d){const r=(e.prioridade||"media").toLowerCase();d.value=r}if(m&&(m.value=e.responsavel||""),p){const r=e.tags||[];p.value=r.join(", ")}l&&(l.value=e.status||"todo");const k=new Date(Date.now()+60*60*1e3);if(c)if(e.time){const r=new Date(e.time);c.value=r.toISOString().split("T")[0]}else c.value=k.toISOString().split("T")[0];if(e.time){const r=new Date(e.time);if(v){const g=String(r.getHours()).padStart(2,"0"),f=String(r.getMinutes()).padStart(2,"0");v.value=`${g}:${f}`}u&&(u.style.display="flex")}else u&&(u.style.display="none");this.modal.style.display="flex",s&&setTimeout(()=>{this.setupRedesignButtons()},50),n&&setTimeout(()=>n.focus(),100)}close(){this.modal.style.display="none",this.currentTask=null,this.onSave=null}handleSave(){const e=this.modal.querySelector("#task-edit-titulo"),t=this.modal.querySelector("#task-edit-descricao"),s=this.modal.querySelector("#task-edit-prioridade"),i=this.modal.querySelector("#task-edit-responsavel"),o=this.modal.querySelector("#task-edit-tags"),n=this.modal.querySelector("#task-edit-status"),a=this.modal.querySelector("#task-edit-date"),d=this.modal.querySelector("#task-edit-time"),m=this.modal.querySelector("#task-edit-time-row"),p=e==null?void 0:e.value.trim();if(!p){alert("O título é obrigatório"),e==null||e.focus();return}const l={titulo:p,descricao:(t==null?void 0:t.value.trim())||"",prioridade:(s==null?void 0:s.value)||"media",responsavel:(i==null?void 0:i.value.trim())||"",tags:o==null?void 0:o.value.split(",").map(c=>c.trim()).filter(c=>c.length>0),status:(n==null?void 0:n.value)||"todo",updatedAt:new Date().toISOString()};if(m&&m.style.display!=="none")if(a!=null&&a.value&&(d!=null&&d.value)){const c=a.value,v=d.value,u=new Date(`${c}T${v}`);l.time=u.toISOString()}else this.currentTask.time!==void 0&&(l.time=null);else this.currentTask.time!==void 0&&(l.time=this.currentTask.time);l.status==="done"&&!this.currentTask.dataConclusao&&(l.dataConclusao=new Date().toISOString()),l.status!=="done"&&this.currentTask.status==="done"&&(l.dataConclusao=null),this.onSave&&this.onSave(this.currentTask,l),this.close()}}const S=new b;export{S as t};
//# sourceMappingURL=TaskEditModal-Ctjk6Vfp.js.map
