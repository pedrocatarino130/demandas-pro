import{s as u,t as w,g as x,T as O}from"./TaskCard-sLMCe87l.js";import{a as A,b as D}from"./taskFilters-03Vb9Oq6.js";import{t as v}from"./index-JMGHwSEN.js";import{confirmAction as R}from"./ConfirmModal-BsncAfHd.js";import"./idb-Dob3nYDb.js";const g={THRESHOLD:50,RESTRAINT:100,ALLOWED_TIME:500,ANIMATION_DURATION:300};function M(n,e={}){const{onSwipeLeft:r,onSwipeRight:t}=e;if(n.classList.contains("swipe-enabled"))return;let a=0,i=0,o=0,s=!1;const c=C("check","Concluir"),d=C("clock","Adiar 1 dia");n.appendChild(c),n.appendChild(d),n.classList.add("swipe-enabled"),n.style.position="relative",n.style.overflow="hidden",n.style.transition=`transform ${g.ANIMATION_DURATION}ms ease-out`,n.addEventListener("touchstart",h,{passive:!0}),n.addEventListener("touchmove",y,{passive:!1}),n.addEventListener("touchend",I,{passive:!0}),n.addEventListener("mousedown",f),n.addEventListener("mousemove",T),n.addEventListener("mouseup",b),n.addEventListener("mouseleave",b);function h(l){const p=l.touches[0];a=p.clientX,i=p.clientY,o=Date.now(),s=!0,n.style.transition="none"}function f(l){l.button===0&&(a=l.clientX,i=l.clientY,o=Date.now(),s=!0,n.style.transition="none",l.preventDefault())}function y(l){if(!s)return;const p=l.touches[0],m=p.clientX-a,k=p.clientY-i;Math.abs(m)>Math.abs(k)&&(l.preventDefault(),S(m))}function T(l){if(!s)return;const p=l.clientX-a,m=l.clientY-i;Math.abs(p)>Math.abs(m)&&S(p)}function I(l){if(!s)return;const p=l.changedTouches[0],m=p.clientX-a,k=p.clientY-i,$=Date.now()-o;E(m,k,$),L()}function b(l){if(!s)return;const p=l.clientX-a,m=l.clientY-i,k=Date.now()-o;E(p,m,k),L()}function S(l){const p=window.innerWidth*.3,m=Math.max(-p,Math.min(p,l));n.style.transform=`translateX(${m}px)`,m>g.THRESHOLD?(d.classList.add("active"),c.classList.remove("active"),n.style.backgroundColor="rgba(245, 158, 11, 0.1)"):m<-50?(c.classList.add("active"),d.classList.remove("active"),n.style.backgroundColor="rgba(16, 185, 129, 0.1)"):(c.classList.remove("active"),d.classList.remove("active"),n.style.backgroundColor="")}function E(l,p,m){m>g.ALLOWED_TIME||Math.abs(p)>g.RESTRAINT||Math.abs(l)<g.THRESHOLD||(l<-50&&r?r(n):l>g.THRESHOLD&&t&&t(n))}function L(){s=!1,n.style.transition=`transform ${g.ANIMATION_DURATION}ms ease-out`,n.style.transform="",n.style.backgroundColor="",c.classList.remove("active"),d.classList.remove("active")}F()}function C(n,e){const r=document.createElement("div");r.className=`swipe-action swipe-action-${n==="check"?"left":"right"}`;const t=n==="check"?"✓":"⏰";return r.innerHTML=`
        <span class="swipe-icon">${t}</span>
        <span class="swipe-label">${e}</span>
    `,r}function F(){const n="swipe-gestures-styles";if(document.getElementById(n))return;const e=document.createElement("style");e.id=n,e.textContent=`
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
    `,document.head.appendChild(e)}function N(n,e){return r=>{r.style.transform="translateX(-100%)",r.style.opacity="0",setTimeout(()=>{e&&e(n)},g.ANIMATION_DURATION)}}function B(n,e){return r=>{r.style.transform="translateX(100%)",r.style.opacity="0",setTimeout(()=>{e&&e(n,1),r.style.transform="",r.style.opacity="1"},g.ANIMATION_DURATION*2)}}class q{constructor(){this.unsubscribe=null,this.currentFilter="all",this.searchQuery="",this.sortBy="time",this.sortOrder="asc",this.priorityFilter="all",this.eventHandlers={filterClick:null,checkboxChange:null,actionClick:null,searchInput:null,sortChange:null,priorityFilterChange:null}}render(){const r=u.getState().tarefasRotina||[];let t=this.filterTasks(r);this.searchQuery&&(t=this.searchTasks(t)),this.priorityFilter!=="all"&&(t=t.filter(h=>(h.prioridade||"media").toLowerCase()===this.priorityFilter.toLowerCase())),t=this.sortTasks(t);let a=t.filter(h=>!h.completed);const i=t.filter(h=>h.completed);let o=[];if(this.currentFilter==="postponed")o=t,a=[];else{o=A(a);const h=new Set(o.map(f=>f.id||f.contador));a=a.filter(f=>!h.has(f.id||f.contador))}const s=t.length,c=i.length,d=s>0?Math.round(c/s*100):0;return`
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

        ${o.length>0?this.renderTasksSection("⏰ Adiadas",o,!1,!0):""}
        ${a.length>0?this.renderTasksSection("Pendentes",a,!1):""}
        ${i.length>0?this.renderTasksSection("Concluídas",i,!0):""}
        
        ${t.length===0?this.renderEmptyState():""}
      </div>
    `}filterTasks(e){switch(this.currentFilter){case"today":return this.getTodayTasks(e);case"overdue":return D(e);case"completed":return e.filter(r=>r.completed);case"postponed":return A(e);default:return e}}searchTasks(e){if(!this.searchQuery)return e;const r=this.searchQuery.toLowerCase();return e.filter(t=>{const a=(t.titulo||t.nome||"").toLowerCase(),i=(t.descricao||"").toLowerCase();return a.includes(r)||i.includes(r)})}sortTasks(e){const r=[...e],t=this.sortOrder==="asc"?1:-1;return r.sort((a,i)=>{switch(this.sortBy){case"time":const o=w(a.time),s=w(i.time);return!o&&!s?0:o?s?(o-s)*t:-1:1;case"priority":const c={urgente:4,alta:3,media:2,baixa:1},d=c[(a.prioridade||"media").toLowerCase()]||0;return((c[(i.prioridade||"media").toLowerCase()]||0)-d)*t;case"title":const f=(a.titulo||a.nome||"").toLowerCase(),y=(i.titulo||i.nome||"").toLowerCase();return f.localeCompare(y)*t;default:return 0}}),r}getTodayTasks(e){const r=x();return e.filter(t=>{if(!t.time)return!1;const a=w(t.time);return a?a.toISOString().split("T")[0]===r:!1})}renderTasksSection(e,r,t,a=!1){const i=D(r);return`
      <section class="rotina-section ${a?"rotina-section-postponed":""}">
        <div class="rotina-section-header">
          <h2 class="rotina-section-title">${e}</h2>
          <span class="rotina-section-count">${r.length}</span>
          ${a?'<span class="rotina-section-badge badge badge-info" title="Tarefas adiadas para mais de 2 horas no futuro">⏰ Adiadas</span>':""}
          ${i.length>0&&!t&&!a?`<span class="rotina-section-badge badge badge-danger">${i.length} atrasadas</span>`:""}
        </div>
        <div class="rotina-tasks-list ${t?"rotina-tasks-completed":""} ${a?"rotina-tasks-postponed":""}">
          ${r.map(o=>{const c=new O(o,{showCheckbox:!0,showModule:!1,showPriority:!0,showDuration:!0,showActions:!0,isCurrent:!1,isOverdue:i.some(h=>(h.id||h.contador)===(o.id||o.contador)),isPostponed:a,onInjectToHome:h=>this.handleInjectToHome(h)}).render().outerHTML,d=o.recurrence&&o.recurrence.enabled;return`<div class="rotina-task-item ${a?"rotina-task-postponed":""}" data-task-id="${o.id||o.contador}" ${d?'data-recurring="true"':""}>${c}</div>`}).join("")}
        </div>
      </section>
    `}renderEmptyState(){const e={all:"Nenhuma tarefa de rotina cadastrada",today:"Nenhuma tarefa para hoje",overdue:"Nenhuma tarefa atrasada! 🎉",completed:"Nenhuma tarefa concluída ainda",postponed:"Nenhuma tarefa adiada"};return`
      <div class="rotina-empty-state">
        <p class="rotina-empty-text">${e[this.currentFilter]||e.all}</p>
      </div>
    `}mount(){this.unsubscribe=u.subscribe(()=>{this.update()}),this.setupEventListeners(),this.setupSwipeGestures()}setupEventListeners(){this.cleanupEventListeners(),this.eventHandlers.filterClick=o=>{const s=o.target.closest(".filter-btn");if(s){const c=s.getAttribute("data-filter");this.currentFilter=c,this.update()}},document.addEventListener("click",this.eventHandlers.filterClick);const e=document.getElementById("btnAddRotina");e&&e.addEventListener("click",()=>{this.handleTaskAdd()});const r=document.getElementById("rotina-search-input");r&&(this.eventHandlers.searchInput=()=>{this.searchQuery=r.value,this.update()},r.addEventListener("input",this.eventHandlers.searchInput));const t=document.getElementById("rotina-sort-by");t&&(this.eventHandlers.sortChange=()=>{this.sortBy=t.value,this.update()},t.addEventListener("change",this.eventHandlers.sortChange));const a=document.getElementById("rotina-sort-order");a&&a.addEventListener("click",()=>{this.sortOrder=this.sortOrder==="asc"?"desc":"asc",this.update()});const i=document.getElementById("rotina-priority-filter");i&&(this.eventHandlers.priorityFilterChange=()=>{this.priorityFilter=i.value,this.update()},i.addEventListener("change",this.eventHandlers.priorityFilterChange)),this.eventHandlers.checkboxChange=o=>{if(o.target.classList.contains("task-checkbox")||o.target.classList.contains("ios-checkbox-input")){const s=o.target.getAttribute("data-task-id");s&&this.handleTaskComplete(s,o.target.checked)}},document.addEventListener("change",this.eventHandlers.checkboxChange),this.eventHandlers.actionClick=o=>{const s=o.target.closest("[data-action]");if(!s)return;const c=s.getAttribute("data-action"),d=s.getAttribute("data-task-id");if(c==="edit"&&d)this.handleTaskEdit(d);else if(c==="delete"&&d)this.handleTaskDelete(d);else if(c==="inject-to-home"&&d){const f=u.getState().tarefasRotina.find(y=>(y.id||y.contador)==d);f?this.handleInjectToHome(f):v.error("Tarefa não encontrada")}},document.addEventListener("click",this.eventHandlers.actionClick)}cleanupEventListeners(){if(this.eventHandlers.filterClick&&document.removeEventListener("click",this.eventHandlers.filterClick),this.eventHandlers.checkboxChange&&document.removeEventListener("change",this.eventHandlers.checkboxChange),this.eventHandlers.actionClick&&document.removeEventListener("click",this.eventHandlers.actionClick),this.eventHandlers.searchInput){const e=document.getElementById("rotina-search-input");e&&e.removeEventListener("input",this.eventHandlers.searchInput)}if(this.eventHandlers.sortChange){const e=document.getElementById("rotina-sort-by");e&&e.removeEventListener("change",this.eventHandlers.sortChange)}if(this.eventHandlers.priorityFilterChange){const e=document.getElementById("rotina-priority-filter");e&&e.removeEventListener("change",this.eventHandlers.priorityFilterChange)}}setupSwipeGestures(){setTimeout(()=>{document.querySelectorAll(".rotina-task-item .task-card").forEach(r=>{const t=r.closest(".rotina-task-item").getAttribute("data-task-id");t&&M(r,{onSwipeLeft:N(t,a=>{this.handleTaskComplete(a,!0)}),onSwipeRight:B(t,(a,i)=>{this.handlePostpone(a,i)})})})},100)}handleTaskComplete(e,r){const a=u.getState().tarefasRotina.find(o=>(o.id||o.contador)==e);if(!a)return;const i=a.titulo||a.nome||"Tarefa";u.updateItem("tarefasRotina",o=>(o.id||o.contador)==e,{completed:r,completedAt:r?new Date().toISOString():null}),r&&a.recurrence&&this.handleRecurringTask(a),r&&v.success(`"${i}" concluída!`,{duration:5e3,action:()=>{u.updateItem("tarefasRotina",o=>(o.id||o.contador)==e,{completed:!1,completedAt:null}),v.info("Ação desfeita")},actionLabel:"Desfazer"})}handleRecurringTask(e){if(!e.recurrence||!e.recurrence.enabled)return;const t=(u.getState().contadorRotina||0)+1,a=e.time?w(e.time):new Date;let i=new Date(a);switch(e.recurrence.type){case"daily":i.setDate(i.getDate()+1);break;case"weekly":i.setDate(i.getDate()+7);break;case"monthly":i.setMonth(i.getMonth()+1);break;case"custom":i.setDate(i.getDate()+(e.recurrence.interval||1));break;default:return}const o={...e,id:t,contador:t,time:i.toISOString(),completed:!1,completedAt:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};delete o.completedAt,u.addItem("tarefasRotina",o),u.setState({contadorRotina:t})}handlePostpone(e,r){const a=u.getState().tarefasRotina.find(i=>(i.id||i.contador)==e);if(a&&a.time){const i=w(a.time);if(i){i.setDate(i.getDate()+r);const o=i.toISOString();u.updateItem("tarefasRotina",s=>(s.id||s.contador)==e,{time:o}),v.info(`Tarefa adiada ${r} dia${r>1?"s":""}`)}}}handleTaskAdd(){const r=(u.getState().contadorRotina||0)+1,t=new Date,a=new Date(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours()+1,0,0),i={id:r,contador:r,titulo:"Nova Tarefa de Rotina",descricao:"",time:a.toISOString(),prioridade:"media",duracao:null,completed:!1,modulo:"rotina",recurrence:{enabled:!1,type:"daily",interval:1},createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};this.openTaskModal(i,o=>{const s={...i,...o};u.addItem("tarefasRotina",s),u.setState({contadorRotina:r}),v.success("Tarefa de rotina criada com sucesso"),this.update()})}handleTaskEdit(e){const t=u.getState().tarefasRotina.find(a=>(a.id||a.contador)==e);if(!t){v.error("Tarefa não encontrada");return}this.openTaskModal(t,a=>{u.updateItem("tarefasRotina",i=>(i.id||i.contador)==e,{...a,updatedAt:new Date().toISOString()}),v.success("Tarefa atualizada com sucesso"),this.update()})}async handleTaskDelete(e){const t=u.getState().tarefasRotina.find(o=>(o.id||o.contador)==e);if(!t){v.error("Tarefa não encontrada");return}const a=t.titulo||t.nome||"Tarefa";await R(`Tem certeza que deseja excluir "${a}"`)&&(u.removeItem("tarefasRotina",o=>(o.id||o.contador)==e),v.success("Tarefa excluída com sucesso"),this.update())}handleInjectToHome(e){if(!e){v.error("Tarefa não encontrada");return}try{const t=(u.getState().contadorHome||0)+1,a={id:t,contador:t,titulo:e.titulo||e.nome||"Nova Tarefa",descricao:e.descricao||"",prioridade:e.prioridade||"media",responsavel:e.responsavel||"",tags:Array.isArray(e.tags)?[...e.tags]:[],status:"todo",completed:!1,time:e.time||new Date().toISOString(),createdAt:new Date().toISOString()};u.addItem("tarefasHome",a),u.setState({contadorHome:t}),v.success(`"${a.titulo}" adicionada ao Home!`,{duration:3e3})}catch(r){console.error("Erro ao injetar tarefa no Home:",r),v.error("Erro ao adicionar tarefa ao Home")}}openTaskModal(e,r){const t=document.createElement("div");t.className="rotina-task-modal";const a=e.time?w(e.time):new Date,i=a?a.toISOString().split("T")[0]:"",o=a?String(a.getHours()).padStart(2,"0"):"",s=a?String(a.getMinutes()).padStart(2,"0"):"",c=e.recurrence||{enabled:!1,type:"daily",interval:1};t.innerHTML=`
      <div class="rotina-task-modal-content">
        <h2 class="rotina-task-modal-title">${e.id?"Editar":"Nova"} Tarefa de Rotina</h2>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Título *</label>
          <input type="text" id="rotina-titulo" class="rotina-task-form-input" value="${this.escapeHtml(e.titulo||e.nome||"")}" required>
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Descrição</label>
          <textarea id="rotina-descricao" rows="4" class="rotina-task-form-textarea">${this.escapeHtml(e.descricao||"")}</textarea>
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Data</label>
          <input type="date" id="rotina-date" class="rotina-task-form-input" value="${i}">
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Hora</label>
          <div class="rotina-task-time-group">
            <input type="number" id="rotina-hour" class="rotina-task-form-input rotina-task-time-input" value="${o}" min="0" max="23" placeholder="HH">
            <span class="rotina-task-time-separator">:</span>
            <input type="number" id="rotina-minute" class="rotina-task-form-input rotina-task-time-input" value="${s}" min="0" max="59" placeholder="MM">
          </div>
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Prioridade</label>
          <select id="rotina-prioridade" class="rotina-task-form-select">
            <option value="baixa" ${e.prioridade==="baixa"?"selected":""}>Baixa</option>
            <option value="media" ${e.prioridade==="media"||!e.prioridade?"selected":""}>Média</option>
            <option value="alta" ${e.prioridade==="alta"?"selected":""}>Alta</option>
            <option value="urgente" ${e.prioridade==="urgente"?"selected":""}>Urgente</option>
          </select>
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Duração (minutos)</label>
          <input type="number" id="rotina-duracao" class="rotina-task-form-input" value="${e.duracao||""}" min="0" placeholder="Ex: 30">
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
    `,document.body.appendChild(t);const d=t.querySelector("#rotina-recurrence-enabled"),h=t.querySelector("#rotina-recurrence-options"),f=t.querySelector("#rotina-recurrence-type"),y=t.querySelector("#rotina-recurrence-interval-group");d&&d.addEventListener("change",()=>{h&&(h.style.display=d.checked?"block":"none")}),f&&f.addEventListener("change",()=>{y&&(y.style.display=f.value==="custom"?"block":"none")});const T=()=>{document.body.contains(t)&&document.body.removeChild(t)};t.querySelector("#rotina-cancel").addEventListener("click",T),t.addEventListener("click",b=>{b.target===t&&T()});const I=b=>{b.key==="Escape"&&(T(),document.removeEventListener("keydown",I))};document.addEventListener("keydown",I),t.querySelector("#rotina-save").addEventListener("click",()=>{const b=t.querySelector("#rotina-titulo").value.trim();if(!b){v.error("O título é obrigatório");return}const S=t.querySelector("#rotina-date").value,E=parseInt(t.querySelector("#rotina-hour").value)||0,L=parseInt(t.querySelector("#rotina-minute").value)||0;let l=null;if(S){const H=new Date(S);H.setHours(E,L,0,0),l=H.toISOString()}const p=t.querySelector("#rotina-recurrence-enabled").checked,m=t.querySelector("#rotina-recurrence-type").value,k=parseInt(t.querySelector("#rotina-recurrence-interval").value)||1,$={titulo:b,descricao:t.querySelector("#rotina-descricao").value.trim(),time:l,prioridade:t.querySelector("#rotina-prioridade").value,duracao:t.querySelector("#rotina-duracao").value?parseInt(t.querySelector("#rotina-duracao").value):null,modulo:"rotina",recurrence:{enabled:p,type:m,interval:m==="custom"?k:1}};r($),T()}),setTimeout(()=>t.querySelector("#rotina-titulo").focus(),100)}escapeHtml(e){const r=document.createElement("div");return r.textContent=e,r.innerHTML}update(){const e=document.getElementById("app");e&&(e.innerHTML=this.render(),this.setupEventListeners(),this.setupSwipeGestures())}destroy(){this.cleanupEventListeners(),this.unsubscribe&&this.unsubscribe()}}function P(){const n=new q;return{render:()=>n.render(),mount:()=>(setTimeout(()=>{n.mount()},0),n)}}export{P as default};
//# sourceMappingURL=Rotina-BtRuiNiy.js.map
