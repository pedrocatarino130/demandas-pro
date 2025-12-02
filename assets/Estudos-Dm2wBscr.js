const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/QuickAddInput-BurKaWOC.js","assets/index-7ypPvpma.js","assets/idb-Dob3nYDb.js","assets/index-D2l0mzX7.css","assets/NotasRapidas-BeqteVDg.js","assets/estudos-store-Dha1Sg9-.js","assets/EstudosView-DosPlo-2.js"])))=>i.map(i=>d[i]);
import{_ as o}from"./index-7ypPvpma.js";import{c as h}from"./NeonButton-DWD2bhQA.js";import"./idb-Dob3nYDb.js";let t=null,r=null;function y(){return{render:()=>`
                <div class="home-view home-view-redesign estudos-view-redesign">
                    <div class="home-top-cards">
                        <section class="home-welcome-card">
                            <h2 class="home-welcome-title">Estudos</h2>
                            <p class="home-welcome-message">
                                Seu painel completo: revisão, kanban, pomodoro e notas.
                            </p>
                        </section>
                        <section class="home-productivity-card">
                            <div class="home-productivity-value">Focus</div>
                            <div class="home-productivity-label">Modo</div>
                            <div class="home-productivity-bar">
                                <div class="home-productivity-bar-fill" style="width: 100%"></div>
                            </div>
                        </section>
                    </div>
                    <div class="home-section-header estudos-header">
                        <h3 class="home-section-title">Workspace de estudos</h3>
                        <div class="home-search" id="estudos-cta"></div>
                    </div>
                    <div class="estudos-modules" id="estudosViewContainer"></div>
                </div>
            `,mount:()=>Promise.all([o(()=>import("./QuickAddParser-RLhah0gW.js"),[]),o(()=>import("./QuickAddInput-BurKaWOC.js"),__vite__mapDeps([0,1,2,3])),o(()=>import("./KanbanEstudos-D1Z0gETV.js"),[]),o(()=>import("./RevisaoEspacada-C7WDZCEW.js"),[]),o(()=>import("./PomodoroTimer-CWgRpmEF.js"),[]),o(()=>import("./NotasRapidas-BeqteVDg.js"),__vite__mapDeps([4,1,2,3])),o(()=>import("./estudos-store-Dha1Sg9-.js"),__vite__mapDeps([5,1,2,3])),o(()=>import("./EstudosView-DosPlo-2.js"),__vite__mapDeps([6,1,2,3]))]).then(d=>{const[e,a,n,u,c,l,m,v]=d;typeof window<"u"&&(window.QuickAddParser=e.QuickAddParser||e.default,window.QuickAddInput=a.QuickAddInput||a.default,window.KanbanEstudos=n.KanbanEstudos||n.default,window.RevisaoEspacada=u.RevisaoEspacada||u.default,window.PomodoroTimer=c.PomodoroTimer||c.default,window.NotasRapidas=l.NotasRapidas||l.default,window.EstudosStore=m.EstudosStore||m.default,window.EstudosView=v.EstudosView||v.default);const E=document.getElementById("estudosViewContainer");if(E){const _=window.EstudosStore,p=window.EstudosView;r=new _,t=new p(E,r);const s=document.getElementById("estudos-cta");if(s){s.innerHTML="";const w=h({text:"Nova nota / estudo",variant:"primary",onClick:()=>{const i=document.getElementById("quickAddInput");i&&(i.focus(),i.scrollIntoView({behavior:"smooth",block:"center"}))}});s.appendChild(w)}console.log("✓ Módulo de Estudos montado")}return{destroy:()=>{t&&t.destroy&&t.destroy(),t=null,r=null}}}).catch(d=>{console.error("Erro ao carregar módulo de Estudos:",d);const e=document.getElementById("estudosViewContainer");e&&(e.innerHTML=`
            <div class="view-container">
              <h1>📚 Estudos</h1>
              <p style="color: var(--color-danger, #FF3B30);">
                Erro ao carregar módulo de Estudos. Verifique o console para mais detalhes.
              </p>
            </div>
          `)})}}export{y as default};
//# sourceMappingURL=Estudos-Dm2wBscr.js.map
