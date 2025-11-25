/**
 * TASK-021: Service Worker Offline-First
 * 
 * Descrição: Implementar cache strategy para funcionamento offline
 * Estimativa: M (8h)
 * Dependências: TASK-001 (Setup Ambiente)
 * 
 * Critérios de Aceitação:
 * - Cache de assets estáticos
 * - localStorage como fallback
 * - Background sync quando voltar online
 * - Indicador visual de modo offline
 * - Update prompt quando nova versão
 */

const CACHE_NAME = 'gerenciador-pedro-v3.0';
const CACHE_VERSION = '1.0.0';
const OFFLINE_PAGE = '/offline.html';

// Assets para cache na instalação
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/app.js',
    '/manifest.json',
    '/offline.html'
];

/**
 * Instala o Service Worker e faz cache dos assets estáticos
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    
    event.waitUntil(
        caches.open(`${CACHE_NAME}-${CACHE_VERSION}`)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting()) // Ativar imediatamente
            .catch((error) => {
                console.error('[SW] Cache failed:', error);
            })
    );
});

/**
 * Ativa o Service Worker e limpa caches antigos
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName.startsWith(CACHE_NAME) && 
                                   cacheName !== `${CACHE_NAME}-${CACHE_VERSION}`;
                        })
                        .map((cacheName) => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => self.clients.claim()) // Controlar todas as páginas
    );
});

/**
 * Estratégia de cache: Cache First para assets estáticos
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorar requisições não-GET e cross-origin
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }
    
    // Estratégia Cache First para assets estáticos
    if (isStaticAsset(request.url)) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Estratégia Network First para páginas HTML
    if (request.headers.get('accept').includes('text/html')) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Estratégia Network First para APIs
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirstWithFallback(request));
        return;
    }
});

/**
 * Verifica se é um asset estático
 */
function isStaticAsset(url) {
    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2'];
    return staticExtensions.some(ext => url.includes(ext));
}

/**
 * Estratégia Cache First: busca no cache primeiro, depois na rede
 */
async function cacheFirst(request) {
    const cache = await caches.open(`${CACHE_NAME}-${CACHE_VERSION}`);
    const cached = await cache.match(request);
    
    if (cached) {
        return cached;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        // Cache apenas se resposta válida
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[SW] Network failed:', error);
        // Retornar página offline se for HTML
        if (request.headers.get('accept').includes('text/html')) {
            return cache.match(OFFLINE_PAGE);
        }
        throw error;
    }
}

/**
 * Estratégia Network First: busca na rede primeiro, fallback para cache
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Atualizar cache se resposta válida
        if (networkResponse.ok) {
            const cache = await caches.open(`${CACHE_NAME}-${CACHE_VERSION}`);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache...');
        const cache = await caches.open(`${CACHE_NAME}-${CACHE_VERSION}`);
        const cached = await cache.match(request);
        
        if (cached) {
            return cached;
        }
        
        // Retornar página offline
        return cache.match(OFFLINE_PAGE) || new Response('Offline', { status: 503 });
    }
}

/**
 * Network First com fallback para localStorage
 */
async function networkFirstWithFallback(request) {
    try {
        const networkResponse = await fetch(request);
        return networkResponse;
    } catch (error) {
        console.log('[SW] API offline, checking localStorage...');
        
        // Tentar recuperar do IndexedDB ou localStorage
        // TODO: Implementar fallback baseado na estrutura de dados
        return new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * Background Sync para sincronizar quando voltar online
 */
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

/**
 * Sincroniza dados pendentes quando voltar online
 */
async function syncData() {
    try {
        // Recuperar dados pendentes do IndexedDB
        // TODO: Implementar sincronização com backend
        
        console.log('[SW] Syncing data...');
        
        // Exemplo: enviar dados pendentes salvos localmente
        // const pendingData = await getPendingData();
        // await sendToServer(pendingData);
        
    } catch (error) {
        console.error('[SW] Sync failed:', error);
    }
}

/**
 * Notifica sobre atualização disponível
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CHECK_UPDATE') {
        checkForUpdate();
    }
});

/**
 * Verifica se há nova versão disponível
 */
async function checkForUpdate() {
    try {
        const cache = await caches.open(`${CACHE_NAME}-${CACHE_VERSION}`);
        const response = await fetch('/manifest.json', { cache: 'no-store' });
        const manifest = await response.json();
        
        if (manifest.version !== CACHE_VERSION) {
            // Notificar cliente sobre atualização
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'UPDATE_AVAILABLE',
                    version: manifest.version
                });
            });
        }
    } catch (error) {
        console.error('[SW] Update check failed:', error);
    }
}

/**
 * Registra o Service Worker
 */
export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
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
                            showUpdatePrompt();
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('[SW] Registration failed:', error);
            });
    }
}

/**
 * Mostra prompt de atualização
 */
function showUpdatePrompt() {
    // TODO: Implementar UI de atualização
    if (confirm('Nova versão disponível! Atualizar agora?')) {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        });
    }
}

/**
 * Indicador visual de modo offline
 */
export function setupOfflineIndicator() {
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

