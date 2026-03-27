/* ============================================================
   js/modal.js — Modal de detalhes do item
   Depende de: utils.js (fmtPrice, FALLBACK_EMOJI),
               opcoes.js (opcoesOpen), cart.js (cartAdd)
============================================================ */

function modalOpen(item) {
  var overlay  = document.getElementById('modal-overlay')

  var mediaHTML = item.img
    ? '<div class="modal-img">' +
        '<img src="' + item.img + '" alt="' + item.nome + '" loading="lazy"' +
        ' onerror="this.parentNode.textContent=\'' + FALLBACK_EMOJI + '\'">' +
      '</div>'
    : '<div class="modal-img">' + FALLBACK_EMOJI + '</div>'

  var addLabel = (item.opcoes && item.opcoes.length)
    ? 'Escolher opções'
    : '+ Adicionar ao pedido'

  overlay.innerHTML =
    '<div class="sheet">' +
      '<div class="sheet-handle"></div>' +
      mediaHTML +
      '<h2 class="modal-title">' + item.nome + '</h2>' +
      (item.info ? '<p class="modal-info">' + item.info + '</p>' : '') +
      '<p class="modal-desc">'  + item.descricao + '</p>' +
      '<p class="modal-price">' + fmtPrice(item.preco) + '</p>' +
      '<button class="modal-add-btn">' + addLabel + '</button>' +
    '</div>'

  overlay.querySelector('.modal-add-btn').onclick = function() {
    modalClose()
    if (item.opcoes && item.opcoes.length) opcoesOpen(item, null, null)
    else cartAdd(item, {})
  }

  overlay.classList.remove('hidden')
  document.body.style.overflow = 'hidden'
}

function modalClose() {
  document.getElementById('modal-overlay').classList.add('hidden')
  document.body.style.overflow = ''
}
