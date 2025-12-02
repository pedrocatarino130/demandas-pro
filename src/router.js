/**
 * Sistema de Roteamento SPA
 * Router vanilla JS com lazy loading e histórico do browser
 */

import {
    buildHistoryPath,
    stripBasePath
} from './utils/base-path.js';

class Router {
    constructor(routes, containerId = 'app') {
        this.routes = routes;
        this.container = document.getElementById(containerId);
        this.currentView = null;
        this.currentPath = this.normalizePath(window.location.pathname);
        this.subscribers = [];
        this.init();
    }

    /**
     * Normaliza o path removendo o base path
     */
    normalizePath(path) {
        return stripBasePath(path || '/') || '/';
    }

    /**
     * Inicializa o router
     */
    init() {
        // Escutar mudanças no histórico do browser
        window.addEventListener('popstate', (e) => {
            const path = this.normalizePath(window.location.pathname);
            this.handleRoute(path, false);
            this.notifySubscribers(path);
        });

        // Escutar cliques em links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-route]');
            if (link) {
                e.preventDefault();
                const path = link.getAttribute('data-route') || link.getAttribute('href');
                this.navigate(path);
            }
        });

        // Rota inicial
        this.handleRoute(this.currentPath || '/', false);
    }

    /**
     * Navega para uma rota
     */
    navigate(path, pushState = true) {
        // Normalizar path para navegação interna
        const normalizedPath = this.normalizePath(path);
        // Para pushState, usar o path completo com base path
        const fullPath = buildHistoryPath(normalizedPath);
        
        if (pushState) {
            window.history.pushState({}, '', fullPath);
        }
        this.handleRoute(normalizedPath, pushState);
        // Notificar subscribers
        this.notifySubscribers(normalizedPath);
    }

    /**
     * Notifica subscribers sobre mudança de rota
     */
    notifySubscribers(path) {
        if (this.subscribers) {
            this.subscribers.forEach((callback) => {
                try {
                    callback(path);
                } catch (error) {
                    console.error('Erro ao notificar subscriber:', error);
                }
            });
        }
    }

    /**
     * Inscreve callback para mudanças de rota
     */
    onRouteChange(callback) {
        if (!this.subscribers) {
            this.subscribers = [];
        }
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter((cb) => cb !== callback);
        };
    }

    /**
     * Processa a rota atual
     */
    async handleRoute(path, pushState = true) {
        // Normalizar path (já deveria estar normalizado, mas garantir)
        path = this.normalizePath(path);
        path = path === '' ? '/' : path;

        // Encontrar rota correspondente
        const route = this.findRoute(path);

        if (!route) {
            console.warn(`Rota não encontrada: ${path}`);
            // Se o path normalizado for vazio ou apenas '/', tentar a rota raiz
            if (path === '/' || path === '') {
                path = '/';
                const rootRoute = this.findRoute('/');
                if (rootRoute) {
                    route = rootRoute;
                } else {
                    console.error('Rota raiz não encontrada');
                    return;
                }
            } else {
                this.navigate('/', false);
                return;
            }
        }

        this.currentPath = path;

        try {
            // Lazy load do componente
            let componentModule;
            try {
                componentModule = await route.component();
            } catch (importError) {
                console.error(`Erro ao importar módulo da rota ${path}:`, importError);
                // Tentar recarregar a página se for erro de módulo não encontrado
                if (importError.message && importError.message.includes('Failed to fetch')) {
                    console.warn('Tentando recarregar devido a erro de fetch...');
                    // Não recarregar automaticamente, apenas mostrar erro
                    this.render(`
                        <div style="padding: 2rem; text-align: center;">
                            <h2>Erro ao carregar página</h2>
                            <p>Não foi possível carregar a página ${path}.</p>
                            <p style="color: #666; font-size: 0.9em;">Erro: ${importError.message}</p>
                            <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; cursor: pointer;">
                                Recarregar página
                            </button>
                        </div>
                    `);
                    return;
                }
                throw importError;
            }
            
            const component = componentModule.default || componentModule;

            if (!component) {
                throw new Error(`Componente não encontrado na rota ${path}`);
            }

            // Limpar view anterior
            if (this.currentView && this.currentView.destroy) {
                try {
                    this.currentView.destroy();
                } catch (destroyError) {
                    console.warn('Erro ao destruir view anterior:', destroyError);
                }
            }

            // Renderizar nova view
            let viewInstance = null;
            if (typeof component === 'function') {
                const result = component();
                if (result && typeof result.render === 'function') {
                    this.render(result.render());
                    if (result.mount) {
                        try {
                            viewInstance = result.mount();
                        } catch (mountError) {
                            console.error(`Erro ao montar view ${path}:`, mountError);
                        }
                    }
                } else {
                    this.render(result);
                }
            } else if (component && typeof component.render === 'function') {
                this.render(component.render());
                if (component.mount) {
                    try {
                        viewInstance = component.mount();
                    } catch (mountError) {
                        console.error(`Erro ao montar view ${path}:`, mountError);
                    }
                }
            } else {
                this.render(component);
            }

            this.currentView = viewInstance || component;

            // Atualizar estado ativo nos links
            this.updateActiveLinks(path);
        } catch (error) {
            console.error(`Erro ao carregar rota ${path}:`, error);
            // Renderizar mensagem de erro amigável
            this.render(`
                <div style="padding: 2rem; text-align: center;">
                    <h2>Erro ao carregar página</h2>
                    <p>Ocorreu um erro ao carregar a página ${path}.</p>
                    <p style="color: #666; font-size: 0.9em;">${error.message || 'Erro desconhecido'}</p>
                    <button onclick="window.location.href='${buildHistoryPath('/')}'" style="margin-top: 1rem; padding: 0.5rem 1rem; cursor: pointer;">
                        Voltar para Home
                    </button>
                </div>
            `);
        }
    }

    /**
     * Encontra rota correspondente ao path
     */
    findRoute(path) {
        // Busca exata primeiro
        if (this.routes[path]) {
            return {
                path,
                component: this.routes[path]
            };
        }

        // Busca por padrão (ex: /projetos/:id)
        for (const [routePath, component] of Object.entries(this.routes)) {
            const pattern = this.pathToRegex(routePath);
            if (pattern.test(path)) {
                return {
                    path: routePath,
                    component,
                    params: this.extractParams(routePath, path)
                };
            }
        }

        return null;
    }

    /**
     * Converte path pattern em regex
     */
    pathToRegex(path) {
        const pattern = path
            .replace(/\//g, '\\/')
            .replace(/:(\w+)/g, '([^/]+)');
        return new RegExp(`^${pattern}$`);
    }

    /**
     * Extrai parâmetros da URL
     */
    extractParams(routePath, actualPath) {
        const params = {};
        const routeParts = routePath.split('/');
        const actualParts = actualPath.split('/');

        routeParts.forEach((part, index) => {
            if (part.startsWith(':')) {
                const key = part.slice(1);
                params[key] = actualParts[index];
            }
        });

        return params;
    }

    /**
     * Renderiza componente no container
     */
    render(html) {
        if (!this.container) {
            console.error('Container não encontrado');
            return;
        }

        if (typeof html === 'string') {
            this.container.innerHTML = html;
        } else if (html && typeof html === 'object') {
            // Se for um elemento DOM
            if (html.nodeType) {
                this.container.innerHTML = '';
                this.container.appendChild(html);
            }
        }
    }

    /**
     * Atualiza links ativos
     */
    updateActiveLinks(path) {
        document.querySelectorAll('[data-route], a[href]').forEach((link) => {
            const linkPath = link.getAttribute('data-route') || link.getAttribute('href');
            if (linkPath === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Retorna path atual
     */
    getCurrentPath() {
        return this.currentPath;
    }
}

// Rotas da aplicação
export const routes = {
    '/': () => import('./views/Home.js').then((m) => m.default),
    '/projetos': () => import('./views/Projetos.js').then((m) => m.default),
    '/estudos': () => import('./views/Estudos.js').then((m) => m.default),
    '/rotina': () => import('./views/Rotina.js').then((m) => m.default),
    '/terapeutico': () => import('./views/Terapeutico.js').then((m) => m.default),
};

// Exportar instância do router
export let router = null;

/**
 * Inicializa o router
 */
export function initRouter(containerId = 'app') {
    router = new Router(routes, containerId);
    return router;
}