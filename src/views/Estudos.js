/**
 * View Estudos - Sprint 2
 * Integra todos os componentes: Quick Add, Kanban, Pomodoro, Notas
 */

let estudosViewInstance = null;
let estudosStore = null;

export default function renderEstudos() {
    return {
        render: () => {
            // Retornar container vazio, será preenchido pelo mount
            return '<div id="estudosViewContainer"></div>';
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
                // Extrair classes dos módulos
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

                // Definir globalmente se necessário
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

                // Inicializar store e view
                const container = document.getElementById('estudosViewContainer');
                if (container) {
                    const EstudosStore = window.EstudosStore;
                    const EstudosView = window.EstudosView;

                    estudosStore = new EstudosStore();
                    estudosViewInstance = new EstudosView(container, estudosStore);

                    console.log('✅ Módulo de Estudos montado');
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