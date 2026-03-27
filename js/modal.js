/* ============================================================
   js/modal.js — Modais de detalhe do item e de opções
   Depende de: utils.js, cart.js (addToCart)
============================================================ */

/* ── Modal de detalhe do item ── */

function openItemModal(item) {
  var overlay  = document.getElementById('modal-overlay')
  var hasOpcoes = item.opcoes && item.opcoes.length
  var mediaHTML = item.img
    ? '<div class="modal-img"><img src="' + item.img + '" alt="' + item.nome + '" loading="lazy" onerror="this.parentNode.textContent=\'' + FALLBACK_EMOJI + '\'"></div>'
    : '<div class="modal-img">' + FALLBACK_EMOJI + '</div>'

  overlay.innerHTML =
    '<div class="sheet">' +
      '<div class="sheet-handle"></div>' +
      mediaHTML +
      '<h2 class="modal-title">' + item.nome + '</h2>' +
      (item.info ? '<p class="modal-info">' + item.info + '</p>' : '') +
      '<p class="modal-desc">'  + item.descricao + '</p>' +
      '<p class="modal-price">' + fmtPrice(item.preco) + '</p>' +
      '<button class="modal-add-btn">' + (hasOpcoes ? 'Escolher opções' : '+ Adicionar ao pedido') + '</button>' +
    '</div>'

  overlay.querySelector('.modal-add-btn').onclick = function() {
    closeItemModal()
    hasOpcoes ? openOpcoesModal(item, null, null) : addToCart(item, {})
  }

  overlay.classList.remove('hidden')
  document.body.style.overflow = 'hidden'
}

function closeItemModal() {
  document.getElementById('modal-overlay').classList.add('hidden')
  document.body.style.overflow = ''
}

/* ── Modal de opções (sub-seleções) ── */

/*
  @param item          — item do cardápio
  @param keyToReplace  — chave do carrinho a substituir (modo edição) | null
  @param preSelections — seleções pré-marcadas (modo edição) | null
*/
function openOpcoesModal(item, keyToReplace, preSelections) {
  var overlay    = document.getElementById('opcoes-overlay')
  var selections = preSelections ? Object.assign({}, preSelections) : {}

  overlay.innerHTML = ''
  var sheet = document.createElement('div')
  sheet.className = 'sheet opcoes-sheet'

  sheet.innerHTML =
    '<div class="sheet-handle"></div>' +
    '<div class="opcoes-header">' +
      '<p class="opcoes-item-nome">' + item.nome + '</p>' +
      '<p class="opcoes-preco" id="opcoes-preco">' + fmtPrice(calcFinalPrice(item, selections)) + '</p>' +
    '</div>'

  item.opcoes.forEach(function(group) {
    var block = document.createElement('div')
    block.className = 'opcoes-grupo'

    var groupLabel = document.createElement('p')
    groupLabel.className   = 'opcoes-grupo-label'
    groupLabel.textContent = group.label + (group.obrigatorio ? ' *' : '')
    block.appendChild(groupLabel)

    var pillsContainer = document.createElement('div')
    pillsContainer.className = 'opcoes-pills'

    group.choices.forEach(function(choice) {
      var pill = document.createElement('button')
      pill.className   = 'opcoes-pill'
      pill.textContent = choice.label + (choice.extra > 0 ? ' (+' + fmtPrice(choice.extra) + ')' : '')
      if (selections[group.label] === choice.id) pill.classList.add('selected')

      pill.onclick = function() {
        pillsContainer.querySelectorAll('.opcoes-pill').forEach(function(p) {
          p.classList.remove('selected')
        })
        pill.classList.add('selected')
        selections[group.label] = choice.id
        document.getElementById('opcoes-preco').textContent = fmtPrice(calcFinalPrice(item, selections))
        updateConfirmButton()
      }
      pillsContainer.appendChild(pill)
    })

    block.appendChild(pillsContainer)
    sheet.appendChild(block)
  })

  var confirmBtn = document.createElement('button')
  confirmBtn.className   = 'opcoes-add-btn'
  confirmBtn.id          = 'opcoes-add-btn'
  confirmBtn.textContent = keyToReplace ? '✔ Atualizar pedido' : '+ Adicionar ao pedido'
  confirmBtn.disabled    = hasMissingRequired(item, selections)

  confirmBtn.onclick = function() {
    if (keyToReplace) delete cart[keyToReplace]
    addToCart(item, selections)
    closeOpcoesModal()
  }

  sheet.appendChild(confirmBtn)
  overlay.appendChild(sheet)
  overlay.classList.remove('hidden')
  document.body.style.overflow = 'hidden'

  function updateConfirmButton() {
    document.getElementById('opcoes-add-btn').disabled = hasMissingRequired(item, selections)
  }
}

function hasMissingRequired(item, selections) {
  return item.opcoes.some(function(group) {
    return group.obrigatorio && !selections[group.label]
  })
}

function closeOpcoesModal() {
  document.getElementById('opcoes-overlay').classList.add('hidden')
  document.body.style.overflow = ''
}
