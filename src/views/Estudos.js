import { createNeonButton } from '../components/NeonButton.js';

/**
 * View Estudos - Sprint 2 (Redesign wrapper)
 * Mantém o módulo completo, mas com o container no layout cyberpunk.
 */

let estudosViewInstance = null;
let estudosStore = null;

export default function renderEstudos() {
    return {
        render: () => {
            return `
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
            `;
        },
        mount: () => {
            // Carregar componentes dinamicamente
            return Promise.all([
                import('../components/estudos/QuickAddParser.js'),
                import('../components/estudos/QuickAddInput.js'),
                import('../components/estudos/KanbanEstudos.js'),
                import('../components/estudos/RevisaoEspacada.js'),
                import('../components/estudos/PomodoroTimer.js'),
                import('../components/estudos/NotasRapidas.js'),
                import('../utils/estudos-store.js'),
                import('./EstudosView.js')
            ]).then((modules) => {
                const [
                    QuickAddParserModule,
                    QuickAddInputModule,
                    KanbanEstudosModule,
                    RevisaoEspacadaModule,
                    PomodoroTimerModule,
                    NotasRapidasModule,
                    EstudosStoreModule,
                    EstudosViewModule
                ] = modules;

                if (typeof window !== 'undefined') {
                    window.QuickAddParser = QuickAddParserModule.QuickAddParser || QuickAddParserModule.default;
                    window.QuickAddInput = QuickAddInputModule.QuickAddInput || QuickAddInputModule.default;
                    window.KanbanEstudos = KanbanEstudosModule.KanbanEstudos || KanbanEstudosModule.default;
                    window.RevisaoEspacada = RevisaoEspacadaModule.RevisaoEspacada || RevisaoEspacadaModule.default;
                    window.PomodoroTimer = PomodoroTimerModule.PomodoroTimer || PomodoroTimerModule.default;
                    window.NotasRapidas = NotasRapidasModule.NotasRapidas || NotasRapidasModule.default;
                    window.EstudosStore = EstudosStoreModule.EstudosStore || EstudosStoreModule.default;
                    window.EstudosView = EstudosViewModule.EstudosView || EstudosViewModule.default;
                }

                const container = document.getElementById('estudosViewContainer');
                if (container) {
                    const EstudosStore = window.EstudosStore;
                    const EstudosView = window.EstudosView;

                    estudosStore = new EstudosStore();
                    estudosViewInstance = new EstudosView(container, estudosStore);

                    // CTA para focar no QuickAdd
                    const cta = document.getElementById('estudos-cta');
                    if (cta) {
                        cta.innerHTML = '';
                        const button = createNeonButton({
                            text: 'Nova nota / estudo',
                            variant: 'primary',
                            onClick: () => {
                                const input = document.getElementById('quickAddInput');
                                if (input) {
                                    input.focus();
                                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                            }
                        });
                        cta.appendChild(button);
                    }

                    console.log('✓ Módulo de Estudos montado');
                }

                return {
                    destroy: () => {
                        if (estudosViewInstance && estudosViewInstance.destroy) {
                            estudosViewInstance.destroy();
                        }
                        estudosViewInstance = null;
                        estudosStore = null;
                    }
                };
            }).catch((error) => {
                console.error('Erro ao carregar módulo de Estudos:', error);
                const container = document.getElementById('estudosViewContainer');
                if (container) {
                    container.innerHTML = `
            <div class="view-container">
              <h1>📚 Estudos</h1>
              <p style="color: var(--color-danger, #FF3B30);">
                Erro ao carregar módulo de Estudos. Verifique o console para mais detalhes.
              </p>
            </div>
          `;
                }
            });
        },
    };
}
