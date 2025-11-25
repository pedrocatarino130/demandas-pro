class f{constructor(){this.modal=null,this.currentTask=null,this.onSave=null,this.init()}init(){document.getElementById("task-edit-modal")?this.modal=document.getElementById("task-edit-modal"):(this.modal=document.createElement("div"),this.modal.id="task-edit-modal",this.modal.className="task-edit-modal",this.modal.style.display="none",document.body.appendChild(this.modal)),this.render(),this.setupEventListeners()}render(){this.modal.innerHTML=`
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
        `}setupEventListeners(){const t=this.modal.querySelector(".task-edit-modal-overlay"),d=this.modal.querySelector(".task-edit-modal-close"),l=this.modal.querySelector("#task-edit-cancel"),s=this.modal.querySelector("#task-edit-save"),o=()=>this.close();t&&t.addEventListener("click",o),d&&d.addEventListener("click",o),l&&l.addEventListener("click",o),s&&s.addEventListener("click",()=>this.handleSave()),document.addEventListener("keydown",r=>{r.key==="Escape"&&this.modal.style.display!=="none"&&o()})}open(t,d){if(!t)return;this.currentTask=t,this.onSave=d;const l=this.modal.querySelector("#task-edit-modal-title");if(l){const e=!t.id||t.titulo==="Nova Tarefa";l.textContent=e?"Criar Tarefa":"Editar Tarefa"}const s=this.modal.querySelector("#task-edit-titulo"),o=this.modal.querySelector("#task-edit-descricao"),r=this.modal.querySelector("#task-edit-prioridade"),n=this.modal.querySelector("#task-edit-responsavel"),c=this.modal.querySelector("#task-edit-tags"),m=this.modal.querySelector("#task-edit-status"),u=this.modal.querySelector("#task-edit-date"),a=this.modal.querySelector("#task-edit-time"),i=this.modal.querySelector("#task-edit-time-row");if(s&&(s.value=t.titulo||t.nome||""),o&&(o.value=t.descricao||""),r){const e=(t.prioridade||"media").toLowerCase();r.value=e}if(n&&(n.value=t.responsavel||""),c){const e=t.tags||[];c.value=e.join(", ")}if(m&&(m.value=t.status||"todo"),t.time){const e=new Date(t.time);if(u&&(u.value=e.toISOString().split("T")[0]),a){const v=String(e.getHours()).padStart(2,"0"),p=String(e.getMinutes()).padStart(2,"0");a.value=`${v}:${p}`}i&&(i.style.display="flex")}else if(t.time!==void 0){i&&(i.style.display="flex");const e=new Date(Date.now()+60*60*1e3);if(u&&(u.value=e.toISOString().split("T")[0]),a){const v=String(e.getHours()).padStart(2,"0"),p=String(e.getMinutes()).padStart(2,"0");a.value=`${v}:${p}`}}else i&&(i.style.display="none");this.modal.style.display="flex",s&&setTimeout(()=>s.focus(),100)}close(){this.modal.style.display="none",this.currentTask=null,this.onSave=null}handleSave(){const t=this.modal.querySelector("#task-edit-titulo"),d=this.modal.querySelector("#task-edit-descricao"),l=this.modal.querySelector("#task-edit-prioridade"),s=this.modal.querySelector("#task-edit-responsavel"),o=this.modal.querySelector("#task-edit-tags"),r=this.modal.querySelector("#task-edit-status"),n=this.modal.querySelector("#task-edit-date"),c=this.modal.querySelector("#task-edit-time"),m=this.modal.querySelector("#task-edit-time-row"),u=t==null?void 0:t.value.trim();if(!u){alert("O título é obrigatório"),t==null||t.focus();return}const a={titulo:u,descricao:(d==null?void 0:d.value.trim())||"",prioridade:(l==null?void 0:l.value)||"media",responsavel:(s==null?void 0:s.value.trim())||"",tags:o==null?void 0:o.value.split(",").map(i=>i.trim()).filter(i=>i.length>0),status:(r==null?void 0:r.value)||"todo",updatedAt:new Date().toISOString()};if(m&&m.style.display!=="none")if(n!=null&&n.value&&(c!=null&&c.value)){const i=n.value,e=c.value,v=new Date(`${i}T${e}`);a.time=v.toISOString()}else this.currentTask.time!==void 0&&(a.time=null);else this.currentTask.time!==void 0&&(a.time=this.currentTask.time);a.status==="done"&&!this.currentTask.dataConclusao&&(a.dataConclusao=new Date().toISOString()),a.status!=="done"&&this.currentTask.status==="done"&&(a.dataConclusao=null),this.onSave&&this.onSave(this.currentTask,a),this.close()}}const k=new f;export{k as t};
//# sourceMappingURL=TaskEditModal-BpBB0i5P.js.map
