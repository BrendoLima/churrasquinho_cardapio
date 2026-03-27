/* ============================================================
   js/utils.js — Funções puras reutilizáveis
   Sem efeitos colaterais. Nenhuma dependência de DOM.
============================================================ */

var FALLBACK_EMOJI = '🍽️'

/* Formata um número como preço em BRL: 22.5 → "R$ 22,50" */
function fmtPrice(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',')
}

/*
  Gera a chave de agrupamento do carrinho.
  Itens com mesmas opções compartilham a mesma chave e são agrupados.
*/
function buildCartKey(item, selections) {
  if (!selections || !Object.keys(selections).length) return item.id
  var parts = Object.keys(selections).sort().map(function(k) {
    return k + '=' + selections[k]
  })
  return item.id + '|' + parts.join('|')
}

/* Preço base + soma dos extras das opções escolhidas */
function calcFinalPrice(item, selections) {
  if (!item.opcoes || !selections) return item.preco
  return item.opcoes.reduce(function(total, group) {
    var chosen = group.choices.find(function(c) {
      return c.id === selections[group.label]
    })
    return total + (chosen ? chosen.extra : 0)
  }, item.preco)
}

/* Texto resumido das opções: "Frango • Batata Frita" */
function buildSelectionsLabel(item, selections) {
  if (!item.opcoes || !selections) return ''
  return item.opcoes.map(function(group) {
    var chosen = group.choices.find(function(c) {
      return c.id === selections[group.label]
    })
    return chosen ? chosen.label : null
  }).filter(Boolean).join(' • ')
}

/* Cria um bloco de imagem com lazy load e fallback para emoji */
function createImgBlock(item, className) {
  var wrap = document.createElement('div')
  wrap.className = className

  if (item.img) {
    var img = document.createElement('img')
    img.src     = item.img
    img.alt     = item.nome
    img.loading = 'lazy'
    img.onerror = function() { wrap.textContent = FALLBACK_EMOJI }
    wrap.appendChild(img)
  } else {
    wrap.textContent = FALLBACK_EMOJI
  }
  return wrap
}

/* Dispara animação de shake em uma lista de elementos */
function shakeElements(elements) {
  elements.forEach(function(el) {
    el.classList.remove('shake')
    void el.offsetWidth  /* reflow para reiniciar a animação */
    el.classList.add('shake')
    el.addEventListener('animationend', function() {
      el.classList.remove('shake')
    }, { once: true })
  })
}
