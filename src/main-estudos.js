/**
 * Main entry point para módulo de Estudos
 * 
 * Inicializa EstudosView e integra com o sistema existente
 */

// Importar componentes
import './components/estudos/QuickAddParser.js';
import './components/estudos/QuickAddInput.js';
import './components/estudos/KanbanEstudos.js';
import './components/estudos/RevisaoEspacada.js';
import './components/estudos/PomodoroTimer.js';
import './components/estudos/NotasRapidas.js';
import './utils/estudos-store.js';
import './views/EstudosView.js';

// Evita erros "play() request was interrupted by pause()"
function suppressMediaAbortError() {
    if (typeof window === 'undefined' || !window.HTMLMediaElement) return;
    const originalPlay = window.HTMLMediaElement.prototype.play;
    if (!originalPlay || originalPlay.__wrapped) return;

    window.HTMLMediaElement.prototype.play = function (...args) {
        const playPromise = originalPlay.apply(this, args);
        if (playPromise && typeof playPromise.catch === 'function') {
            return playPromise.catch((error) => {
                if (error && error.name === 'AbortError') {
                    return;
                }
                throw error;
            });
        }
        return playPromise;
    };
    window.HTMLMediaElement.prototype.play.__wrapped = true;
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    suppressMediaAbortError();
    // Verificar se já existe container de estudos
    let container = document.getElementById('estudosView');

    if (!container) {
        // Criar container se não existir
        container = document.createElement('div');
        container.id = 'estudosView';
        document.body.appendChild(container);
    }

    // Inicializar store
    const store = new EstudosStore();

    // Inicializar view
    const estudosView = new EstudosView(container, store);

    // Expor globalmente para debug
    window.estudosView = estudosView;
    window.estudosStore = store;

    console.log('✅ Módulo de Estudos inicializado');
});

// Export para uso em outros módulos
export {
    EstudosStore,
    EstudosView
};
