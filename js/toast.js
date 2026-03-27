/* ============================================================
   js/toast.js — Feedback visual temporário
   Sem dependências.
============================================================ */

var toastTimer = null

/* Exibe uma mensagem por 2 segundos no rodapé da tela */
function toastShow(msg) {
  var el = document.getElementById('toast')
  el.textContent = msg
  el.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(function() {
    el.classList.remove('show')
  }, 2000)
}
