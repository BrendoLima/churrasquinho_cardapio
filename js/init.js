/* js/init.js — Ponto de entrada */

const $ = id => document.getElementById(id)

/* Botão flutuante */
$('cart-btn').onclick = cartOpen

/* Helper para fechar ao clicar fora */
const closeOnOutsideClick = (id, closeFn) =>
  $(id).onclick = e =>
    e.target === e.currentTarget && closeFn()

closeOnOutsideClick('modal-overlay', modalClose)
closeOnOutsideClick('cart-overlay', cartClose)
closeOnOutsideClick('opcoes-overlay', opcoesClose)

/* Render inicial */
renderHeader()
renderAllSections()