function A(e,t){const r=new Date(e);return r.setHours(r.getHours()+t),r}function v(e,t="dd/MM/yyyy"){if(!e)return"";const r=typeof e=="string"?u(e):e;if(!r)return"";const i=String(r.getDate()).padStart(2,"0"),s=String(r.getMonth()+1).padStart(2,"0"),o=r.getFullYear();return t.replace("dd",i).replace("MM",s).replace("yyyy",o)}function T(e,t="HH:mm"){if(!e)return"";const r=typeof e=="string"?u(e):e;if(!r)return"";const i=String(r.getHours()).padStart(2,"0"),s=String(r.getMinutes()).padStart(2,"0");return t.replace("HH",i).replace("mm",s)}function M(e){if(!e)return 0;const t=typeof e=="string"?u(e):e;if(!t)return 0;const r=new Date;if(t>r)return 0;const i=r-t;return Math.floor(i/(1e3*60*60*24))}function B(){return new Date().toISOString().split("T")[0]}function u(e){if(!e)return null;if(e instanceof Date)return e;if(typeof e=="string"){if(e.match(/^\d{4}-\d{2}-\d{2}$/))return new Date(e+"T00:00:00");try{return new Date(e)}catch{return null}}return null}function R(e,t=2){if(!e||!Array.isArray(e))return[];const r=new Date,i=A(r,t);return e.filter(s=>{if(s.completed||!s.time)return!1;const o=u(s.time);return o?o>=r&&o<=i:!1}).sort((s,o)=>{const d=u(s.time),a=u(o.time);return!d||!a?0:d-a})}function P(e){if(!e||!Array.isArray(e))return[];const t=new Date;return e.filter(r=>{if(r.completed||!r.time&&!r.deadline)return!1;const i=u(r.time||r.deadline);return i?i<t:!1}).map(r=>{const i=u(r.time||r.deadline);return{...r,daysOverdue:M(i)}}).sort((r,i)=>{var a,c;const s={urgente:4,alta:3,media:2,baixa:1},o=s[(a=r.prioridade)==null?void 0:a.toLowerCase()]||0,d=s[(c=i.prioridade)==null?void 0:c.toLowerCase()]||0;return o!==d?d-o:i.daysOverdue-r.daysOverdue})}function F(e){if(!e||!Array.isArray(e))return[];const t=new Date;return t.setHours(0,0,0,0),e.filter(r=>{if(!r.completed||!r.completedAt)return!1;const i=u(r.completedAt);return i?(i.setHours(0,0,0,0),i.getTime()===t.getTime()):!1})}function X(e){if(!e||!Array.isArray(e))return 0;const t=new Date;return t.setHours(0,0,0,0),e.filter(r=>{if(r.completed||!r.time)return!1;const i=u(r.time);return i?(i.setHours(0,0,0,0),i.getTime()===t.getTime()):!1}).length}function Y(e){return!e||!Array.isArray(e)?[]:e.filter(t=>t.completed===!0).map(t=>{const r=u(t.completedAt);return{...t,completedDate:r||new Date(0)}}).sort((t,r)=>r.completedDate-t.completedDate)}function z(e){if(!e||!Array.isArray(e))return[];const r=A(new Date,2);return e.filter(i=>{if(i.completed||!i.time)return!1;const s=u(i.time);return s?s>r:!1}).sort((i,s)=>{const o=u(i.time),d=u(s.time);return!o||!d?0:o-d})}function E(){if(document.getElementById("ios-cards-styles"))return;const e=document.createElement("style");e.id="ios-cards-styles",e.textContent=`
        .ios-card {
            background: var(--color-surface);
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            padding: 20px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            margin-bottom: 16px;
        }
        
        .ios-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
        
        .ios-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .ios-card-title {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary, #0f172a);
            margin: 0;
        }
        
        .ios-card-content {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
            font-size: 15px;
            line-height: 1.5;
            color: var(--text-secondary, #64748b);
        }
        
        .ios-card-priority {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .ios-card[data-priority="urgent"] .priority-urgent {
            background: #dc2626;
            color: white;
        }
        
        .ios-card[data-priority="high"] .priority-high {
            background: #f59e0b;
            color: white;
        }
        
        .ios-card[data-priority="medium"] .priority-medium {
            background: #64748b;
            color: white;
        }
        
        .ios-card[data-priority="low"] .priority-low {
            background: #94a3b8;
            color: white;
        }
    `,document.head.appendChild(e)}function I(e){const{id:t,label:r,checked:i=!1,priority:s="medium",onChange:o}=e,d=t||`ios-checkbox-${Date.now()}-${Math.random()}`,a=document.createElement("div");a.className="ios-checkbox-container";const c=document.createElement("input");c.type="checkbox",c.id=d,c.checked=i,c.className="ios-checkbox-input",c.setAttribute("aria-label",r||"Checkbox");const h=document.createElement("label");if(h.htmlFor=d,h.className=`ios-checkbox-label priority-${s}`,h.innerHTML=`
        <svg class="ios-checkbox-circle" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        </svg>
        <svg class="ios-checkmark" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2.5" 
                  stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,r){const m=document.createElement("span");m.className="ios-checkbox-text",m.textContent=r,a.appendChild(m)}return a.appendChild(c),a.appendChild(h),c.addEventListener("change",m=>{const y=m.target.checked;O(h,y),navigator.vibrate&&navigator.vibrate(50),o&&o(y)}),i&&h.classList.add("checked"),a}function O(e,t,r){t?(e.classList.add("checked"),e.style.transform="scale(1.2)",setTimeout(()=>{e.style.transform="scale(1)"},150)):e.classList.remove("checked")}function H(){if(document.getElementById("ios-checkbox-styles"))return;const e=document.createElement("style");e.id="ios-checkbox-styles",e.textContent=`
        .ios-checkbox-container {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
        }
        
        .ios-checkbox-input {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .ios-checkbox-label {
            position: relative;
            width: 24px;
            height: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ios-checkbox-circle {
            position: absolute;
            width: 100%;
            height: 100%;
            color: #d1d5db;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ios-checkmark {
            position: absolute;
            width: 16px;
            height: 16px;
            color: white;
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ios-checkbox-label.checked .ios-checkbox-circle {
            color: var(--accent, #007AFF);
            fill: var(--accent, #007AFF);
        }
        
        .ios-checkbox-label.checked .ios-checkmark {
            opacity: 1;
            transform: scale(1);
            animation: checkmarkBounce 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Cores por prioridade */
        .ios-checkbox-label.priority-urgent.checked .ios-checkbox-circle {
            color: #dc2626;
            fill: #dc2626;
        }
        
        .ios-checkbox-label.priority-high.checked .ios-checkbox-circle {
            color: #f59e0b;
            fill: #f59e0b;
        }
        
        .ios-checkbox-label.priority-medium.checked .ios-checkbox-circle {
            color: #64748b;
            fill: #64748b;
        }
        
        .ios-checkbox-label.priority-low.checked .ios-checkbox-circle {
            color: #94a3b8;
            fill: #94a3b8;
        }
        
        .ios-checkbox-text {
            font-family: 'Inter', -apple-system, sans-serif;
            font-size: 15px;
            color: var(--text-primary, #0f172a);
            user-select: none;
        }
        
        @keyframes checkmarkBounce {
            0% {
                transform: scale(0);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
        }
        
        /* Hover effect */
        .ios-checkbox-label:hover .ios-checkbox-circle {
            transform: scale(1.1);
        }
        
        .ios-checkbox-label:active {
            transform: scale(0.95);
        }
    `,document.head.appendChild(e)}class _{constructor(t,r={}){this.task=t,this.options={showCheckbox:!0,showModule:!0,showPriority:!0,showDuration:!0,isCurrent:!1,isOverdue:!1,isCompleted:!1,isPostponed:!1,showActions:!1,...r}}render(){const t=document.createElement("div");t.className="task-card ios-card",E();const i={urgente:"urgent",alta:"high",media:"medium",média:"medium",baixa:"low"}[(this.task.prioridade||"media").toLowerCase()]||"medium";t.setAttribute("data-priority",i),this.options.isCurrent&&t.classList.add("task-card-current"),this.options.isOverdue&&t.classList.add("task-card-overdue"),this.options.isCompleted&&t.classList.add("task-card-completed"),this.options.isPostponed&&t.classList.add("task-card-postponed");const s=u(this.task.time),o=s?T(s):"",d=s?v(s,"dd/MM"):"";if(t.innerHTML="",this.options.showCheckbox){const c=this.renderCheckbox();t.appendChild(c)}const a=document.createElement("div");return a.className="task-card-content",a.innerHTML=`
        <div class="task-card-header">
          <div class="task-card-time">
            ${o?`<span class="task-card-time-value">${o}</span>`:""}
            ${d?`<span class="task-card-time-date">${d}</span>`:""}
          </div>
          ${this.options.showPriority?this.renderPriority():""}
        </div>
        <h3 class="task-card-title">${this.escapeHtml(this.task.titulo||this.task.nome||"Sem título")}</h3>
        ${this.task.descricao?`<p class="task-card-description">${this.escapeHtml(this.task.descricao)}</p>`:""}
        <div class="task-card-footer">
          ${this.options.showModule?this.renderModule():""}
          ${this.options.showDuration&&this.task.duracao?this.renderDuration():""}
          ${this.task.recurrence&&this.task.recurrence.enabled?this.renderRecurrenceBadge():""}
          ${this.options.isPostponed?this.renderPostponedBadge():""}
          ${this.options.isOverdue?this.renderOverdueBadge():""}
          ${this.options.showActions?this.renderActions():""}
        </div>
      `,t.appendChild(a),t}renderCheckbox(){H();const r={urgente:"urgent",alta:"high",media:"medium",média:"medium",baixa:"low"}[(this.task.prioridade||"media").toLowerCase()]||"medium",i=I({id:`task-checkbox-${this.task.id||this.task.contador}`,label:"Concluir tarefa",checked:this.task.completed||!1,priority:r,onChange:d=>{const a=new Event("change",{bubbles:!0}),c=i.querySelector("input");c&&c.dispatchEvent(a)}}),s=i.querySelector("input");s&&(s.className="task-checkbox ios-checkbox-input",s.setAttribute("data-task-id",this.task.id||this.task.contador));const o=document.createElement("div");return o.className="task-card-checkbox",o.appendChild(i),o}renderPriority(){const t=(this.task.prioridade||"media").toLowerCase(),r={urgente:"Urgente",alta:"Alta",media:"Média",baixa:"Baixa"};return`
      <span class="task-card-priority badge badge-${{urgente:"danger",alta:"warning",media:"secondary",baixa:"muted"}[t]||"secondary"}">
        ${r[t]||t}
      </span>
    `}renderModule(){const t=this.task.modulo||this.task.area||"Geral";return`<span class="task-card-module">${this.escapeHtml(t)}</span>`}renderDuration(){return`<span class="task-card-duration">⏱ ${this.task.duracao}</span>`}renderRecurrenceBadge(){const t=this.task.recurrence||{},i={daily:"Diária",weekly:"Semanal",monthly:"Mensal",custom:`A cada ${t.interval||1} dia${(t.interval||1)>1?"s":""}`}[t.type]||"Recorrente";return`
      <span class="task-card-recurrence-badge badge badge-info" title="Tarefa recorrente: ${i}">
        🔄 ${i}
      </span>
    `}renderPostponedBadge(){const t=u(this.task.time);if(!t)return"";const i=Math.round((t-new Date)/(1e3*60*60)),s=Math.floor(i/24);let o="";return s>0?o=`Adiada ${s} dia${s>1?"s":""}`:i>2?o=`Adiada ${i}h`:o="Adiada",`
      <span class="task-card-postponed-badge badge badge-warning" title="Tarefa adiada para ${v(t,"dd/MM/yyyy")} às ${T(t)}">
        ⏰ ${o}
      </span>
    `}renderOverdueBadge(){const t=u(this.task.time||this.task.deadline),r=M(t);return`
      <span class="task-card-overdue-badge badge badge-danger">
        ${r} ${r===1?"dia":"dias"} atrasado
      </span>
    `}renderActions(){const t=this.task.id||this.task.contador;return`
      <div class="task-card-actions">
        <button class="btn-icon-small" data-action="edit" data-task-id="${t}" title="Editar">✏️</button>
        <button class="btn-icon-small" data-action="delete" data-task-id="${t}" title="Excluir">🗑️</button>
      </div>
    `}escapeHtml(t){const r=document.createElement("div");return r.textContent=t,r.innerHTML}}const f={THRESHOLD:50,RESTRAINT:100,ALLOWED_TIME:500,ANIMATION_DURATION:300};function j(e,t={}){const{onSwipeLeft:r,onSwipeRight:i}=t;if(e.classList.contains("swipe-enabled"))return;let s=0,o=0,d=0,a=!1;const c=D("check","Concluir"),h=D("clock","Adiar 1 dia");e.appendChild(c),e.appendChild(h),e.classList.add("swipe-enabled"),e.style.position="relative",e.style.overflow="hidden",e.style.transition=`transform ${f.ANIMATION_DURATION}ms ease-out`,e.addEventListener("touchstart",m,{passive:!0}),e.addEventListener("touchmove",C,{passive:!1}),e.addEventListener("touchend",S,{passive:!0}),e.addEventListener("mousedown",y),e.addEventListener("mousemove",L),e.addEventListener("mouseup",k),e.addEventListener("mouseleave",k);function m(n){const l=n.touches[0];s=l.clientX,o=l.clientY,d=Date.now(),a=!0,e.style.transition="none"}function y(n){n.button===0&&(s=n.clientX,o=n.clientY,d=Date.now(),a=!0,e.style.transition="none",n.preventDefault())}function C(n){if(!a)return;const l=n.touches[0],p=l.clientX-s,b=l.clientY-o;Math.abs(p)>Math.abs(b)&&(n.preventDefault(),g(p))}function L(n){if(!a)return;const l=n.clientX-s,p=n.clientY-o;Math.abs(l)>Math.abs(p)&&g(l)}function S(n){if(!a)return;const l=n.changedTouches[0],p=l.clientX-s,b=l.clientY-o,$=Date.now()-d;x(p,b,$),w()}function k(n){if(!a)return;const l=n.clientX-s,p=n.clientY-o,b=Date.now()-d;x(l,p,b),w()}function g(n){const l=window.innerWidth*.3,p=Math.max(-l,Math.min(l,n));e.style.transform=`translateX(${p}px)`,p>f.THRESHOLD?(h.classList.add("active"),c.classList.remove("active"),e.style.backgroundColor="rgba(245, 158, 11, 0.1)"):p<-50?(c.classList.add("active"),h.classList.remove("active"),e.style.backgroundColor="rgba(16, 185, 129, 0.1)"):(c.classList.remove("active"),h.classList.remove("active"),e.style.backgroundColor="")}function x(n,l,p){p>f.ALLOWED_TIME||Math.abs(l)>f.RESTRAINT||Math.abs(n)<f.THRESHOLD||(n<-50&&r?r(e):n>f.THRESHOLD&&i&&i(e))}function w(){a=!1,e.style.transition=`transform ${f.ANIMATION_DURATION}ms ease-out`,e.style.transform="",e.style.backgroundColor="",c.classList.remove("active"),h.classList.remove("active")}N()}function D(e,t){const r=document.createElement("div");r.className=`swipe-action swipe-action-${e==="check"?"left":"right"}`;const i=e==="check"?"✓":"⏰";return r.innerHTML=`
        <span class="swipe-icon">${i}</span>
        <span class="swipe-label">${t}</span>
    `,r}function N(){const e="swipe-gestures-styles";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
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
    `,document.head.appendChild(t)}function U(e,t){return r=>{r.style.transform="translateX(-100%)",r.style.opacity="0",setTimeout(()=>{t&&t(e)},f.ANIMATION_DURATION)}}function W(e,t){return r=>{r.style.transform="translateX(100%)",r.style.opacity="0",setTimeout(()=>{t&&t(e,1),r.style.transform="",r.style.opacity="1"},f.ANIMATION_DURATION*2)}}export{_ as T,z as a,F as b,X as c,W as d,U as e,P as f,Y as g,B as h,R as i,j as s,u as t};
//# sourceMappingURL=swipe-gestures-CKoNtDs5.js.map
