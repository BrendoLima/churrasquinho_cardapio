/* ============================================================
   whatsapp-message.js — Template da mensagem enviada ao WhatsApp
   Depende de: app.js (fmtPrice, buildSelectionsLabel)
   Carregado APÓS app.js no index.html

   Emojis usados: apenas os reconhecidos pelo WhatsApp
     ✅  🔥  💰  💳  💵  📱  •
   ============================================================ */

var WHATSAPP_NUMBER = '5522991016613'

/* Monta o texto completo da mensagem */
function buildWhatsAppMsg(entries, total, metodoPagamento) {
  var linhas = []

  linhas.push('🔥 *Churrasquinho do Juanete*')
  linhas.push('')

  entries.forEach(function(e) {
    var sub = buildSelectionsLabel(e.item, e.selections)
    var linha = '• ' + e.qty + 'x ' + e.item.nome
    if (sub) linha += ' (' + sub + ')'
    linha += '  -  ' + fmtPrice(e.preco * e.qty)
    linhas.push(linha)
  })

  linhas.push('')
  linhas.push('💰 Total: *' + fmtPrice(total) + '*')

  if (metodoPagamento) {
    var icone = metodoPagamento === 'Dinheiro'          ? '💵'
              : metodoPagamento === 'PIX'               ? '📱'
              : '💳'
    linhas.push(icone + ' Metodo de Pagamento: *' + metodoPagamento + '*')
  }

  linhas.push('')
  linhas.push('✅ Envie esta mensagem para confirmar seu pedido')

  return linhas.join('\n')
}

/* Abre o WhatsApp com a mensagem montada */
function sendWhatsApp(entries, total, metodoPagamento) {
  var msg = buildWhatsAppMsg(entries, total, metodoPagamento)
  window.open(
    'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg),
    '_blank'
  )
}
