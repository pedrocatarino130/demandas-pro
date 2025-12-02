import{s as i,T as l}from"./TaskCard-CQKHJvpQ.js";import{C as h,t as u}from"./TaskEditModal-BHXB4Oq6.js";import{c as m}from"./NeonButton-DWD2bhQA.js";import{confirmAction as p}from"./ConfirmModal-BsncAfHd.js";import{g}from"./taskFilters-BoeSJyjR.js";import"./index-7ypPvpma.js";import"./idb-Dob3nYDb.js";class v{constructor(){this.activeTab="urgent",this.searchQuery="",this.unsubscribe=null}render(){return`
      <div class="home-view home-view-redesign" id="home-view-redesign">
        <div class="home-top-cards">
          <section class="home-welcome-card">
            <h2 class="home-welcome-title">Bem vindo de volta, Pedro!</h2>
            <p class="home-welcome-message">
              Você tem <strong id="home-urgent-count">0 tarefas urgentes</strong> hoje. Mantenha o foco!
            </p>
            <div id="home-cta"></div>
          </section>

          <section class="home-productivity-card">
            <div class="home-productivity-value" id="home-productivity-value">0%</div>
            <div class="home-productivity-label">Produtividade</div>
            <div class="home-productivity-bar">
              <div class="home-productivity-bar-fill" id="home-productivity-bar-fill" style="width: 0%"></div>
            </div>
          </section>
        </div>

        <div class="home-section-header">
          <div class="home-dashboard-tabs" id="home-dashboard-tabs"></div>
          <div class="home-search" id="home-search"></div>
        </div>

        <div class="home-tasks-grid" id="home-tasks-grid"></div>
      </div>
    `}mount(){return this.renderSearch(),this.renderCTA(),this.renderData(),this.unsubscribe=i.subscribe(()=>this.renderData()),this}destroy(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null)}renderSearch(){const e=document.getElementById("home-search");if(!e)return;e.innerHTML="";const t=new h({value:this.searchQuery,onChange:s=>{this.searchQuery=s,this.renderData()}});e.appendChild(t.render())}renderCTA(){const e=document.getElementById("home-cta");if(!e)return;e.innerHTML="";const t=m({text:"Nova Tarefa",variant:"primary",onClick:()=>this.createTask(),className:"home-cta-button"});e.appendChild(t)}renderData(){const e=i.getState(),t=Array.isArray(e.tarefasHome)?[...e.tarefasHome]:[],s=this.applySearch(t),r=this.buildCategories(s);this.renderTabs(r),this.updateTopCards(r,s),this.renderGrid(this.getActiveTasks(r))}renderTabs(e){const t=document.getElementById("home-dashboard-tabs");if(!t)return;const s=[{id:"urgent",label:"Urgentes",className:"urgent",count:e.urgent.length},{id:"future",label:"Futuras",className:"future",count:e.future.length},{id:"completed",label:"Concluídas",className:"completed",count:e.completed.length}];t.innerHTML=s.map(r=>`
          <button 
            class="home-dashboard-tab ${r.className} ${this.activeTab===r.id?"active":""}" 
            data-tab="${r.id}"
            aria-pressed="${this.activeTab===r.id}"
          >
            <span class="home-dashboard-tab-icon">●</span>
            ${r.label} (${r.count})
          </button>
        `).join(""),t.querySelectorAll("[data-tab]").forEach(r=>{r.addEventListener("click",()=>{const a=r.getAttribute("data-tab");a&&(this.activeTab=a,this.renderTabs(e),this.renderGrid(this.getActiveTasks(e)))})})}renderGrid(e){const t=document.getElementById("home-tasks-grid");if(t){if(t.innerHTML="",!e||e.length===0){const s=document.createElement("div");s.className="home-empty-state",s.innerHTML=`
        <div class="home-empty-state-icon">📂</div>
        <p class="home-empty-state-message">Nenhuma tarefa nesta categoria.</p>
      `,t.appendChild(s);return}e.forEach(s=>{const r=new l(s,{showCheckbox:!0,showPriority:!0,showActions:!0,onToggleStatus:(a,n)=>this.handleToggleStatus(a,n),onEdit:a=>this.handleEdit(a),onDelete:a=>this.handleDelete(a)});t.appendChild(r.render())})}}updateTopCards(e,t){const s=document.getElementById("home-urgent-count");s&&(s.textContent=`${e.urgent.length} tarefas urgentes`);const r=t.length,a=e.completed.length,n=r>0?Math.round(a/r*100):0,o=document.getElementById("home-productivity-value");o&&(o.textContent=`${n}%`);const d=document.getElementById("home-productivity-bar-fill");d&&(d.style.width=`${n}%`)}applySearch(e){if(!this.searchQuery)return e;const t=this.searchQuery.toLowerCase();return e.filter(s=>{const r=(s.titulo||s.nome||"").toLowerCase(),a=(s.descricao||"").toLowerCase(),n=(s.responsavel||"").toLowerCase(),o=Array.isArray(s.tags)?s.tags.join(" ").toLowerCase():"";return r.includes(t)||a.includes(t)||n.includes(t)||o.includes(t)})}buildCategories(e){const t=new Set,s=e.filter(o=>!o.completed&&this.isHighPriority(o)&&!t.has(this.getTaskId(o))),r=new Set(s.map(o=>this.getTaskId(o))),a=g(e),n=e.filter(o=>!o.completed&&!t.has(this.getTaskId(o))&&!r.has(this.getTaskId(o)));return{urgent:s,future:n,completed:a}}getActiveTasks(e){switch(this.activeTab){case"future":return e.future;case"completed":return e.completed;case"urgent":default:return e.urgent}}async handleDelete(e){await p("Deseja excluir esta tarefa?")&&i.removeItem("tarefasHome",s=>this.compareIds(this.getTaskId(s),e))}handleEdit(e){e&&u.open(e,(t,s)=>this.saveTask(t,s))}handleToggleStatus(e,t){i.updateItem("tarefasHome",s=>this.compareIds(this.getTaskId(s),e),{completed:t,completedAt:t?new Date().toISOString():null})}createTask(){const t=(i.getState().contadorHome||0)+1,s=new Date;s.setHours(s.getHours()+1);const r={id:t,contador:t,titulo:"Nova Tarefa",descricao:"",prioridade:"media",responsavel:"",tags:[],status:"todo",completed:!1,time:s.toISOString()};u.open(r,(a,n)=>this.saveTask(a,n))}saveTask(e,t){const s=this.getTaskId(e),r={...e,...t};if(this.taskExists(s))i.updateItem("tarefasHome",n=>this.compareIds(this.getTaskId(n),s),r);else{i.addItem("tarefasHome",r);const n=i.getState().contadorHome||0,o=Number(s),d=Number.isFinite(o)?Math.max(n,o):n+1;i.setState({contadorHome:d})}}taskExists(e){const t=i.getState();return(Array.isArray(t.tarefasHome)?t.tarefasHome:[]).some(r=>this.compareIds(this.getTaskId(r),e))}isHighPriority(e){const t=(e.prioridade||"").toString().toLowerCase();return t==="alta"||t==="urgente"||t==="high"||t==="urgent"}getTaskId(e){return e&&(e.id||e.contador)||null}compareIds(e,t){return e==null||t==null?!1:String(e)===String(t)}}function S(){const c=new v;return{render:()=>c.render(),mount:()=>c.mount()}}export{S as default};
//# sourceMappingURL=Home-Dh9Zd1mX.js.map
