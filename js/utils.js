/* ============================================================
   js/utils.js — Funções utilitárias puras
   Sem dependências. Carregado antes de todos os outros js/.
============================================================ */

/* Emoji exibido quando o item não tem img nem emoji definido */
var FALLBACK_EMOJI = '🍽️'

/* Formata número em Real brasileiro: 22.5 → "R$ 22,50" */
function fmtPrice(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',')
}

/*
  Gera uma chave única para agrupar entradas no carrinho.
  Mesmo item com mesmas opções = mesma chave = mesma linha no carrinho.
  Mesmo item com opções diferentes = chaves diferentes = linhas separadas.
*/
function buildCartKey(item, selections) {
  if (!selections || !Object.keys(selections).length) return item.id
  var parts = Object.keys(selections).sort().map(function(k) {
    return k + '=' + selections[k]
  })
  return item.id + '|' + parts.join('|')
}

/* Calcula preço final: preço base + soma dos extras das opções escolhidas */
function calcPreco(item, selections) {
  if (!item.opcoes || !selections) return item.preco
  var extras = item.opcoes.reduce(function(sum, grupo) {
    var choice = grupo.choices.find(function(c) {
      return c.id === selections[grupo.label]
    })
    return sum + (choice ? choice.extra : 0)
  }, 0)
  return item.preco + extras
}

/*
  Monta texto resumido das opções selecionadas.
  Usado no carrinho e na mensagem do WhatsApp.
  Ex.: "Frango • Batata Frita"
*/
function buildSelectionsLabel(item, selections) {
  if (!item.opcoes || !selections) return ''
  return item.opcoes.map(function(grupo) {
    var choice = grupo.choices.find(function(c) {
      return c.id === selections[grupo.label]
    })
    return choice ? choice.label : null
  }).filter(Boolean).join(' • ')
}
