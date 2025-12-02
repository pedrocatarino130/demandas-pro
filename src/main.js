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
import {
    firebaseSyncNotifications
} from './services/firebase-sync-notifications.js';
import {
    SyncStatusWidget
} from './components/SyncStatusWidget.js';
import {
    buildAssetPath,
    consumePendingRoute,
    rememberBasePath
} from './utils/base-path.js';
import './utils/firebase-diagnostics.js'; // Diagnóstico automático em desenvolvimento
import './utils/firebase-check-env.js'; // Verificação de variáveis de ambiente

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
                    // Ignorar AbortError causado por pausa imediata ou troca de rota
                    return;
                }
                throw error;
            });
        }
        return playPromise;
    };
    window.HTMLMediaElement.prototype.play.__wrapped = true;
}

// Service Worker
function registerServiceWorker() {
    // Desabilitar Service Worker em desenvolvimento (Vite precisa processar arquivos diretamente)
    // O Vite sempre roda em localhost em desenvolvimento
    const isDev =
        import.meta.env.DEV ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';
    const enableDevSW = typeof window !== 'undefined' && window.__ENABLE_SW_IN_DEV__ === true;

    if (isDev && !enableDevSW) {
        // Desregistrar Service Workers existentes em dev
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => {
                    registration.unregister().then(() => {
                        console.log('[SW] Service Worker desabilitado em desenvolvimento');
                    });
                });
            });
        }
        updateSwDiagnostics('disabled-dev');
        return;
    }

    if ('serviceWorker' in navigator) {
        const swPath = buildAssetPath('service-worker.js');
        const swScope = buildAssetPath('');
        const registerOptions = {};

        if (swScope && swScope.startsWith('/')) {
            registerOptions.scope = swScope;
        }

        navigator.serviceWorker.register(swPath, registerOptions)
            .then((registration) => {
                console.log('[SW] Registered:', registration.scope);
                updateSwDiagnostics('registered', registration.scope);

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
                                    registration.waiting.postMessage({
                                        type: 'SKIP_WAITING'
                                    });
                                    window.location.reload();
                                }
                            }
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('[SW] Registration failed:', error);
                updateSwDiagnostics('error', error?.message || 'unknown-error');
            });
    }
}

function updateSwDiagnostics(status, detail) {
    if (typeof window === 'undefined') {
        return;
    }
    window.__SW_STATUS__ = status;
    if (detail) {
        window.__SW_SCOPE__ = detail;
    }

    try {
        window.dispatchEvent(new CustomEvent('sw:status', {
            detail: {
                status,
                scope: detail
            }
        }));
    } catch (error) {
        // Ignorar navegadores que não suportam CustomEvent no contexto atual
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
    suppressMediaAbortError();
    rememberBasePath();
    restorePendingRoute();

    // Registrar service worker
    registerServiceWorker();

    // Configurar indicador offline
    setupOfflineIndicator();

    // Inicializar notificações de sincronização Firebase
    firebaseSyncNotifications.start();

    // Mostrar widget persistente de status de sincronização
    const syncStatusWidget = new SyncStatusWidget();
    syncStatusWidget.mount();

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

function restorePendingRoute() {
    const pendingPath = consumePendingRoute();
    if (!pendingPath) {
        return;
    }

    try {
        window.history.replaceState({}, '', pendingPath);
    } catch (error) {
        console.warn('[SPA] Falha ao restaurar rota após fallback 404:', error);
    }
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
