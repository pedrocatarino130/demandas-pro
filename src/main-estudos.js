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

// Importar estilos
import './styles/variables.css';
import './styles/estudos.css';

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
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
