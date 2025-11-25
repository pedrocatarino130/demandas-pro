/**
 * Componente Sidebar
 * Menu lateral responsivo com navegação
 */

import { router } from '../router.js';

export class Sidebar {
  constructor() {
    this.isOpen = false;
    this.isMobile = window.innerWidth < 1024;
    this.init();
  }

  init() {
    this.createSidebar();
    this.setupEventListeners();
    this.handleResize();
  }

  createSidebar() {
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.id = 'sidebar';
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <h2>🎯 Gerenciador</h2>
        <button class="sidebar-close" aria-label="Fechar menu">✕</button>
      </div>
      <nav class="sidebar-nav">
        <a href="/" data-route="/" class="sidebar-link active">
          <span class="sidebar-link-icon">🏠</span>
          <span class="sidebar-link-text">Home</span>
        </a>
        <a href="/projetos" data-route="/projetos" class="sidebar-link">
          <span class="sidebar-link-icon">📋</span>
          <span class="sidebar-link-text">Projetos</span>
        </a>
        <a href="/estudos" data-route="/estudos" class="sidebar-link">
          <span class="sidebar-link-icon">📚</span>
          <span class="sidebar-link-text">Estudos</span>
        </a>
        <a href="/rotina" data-route="/rotina" class="sidebar-link">
          <span class="sidebar-link-icon">📅</span>
          <span class="sidebar-link-text">Minha Rotina</span>
        </a>
        <a href="/terapeutico" data-route="/terapeutico" class="sidebar-link">
          <span class="sidebar-link-icon">🌱</span>
          <span class="sidebar-link-text">Espaço Terapêutico</span>
        </a>
      </nav>
    `;

    // Overlay para mobile
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.id = 'sidebar-overlay';

    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);

    // Event listeners
    const closeBtn = sidebar.querySelector('.sidebar-close');
    closeBtn.addEventListener('click', () => this.close());

    overlay.addEventListener('click', () => this.close());

    // Links de navegação
    sidebar.querySelectorAll('.sidebar-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        const route = link.getAttribute('data-route');
        if (route && router) {
          router.navigate(route);
          if (this.isMobile) {
            this.close();
          }
        }
      });
    });
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.handleResize());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 1024;

    if (wasMobile !== this.isMobile) {
      if (!this.isMobile) {
        // Desktop: sidebar sempre visível
        this.open();
      } else {
        // Mobile: sidebar fechada por padrão
        this.close();
      }
    }
  }

  open() {
    this.isOpen = true;
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar) {
      sidebar.classList.add('open');
    }
    if (overlay && this.isMobile) {
      overlay.classList.add('active');
    }
    document.body.style.overflow = this.isMobile ? 'hidden' : '';
  }

  close() {
    this.isOpen = false;
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar) {
      sidebar.classList.remove('open');
    }
    if (overlay) {
      overlay.classList.remove('active');
    }
    document.body.style.overflow = '';
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  updateActiveRoute(path) {
    const links = document.querySelectorAll('.sidebar-link');
    links.forEach((link) => {
      const linkPath = link.getAttribute('data-route');
      if (linkPath === path) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

