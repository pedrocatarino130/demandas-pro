import{s as l,t as d}from"./Toast-BrGTI1e1.js";import{a as w,f as C,t as h,h as A,T as x,s as O,d as R,e as F}from"./swipe-gestures-CKoNtDs5.js";import{confirmAction as B}from"./ConfirmModal-BsncAfHd.js";import"./index-DrFPX27l.js";import"./firebase-service-DlA8zRSG.js";import"./firebase-DLTXyntu.js";import"./firebase-cache-CNydOCth.js";import"./idb-Dob3nYDb.js";class q{constructor(){this.unsubscribe=null,this.currentFilter="all",this.searchQuery="",this.sortBy="time",this.sortOrder="asc",this.priorityFilter="all",this.eventHandlers={filterClick:null,checkboxChange:null,actionClick:null,searchInput:null,sortChange:null,priorityFilterChange:null}}render(){const n=l.getState().tarefasRotina||[];let e=this.filterTasks(n);this.searchQuery&&(e=this.searchTasks(e)),this.priorityFilter!=="all"&&(e=e.filter(o=>(o.prioridade||"media").toLowerCase()===this.priorityFilter.toLowerCase())),e=this.sortTasks(e);let a=e.filter(o=>!o.completed);const i=e.filter(o=>o.completed);let r=[];if(this.currentFilter==="postponed")r=e,a=[];else{r=w(a);const o=new Set(r.map(s=>s.id||s.contador));a=a.filter(s=>!o.has(s.id||s.contador))}return`
      <div class="rotina-view">
        <div class="rotina-header">
          <h1 class="rotina-title">📅 Minha Rotina</h1>
          <div class="rotina-header-controls">
            <button class="btn btn-primary" id="btnAddRotina" title="Adicionar nova tarefa de rotina">➕ Nova Tarefa</button>
          </div>
          
          <div class="rotina-search-sort">
            <div class="rotina-search">
              <input 
                type="text" 
                id="rotina-search-input" 
                class="rotina-search-input" 
                placeholder="🔍 Buscar tarefas..."
                value="${this.escapeHtml(this.searchQuery)}"
              />
            </div>
            <div class="rotina-sort-controls">
              <select id="rotina-sort-by" class="rotina-sort-select">
                <option value="time" ${this.sortBy==="time"?"selected":""}>Data/Hora</option>
                <option value="priority" ${this.sortBy==="priority"?"selected":""}>Prioridade</option>
                <option value="title" ${this.sortBy==="title"?"selected":""}>Título</option>
              </select>
              <button 
                id="rotina-sort-order" 
                class="rotina-sort-btn" 
                title="Alternar ordem"
                data-order="${this.sortOrder}"
              >
                ${this.sortOrder==="asc"?"↑":"↓"}
              </button>
            </div>
          </div>
          
          <div class="rotina-filters">
            <button class="filter-btn ${this.currentFilter==="all"?"active":""}" 
                    data-filter="all">Todas</button>
            <button class="filter-btn ${this.currentFilter==="today"?"active":""}" 
                    data-filter="today">Hoje</button>
            <button class="filter-btn ${this.currentFilter==="overdue"?"active":""}" 
                    data-filter="overdue">Atrasadas</button>
            <button class="filter-btn ${this.currentFilter==="completed"?"active":""}" 
                    data-filter="completed">Concluídas</button>
            <button class="filter-btn ${this.currentFilter==="postponed"?"active":""}" 
                    data-filter="postponed">📅 Adiadas</button>
            <select id="rotina-priority-filter" class="filter-select">
              <option value="all" ${this.priorityFilter==="all"?"selected":""}>Todas Prioridades</option>
              <option value="urgente" ${this.priorityFilter==="urgente"?"selected":""}>Urgente</option>
              <option value="alta" ${this.priorityFilter==="alta"?"selected":""}>Alta</option>
              <option value="media" ${this.priorityFilter==="media"?"selected":""}>Média</option>
              <option value="baixa" ${this.priorityFilter==="baixa"?"selected":""}>Baixa</option>
            </select>
          </div>
        </div>

        ${r.length>0?this.renderTasksSection("📅 Adiadas",r,!1,!0):""}
        ${a.length>0?this.renderTasksSection("Pendentes",a,!1):""}
        ${i.length>0?this.renderTasksSection("Concluídas",i,!0):""}
        
        ${e.length===0?this.renderEmptyState():""}
      </div>
    `}filterTasks(t){switch(this.currentFilter){case"today":return this.getTodayTasks(t);case"overdue":return C(t);case"completed":return t.filter(n=>n.completed);case"postponed":return w(t);default:return t}}searchTasks(t){if(!this.searchQuery)return t;const n=this.searchQuery.toLowerCase();return t.filter(e=>{const a=(e.titulo||e.nome||"").toLowerCase(),i=(e.descricao||"").toLowerCase();return a.includes(n)||i.includes(n)})}sortTasks(t){const n=[...t],e=this.sortOrder==="asc"?1:-1;return n.sort((a,i)=>{switch(this.sortBy){case"time":const r=h(a.time),o=h(i.time);return!r&&!o?0:r?o?(r-o)*e:-1:1;case"priority":const s={urgente:4,alta:3,media:2,baixa:1},c=s[(a.prioridade||"media").toLowerCase()]||0;return((s[(i.prioridade||"media").toLowerCase()]||0)-c)*e;case"title":const m=(a.titulo||a.nome||"").toLowerCase(),v=(i.titulo||i.nome||"").toLowerCase();return m.localeCompare(v)*e;default:return 0}}),n}getTodayTasks(t){const n=A();return t.filter(e=>{if(!e.time)return!1;const a=h(e.time);return a?a.toISOString().split("T")[0]===n:!1})}renderTasksSection(t,n,e,a=!1){const i=C(n);return`
      <section class="rotina-section ${a?"rotina-section-postponed":""}">
        <div class="rotina-section-header">
          <h2 class="rotina-section-title">${t}</h2>
          <span class="rotina-section-count">${n.length}</span>
          ${a?'<span class="rotina-section-badge badge badge-info" title="Tarefas adiadas para mais de 2 horas no futuro">⏰ Adiadas</span>':""}
          ${i.length>0&&!e&&!a?`<span class="rotina-section-badge badge badge-danger">${i.length} atrasadas</span>`:""}
        </div>
        <div class="rotina-tasks-list ${e?"rotina-tasks-completed":""} ${a?"rotina-tasks-postponed":""}">
          ${n.map(r=>{const s=new x(r,{showCheckbox:!0,showModule:!1,showPriority:!0,showDuration:!0,showActions:!0,isCurrent:!1,isOverdue:i.some(u=>(u.id||u.contador)===(r.id||r.contador)),isPostponed:a}).render().outerHTML,c=r.recurrence&&r.recurrence.enabled;return`<div class="rotina-task-item ${a?"rotina-task-postponed":""}" data-task-id="${r.id||r.contador}" ${c?'data-recurring="true"':""}>${s}</div>`}).join("")}
        </div>
      </section>
    `}renderEmptyState(){const t={all:"Nenhuma tarefa de rotina cadastrada",today:"Nenhuma tarefa para hoje",overdue:"Nenhuma tarefa atrasada! 🎉",completed:"Nenhuma tarefa concluída ainda",postponed:"Nenhuma tarefa adiada"};return`
      <div class="rotina-empty-state">
        <p class="rotina-empty-text">${t[this.currentFilter]||t.all}</p>
      </div>
    `}mount(){this.unsubscribe=l.subscribe(()=>{this.update()}),this.setupEventListeners(),this.setupSwipeGestures()}setupEventListeners(){this.cleanupEventListeners(),this.eventHandlers.filterClick=r=>{const o=r.target.closest(".filter-btn");if(o){const s=o.getAttribute("data-filter");this.currentFilter=s,this.update()}},document.addEventListener("click",this.eventHandlers.filterClick);const t=document.getElementById("btnAddRotina");t&&t.addEventListener("click",()=>{this.handleTaskAdd()});const n=document.getElementById("rotina-search-input");n&&(this.eventHandlers.searchInput=()=>{this.searchQuery=n.value,this.update()},n.addEventListener("input",this.eventHandlers.searchInput));const e=document.getElementById("rotina-sort-by");e&&(this.eventHandlers.sortChange=()=>{this.sortBy=e.value,this.update()},e.addEventListener("change",this.eventHandlers.sortChange));const a=document.getElementById("rotina-sort-order");a&&a.addEventListener("click",()=>{this.sortOrder=this.sortOrder==="asc"?"desc":"asc",this.update()});const i=document.getElementById("rotina-priority-filter");i&&(this.eventHandlers.priorityFilterChange=()=>{this.priorityFilter=i.value,this.update()},i.addEventListener("change",this.eventHandlers.priorityFilterChange)),this.eventHandlers.checkboxChange=r=>{if(r.target.classList.contains("task-checkbox")||r.target.classList.contains("ios-checkbox-input")){const o=r.target.getAttribute("data-task-id");o&&this.handleTaskComplete(o,r.target.checked)}},document.addEventListener("change",this.eventHandlers.checkboxChange),this.eventHandlers.actionClick=r=>{const o=r.target.closest("[data-action]");if(!o)return;const s=o.getAttribute("data-action"),c=o.getAttribute("data-task-id");s==="edit"&&c?this.handleTaskEdit(c):s==="delete"&&c&&this.handleTaskDelete(c)},document.addEventListener("click",this.eventHandlers.actionClick)}cleanupEventListeners(){if(this.eventHandlers.filterClick&&document.removeEventListener("click",this.eventHandlers.filterClick),this.eventHandlers.checkboxChange&&document.removeEventListener("change",this.eventHandlers.checkboxChange),this.eventHandlers.actionClick&&document.removeEventListener("click",this.eventHandlers.actionClick),this.eventHandlers.searchInput){const t=document.getElementById("rotina-search-input");t&&t.removeEventListener("input",this.eventHandlers.searchInput)}if(this.eventHandlers.sortChange){const t=document.getElementById("rotina-sort-by");t&&t.removeEventListener("change",this.eventHandlers.sortChange)}if(this.eventHandlers.priorityFilterChange){const t=document.getElementById("rotina-priority-filter");t&&t.removeEventListener("change",this.eventHandlers.priorityFilterChange)}}setupSwipeGestures(){setTimeout(()=>{document.querySelectorAll(".rotina-task-item .task-card").forEach(n=>{var a;const e=(a=n.closest(".rotina-task-item"))==null?void 0:a.getAttribute("data-task-id");e&&O(n,{onSwipeLeft:F(e,i=>{this.handleTaskComplete(i,!0)}),onSwipeRight:R(e,(i,r)=>{this.handlePostpone(i,r)})})})},100)}handleTaskComplete(t,n){const a=l.getState().tarefasRotina.find(r=>(r.id||r.contador)==t);if(!a)return;const i=a.titulo||a.nome||"Tarefa";l.updateItem("tarefasRotina",r=>(r.id||r.contador)==t,{completed:n,completedAt:n?new Date().toISOString():null}),n&&a.recurrence&&this.handleRecurringTask(a),n&&d.success(`"${i}" concluída!`,{duration:5e3,action:()=>{l.updateItem("tarefasRotina",r=>(r.id||r.contador)==t,{completed:!1,completedAt:null}),d.info("Ação desfeita")},actionLabel:"Desfazer"})}handleRecurringTask(t){if(!t.recurrence||!t.recurrence.enabled)return;const e=(l.getState().contadorRotina||0)+1,a=t.time?h(t.time):new Date;let i=new Date(a);switch(t.recurrence.type){case"daily":i.setDate(i.getDate()+1);break;case"weekly":i.setDate(i.getDate()+7);break;case"monthly":i.setMonth(i.getMonth()+1);break;case"custom":i.setDate(i.getDate()+(t.recurrence.interval||1));break;default:return}const r={...t,id:e,contador:e,time:i.toISOString(),completed:!1,completedAt:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};delete r.completedAt,l.addItem("tarefasRotina",r),l.setState({contadorRotina:e})}handlePostpone(t,n){const a=l.getState().tarefasRotina.find(i=>(i.id||i.contador)==t);if(a&&a.time){const i=h(a.time);if(i){i.setDate(i.getDate()+n);const r=i.toISOString();l.updateItem("tarefasRotina",o=>(o.id||o.contador)==t,{time:r}),d.info(`Tarefa adiada ${n} dia${n>1?"s":""}`)}}}handleTaskAdd(){const n=(l.getState().contadorRotina||0)+1,e=new Date,a=new Date(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours()+1,0,0),i={id:n,contador:n,titulo:"Nova Tarefa de Rotina",descricao:"",time:a.toISOString(),prioridade:"media",duracao:null,completed:!1,modulo:"rotina",recurrence:{enabled:!1,type:"daily",interval:1},createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};this.openTaskModal(i,r=>{const o={...i,...r};l.addItem("tarefasRotina",o),l.setState({contadorRotina:n}),d.success("Tarefa de rotina criada com sucesso"),this.update()})}handleTaskEdit(t){const e=l.getState().tarefasRotina.find(a=>(a.id||a.contador)==t);if(!e){d.error("Tarefa não encontrada");return}this.openTaskModal(e,a=>{l.updateItem("tarefasRotina",i=>(i.id||i.contador)==t,{...a,updatedAt:new Date().toISOString()}),d.success("Tarefa atualizada com sucesso"),this.update()})}async handleTaskDelete(t){const e=l.getState().tarefasRotina.find(r=>(r.id||r.contador)==t);if(!e){d.error("Tarefa não encontrada");return}const a=e.titulo||e.nome||"Tarefa";await B(`Tem certeza que deseja excluir "${a}"?`)&&(l.removeItem("tarefasRotina",r=>(r.id||r.contador)==t),d.success("Tarefa excluída com sucesso"),this.update())}openTaskModal(t,n){const e=document.createElement("div");e.className="rotina-task-modal";const a=t.time?h(t.time):new Date,i=a?a.toISOString().split("T")[0]:"",r=a?String(a.getHours()).padStart(2,"0"):"",o=a?String(a.getMinutes()).padStart(2,"0"):"",s=t.recurrence||{enabled:!1,type:"daily",interval:1};e.innerHTML=`
      <div class="rotina-task-modal-content">
        <h2 class="rotina-task-modal-title">${t.id?"Editar":"Nova"} Tarefa de Rotina</h2>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Título *</label>
          <input type="text" id="rotina-titulo" class="rotina-task-form-input" value="${this.escapeHtml(t.titulo||t.nome||"")}" required>
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Descrição</label>
          <textarea id="rotina-descricao" rows="4" class="rotina-task-form-textarea">${this.escapeHtml(t.descricao||"")}</textarea>
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Data</label>
          <input type="date" id="rotina-date" class="rotina-task-form-input" value="${i}">
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Hora</label>
          <div class="rotina-task-time-group">
            <input type="number" id="rotina-hour" class="rotina-task-form-input rotina-task-time-input" value="${r}" min="0" max="23" placeholder="HH">
            <span class="rotina-task-time-separator">:</span>
            <input type="number" id="rotina-minute" class="rotina-task-form-input rotina-task-time-input" value="${o}" min="0" max="59" placeholder="MM">
          </div>
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Prioridade</label>
          <select id="rotina-prioridade" class="rotina-task-form-select">
            <option value="baixa" ${t.prioridade==="baixa"?"selected":""}>Baixa</option>
            <option value="media" ${t.prioridade==="media"||!t.prioridade?"selected":""}>Média</option>
            <option value="alta" ${t.prioridade==="alta"?"selected":""}>Alta</option>
            <option value="urgente" ${t.prioridade==="urgente"?"selected":""}>Urgente</option>
          </select>
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Duração (minutos)</label>
          <input type="number" id="rotina-duracao" class="rotina-task-form-input" value="${t.duracao||""}" min="0" placeholder="Ex: 30">
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">
            <input type="checkbox" id="rotina-recurrence-enabled" ${s.enabled?"checked":""}>
            Repetir tarefa
          </label>
        </div>
        <div id="rotina-recurrence-options" style="display: ${s.enabled?"block":"none"};">
          <div class="rotina-task-form-group">
            <label class="rotina-task-form-label">Tipo de repetição</label>
            <select id="rotina-recurrence-type" class="rotina-task-form-select">
              <option value="daily" ${s.type==="daily"?"selected":""}>Diária</option>
              <option value="weekly" ${s.type==="weekly"?"selected":""}>Semanal</option>
              <option value="monthly" ${s.type==="monthly"?"selected":""}>Mensal</option>
              <option value="custom" ${s.type==="custom"?"selected":""}>Personalizada</option>
            </select>
          </div>
          <div class="rotina-task-form-group" id="rotina-recurrence-interval-group" style="display: ${s.type==="custom"?"block":"none"};">
            <label class="rotina-task-form-label">Intervalo (dias)</label>
            <input type="number" id="rotina-recurrence-interval" class="rotina-task-form-input" value="${s.interval||1}" min="1" placeholder="Ex: 3">
          </div>
        </div>
        <div class="rotina-task-modal-footer">
          <button id="rotina-cancel" class="rotina-task-btn rotina-task-btn-cancel">Cancelar</button>
          <button id="rotina-save" class="rotina-task-btn rotina-task-btn-save">Salvar</button>
        </div>
      </div>
    `,document.body.appendChild(e);const c=e.querySelector("#rotina-recurrence-enabled"),u=e.querySelector("#rotina-recurrence-options"),m=e.querySelector("#rotina-recurrence-type"),v=e.querySelector("#rotina-recurrence-interval-group");c&&c.addEventListener("change",()=>{u&&(u.style.display=c.checked?"block":"none")}),m&&m.addEventListener("change",()=>{v&&(v.style.display=m.value==="custom"?"block":"none")});const y=()=>{document.body.contains(e)&&document.body.removeChild(e)};e.querySelector("#rotina-cancel").addEventListener("click",y),e.addEventListener("click",p=>{p.target===e&&y()});const b=p=>{p.key==="Escape"&&(y(),document.removeEventListener("keydown",b))};document.addEventListener("keydown",b),e.querySelector("#rotina-save").addEventListener("click",()=>{var S;const p=e.querySelector("#rotina-titulo").value.trim();if(!p){d.error("O título é obrigatório");return}const g=e.querySelector("#rotina-date").value,E=parseInt(e.querySelector("#rotina-hour").value)||0,I=parseInt(e.querySelector("#rotina-minute").value)||0;let k=null;if(g){const $=new Date(g);$.setHours(E,I,0,0),k=$.toISOString()}const H=e.querySelector("#rotina-recurrence-enabled").checked,T=e.querySelector("#rotina-recurrence-type").value,L=parseInt((S=e.querySelector("#rotina-recurrence-interval"))==null?void 0:S.value)||1,D={titulo:p,descricao:e.querySelector("#rotina-descricao").value.trim(),time:k,prioridade:e.querySelector("#rotina-prioridade").value,duracao:e.querySelector("#rotina-duracao").value?parseInt(e.querySelector("#rotina-duracao").value):null,modulo:"rotina",recurrence:{enabled:H,type:T,interval:T==="custom"?L:1}};n(D),y()}),setTimeout(()=>e.querySelector("#rotina-titulo").focus(),100)}escapeHtml(t){const n=document.createElement("div");return n.textContent=t,n.innerHTML}update(){const t=document.getElementById("app");t&&(t.innerHTML=this.render(),this.setupEventListeners(),this.setupSwipeGestures())}destroy(){this.cleanupEventListeners(),this.unsubscribe&&this.unsubscribe()}}function U(){const f=new q;return{render:()=>f.render(),mount:()=>(setTimeout(()=>{f.mount()},0),f)}}export{U as default};
//# sourceMappingURL=Rotina-C79DdUPj.js.map
