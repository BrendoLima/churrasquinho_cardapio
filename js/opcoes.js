/* ============================================================
   js/opcoes.js — Modal de sub-opções do item
   Depende de: utils.js (fmtPrice, calcPreco), cart.js (cart, cartAdd)
============================================================ */

/*
  opcoesOpen(item, keyToReplace, preSelections)
    item          — item do cardápio
    keyToReplace  — chave de entrada no carrinho a substituir (edição), ou null
    preSelections — seleções iniciais para pré-marcar (edição), ou null
*/
function opcoesOpen(item, keyToReplace, preSelections) {
  var overlay    = document.getElementById('opcoes-overlay')
  var selections = preSelections ? Object.assign({}, preSelections) : {}

  overlay.innerHTML = ''
  var sheet = document.createElement('div')
  sheet.className = 'sheet opcoes-sheet'

  sheet.innerHTML =
    '<div class="sheet-handle"></div>' +
    '<div class="opcoes-header">' +
      '<p class="opcoes-item-nome">' + item.nome + '</p>' +
      '<p class="opcoes-preco" id="opcoes-preco">' +
        fmtPrice(calcPreco(item, selections)) +
      '</p>' +
    '</div>'

  /* Um bloco por grupo de opções */
  item.opcoes.forEach(function(grupo) {
    var bloco = document.createElement('div')
    bloco.className = 'opcoes-grupo'

    var titulo = document.createElement('p')
    titulo.className   = 'opcoes-grupo-label'
    titulo.textContent = grupo.label + (grupo.obrigatorio ? ' *' : '')
    bloco.appendChild(titulo)

    var pills = document.createElement('div')
    pills.className = 'opcoes-pills'

    grupo.choices.forEach(function(choice) {
      var pill = document.createElement('button')
      pill.className   = 'opcoes-pill'
      pill.dataset.id  = choice.id
      pill.textContent = choice.label +
        (choice.extra > 0 ? ' (+' + fmtPrice(choice.extra) + ')' : '')

      if (selections[grupo.label] === choice.id) pill.classList.add('selected')

      pill.onclick = function() {
        pills.querySelectorAll('.opcoes-pill').forEach(function(p) {
          p.classList.remove('selected')
        })
        pill.classList.add('selected')
        selections[grupo.label] = choice.id

        /* Atualiza preço ao vivo */
        document.getElementById('opcoes-preco').textContent =
          fmtPrice(calcPreco(item, selections))

        refreshBtn()
      }
      pills.appendChild(pill)
    })

    bloco.appendChild(pills)
    sheet.appendChild(bloco)
  })

  var addBtn = document.createElement('button')
  addBtn.className   = 'opcoes-add-btn'
  addBtn.id          = 'opcoes-add-btn'
  addBtn.textContent = keyToReplace ? '✔ Atualizar pedido' : '+ Adicionar ao pedido'
  addBtn.disabled    = hasUnfilled(item, selections)

  addBtn.onclick = function() {
    if (keyToReplace) delete cart[keyToReplace]
    cartAdd(item, selections)
    opcoesClose()
  }

  sheet.appendChild(addBtn)
  overlay.appendChild(sheet)
  overlay.classList.remove('hidden')
  document.body.style.overflow = 'hidden'

  function refreshBtn() {
    document.getElementById('opcoes-add-btn').disabled =
      hasUnfilled(item, selections)
  }
}

/* Retorna true se algum grupo obrigatório ainda não foi respondido */
function hasUnfilled(item, selections) {
  return item.opcoes.some(function(g) {
    return g.obrigatorio && !selections[g.label]
  })
}

function opcoesClose() {
  document.getElementById('opcoes-overlay').classList.add('hidden')
  document.body.style.overflow = ''
}
