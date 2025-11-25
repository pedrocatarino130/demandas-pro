/**
 * Componente Menu Hamburguer
 * Botão de menu para mobile
 */

export function createMenuHamburguer(onClick) {
    const button = document.createElement('button');
    button.className = 'menu-hamburguer';
    button.setAttribute('aria-label', 'Abrir menu');
    button.innerHTML = `
    <span class="menu-hamburguer-line"></span>
    <span class="menu-hamburguer-line"></span>
    <span class="menu-hamburguer-line"></span>
  `;

    button.addEventListener('click', onClick);

    return button;
}