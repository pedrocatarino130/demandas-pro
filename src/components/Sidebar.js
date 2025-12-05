/**
 * Componente Sidebar
 * Menu lateral responsivo com navegação
 */

import { router } from '../router.js';

export class Sidebar {
  constructor() {
    this.isOpen = false;
    this.isMobile = window.innerWidth < 1024;
    this.expandedSections = {}; // Track which sections are expanded
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
      <!-- Logo Area -->
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <div class="sidebar-logo-icon-wrapper">
            <div class="sidebar-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div class="sidebar-logo-glow"></div>
          </div>
          <div class="sidebar-logo-text">
            <h1 class="sidebar-logo-title">Gerenciador</h1>
            <p class="sidebar-logo-subtitle">Pedro</p>
          </div>
        </div>
        <button class="sidebar-close" aria-label="Fechar menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Divider -->
      <div class="sidebar-divider"></div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <a href="/" data-route="/" class="sidebar-link active">
          <svg class="sidebar-link-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span class="sidebar-link-text">Home</span>
        </a>
        <a href="/projetos" data-route="/projetos" class="sidebar-link">
          <svg class="sidebar-link-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span class="sidebar-link-text">Projetos</span>
        </a>
        <a href="/estudos" data-route="/estudos" class="sidebar-link">
          <svg class="sidebar-link-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span class="sidebar-link-text">Estudos</span>
        </a>
        <a href="/rotina" data-route="/rotina" class="sidebar-link">
          <svg class="sidebar-link-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span class="sidebar-link-text">Minha Rotina</span>
        </a>
        <div class="sidebar-section" data-section="criacao">
          <button class="sidebar-link sidebar-section-toggle" data-section-toggle="criacao">
            <svg class="sidebar-link-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            <span class="sidebar-link-text">Criação</span>
            <svg class="sidebar-section-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="sidebar-submenu" data-submenu="criacao">
            <a href="/criacao" data-route="/criacao" class="sidebar-sublink">
              <svg class="sidebar-sublink-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Home (Tarefas)</span>
            </a>
            <a href="/criacao/ideias" data-route="/criacao/ideias" class="sidebar-sublink">
              <svg class="sidebar-sublink-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              <span>Ideias</span>
            </a>
            <a href="/criacao/planejamento" data-route="/criacao/planejamento" class="sidebar-sublink">
              <svg class="sidebar-sublink-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              <span>Planejamento</span>
            </a>
          </div>
        </div>
        <a href="/terapeutico" data-route="/terapeutico" class="sidebar-link">
          <svg class="sidebar-link-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <span class="sidebar-link-text">Espaço Terapêutico</span>
        </a>
      </nav>

      <!-- Footer Actions -->
      <div class="sidebar-footer">
        <div class="sidebar-footer-content">
          <button class="sidebar-footer-button" data-action="settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
            </svg>
            <span>Configurações</span>
          </button>
          <button class="sidebar-footer-button sidebar-footer-button-danger" data-action="logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Sair</span>
          </button>
        </div>
      </div>
    `;

    // Overlay para mobile
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.id = 'sidebar-overlay';

    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);

    // Event listeners
    const closeBtn = sidebar.querySelector('.sidebar-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    overlay.addEventListener('click', () => this.close());

    // Links de navegação
    sidebar.querySelectorAll('.sidebar-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        if (route && router) {
          router.navigate(route);
          if (this.isMobile) {
            this.close();
          }
        }
      });
    });

    // Sublinks de navegação
    sidebar.querySelectorAll('.sidebar-sublink').forEach((sublink) => {
      sublink.addEventListener('click', (e) => {
        e.preventDefault();
        const route = sublink.getAttribute('data-route');
        if (route && router) {
          router.navigate(route);
          if (this.isMobile) {
            this.close();
          }
        }
      });
    });

    // Section toggle buttons (collapse/expand)
    sidebar.querySelectorAll('.sidebar-section-toggle').forEach((toggle) => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionName = toggle.getAttribute('data-section-toggle');
        this.toggleSection(sectionName);
      });
    });

    // Footer buttons
    const settingsBtn = sidebar.querySelector('[data-action="settings"]');
    const logoutBtn = sidebar.querySelector('[data-action="logout"]');
    
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        // TODO: Implementar ação de configurações
        console.log('Settings clicked');
      });
    }
    
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        // TODO: Implementar ação de logout
        console.log('Logout clicked');
      });
    }
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
    // Atualizar sidebar-link
    const links = document.querySelectorAll('.sidebar-link');
    links.forEach((link) => {
      const linkPath = link.getAttribute('data-route');
      if (linkPath === path) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Atualizar sidebar-sublink
    const sublinks = document.querySelectorAll('.sidebar-sublink');
    sublinks.forEach((sublink) => {
      const sublinkPath = sublink.getAttribute('data-route');
      if (sublinkPath === path) {
        sublink.classList.add('active');
        // Auto-expand parent section when sublink is active
        const submenu = sublink.closest('.sidebar-submenu');
        if (submenu) {
          const sectionName = submenu.getAttribute('data-submenu');
          if (sectionName && !this.expandedSections[sectionName]) {
            this.expandSection(sectionName);
          }
        }
      } else {
        sublink.classList.remove('active');
      }
    });
  }

  toggleSection(sectionName) {
    if (this.expandedSections[sectionName]) {
      this.collapseSection(sectionName);
    } else {
      this.expandSection(sectionName);
    }
  }

  expandSection(sectionName) {
    this.expandedSections[sectionName] = true;
    const submenu = document.querySelector(`[data-submenu="${sectionName}"]`);
    const toggle = document.querySelector(`[data-section-toggle="${sectionName}"]`);
    
    if (submenu) {
      submenu.classList.add('expanded');
    }
    if (toggle) {
      toggle.classList.add('expanded');
    }
  }

  collapseSection(sectionName) {
    this.expandedSections[sectionName] = false;
    const submenu = document.querySelector(`[data-submenu="${sectionName}"]`);
    const toggle = document.querySelector(`[data-section-toggle="${sectionName}"]`);
    
    if (submenu) {
      submenu.classList.remove('expanded');
    }
    if (toggle) {
      toggle.classList.remove('expanded');
    }
  }
}

