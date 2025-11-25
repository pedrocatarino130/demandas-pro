/**
 * Sistema de Roteamento SPA
 * Router vanilla JS com lazy loading e histórico do browser
 */

class Router {
    constructor(routes, containerId = 'app') {
        this.routes = routes;
        this.container = document.getElementById(containerId);
        this.currentView = null;
        this.currentPath = window.location.pathname;
        this.subscribers = [];
        this.init();
    }

    /**
     * Inicializa o router
     */
    init() {
        // Escutar mudanças no histórico do browser
        window.addEventListener('popstate', (e) => {
            const path = window.location.pathname;
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
        if (pushState) {
            window.history.pushState({}, '', path);
        }
        this.handleRoute(path, pushState);
        // Notificar subscribers
        this.notifySubscribers(path);
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
        // Normalizar path
        path = path === '' ? '/' : path;

        // Encontrar rota correspondente
        const route = this.findRoute(path);

        if (!route) {
            console.warn(`Rota não encontrada: ${path}`);
            this.navigate('/', false);
            return;
        }

        this.currentPath = path;

        try {
            // Lazy load do componente
            const componentModule = await route.component();
            const component = componentModule.default || componentModule;

            // Limpar view anterior
            if (this.currentView && this.currentView.destroy) {
                this.currentView.destroy();
            }

            // Renderizar nova view
            let viewInstance = null;
            if (typeof component === 'function') {
                const result = component();
                if (result && typeof result.render === 'function') {
                    this.render(result.render());
                    if (result.mount) {
                        viewInstance = result.mount();
                    }
                } else {
                    this.render(result);
                }
            } else if (component && typeof component.render === 'function') {
                this.render(component.render());
                if (component.mount) {
                    viewInstance = component.mount();
                }
            } else {
                this.render(component);
            }

            this.currentView = viewInstance || component;

            // Atualizar estado ativo nos links
            this.updateActiveLinks(path);
        } catch (error) {
            console.error(`Erro ao carregar rota ${path}:`, error);
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