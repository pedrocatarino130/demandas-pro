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
const CACHE_VERSION = '1.1.0';
const ACTIVE_CACHE = `${CACHE_NAME}-${CACHE_VERSION}`;

const BASE_PATH = resolveBasePath();

// Assets para cache na instalação
const STATIC_ASSETS = [
    BASE_PATH === '/' ? '/' : BASE_PATH,
    withBase('index.html'),
    withBase('manifest.json')
];

function ensureTrailingSlash(path) {
    if (!path) {
        return '/';
    }
    if (!path.startsWith('/')) {
        path = `/${path}`;
    }
    return path.endsWith('/') ? path : `${path}/`;
}

function resolveBasePath() {
    try {
        if (self.registration && self.registration.scope) {
            const scopeUrl = new URL(self.registration.scope);
            return ensureTrailingSlash(scopeUrl.pathname);
        }
    } catch (error) {
        // Ignorar
    }

    const swPath = self.location && self.location.pathname ? self.location.pathname : '/';
    if (swPath.endsWith('/service-worker.js')) {
        return ensureTrailingSlash(swPath.replace(/service-worker\.js$/, ''));
    }
    return ensureTrailingSlash(swPath);
}

function withBase(path = '') {
    if (!path) {
        return BASE_PATH;
    }

    if (path.startsWith('http')) {
        return path;
    }

    if (path.startsWith('/')) {
        return BASE_PATH === '/' ? path : `${BASE_PATH}${path.slice(1)}`;
    }

    return BASE_PATH === '/' ? `/${path}` : `${BASE_PATH}${path}`;
}

/**
 * Instala o Service Worker e faz cache dos assets estáticos
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');

    event.waitUntil(
        caches.open(ACTIVE_CACHE)
        .then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS).catch(err => {
                console.warn('[SW] Some assets failed to cache:', err);
            });
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
                        cacheName !== ACTIVE_CACHE;
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
    const {
        request
    } = event;
    const url = new URL(request.url);

    // Ignorar requisições não-GET e cross-origin
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    if (BASE_PATH !== '/' && !url.pathname.startsWith(BASE_PATH)) {
        return;
    }

    // IMPORTANTE: Ignorar requisições do Vite dev server e arquivos fonte
    // Esses arquivos são processados pelo Vite e não podem ser acessados diretamente
    if (url.pathname.startsWith('/src/') ||
        url.pathname.startsWith('/@') ||
        url.pathname.startsWith('/node_modules/') ||
        url.pathname.includes('/__vite') ||
        url.pathname === '/client' ||
        url.pathname.includes('websocket') ||
        url.pathname.includes('hmr') ||
        (url.hostname === 'localhost' && url.pathname.includes('.css') && url.pathname.includes('/src/'))) {
        // Não interceptar - deixar passar direto para o Vite processar
        return;
    }

    // Para módulos ES6 e assets compilados, usar Network First para garantir atualizações
    // Isso é importante para GitHub Pages onde os arquivos podem mudar
    if (url.pathname.startsWith('/assets/') || url.pathname.includes('/assets/')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Estratégia Cache First para assets estáticos (ícones, imagens, etc)
    if (isStaticAsset(request.url)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Estratégia Network First para páginas HTML
    if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
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
    // Não processar arquivos fonte do Vite
    if (url.includes('/src/') ||
        url.includes('/@') ||
        url.includes('/node_modules/') ||
        url.includes('/__vite')) {
        return false;
    }

    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2'];
    return staticExtensions.some(ext => url.includes(ext));
}

/**
 * Estratégia Cache First: busca no cache primeiro, depois na rede
 */
