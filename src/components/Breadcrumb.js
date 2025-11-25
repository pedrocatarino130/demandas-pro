/**
 * Componente Breadcrumb
 * Trilha de navegação contextual
 */

import { router } from '../router.js';

export class Breadcrumb {
  constructor(items = []) {
    this.items = items;
  }

  /**
   * Cria breadcrumb a partir de array de itens
   */
  static create(items) {
    const breadcrumb = new Breadcrumb(items);
    return breadcrumb.render();
  }

  /**
   * Cria breadcrumb a partir da rota atual
   */
  static fromRoute(path) {
    const items = [{ label: 'Home', path: '/' }];

    const routeMap = {
      '/projetos': 'Projetos',
      '/estudos': 'Estudos',
      '/rotina': 'Minha Rotina',
      '/terapeutico': 'Espaço Terapêutico',
    };

    if (path && path !== '/') {
      const parts = path.split('/').filter(Boolean);
      parts.forEach((part) => {
        const fullPath = '/' + part;
        const label = routeMap[fullPath] || part.charAt(0).toUpperCase() + part.slice(1);
        items.push({ label, path: fullPath });
      });
    }

    return new Breadcrumb(items);
  }

  render() {
    const isMobile = window.innerWidth < 768;
    const displayItems = isMobile ? [this.items[this.items.length - 1]] : this.items;

    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');

    const list = document.createElement('ol');
    list.className = 'breadcrumb-list';

    displayItems.forEach((item, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'breadcrumb-item';

      const isLast = index === displayItems.length - 1;

      if (isLast) {
        listItem.setAttribute('aria-current', 'page');
        const span = document.createElement('span');
        span.className = 'breadcrumb-current';
        span.textContent = item.label;
        listItem.appendChild(span);
      } else {
        const link = document.createElement('a');
        link.href = item.path;
        link.setAttribute('data-route', item.path);
        link.className = 'breadcrumb-link';
        link.textContent = item.label;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          if (router && item.path) {
            router.navigate(item.path);
          }
        });
        listItem.appendChild(link);
      }

      if (!isLast) {
        const separator = document.createElement('span');
        separator.className = 'breadcrumb-separator';
        separator.setAttribute('aria-hidden', 'true');
        separator.textContent = '›';
        listItem.appendChild(separator);
      }

      list.appendChild(listItem);
    });

    breadcrumb.appendChild(list);
    return breadcrumb;
  }
}

