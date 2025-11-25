/**
 * Entry Point da Aplicação
 */

import {
    initRouter
} from './router.js';
import {
    Sidebar
} from './components/Sidebar.js';
import {
    createMenuHamburguer
} from './components/MenuHamburguer.js';
import {
    Breadcrumb
} from './components/Breadcrumb.js';

// Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Usar caminho relativo ao base path
        const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) 
            ? import.meta.env.BASE_URL 
            : './';
        const swPath = baseUrl + 'service-worker.js';
        navigator.serviceWorker.register(swPath)
            .then((registration) => {
                console.log('[SW] Registered:', registration.scope);
                
                // Verificar atualizações periodicamente
                setInterval(() => {
                    registration.update();
                }, 60000); // A cada 1 minuto
                
                // Escutar atualizações
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Nova versão disponível
                            if (confirm('Nova versão disponível! Atualizar agora?')) {
                                if (registration.waiting) {
                                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                                    window.location.reload();
                                }
                            }
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('[SW] Registration failed:', error);
            });
    }
}

// Indicador de modo offline
function setupOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.className = 'offline-indicator hidden';
    indicator.innerHTML = '📴 Sem conexão';
    document.body.appendChild(indicator);
    
    // CSS para o indicador
    const style = document.createElement('style');
    style.textContent = `
        .offline-indicator {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ef4444;
            color: white;
            text-align: center;
            padding: 12px;
            font-weight: 600;
            z-index: 9999;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        }
        
        .offline-indicator.show {
            transform: translateY(0);
        }
        
        .offline-indicator.hidden {
            display: none;
        }
    `;
    document.head.appendChild(style);
    
    // Escutar eventos online/offline
    window.addEventListener('online', () => {
        indicator.classList.remove('show');
        indicator.textContent = '✅ Conectado';
        setTimeout(() => indicator.classList.add('hidden'), 2000);
    });
    
    window.addEventListener('offline', () => {
        indicator.classList.add('show');
        indicator.classList.remove('hidden');
        indicator.textContent = '📴 Sem conexão';
    });
    
    // Verificar status inicial
    if (!navigator.onLine) {
        indicator.classList.add('show');
    }
}

// Inicializar aplicação
function init() {
    // Registrar service worker
    registerServiceWorker();
    
    // Configurar indicador offline
    setupOfflineIndicator();
    
    // Inicializar router
    const router = initRouter('app');

    // Inicializar sidebar
    const sidebar = new Sidebar();

    // Criar header com menu hamburguer
    createHeader(sidebar);

    // Atualizar breadcrumb e sidebar ao mudar rota
    function updateNavigation(path) {
        sidebar.updateActiveRoute(path);
        updateBreadcrumb(path);
    }

    function updateBreadcrumb(path) {
        const breadcrumbContainer = document.getElementById('breadcrumb-container');
        if (breadcrumbContainer) {
            const breadcrumb = Breadcrumb.fromRoute(path);
            breadcrumbContainer.innerHTML = '';
            breadcrumbContainer.appendChild(breadcrumb.render());
        }
    }

    // Escutar mudanças de rota
    router.onRouteChange(updateNavigation);

    // Inicializar breadcrumb
    updateBreadcrumb(router.getCurrentPath());
}

function createHeader(sidebar) {
    const header = document.createElement('header');
    header.className = 'app-header';
    header.innerHTML = `
    <div class="app-header-content">
      <button class="menu-hamburguer" id="menu-hamburguer" aria-label="Abrir menu">
        <span class="menu-hamburguer-line"></span>
        <span class="menu-hamburguer-line"></span>
        <span class="menu-hamburguer-line"></span>
      </button>
      <h1 class="app-header-title">🎯 Gerenciador Pedro</h1>
    </div>
    <nav id="breadcrumb-container" class="app-breadcrumb"></nav>
  `;

    document.body.insertBefore(header, document.body.firstChild);

    // Menu hamburguer handler
    const menuBtn = document.getElementById('menu-hamburguer');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.toggle();
        });
    }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}