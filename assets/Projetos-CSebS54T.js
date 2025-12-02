import{s as i,T as m}from"./TaskCard-CQKHJvpQ.js";import{C as p,t as l}from"./TaskEditModal-BHXB4Oq6.js";import{c as v}from"./NeonButton-DWD2bhQA.js";import{confirmAction as g}from"./ConfirmModal-BsncAfHd.js";import"./index-7ypPvpma.js";import"./idb-Dob3nYDb.js";class f{constructor(){this.unsubscribe=null,this.searchQuery=""}render(){return`
      <div class="home-view home-view-redesign projetos-view-redesign" id="projetos-view">
        <div class="home-section-header">
          <h1 class="home-section-title">Projetos</h1>
          <div class="home-search" id="projetos-search"></div>
        </div>

        <div class="home-top-cards">
          <section class="home-welcome-card">
            <h2 class="home-welcome-title">Board de Projetos</h2>
            <p class="home-welcome-message">
              Organize seu fluxo em colunas e mantenha o ritmo.
            </p>
            <div id="projetos-cta"></div>
          </section>

          <section class="home-productivity-card">
            <div class="home-productivity-value" id="projetos-progress-value">0%</div>
            <div class="home-productivity-label">Progresso</div>
            <div class="home-productivity-bar">
              <div class="home-productivity-bar-fill" id="projetos-progress-bar" style="width: 0%"></div>
            </div>
          </section>
        </div>

        <div class="kanban-cyberpunk" id="projetos-kanban"></div>
      </div>
    `}mount(){return this.renderSearch(),this.renderCTA(),this.renderKanban(),this.unsubscribe=i.subscribe(()=>this.renderKanban()),this}destroy(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null)}renderSearch(){const e=document.getElementById("projetos-search");if(!e)return;e.innerHTML="";const t=new p({value:this.searchQuery,onChange:s=>{this.searchQuery=s,this.renderKanban()}});e.appendChild(t.render())}renderCTA(){const e=document.getElementById("projetos-cta");if(!e)return;e.innerHTML="";const t=v({text:"Nova Tarefa",variant:"primary",onClick:()=>this.createTask()});e.appendChild(t)}renderKanban(){const e=document.getElementById("projetos-kanban");if(!e)return;const t=i.getState(),s=this.filterTasks(t.tarefas||[]),o=this.groupByStatus(s);this.updateProgress(s),e.innerHTML=`
      <div class="kanban-cyberpunk-grid">
        ${o.map(r=>`
              <div class="kanban-cyberpunk-column">
                <div class="kanban-cyberpunk-column-header">
                  <div class="kanban-cyberpunk-column-title">
                    <span class="kanban-cyberpunk-dot" style="background:${r.color}"></span>
                    <h3>${r.title}</h3>
                  </div>
                  <span class="kanban-cyberpunk-count">${r.tasks.length}</span>
                </div>
                <div class="kanban-cyberpunk-column-body" id="col-${r.id}"></div>
              </div>
            `).join("")}
      </div>
    `,o.forEach(r=>{const a=e.querySelector(`#col-${r.id}`);if(a){if(r.tasks.length===0){const n=document.createElement("div");n.className="home-empty-state",n.innerHTML=`
          <div class="home-empty-state-icon">📂</div>
          <p class="home-empty-state-message">Nenhuma tarefa aqui.</p>
        `,a.appendChild(n);return}r.tasks.forEach(n=>{const d=new m(n,{showCheckbox:!0,showPriority:!0,showActions:!0,onToggleStatus:(c,h)=>this.handleToggleStatus(c,h),onEdit:c=>this.handleEdit(c),onDelete:c=>this.handleDelete(c),isCompleted:this.isDone(n)});a.appendChild(d.render())})}})}filterTasks(e){const t=e.filter(o=>!o.arquivado);if(!this.searchQuery)return t;const s=this.searchQuery.toLowerCase();return t.filter(o=>{const r=(o.titulo||o.nome||"").toLowerCase(),a=(o.descricao||"").toLowerCase(),n=(o.responsavel||"").toLowerCase(),d=Array.isArray(o.tags)?o.tags.join(" ").toLowerCase():"";return r.includes(s)||a.includes(s)||n.includes(s)||d.includes(s)})}groupByStatus(e){const t=[{id:"todo",title:"A Fazer",color:"#03a9f4"},{id:"doing",title:"Fazendo",color:"#cf30aa"},{id:"done",title:"Feito",color:"#00ff88"}],s=new Map(t.map(o=>[o.id,[]]));return e.forEach(o=>{const r=(o.status||"todo").toLowerCase();s.has(r)?s.get(r).push(o):s.get("todo").push(o)}),t.map(o=>({...o,tasks:s.get(o.id)||[]}))}updateProgress(e){const t=e.length,s=e.filter(n=>this.isDone(n)).length,o=t>0?Math.round(s/t*100):0,r=document.getElementById("projetos-progress-value"),a=document.getElementById("projetos-progress-bar");r&&(r.textContent=`${o}%`),a&&(a.style.width=`${o}%`)}isDone(e){return(e.status||"").toLowerCase()==="done"||e.completed===!0}async handleDelete(e){await g("Deseja excluir esta tarefa?")&&i.removeItem("tarefas",s=>this.compareIds(this.getTaskId(s),e))}handleEdit(e){e&&l.open(e,(t,s)=>this.saveTask(t,s))}handleToggleStatus(e,t){i.updateItem("tarefas",s=>this.compareIds(this.getTaskId(s),e),{completed:t,status:t?"done":"todo",completedAt:t?new Date().toISOString():null})}createTask(){const t=(i.getState().contador||0)+1,s=new Date;s.setHours(s.getHours()+1);const o={id:t,contador:t,titulo:"Nova Tarefa",descricao:"",prioridade:"media",responsavel:"",tags:[],status:"todo",completed:!1,time:s.toISOString()};l.open(o,(r,a)=>this.saveTask(r,a))}saveTask(e,t){const s=this.getTaskId(e),o={...e,...t};if(this.taskExists(s))i.updateItem("tarefas",a=>this.compareIds(this.getTaskId(a),s),o);else{i.addItem("tarefas",o);const a=i.getState().contador||0,n=Number(s),d=Number.isFinite(n)?Math.max(a,n):a+1;i.setState({contador:d})}}taskExists(e){const t=i.getState();return(Array.isArray(t.tarefas)?t.tarefas:[]).some(o=>this.compareIds(this.getTaskId(o),e))}getTaskId(e){return e&&(e.id||e.contador)||null}compareIds(e,t){return e==null||t==null?!1:String(e)===String(t)}}function C(){const u=new f;return{render:()=>u.render(),mount:()=>u.mount(),destroy:()=>u.destroy()}}export{C as default};
//# sourceMappingURL=Projetos-CSebS54T.js.map
