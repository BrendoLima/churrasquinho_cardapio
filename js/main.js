/* ============================================================
   js/main.js — Ponto de entrada da aplicação
   Responsabilidades:
     1. Busca os JSONs de cada seção em paralelo (Promise.all)
     2. Monta o array global CARDAPIO
     3. Inicializa header, seções e event listeners
============================================================ */

var CARDAPIO   = []
var toastTimer = null

/* ── Carregamento dos dados ── */

function loadCardapio() {
  var requests = SECTIONS.map(function(section) {
    return fetch(section.file)
      .then(function(response) {
        if (!response.ok) throw new Error('Erro ao carregar ' + section.file)
        return response.json()
      })
      .then(function(data) {
        return {
          id:            section.id,
          label:         section.label,
          subcategorias: data.subcategorias
        }
      })
  })

  Promise.all(requests)
    .then(function(sections) {
      CARDAPIO = sections
      initApp()
    })
    .catch(function(err) {
      console.error(err)
      document.getElementById('main').innerHTML =
        '<p style="padding:48px 24px;text-align:center;color:#9A8060">' +
        'Erro ao carregar o cardápio. Recarregue a página.</p>'
    })
}

/* ── Inicialização ── */

function initApp() {
  renderHeader()
  renderAllSections()
}

/* ── Toast de feedback ── */

function showToast(message) {
  var el = document.getElementById('toast')
  el.textContent = message
  el.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(function() { el.classList.remove('show') }, 2000)
}

/* ── Event listeners globais ── */

document.getElementById('cart-btn').onclick = openCartDrawer

document.getElementById('modal-overlay').onclick = function(e) {
  if (e.target === e.currentTarget) closeItemModal()
}
document.getElementById('cart-overlay').onclick = function(e) {
  if (e.target === e.currentTarget) closeCartDrawer()
}
document.getElementById('opcoes-overlay').onclick = function(e) {
  if (e.target === e.currentTarget) closeOpcoesModal()
}

/* Inicia a aplicação */
loadCardapio()
