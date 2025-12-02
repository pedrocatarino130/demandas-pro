import{N as w}from"./NeonButton-DWD2bhQA.js";class E{constructor(e={}){this.value=e.value||"",this.placeholder=e.placeholder||"Buscar tarefas...",this.onChange=e.onChange||(()=>{}),this.id=e.id||"complex-search"}render(){const e=document.createElement("div");e.className="complex-search-wrapper",e.id=this.id;const i=document.createElement("div");i.className="complex-search-glow";const r=document.createElement("div");r.className="complex-search-glow-gradient",i.appendChild(r);const u=document.createElement("div");u.className="complex-search-border-outer";const l=document.createElement("div");l.className="complex-search-border-outer-gradient";const n=document.createElement("div");n.className="complex-search-border-inner-bg",u.appendChild(l),u.appendChild(n);const s=document.createElement("div");s.className="complex-search-border-inner";const d=document.createElement("div");d.className="complex-search-border-inner-gradient";const h=document.createElement("div");h.className="complex-search-input-bg",s.appendChild(d),s.appendChild(h);const p=document.createElement("div");p.className="complex-search-input-container";const t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("class","complex-search-icon"),t.setAttribute("width","20"),t.setAttribute("height","20"),t.setAttribute("viewBox","0 0 24 24"),t.setAttribute("fill","none"),t.setAttribute("stroke","currentColor"),t.setAttribute("stroke-width","2");const m=document.createElementNS("http://www.w3.org/2000/svg","path");m.setAttribute("d","M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"),t.appendChild(m);const o=document.createElement("input");o.type="text",o.className="complex-search-input",o.placeholder=this.placeholder,o.value=this.value,o.setAttribute("aria-label","Buscar tarefas");const a=document.createElement("div");a.className="complex-search-filter-btn",a.setAttribute("role","button"),a.setAttribute("tabindex","0"),a.setAttribute("aria-label","Filtros");const k=document.createElement("div");k.className="complex-search-filter-btn-border";const c=document.createElement("div");c.className="complex-search-filter-btn-border-gradient",k.appendChild(c);const v=document.createElementNS("http://www.w3.org/2000/svg","svg");v.setAttribute("class","complex-search-filter-icon"),v.setAttribute("width","20"),v.setAttribute("height","20"),v.setAttribute("viewBox","0 0 24 24"),v.setAttribute("fill","none"),v.setAttribute("stroke","currentColor"),v.setAttribute("stroke-width","2");const f=document.createElementNS("http://www.w3.org/2000/svg","path");f.setAttribute("d","M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"),v.appendChild(f),a.appendChild(k),a.appendChild(v);const b=document.createElement("div");return b.className="complex-search-decorative",p.appendChild(t),p.appendChild(o),p.appendChild(a),e.appendChild(i),e.appendChild(u),e.appendChild(s),e.appendChild(p),e.appendChild(b),o.addEventListener("input",g=>{this.value=g.target.value,this.onChange(this.value)}),o.addEventListener("focus",()=>{e.classList.add("focused")}),o.addEventListener("blur",()=>{e.classList.remove("focused")}),a.addEventListener("click",()=>{const g=new CustomEvent("filterclick",{bubbles:!0});e.dispatchEvent(g)}),a.addEventListener("keydown",g=>{(g.key==="Enter"||g.key===" ")&&(g.preventDefault(),a.click())}),this._input=o,this._wrapper=e,e}getValue(){return this._input?this._input.value:this.value}setValue(e){this.value=e,this._input&&(this._input.value=e)}focus(){this._input&&this._input.focus()}blur(){this._input&&this._input.blur()}}class S{constructor(){this.modal=null,this.currentTask=null,this.onSave=null,this.init()}init(){document.getElementById("task-edit-modal")?this.modal=document.getElementById("task-edit-modal"):(this.modal=document.createElement("div"),this.modal.id="task-edit-modal",this.modal.className="task-edit-modal",this.modal.style.display="none",document.body.appendChild(this.modal)),this.render(),this.setupEventListeners(),setTimeout(()=>{this.modal.classList.contains("task-edit-modal-redesign")&&this.setupRedesignButtons()},100)}render(){const e=!!document.querySelector(".home-view-redesign"),i=e?"task-edit-modal-redesign":"task-edit-modal";e&&(this.modal.className=i),e?this.renderRedesign():this.renderClassic()}renderRedesign(){this.modal.innerHTML=`
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
        `}setupRedesignButtons(){const e=this.modal.querySelector("#task-edit-save-container");if(!e||e.hasChildNodes())return;const i=new w({text:"Salvar",variant:"primary",icon:"💾",type:"button",onClick:()=>this.handleSave()});e.appendChild(i.render())}setupEventListeners(){const e=this.modal.classList.contains("task-edit-modal-redesign"),i=this.modal.querySelector(e?".task-edit-modal-redesign-overlay":".task-edit-modal-overlay"),r=this.modal.querySelector(e?".task-edit-modal-redesign-close":".task-edit-modal-close"),u=this.modal.querySelector("#task-edit-cancel"),l=()=>this.close();if(i&&i.addEventListener("click",l),r&&r.addEventListener("click",l),u&&u.addEventListener("click",l),!e){const s=this.modal.querySelector("#task-edit-save");s&&s.addEventListener("click",()=>this.handleSave())}const n=s=>{s.key==="Escape"&&this.modal.style.display!=="none"&&l()};document.addEventListener("keydown",n),e&&this.modal.querySelectorAll(".task-edit-modal-redesign-input").forEach(d=>{d.addEventListener("focus",()=>{d.classList.add("focused")}),d.addEventListener("blur",()=>{d.classList.remove("focused")})})}open(e,i){if(!e)return;this.currentTask=e,this.onSave=i;const r=!!document.querySelector(".home-view-redesign");(r&&!this.modal.classList.contains("task-edit-modal-redesign")||!r&&this.modal.classList.contains("task-edit-modal-redesign"))&&(this.render(),this.setupEventListeners());const l=this.modal.querySelector("#task-edit-modal-title");if(l){const c=!e.id||e.titulo==="Nova Tarefa";l.textContent=c?"Criar Tarefa":"Editar Tarefa"}const n=this.modal.querySelector("#task-edit-titulo"),s=this.modal.querySelector("#task-edit-descricao"),d=this.modal.querySelector("#task-edit-prioridade"),h=this.modal.querySelector("#task-edit-responsavel"),p=this.modal.querySelector("#task-edit-tags"),t=this.modal.querySelector("#task-edit-status"),m=this.modal.querySelector("#task-edit-date"),o=this.modal.querySelector("#task-edit-time"),a=this.modal.querySelector("#task-edit-time-row");if(n&&(n.value=e.titulo||e.nome||""),s&&(s.value=e.descricao||""),d){const c=(e.prioridade||"media").toLowerCase();d.value=c}if(h&&(h.value=e.responsavel||""),p){const c=e.tags||[];p.value=c.join(", ")}t&&(t.value=e.status||"todo");const k=new Date(Date.now()+60*60*1e3);if(m)if(e.time){const c=new Date(e.time);m.value=c.toISOString().split("T")[0]}else m.value=k.toISOString().split("T")[0];if(e.time){const c=new Date(e.time);if(o){const v=String(c.getHours()).padStart(2,"0"),f=String(c.getMinutes()).padStart(2,"0");o.value=`${v}:${f}`}a&&(a.style.display="flex")}else a&&(a.style.display="none");this.modal.style.display="flex",r&&setTimeout(()=>{this.setupRedesignButtons()},50),n&&setTimeout(()=>n.focus(),100)}close(){this.modal.style.display="none",this.currentTask=null,this.onSave=null}handleSave(){const e=this.modal.querySelector("#task-edit-titulo"),i=this.modal.querySelector("#task-edit-descricao"),r=this.modal.querySelector("#task-edit-prioridade"),u=this.modal.querySelector("#task-edit-responsavel"),l=this.modal.querySelector("#task-edit-tags"),n=this.modal.querySelector("#task-edit-status"),s=this.modal.querySelector("#task-edit-date"),d=this.modal.querySelector("#task-edit-time"),h=this.modal.querySelector("#task-edit-time-row"),p=e==null?void 0:e.value.trim();if(!p){alert("O título é obrigatório"),e==null||e.focus();return}const t={titulo:p,descricao:(i==null?void 0:i.value.trim())||"",prioridade:(r==null?void 0:r.value)||"media",responsavel:(u==null?void 0:u.value.trim())||"",tags:l==null?void 0:l.value.split(",").map(m=>m.trim()).filter(m=>m.length>0),status:(n==null?void 0:n.value)||"todo",updatedAt:new Date().toISOString()};if(h&&h.style.display!=="none")if(s!=null&&s.value&&(d!=null&&d.value)){const m=s.value,o=d.value,a=new Date(`${m}T${o}`);t.time=a.toISOString()}else this.currentTask.time!==void 0&&(t.time=null);else this.currentTask.time!==void 0&&(t.time=this.currentTask.time);t.status==="done"&&!this.currentTask.dataConclusao&&(t.dataConclusao=new Date().toISOString()),t.status!=="done"&&this.currentTask.status==="done"&&(t.dataConclusao=null),this.onSave&&this.onSave(this.currentTask,t),this.close()}}const C=new S;export{E as C,C as t};
//# sourceMappingURL=TaskEditModal-BHXB4Oq6.js.map
