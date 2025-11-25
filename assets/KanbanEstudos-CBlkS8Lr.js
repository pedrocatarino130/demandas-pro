class u{constructor(a={}){this.container=a.container||document.body,this.topicos=a.topicos||[],this.areas=a.areas||[],this.onStatusChange=a.onStatusChange||(()=>{}),this.onCardClick=a.onCardClick||(()=>{}),this.draggedCard=null,this._createKanban(),this._attachEvents()}_createKanban(){this.wrapper=document.createElement("div"),this.wrapper.className="kanban-estudos",this.wrapper.innerHTML=`
            <div class="kanban-estudos-container">
                <div class="kanban-column" data-status="prioridade">
                    <div class="kanban-column-header">
                        <h3>🎯 Prioridade</h3>
                        <span class="kanban-count" id="countPrioridade">0</span>
                    </div>
                    <div class="kanban-column-content" data-status="prioridade"></div>
                </div>
                
                <div class="kanban-column" data-status="revisoes">
                    <div class="kanban-column-header">
                        <h3>🔄 Revisões</h3>
                        <span class="kanban-count" id="countRevisoes">0</span>
                    </div>
                    <div class="kanban-column-content" data-status="revisoes"></div>
                </div>
                
                <div class="kanban-column" data-status="andamento">
                    <div class="kanban-column-header">
                        <h3>📚 Em Andamento</h3>
                        <span class="kanban-count" id="countAndamento">0</span>
                    </div>
                    <div class="kanban-column-content" data-status="andamento"></div>
                </div>
                
                <div class="kanban-column" data-status="concluidos">
                    <div class="kanban-column-header">
                        <h3>✅ Concluídos</h3>
                        <span class="kanban-count" id="countConcluidos">0</span>
                    </div>
                    <div class="kanban-column-content" data-status="concluidos"></div>
                </div>
            </div>
        `,this.container.appendChild(this.wrapper),this.render()}render(){const a={prioridade:this.wrapper.querySelector('[data-status="prioridade"] .kanban-column-content'),revisoes:this.wrapper.querySelector('[data-status="revisoes"] .kanban-column-content'),andamento:this.wrapper.querySelector('[data-status="andamento"] .kanban-column-content'),concluidos:this.wrapper.querySelector('[data-status="concluidos"] .kanban-column-content')};Object.values(a).forEach(t=>t.innerHTML="");const e=this._groupTopicos();e.prioridade.forEach(t=>{a.prioridade.appendChild(this._createCard(t))}),e.revisoes.forEach(t=>{a.revisoes.appendChild(this._createCard(t))}),e.andamento.forEach(t=>{a.andamento.appendChild(this._createCard(t))}),e.concluidos.forEach(t=>{a.concluidos.appendChild(this._createCard(t))}),this._updateCounters(e)}_groupTopicos(){const a={prioridade:[],revisoes:[],andamento:[],concluidos:[]};return this.topicos.forEach(e=>{e.status==="Precisa revisão"||this._isRevisaoPendente(e)?a.revisoes.push(e):e.status==="Estudando"?a.andamento.push(e):e.status==="Concluído"?a.concluidos.push(e):(e.status==="Não iniciado"&&(e.prioridade==="Alta"||e.prioridade),a.prioridade.push(e))}),a.prioridade.sort((e,t)=>this._sortByPriority(e,t)),a.revisoes.sort((e,t)=>{const s=new Date(e.proximaRevisao||0),n=new Date(t.proximaRevisao||0);return s-n}),a.andamento.sort((e,t)=>{const s=new Date(e.criadoEm||0),n=new Date(t.criadoEm||0);return s-n}),a.concluidos.sort((e,t)=>{const s=new Date(e.concluidoEm||0);return new Date(t.concluidoEm||0)-s}),a}_isRevisaoPendente(a){return a.proximaRevisao?new Date(a.proximaRevisao)<=new Date:!1}_sortByPriority(a,e){const t={Alta:3,Média:2,Baixa:1},s=t[a.prioridade]||0,n=t[e.prioridade]||0;if(s!==n)return n-s;const d=new Date(a.criadoEm||0),o=new Date(e.criadoEm||0);return d-o}_createCard(a){var i;const e=this.areas.find(r=>r.id===a.areaId),t=document.createElement("div");t.className="kanban-card",t.draggable=!0,t.dataset.id=a.id;const s=this._calcularProgresso(a),n=this._isRevisaoPendente(a)?'<span class="kanban-badge revisao-pendente">⏰ Revisão</span>':"",d=a.tags&&a.tags.length>0?`<div class="kanban-tags">${a.tags.map(r=>`<span class="kanban-tag">#${r}</span>`).join("")}</div>`:"",o=this._getUltimaSessao(a),c=o?`<div class="kanban-meta">📅 ${this._formatDate(o.data)}</div>`:"";return t.innerHTML=`
            <div class="kanban-card-header">
                <span class="kanban-priority ${(i=a.prioridade)==null?void 0:i.toLowerCase()}">${a.prioridade||"Média"}</span>
                ${n}
                <div class="kanban-card-actions">
                    <button class="btn-icon-small" data-action="edit" data-topico-id="${a.id}" title="Editar">✏️</button>
                    <button class="btn-icon-small" data-action="delete" data-topico-id="${a.id}" title="Excluir">🗑️</button>
                </div>
            </div>
            <div class="kanban-card-body">
                <h4 class="kanban-card-title">${this._escapeHtml(a.titulo)}</h4>
                ${a.descricao?`<p class="kanban-card-desc">${this._escapeHtml(a.descricao)}</p>`:""}
                ${d}
                ${e?`<div class="kanban-area" style="color: ${e.cor}">${e.icone||"📚"} ${e.nome}</div>`:""}
            </div>
            <div class="kanban-card-footer">
                ${s>0?`
                    <div class="kanban-progress">
                        <div class="kanban-progress-bar" style="width: ${s}%"></div>
                        <span class="kanban-progress-text">${s}%</span>
                    </div>
                `:""}
                ${c}
            </div>
        `,t.addEventListener("dragstart",r=>this._handleDragStart(r,a)),t.addEventListener("dragend",r=>this._handleDragEnd(r)),t.querySelector(".kanban-card-body").addEventListener("click",()=>{this.onCardClick(a)}),t.querySelectorAll("[data-action]").forEach(r=>{r.addEventListener("click",l=>{l.stopPropagation()})}),t}_calcularProgresso(a){var e;if(a.sessoes&&a.sessoes.length>0){const t=a.sessoes.reduce((n,d)=>n+(d.duracao||0),0),s=((e=a.tempoEstimado)==null?void 0:e.minutes)||0;if(s>0)return Math.min(100,Math.round(t/s*100))}return a.status==="Concluído"?100:a.status==="Estudando"?50:0}_getUltimaSessao(a){return a.sessoes&&a.sessoes.length>0?[...a.sessoes].sort((t,s)=>{const n=new Date(t.data||0);return new Date(s.data||0)-n})[0]:null}_formatDate(a){if(!a)return"";const e=new Date(a),s=Math.floor((new Date-e)/(1e3*60*60*24));return s===0?"Hoje":s===1?"Ontem":s<7?`${s} dias atrás`:e.toLocaleDateString("pt-BR")}_escapeHtml(a){const e=document.createElement("div");return e.textContent=a,e.innerHTML}_updateCounters(a){this.wrapper.querySelector("#countPrioridade").textContent=a.prioridade.length,this.wrapper.querySelector("#countRevisoes").textContent=a.revisoes.length,this.wrapper.querySelector("#countAndamento").textContent=a.andamento.length,this.wrapper.querySelector("#countConcluidos").textContent=a.concluidos.length}_handleDragStart(a,e){this.draggedCard=e,a.dataTransfer.effectAllowed="move",a.currentTarget.classList.add("dragging")}_handleDragEnd(a){a.currentTarget.classList.remove("dragging"),this.draggedCard=null,this.wrapper.querySelectorAll(".kanban-column").forEach(e=>{e.classList.remove("drag-over")})}_attachEvents(){this.wrapper.querySelectorAll(".kanban-column-content").forEach(e=>{e.addEventListener("dragover",t=>{t.preventDefault(),t.dataTransfer.dropEffect="move",e.parentElement.classList.add("drag-over")}),e.addEventListener("dragleave",()=>{e.parentElement.classList.remove("drag-over")}),e.addEventListener("drop",t=>{if(t.preventDefault(),e.parentElement.classList.remove("drag-over"),this.draggedCard){const s=this._mapStatusFromColumn(e.dataset.status);this.onStatusChange(this.draggedCard.id,s)}})})}_mapStatusFromColumn(a){return{prioridade:"Não iniciado",revisoes:"Precisa revisão",andamento:"Estudando",concluidos:"Concluído"}[a]||"Não iniciado"}updateTopicos(a){this.topicos=a||[],this.render()}updateAreas(a){this.areas=a||[],this.render()}}typeof module<"u"&&module.exports&&(module.exports=u);export{u as KanbanEstudos,u as default};
//# sourceMappingURL=KanbanEstudos-CBlkS8Lr.js.map