async function cacheFirst(request) {
    try {
        const cache = await caches.open(ACTIVE_CACHE);
        const cached = await cache.match(request);

        if (cached) {
            return cached;
        }

        try {
            const networkResponse = await fetch(request);

            // Cache apenas se resposta válida
            if (networkResponse && networkResponse.ok) {
                cache.put(request, networkResponse.clone()).catch(err => {
                    // Ignorar erros de cache silenciosamente
                });
            }

            return networkResponse;
        } catch (networkError) {
            // Se falhou na rede e não tem no cache, lançar erro
            // Mas não logar para não poluir o console em dev
            throw networkError;
        }
    } catch (error) {
        // Em caso de erro, apenas relançar sem logar (evitar spam no console)
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
            const cache = await caches.open(ACTIVE_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache...');
        const cache = await caches.open(ACTIVE_CACHE);
        const cached = await cache.match(request);

        if (cached) {
            return cached;
        }

        // Retornar página offline
        const offlinePagePath = withBase('index.html');
        const offlinePage = await cache.match(offlinePagePath);
        return offlinePage || new Response('Offline', {
            status: 503
        });
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

        // Fallback: Tentar recuperar dados do localStorage baseado no endpoint
        try {
            const url = new URL(request.url);
            const endpoint = url.pathname;

            // Mapear endpoints para chaves do localStorage
            const endpointMap = {
                '/api/tarefas': 'gerenciador_v3_state',
                '/api/tarefas-rotina': 'gerenciador_v3_state',
                '/api/estudos': 'estudos_v3',
                '/api/estado': 'gerenciador_v3_state'
            };

            // Encontrar chave correspondente
            let storageKey = null;
            for (const [pattern, key] of Object.entries(endpointMap)) {
                if (endpoint.includes(pattern.replace('/api/', ''))) {
                    storageKey = key;
                    break;
                }
            }

            // Se não encontrou mapeamento específico, tentar chave padrão
            if (!storageKey) {
                storageKey = 'gerenciador_v3_state';
            }

            // Recuperar dados do localStorage
            // Nota: Service Worker não tem acesso direto ao localStorage, 
            // mas pode usar IndexedDB ou receber dados via postMessage
            // Por enquanto, retornamos indicador de offline com sugestão
            return new Response(JSON.stringify({
                error: 'Offline',
                message: 'Dados disponíveis localmente. A aplicação funcionará offline.',
                offline: true,
                storageKey: storageKey
            }), {
                status: 503,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (fallbackError) {
            console.error('[SW] Fallback failed:', fallbackError);
            return new Response(JSON.stringify({
                error: 'Offline',
                offline: true
            }), {
                status: 503,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
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
        console.log('[SW] Syncing data...');

        // Notificar clientes para sincronizar dados
        const clients = await self.clients.matchAll({
            includeUncontrolled: true
        });

        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_REQUEST',
                message: 'Sincronizando dados com servidor...'
            });
        });

        // Se houver backend no futuro, implementar aqui:
        // 
        // 1. Recuperar dados pendentes do IndexedDB/localStorage
        // const pendingData = await getPendingDataFromStorage();
        // 
        // 2. Enviar para servidor
        // for (const data of pendingData) {
        //     try {
        //         await fetch('/api/sync', {
        //             method: 'POST',
        //             headers: { 'Content-Type': 'application/json' },
        //             body: JSON.stringify(data)
        //         });
        //         // Marcar como sincronizado
        //         await markAsSynced(data.id);
        //     } catch (error) {
        //         console.error('[SW] Failed to sync item:', error);
        //     }
        // }
        //
        // 3. Notificar sucesso
        // clients.forEach(client => {
        //     client.postMessage({
        //         type: 'SYNC_COMPLETE',
        //         synced: pendingData.length
        //     });
        // });

        console.log('[SW] Sync request sent to clients');

    } catch (error) {
        console.error('[SW] Sync failed:', error);

        // Notificar erro aos clientes
        const clients = await self.clients.matchAll({
            includeUncontrolled: true
        });
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_ERROR',
                error: error.message
            });
        });
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
        const manifestPath = withBase('manifest.json');
        const response = await fetch(manifestPath, {
            cache: 'no-store'
        });
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