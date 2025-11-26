import{s as l,t as v}from"./Toast-BPkJWnVN.js";import{t as k}from"./TaskEditModal-BpBB0i5P.js";import{confirmAction as T}from"./ConfirmModal-BsncAfHd.js";import"./index-C26MVf89.js";import"./firebase-service-DlA8zRSG.js";import"./firebase-DLTXyntu.js";import"./firebase-cache-CNydOCth.js";import"./idb-Dob3nYDb.js";const u={TODO:{id:"todo",title:"A Fazer",color:"#3b82f6"},DOING:{id:"doing",title:"Fazendo",color:"#f59e0b"},DONE:{id:"done",title:"Feito",color:"#10b981"}},y={Revisão:"doing",Bloqueado:"todo","A Fazer":"todo",Fazendo:"doing",Feito:"done",Concluído:"done"};function S(o){const{container:t,tasks:n=[],onTaskMove:e,onTaskClick:a}=o;t.innerHTML="",t.className="kanban-3columns",t.innerHTML=`
        <div class="kanban-header">
            <h2>📋 Projetos</h2>
            <div class="kanban-header-controls">
                <button class="btn btn-primary" id="btnAddTask" title="Adicionar nova tarefa">➕ Nova Tarefa</button>
                <div class="kanban-search-wrapper">
                    <input 
                        type="text" 
                        id="kanban-search" 
                        class="kanban-search" 
                        placeholder="🔍 Buscar tarefas..."
                    />
                </div>
                <div class="kanban-filters">
                    <select id="filterResponsavel" class="kanban-filter">
                        <option value="">Todos os responsáveis</option>
                    </select>
                    <button class="btn-icon" id="btnViewToggle" title="Alternar visualização">
                        <span id="viewToggleIcon">📋</span>
                    </button>
                    <button class="btn-icon" id="btnArquivar" title="Arquivar concluídos > 30 dias">🗄️ Arquivar</button>
                </div>
            </div>
        </div>
        <div class="kanban-view-container">
            <div class="kanban-columns" id="kanban-columns-view">
                <div class="kanban-column" data-column="${u.TODO.id}">
                    <div class="kanban-column-header">
                        <h3>${u.TODO.title}</h3>
                        <span class="kanban-count" id="count-todo">0</span>
                    </div>
                    <div class="kanban-column-body" id="column-todo"></div>
                </div>
                <div class="kanban-column" data-column="${u.DOING.id}">
                    <div class="kanban-column-header">
                        <h3>${u.DOING.title}</h3>
                        <span class="kanban-count" id="count-doing">0</span>
                    </div>
                    <div class="kanban-column-body" id="column-doing"></div>
                </div>
                <div class="kanban-column" data-column="${u.DONE.id}">
                    <div class="kanban-column-header">
                        <h3>${u.DONE.title}</h3>
                        <span class="kanban-count" id="count-done">0</span>
                    </div>
                    <div class="kanban-column-body" id="column-done"></div>
                </div>
            </div>
            <div class="kanban-list-view" id="kanban-list-view" style="display: none;"></div>
        </div>
    `;let s="",i="kanban",r=n;const d=()=>{const c=$(r,s);E(c,t,i),N(t,a),O(t,e)};C(t,c=>{s=c,d()}),I(t,c=>{i=c,d()}),M(t,r,c=>{r=c,d()}),B(t,n),d(),t.updateTasks=c=>{r=c,d()}}function E(o,t,n="kanban"){n==="list"?L(o,t):D(o,t)}function D(o,t){const n=t.querySelector("#kanban-columns-view"),e=t.querySelector("#kanban-list-view");n&&(n.style.display="grid"),e&&(e.style.display="none"),Object.values(u).forEach(s=>{const i=t.querySelector(`#column-${s.id}`);i&&(i.innerHTML="")});const a={todo:[],doing:[],done:[]};o.forEach(s=>{const i=s.status||"todo";a[i]&&a[i].push(s)}),Object.entries(a).forEach(([s,i])=>{const r=t.querySelector(`#column-${s}`),d=t.querySelector(`#count-${s}`);r&&i.forEach(c=>{const p=A(c);r.appendChild(p)}),d&&(d.textContent=i.length)})}function L(o,t){const n=t.querySelector("#kanban-columns-view"),e=t.querySelector("#kanban-list-view");if(n&&(n.style.display="none"),e){if(e.style.display="block",e.innerHTML="",o.length===0){e.innerHTML='<div class="kanban-empty-state">Nenhuma tarefa encontrada</div>';return}const a={todo:o.filter(s=>(s.status||"todo")==="todo"),doing:o.filter(s=>(s.status||"todo")==="doing"),done:o.filter(s=>(s.status||"todo")==="done")};Object.entries(u).forEach(([s,i])=>{const r=a[i.id];if(r.length>0){const d=document.createElement("div");d.className="kanban-list-section",d.innerHTML=`
                    <h3 class="kanban-list-section-title">${i.title} (${r.length})</h3>
                `;const c=document.createElement("div");c.className="kanban-list-tasks",r.forEach(p=>{const b=A(p);b.classList.add("kanban-card-list"),c.appendChild(b)}),d.appendChild(c),e.appendChild(d)}})}}function $(o,t){if(!t||t.trim()==="")return o;const n=t.toLowerCase().trim();return o.filter(e=>{const a=(e.titulo||e.nome||"").toLowerCase(),s=(e.descricao||"").toLowerCase(),i=(e.responsavel||"").toLowerCase(),r=(e.tags||[]).join(" ").toLowerCase();return a.includes(n)||s.includes(n)||i.includes(n)||r.includes(n)})}function C(o,t){const n=o.querySelector("#kanban-search");if(!n)return;let e;n.addEventListener("input",a=>{clearTimeout(e),e=setTimeout(()=>{t&&t(a.target.value)},300)})}function I(o,t){const n=o.querySelector("#btnViewToggle"),e=o.querySelector("#viewToggleIcon");if(!n)return;let a="kanban";n.addEventListener("click",()=>{a=a==="kanban"?"list":"kanban",e.textContent=a==="kanban"?"📋":"📝",n.title=a==="kanban"?"Ver como lista":"Ver como kanban",t&&t(a)})}function N(o,t){t&&o.querySelectorAll(".kanban-card").forEach(n=>{const e=n.cloneNode(!0);n.parentNode.replaceChild(e,n),e.addEventListener("click",s=>{!s.target.closest(".kanban-card-actions")&&!s.target.closest(".btn-icon-small")&&t(e.dataset.taskId)});const a=e.querySelector('[data-action="edit"]');a&&a.addEventListener("click",s=>{s.stopPropagation(),t(a.dataset.taskId)})})}function A(o){const t=document.createElement("div");t.className="kanban-card",t.draggable=!0,t.dataset.taskId=o.id||o.contador,t.dataset.column=o.status||"todo";const n=o.tags||[],e=n.includes("bloqueado"),a=(o.prioridade||"media").toLowerCase(),s=f=>{if(!f)return"";try{const g=new Date(f),w=String(g.getDate()).padStart(2,"0"),q=String(g.getMonth()+1).padStart(2,"0");return`${w}/${q}`}catch{return""}},i=s(o.createdAt||o.dataCriacao),r=o.status==="done"?s(o.dataConclusao||o.updatedAt):"",d=o.descricao||"",c=d.length>100?d.substring(0,100)+"...":d,p=n.filter(f=>f!=="bloqueado"&&f),b={urgente:{label:"Urgente",class:"priority-urgent"},alta:{label:"Alta",class:"priority-high"},media:{label:"Média",class:"priority-medium"},média:{label:"Média",class:"priority-medium"},baixa:{label:"Baixa",class:"priority-low"}},h=b[a]||b.media;return t.innerHTML=`
        <div class="kanban-card-header">
            <div class="kanban-card-title-wrapper">
                <h4 class="kanban-card-title">${m(o.titulo||o.nome||"Sem título")}</h4>
                ${e?'<span class="kanban-tag tag-bloqueado">🚫 Bloqueado</span>':""}
            </div>
            <div class="kanban-card-actions">
                <button class="btn-icon-small" data-action="edit" data-task-id="${o.id||o.contador}" title="Editar">✏️</button>
                <button class="btn-icon-small" data-action="delete" data-task-id="${o.id||o.contador}" title="Excluir">🗑️</button>
            </div>
        </div>
        ${c?`<p class="kanban-card-description">${m(c)}</p>`:""}
        <div class="kanban-card-meta">
            ${o.responsavel?`<span class="kanban-card-meta-item kanban-card-responsavel">👤 ${m(o.responsavel)}</span>`:""}
            ${a?`<span class="kanban-card-prioridade ${h.class}">${h.label}</span>`:""}
        </div>
        ${p.length>0?`
            <div class="kanban-card-tags">
                ${p.map(f=>`<span class="kanban-tag">${m(f)}</span>`).join("")}
            </div>
        `:""}
        <div class="kanban-card-footer">
            ${i?`<span class="kanban-card-date">📅 Criado: ${i}</span>`:""}
            ${r?`<span class="kanban-card-date kanban-card-date-completed">✅ Concluído: ${r}</span>`:""}
        </div>
    `,t}function m(o){const t=document.createElement("div");return t.textContent=o,t.innerHTML}function O(o,t){const n=o.querySelectorAll(".kanban-card"),e=o.querySelectorAll(".kanban-column-body");n.forEach(a=>{a.addEventListener("dragstart",s=>{s.dataTransfer.setData("text/plain",a.dataset.taskId),a.classList.add("dragging")}),a.addEventListener("dragend",()=>{a.classList.remove("dragging")})}),e.forEach(a=>{a.addEventListener("dragover",s=>{s.preventDefault(),a.classList.add("drag-over")}),a.addEventListener("dragleave",()=>{a.classList.remove("drag-over")}),a.addEventListener("drop",s=>{s.preventDefault(),a.classList.remove("drag-over");const i=s.dataTransfer.getData("text/plain"),r=a.closest(".kanban-column").dataset.column;t&&t(i,r)})})}function M(o,t,n){const e=o.querySelector("#filterResponsavel");if(!e)return;const a=e.querySelector('option[value=""]');e.innerHTML="",a&&e.appendChild(a),[...new Set(t.map(r=>r.responsavel).filter(Boolean))].sort().forEach(r=>{const d=document.createElement("option");d.value=r,d.textContent=r,e.appendChild(d)});const i=e.cloneNode(!0);e.parentNode.replaceChild(i,e),i.addEventListener("change",r=>{const d=r.target.value,c=d?t.filter(p=>p.responsavel===d):t;n&&n(c)})}function B(o,t){o.querySelector("#btnArquivar").addEventListener("click",()=>{const e=new Date;e.setDate(e.getDate()-30);const a=t.filter(s=>s.status!=="done"?!1:new Date(s.dataConclusao||s.updatedAt)<e);a.length>0?confirm(`Arquivar ${a.length} tarefas concluídas há mais de 30 dias?`)&&console.log("Arquivando:",a):alert("Nenhuma tarefa para arquivar.")})}function j(o){return o.map(t=>{const n={...t};return y[t.status]&&(n.status=y[t.status]),t.status==="Bloqueado"&&!n.tags&&(n.tags=["bloqueado"]),n})}class x{constructor(){this.unsubscribe=null,this.kanbanInstance=null}render(){return`
      <div class="projetos-view">
        <div id="projetos-kanban-container"></div>
      </div>
    `}mount(){document.getElementById("projetos-kanban-container")&&(this.unsubscribe=l.subscribe(()=>{this.update()}),this.update())}update(){let n=l.getState().tarefas||[];n=j(n),n=n.filter(a=>!a.arquivado),this.archiveOldTasks(n);const e=document.getElementById("projetos-kanban-container");e&&(S({container:e,tasks:n,onTaskMove:(a,s)=>{this.handleTaskMove(a,s)},onTaskClick:a=>{this.handleTaskEdit(a)}}),this.setupArquivar(e,n),this.setupAddButton(e),this.setupCardActions(e))}handleTaskMove(t,n){var s;const a=l.getState().tarefas.find(i=>(i.id||i.contador)==t);a&&(l.updateItem("tarefas",i=>(i.id||i.contador)==t,{status:n,updatedAt:new Date().toISOString(),dataConclusao:n==="done"?new Date().toISOString():a.dataConclusao}),v.success(`Tarefa movida para "${((s=u[n.toUpperCase()])==null?void 0:s.title)||n}"`))}handleTaskEdit(t){const e=l.getState().tarefas.find(a=>(a.id||a.contador)==t);if(!e){v.error("Tarefa não encontrada");return}k.open(e,(a,s)=>{l.updateItem("tarefas",i=>(i.id||i.contador)==(a.id||a.contador),s),v.success("Tarefa atualizada com sucesso"),this.update()})}handleTaskAdd(){const n=(l.getState().contador||0)+1,e={id:n,contador:n,titulo:"Nova Tarefa",descricao:"",status:"todo",prioridade:"media",tags:[],responsavel:"",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};k.open(e,(a,s)=>{const i={...e,...s};l.addItem("tarefas",i),l.setState({contador:n}),v.success("Tarefa criada com sucesso"),this.update()})}async handleTaskDelete(t){const e=l.getState().tarefas.find(i=>(i.id||i.contador)==t);if(!e){v.error("Tarefa não encontrada");return}const a=e.titulo||e.nome||"Tarefa";await T(`Tem certeza que deseja excluir "${a}"?`)&&(l.removeItem("tarefas",i=>(i.id||i.contador)==t),v.success("Tarefa excluída com sucesso"),this.update())}setupAddButton(t){const n=t.querySelector("#btnAddTask");if(n){const e=n.cloneNode(!0);n.parentNode.replaceChild(e,n),e.addEventListener("click",()=>{this.handleTaskAdd()})}}setupCardActions(t){t.addEventListener("click",n=>{const e=n.target.closest("[data-action]");if(!e)return;const a=e.getAttribute("data-action"),s=e.getAttribute("data-task-id");a==="edit"&&s?this.handleTaskEdit(s):a==="delete"&&s&&this.handleTaskDelete(s)})}setupArquivar(t,n){const e=t.querySelector("#btnArquivar");if(!e)return;const a=e.cloneNode(!0);e.parentNode.replaceChild(a,e),a.addEventListener("click",()=>{this.archiveOldTasks(n,!0)})}archiveOldTasks(t,n=!1){const e=new Date;e.setDate(e.getDate()-30);const a=t.filter(i=>{if(i.status!=="done")return!1;const r=i.dataConclusao||i.updatedAt||i.createdAt;return r?new Date(r)<e:!1});if(a.length===0){n&&v.info("Nenhuma tarefa para arquivar");return}const s=()=>{a.forEach(i=>{l.updateItem("tarefas",r=>(r.id||r.contador)==(i.id||i.contador),{arquivado:!0,arquivadoEm:new Date().toISOString()})}),v.success(`${a.length} tarefa(s) arquivada(s)`),this.update()};n?T(`Arquivar ${a.length} tarefas concluídas há mais de 30 dias?`).then(i=>{i&&s()}):s()}destroy(){this.unsubscribe&&this.unsubscribe()}}function U(){const o=new x;return{render:()=>o.render(),mount:()=>(setTimeout(()=>{o.mount()},0),o)}}export{U as default};
//# sourceMappingURL=Projetos-D1M9_fKX.js.map
