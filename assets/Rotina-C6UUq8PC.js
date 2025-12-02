import{s as h,t as w,g as x,T as O}from"./TaskCard-CQKHJvpQ.js";import{a as A,b as D}from"./taskFilters-BoeSJyjR.js";import{t as y}from"./index-7ypPvpma.js";import{confirmAction as R}from"./ConfirmModal-BsncAfHd.js";import"./idb-Dob3nYDb.js";const b={THRESHOLD:50,RESTRAINT:100,ALLOWED_TIME:500,ANIMATION_DURATION:300};function M(o,t={}){const{onSwipeLeft:i,onSwipeRight:e}=t;if(o.classList.contains("swipe-enabled"))return;let a=0,r=0,n=0,s=!1;const c=H("check","Concluir"),d=H("clock","Adiar 1 dia");o.appendChild(c),o.appendChild(d),o.classList.add("swipe-enabled"),o.style.position="relative",o.style.overflow="hidden",o.style.transition=`transform ${b.ANIMATION_DURATION}ms ease-out`,o.addEventListener("touchstart",m,{passive:!0}),o.addEventListener("touchmove",k,{passive:!1}),o.addEventListener("touchend",E,{passive:!0}),o.addEventListener("mousedown",v),o.addEventListener("mousemove",T),o.addEventListener("mouseup",f),o.addEventListener("mouseleave",f);function m(l){const u=l.touches[0];a=u.clientX,r=u.clientY,n=Date.now(),s=!0,o.style.transition="none"}function v(l){l.button===0&&(a=l.clientX,r=l.clientY,n=Date.now(),s=!0,o.style.transition="none",l.preventDefault())}function k(l){if(!s)return;const u=l.touches[0],p=u.clientX-a,g=u.clientY-r;Math.abs(p)>Math.abs(g)&&(l.preventDefault(),S(p))}function T(l){if(!s)return;const u=l.clientX-a,p=l.clientY-r;Math.abs(u)>Math.abs(p)&&S(u)}function E(l){if(!s)return;const u=l.changedTouches[0],p=u.clientX-a,g=u.clientY-r,$=Date.now()-n;I(p,g,$),L()}function f(l){if(!s)return;const u=l.clientX-a,p=l.clientY-r,g=Date.now()-n;I(u,p,g),L()}function S(l){const u=window.innerWidth*.3,p=Math.max(-u,Math.min(u,l));o.style.transform=`translateX(${p}px)`,p>b.THRESHOLD?(d.classList.add("active"),c.classList.remove("active"),o.style.backgroundColor="rgba(245, 158, 11, 0.1)"):p<-50?(c.classList.add("active"),d.classList.remove("active"),o.style.backgroundColor="rgba(16, 185, 129, 0.1)"):(c.classList.remove("active"),d.classList.remove("active"),o.style.backgroundColor="")}function I(l,u,p){p>b.ALLOWED_TIME||Math.abs(u)>b.RESTRAINT||Math.abs(l)<b.THRESHOLD||(l<-50&&i?i(o):l>b.THRESHOLD&&e&&e(o))}function L(){s=!1,o.style.transition=`transform ${b.ANIMATION_DURATION}ms ease-out`,o.style.transform="",o.style.backgroundColor="",c.classList.remove("active"),d.classList.remove("active")}F()}function H(o,t){const i=document.createElement("div");i.className=`swipe-action swipe-action-${o==="check"?"left":"right"}`;const e=o==="check"?"✓":"⏰";return i.innerHTML=`
        <span class="swipe-icon">${e}</span>
        <span class="swipe-label">${t}</span>
    `,i}function F(){const o="swipe-gestures-styles";if(document.getElementById(o))return;const t=document.createElement("style");t.id=o,t.textContent=`
        .swipe-enabled {
            cursor: grab;
            user-select: none;
        }
        
        .swipe-enabled:active {
            cursor: grabbing;
        }
        
        .swipe-action {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 80px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            z-index: 1;
        }
        
        .swipe-action-left {
            left: 20px;
            color: #10b981;
        }
        
        .swipe-action-right {
            right: 20px;
            color: #f59e0b;
        }
        
        .swipe-action.active {
            opacity: 1;
        }
        
        .swipe-icon {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 4px;
        }
        
        .swipe-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        /* Desktop fallback: botões hover */
        @media (hover: hover) and (pointer: fine) {
            .swipe-enabled:hover .swipe-action {
                opacity: 0.3;
            }
            
            .swipe-enabled:hover .swipe-action:hover {
                opacity: 1;
                cursor: pointer;
                pointer-events: all;
            }
        }
        
        /* Touch devices: área maior */
        @media (hover: none) and (pointer: coarse) {
            .swipe-enabled {
                touch-action: pan-y;
            }
        }
    `,document.head.appendChild(t)}function N(o,t){return i=>{i.style.transform="translateX(-100%)",i.style.opacity="0",setTimeout(()=>{t&&t(o)},b.ANIMATION_DURATION)}}function B(o,t){return i=>{i.style.transform="translateX(100%)",i.style.opacity="0",setTimeout(()=>{t&&t(o,1),i.style.transform="",i.style.opacity="1"},b.ANIMATION_DURATION*2)}}class q{constructor(){this.unsubscribe=null,this.currentFilter="all",this.searchQuery="",this.sortBy="time",this.sortOrder="asc",this.priorityFilter="all",this.eventHandlers={filterClick:null,checkboxChange:null,actionClick:null,searchInput:null,sortChange:null,priorityFilterChange:null}}render(){const i=h.getState().tarefasRotina||[];let e=this.filterTasks(i);this.searchQuery&&(e=this.searchTasks(e)),this.priorityFilter!=="all"&&(e=e.filter(m=>(m.prioridade||"media").toLowerCase()===this.priorityFilter.toLowerCase())),e=this.sortTasks(e);let a=e.filter(m=>!m.completed);const r=e.filter(m=>m.completed);let n=[];if(this.currentFilter==="postponed")n=e,a=[];else{n=A(a);const m=new Set(n.map(v=>v.id||v.contador));a=a.filter(v=>!m.has(v.id||v.contador))}const s=e.length,c=r.length,d=s>0?Math.round(c/s*100):0;return`
      <div class="home-view home-view-redesign rotina-view-redesign">
        <div class="home-top-cards">
          <section class="home-welcome-card">
            <h2 class="home-welcome-title">Fluxo de Rotina</h2>
            <p class="home-welcome-message">
              Mantenha o foco nas tarefas do dia e conclua com estilo.
            </p>
            <div class="home-cta">
              <button class="btn btn-primary" id="btnAddRotina" title="Adicionar nova tarefa de rotina">Nova Tarefa</button>
            </div>
          </section>

          <section class="home-productivity-card">
            <div class="home-productivity-value">${d}%</div>
            <div class="home-productivity-label">Progresso</div>
            <div class="home-productivity-bar">
              <div class="home-productivity-bar-fill" style="width: ${d}%"></div>
            </div>
          </section>
        </div>

        <div class="home-section-header">
          <h1 class="home-section-title">Minha Rotina</h1>
          <div class="home-search">
            <div class="rotina-search">
              <input 
                type="text" 
                id="rotina-search-input" 
                class="rotina-search-input" 
                placeholder="Buscar tarefas..."
                value="${this.escapeHtml(this.searchQuery)}"
              />
            </div>
          </div>
        </div>

        <div class="rotina-search-sort">
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
          <button class="filter-btn ${this.currentFilter==="all"?"active":""}" data-filter="all">Todas</button>
          <button class="filter-btn ${this.currentFilter==="today"?"active":""}" data-filter="today">Hoje</button>
          <button class="filter-btn ${this.currentFilter==="overdue"?"active":""}" data-filter="overdue">Atrasadas</button>
          <button class="filter-btn ${this.currentFilter==="completed"?"active":""}" data-filter="completed">Concluídas</button>
          <button class="filter-btn ${this.currentFilter==="postponed"?"active":""}" data-filter="postponed">⏰ Adiadas</button>
          <select id="rotina-priority-filter" class="filter-select">
            <option value="all" ${this.priorityFilter==="all"?"selected":""}>Todas Prioridades</option>
            <option value="urgente" ${this.priorityFilter==="urgente"?"selected":""}>Urgente</option>
            <option value="alta" ${this.priorityFilter==="alta"?"selected":""}>Alta</option>
            <option value="media" ${this.priorityFilter==="media"?"selected":""}>Média</option>
            <option value="baixa" ${this.priorityFilter==="baixa"?"selected":""}>Baixa</option>
          </select>
        </div>

        ${n.length>0?this.renderTasksSection("⏰ Adiadas",n,!1,!0):""}
        ${a.length>0?this.renderTasksSection("Pendentes",a,!1):""}
        ${r.length>0?this.renderTasksSection("Concluídas",r,!0):""}
        
        ${e.length===0?this.renderEmptyState():""}
      </div>
    `}filterTasks(t){switch(this.currentFilter){case"today":return this.getTodayTasks(t);case"overdue":return D(t);case"completed":return t.filter(i=>i.completed);case"postponed":return A(t);default:return t}}searchTasks(t){if(!this.searchQuery)return t;const i=this.searchQuery.toLowerCase();return t.filter(e=>{const a=(e.titulo||e.nome||"").toLowerCase(),r=(e.descricao||"").toLowerCase();return a.includes(i)||r.includes(i)})}sortTasks(t){const i=[...t],e=this.sortOrder==="asc"?1:-1;return i.sort((a,r)=>{switch(this.sortBy){case"time":const n=w(a.time),s=w(r.time);return!n&&!s?0:n?s?(n-s)*e:-1:1;case"priority":const c={urgente:4,alta:3,media:2,baixa:1},d=c[(a.prioridade||"media").toLowerCase()]||0;return((c[(r.prioridade||"media").toLowerCase()]||0)-d)*e;case"title":const v=(a.titulo||a.nome||"").toLowerCase(),k=(r.titulo||r.nome||"").toLowerCase();return v.localeCompare(k)*e;default:return 0}}),i}getTodayTasks(t){const i=x();return t.filter(e=>{if(!e.time)return!1;const a=w(e.time);return a?a.toISOString().split("T")[0]===i:!1})}renderTasksSection(t,i,e,a=!1){const r=D(i);return`
      <section class="rotina-section ${a?"rotina-section-postponed":""}">
        <div class="rotina-section-header">
          <h2 class="rotina-section-title">${t}</h2>
          <span class="rotina-section-count">${i.length}</span>
          ${a?'<span class="rotina-section-badge badge badge-info" title="Tarefas adiadas para mais de 2 horas no futuro">⏰ Adiadas</span>':""}
          ${r.length>0&&!e&&!a?`<span class="rotina-section-badge badge badge-danger">${r.length} atrasadas</span>`:""}
        </div>
        <div class="rotina-tasks-list ${e?"rotina-tasks-completed":""} ${a?"rotina-tasks-postponed":""}">
          ${i.map(n=>{const c=new O(n,{showCheckbox:!0,showModule:!1,showPriority:!0,showDuration:!0,showActions:!0,isCurrent:!1,isOverdue:r.some(m=>(m.id||m.contador)===(n.id||n.contador)),isPostponed:a}).render().outerHTML,d=n.recurrence&&n.recurrence.enabled;return`<div class="rotina-task-item ${a?"rotina-task-postponed":""}" data-task-id="${n.id||n.contador}" ${d?'data-recurring="true"':""}>${c}</div>`}).join("")}
        </div>
      </section>
    `}renderEmptyState(){const t={all:"Nenhuma tarefa de rotina cadastrada",today:"Nenhuma tarefa para hoje",overdue:"Nenhuma tarefa atrasada! 🎉",completed:"Nenhuma tarefa concluída ainda",postponed:"Nenhuma tarefa adiada"};return`
      <div class="rotina-empty-state">
        <p class="rotina-empty-text">${t[this.currentFilter]||t.all}</p>
      </div>
    `}mount(){this.unsubscribe=h.subscribe(()=>{this.update()}),this.setupEventListeners(),this.setupSwipeGestures()}setupEventListeners(){this.cleanupEventListeners(),this.eventHandlers.filterClick=n=>{const s=n.target.closest(".filter-btn");if(s){const c=s.getAttribute("data-filter");this.currentFilter=c,this.update()}},document.addEventListener("click",this.eventHandlers.filterClick);const t=document.getElementById("btnAddRotina");t&&t.addEventListener("click",()=>{this.handleTaskAdd()});const i=document.getElementById("rotina-search-input");i&&(this.eventHandlers.searchInput=()=>{this.searchQuery=i.value,this.update()},i.addEventListener("input",this.eventHandlers.searchInput));const e=document.getElementById("rotina-sort-by");e&&(this.eventHandlers.sortChange=()=>{this.sortBy=e.value,this.update()},e.addEventListener("change",this.eventHandlers.sortChange));const a=document.getElementById("rotina-sort-order");a&&a.addEventListener("click",()=>{this.sortOrder=this.sortOrder==="asc"?"desc":"asc",this.update()});const r=document.getElementById("rotina-priority-filter");r&&(this.eventHandlers.priorityFilterChange=()=>{this.priorityFilter=r.value,this.update()},r.addEventListener("change",this.eventHandlers.priorityFilterChange)),this.eventHandlers.checkboxChange=n=>{if(n.target.classList.contains("task-checkbox")||n.target.classList.contains("ios-checkbox-input")){const s=n.target.getAttribute("data-task-id");s&&this.handleTaskComplete(s,n.target.checked)}},document.addEventListener("change",this.eventHandlers.checkboxChange),this.eventHandlers.actionClick=n=>{const s=n.target.closest("[data-action]");if(!s)return;const c=s.getAttribute("data-action"),d=s.getAttribute("data-task-id");c==="edit"&&d?this.handleTaskEdit(d):c==="delete"&&d&&this.handleTaskDelete(d)},document.addEventListener("click",this.eventHandlers.actionClick)}cleanupEventListeners(){if(this.eventHandlers.filterClick&&document.removeEventListener("click",this.eventHandlers.filterClick),this.eventHandlers.checkboxChange&&document.removeEventListener("change",this.eventHandlers.checkboxChange),this.eventHandlers.actionClick&&document.removeEventListener("click",this.eventHandlers.actionClick),this.eventHandlers.searchInput){const t=document.getElementById("rotina-search-input");t&&t.removeEventListener("input",this.eventHandlers.searchInput)}if(this.eventHandlers.sortChange){const t=document.getElementById("rotina-sort-by");t&&t.removeEventListener("change",this.eventHandlers.sortChange)}if(this.eventHandlers.priorityFilterChange){const t=document.getElementById("rotina-priority-filter");t&&t.removeEventListener("change",this.eventHandlers.priorityFilterChange)}}setupSwipeGestures(){setTimeout(()=>{document.querySelectorAll(".rotina-task-item .task-card").forEach(i=>{const e=i.closest(".rotina-task-item").getAttribute("data-task-id");e&&M(i,{onSwipeLeft:N(e,a=>{this.handleTaskComplete(a,!0)}),onSwipeRight:B(e,(a,r)=>{this.handlePostpone(a,r)})})})},100)}handleTaskComplete(t,i){const a=h.getState().tarefasRotina.find(n=>(n.id||n.contador)==t);if(!a)return;const r=a.titulo||a.nome||"Tarefa";h.updateItem("tarefasRotina",n=>(n.id||n.contador)==t,{completed:i,completedAt:i?new Date().toISOString():null}),i&&a.recurrence&&this.handleRecurringTask(a),i&&y.success(`"${r}" concluída!`,{duration:5e3,action:()=>{h.updateItem("tarefasRotina",n=>(n.id||n.contador)==t,{completed:!1,completedAt:null}),y.info("Ação desfeita")},actionLabel:"Desfazer"})}handleRecurringTask(t){if(!t.recurrence||!t.recurrence.enabled)return;const e=(h.getState().contadorRotina||0)+1,a=t.time?w(t.time):new Date;let r=new Date(a);switch(t.recurrence.type){case"daily":r.setDate(r.getDate()+1);break;case"weekly":r.setDate(r.getDate()+7);break;case"monthly":r.setMonth(r.getMonth()+1);break;case"custom":r.setDate(r.getDate()+(t.recurrence.interval||1));break;default:return}const n={...t,id:e,contador:e,time:r.toISOString(),completed:!1,completedAt:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};delete n.completedAt,h.addItem("tarefasRotina",n),h.setState({contadorRotina:e})}handlePostpone(t,i){const a=h.getState().tarefasRotina.find(r=>(r.id||r.contador)==t);if(a&&a.time){const r=w(a.time);if(r){r.setDate(r.getDate()+i);const n=r.toISOString();h.updateItem("tarefasRotina",s=>(s.id||s.contador)==t,{time:n}),y.info(`Tarefa adiada ${i} dia${i>1?"s":""}`)}}}handleTaskAdd(){const i=(h.getState().contadorRotina||0)+1,e=new Date,a=new Date(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours()+1,0,0),r={id:i,contador:i,titulo:"Nova Tarefa de Rotina",descricao:"",time:a.toISOString(),prioridade:"media",duracao:null,completed:!1,modulo:"rotina",recurrence:{enabled:!1,type:"daily",interval:1},createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};this.openTaskModal(r,n=>{const s={...r,...n};h.addItem("tarefasRotina",s),h.setState({contadorRotina:i}),y.success("Tarefa de rotina criada com sucesso"),this.update()})}handleTaskEdit(t){const e=h.getState().tarefasRotina.find(a=>(a.id||a.contador)==t);if(!e){y.error("Tarefa não encontrada");return}this.openTaskModal(e,a=>{h.updateItem("tarefasRotina",r=>(r.id||r.contador)==t,{...a,updatedAt:new Date().toISOString()}),y.success("Tarefa atualizada com sucesso"),this.update()})}async handleTaskDelete(t){const e=h.getState().tarefasRotina.find(n=>(n.id||n.contador)==t);if(!e){y.error("Tarefa não encontrada");return}const a=e.titulo||e.nome||"Tarefa";await R(`Tem certeza que deseja excluir "${a}"`)&&(h.removeItem("tarefasRotina",n=>(n.id||n.contador)==t),y.success("Tarefa excluída com sucesso"),this.update())}openTaskModal(t,i){const e=document.createElement("div");e.className="rotina-task-modal";const a=t.time?w(t.time):new Date,r=a?a.toISOString().split("T")[0]:"",n=a?String(a.getHours()).padStart(2,"0"):"",s=a?String(a.getMinutes()).padStart(2,"0"):"",c=t.recurrence||{enabled:!1,type:"daily",interval:1};e.innerHTML=`
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
          <input type="date" id="rotina-date" class="rotina-task-form-input" value="${r}">
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Hora</label>
          <div class="rotina-task-time-group">
            <input type="number" id="rotina-hour" class="rotina-task-form-input rotina-task-time-input" value="${n}" min="0" max="23" placeholder="HH">
            <span class="rotina-task-time-separator">:</span>
            <input type="number" id="rotina-minute" class="rotina-task-form-input rotina-task-time-input" value="${s}" min="0" max="59" placeholder="MM">
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
            <input type="checkbox" id="rotina-recurrence-enabled" ${c.enabled?"checked":""}>
            Repetir tarefa
          </label>
        </div>
        <div id="rotina-recurrence-options" style="display: ${c.enabled?"block":"none"};">
          <div class="rotina-task-form-group">
            <label class="rotina-task-form-label">Tipo de repetição</label>
            <select id="rotina-recurrence-type" class="rotina-task-form-select">
              <option value="daily" ${c.type==="daily"?"selected":""}>Diária</option>
              <option value="weekly" ${c.type==="weekly"?"selected":""}>Semanal</option>
              <option value="monthly" ${c.type==="monthly"?"selected":""}>Mensal</option>
              <option value="custom" ${c.type==="custom"?"selected":""}>Personalizada</option>
            </select>
          </div>
          <div class="rotina-task-form-group" id="rotina-recurrence-interval-group" style="display: ${c.type==="custom"?"block":"none"};">
            <label class="rotina-task-form-label">Intervalo (dias)</label>
            <input type="number" id="rotina-recurrence-interval" class="rotina-task-form-input" value="${c.interval||1}" min="1" placeholder="Ex: 3">
          </div>
        </div>
        <div class="rotina-task-modal-footer">
          <button id="rotina-cancel" class="rotina-task-btn rotina-task-btn-cancel">Cancelar</button>
          <button id="rotina-save" class="rotina-task-btn rotina-task-btn-save">Salvar</button>
        </div>
      </div>
    `,document.body.appendChild(e);const d=e.querySelector("#rotina-recurrence-enabled"),m=e.querySelector("#rotina-recurrence-options"),v=e.querySelector("#rotina-recurrence-type"),k=e.querySelector("#rotina-recurrence-interval-group");d&&d.addEventListener("change",()=>{m&&(m.style.display=d.checked?"block":"none")}),v&&v.addEventListener("change",()=>{k&&(k.style.display=v.value==="custom"?"block":"none")});const T=()=>{document.body.contains(e)&&document.body.removeChild(e)};e.querySelector("#rotina-cancel").addEventListener("click",T),e.addEventListener("click",f=>{f.target===e&&T()});const E=f=>{f.key==="Escape"&&(T(),document.removeEventListener("keydown",E))};document.addEventListener("keydown",E),e.querySelector("#rotina-save").addEventListener("click",()=>{const f=e.querySelector("#rotina-titulo").value.trim();if(!f){y.error("O título é obrigatório");return}const S=e.querySelector("#rotina-date").value,I=parseInt(e.querySelector("#rotina-hour").value)||0,L=parseInt(e.querySelector("#rotina-minute").value)||0;let l=null;if(S){const C=new Date(S);C.setHours(I,L,0,0),l=C.toISOString()}const u=e.querySelector("#rotina-recurrence-enabled").checked,p=e.querySelector("#rotina-recurrence-type").value,g=parseInt(e.querySelector("#rotina-recurrence-interval").value)||1,$={titulo:f,descricao:e.querySelector("#rotina-descricao").value.trim(),time:l,prioridade:e.querySelector("#rotina-prioridade").value,duracao:e.querySelector("#rotina-duracao").value?parseInt(e.querySelector("#rotina-duracao").value):null,modulo:"rotina",recurrence:{enabled:u,type:p,interval:p==="custom"?g:1}};i($),T()}),setTimeout(()=>e.querySelector("#rotina-titulo").focus(),100)}escapeHtml(t){const i=document.createElement("div");return i.textContent=t,i.innerHTML}update(){const t=document.getElementById("app");t&&(t.innerHTML=this.render(),this.setupEventListeners(),this.setupSwipeGestures())}destroy(){this.cleanupEventListeners(),this.unsubscribe&&this.unsubscribe()}}function U(){const o=new q;return{render:()=>o.render(),mount:()=>(setTimeout(()=>{o.mount()},0),o)}}export{U as default};
//# sourceMappingURL=Rotina-C6UUq8PC.js.map
