/**
 * Sistema de Roteamento SPA
 * Router vanilla JS com lazy loading e histórico do browser
 */

class Router {
    constructor(routes, containerId = 'app') {
        this.routes = routes;
        this.container = document.getElementById(containerId);
        this.currentView = null;
        // Normalizar path removendo base path (ex: /demandas-pro/)
        this.basePath = this.detectBasePath();
        this.currentPath = this.normalizePath(window.location.pathname);
        this.subscribers = [];
        this.init();
    }

    /**
     * Detecta o base path do projeto (ex: /demandas-pro/)
     */
    detectBasePath() {
        // Primeiro, tentar usar import.meta.env.BASE_URL (definido pelo Vite)
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) {
            const base = import.meta.env.BASE_URL;
            // Garantir que termina com /
            return base.endsWith('/') ? base : base + '/';
        }
        
        // Caso contrário, detectar pelo caminho atual
        const path = window.location.pathname;
        
        // Verificar se está em um subdiretório conhecido (ex: /demandas-pro/)
        if (path.startsWith('/demandas-pro/')) {
            return '/demandas-pro/';
        }
        
        // Se o path tem mais de um segmento e não é uma rota conhecida, pode ser base path
        const segments = path.split('/').filter(p => p);
        if (segments.length > 0) {
            const firstSegment = segments[0];
            // Se o primeiro segmento não corresponde a nenhuma rota conhecida, pode ser base path
            const knownRoutes = ['', 'projetos', 'estudos', 'rotina', 'terapeutico'];
            if (!knownRoutes.includes(firstSegment) && path.startsWith('/' + firstSegment + '/')) {
                return '/' + firstSegment + '/';
            }
        }
        
        return '/';
    }

    /**
     * Normaliza o path removendo o base path
     */
    normalizePath(path) {
        if (!path) return '/';
        
        // Se não há base path ou é a raiz, retornar normalizado
        if (!this.basePath || this.basePath === '/') {
            return path === '' ? '/' : path;
        }
        
        // Remove o base path do início do path
        if (path.startsWith(this.basePath)) {
            const normalized = path.slice(this.basePath.length - 1); // -1 para manter a barra inicial
            return normalized || '/';
        }
        
        // Se o path é exatamente o base path (sem barra final), retornar '/'
        if (path === this.basePath.slice(0, -1)) {
            return '/';
        }
        
        // Se o path não começa com base path, pode já estar normalizado
        return path || '/';
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
        const fullPath = this.basePath && this.basePath !== '/' 
            ? this.basePath.slice(0, -1) + normalizedPath // Remove a barra final do basePath
            : normalizedPath;
        
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