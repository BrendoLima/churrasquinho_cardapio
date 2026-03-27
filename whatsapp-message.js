/* ============================================================
   whatsapp-message.js — Template da mensagem enviada ao WhatsApp
   Depende de: js/config.js (CONFIG), js/utils.js (fmtPrice, buildSelectionsLabel)
   Carregado após cart.js no index.html.

   Emojis usados: apenas os suportados nativamente pelo WhatsApp
     🔥  💰  💵  📱  💳  ✅  •
============================================================ */

function buildWhatsAppMessage(entries, total, paymentMethod) {
  var lines = []

  lines.push('🔥 *Churrasquinho do Juanete*')
  lines.push('')

  entries.forEach(function (entry) {
    var options = buildSelectionsLabel(entry.item, entry.selections)
    var line = '• ' + entry.qty + 'x ' + entry.item.nome
    if (options) line += ' (' + options + ')'
    line += '  -  ' + fmtPrice(entry.price * entry.qty)
    lines.push(line)
  })

  lines.push('')
  lines.push('💰 Total: *' + fmtPrice(total) + '*')

  if (paymentMethod) {
    var icon = paymentMethod === 'Dinheiro' ? '💵'
      : paymentMethod === 'PIX' ? '📱'
        : '💳'
    lines.push(icon + ' Metodo de Pagamento: *' + paymentMethod + '*')
  }

  lines.push('')
  lines.push('✅ Envie esta mensagem para confirmar seu pedido!')

  return lines.join('\n')
}

function sendWhatsApp(entries, total, paymentMethod) {
  var message = buildWhatsAppMessage(entries, total, paymentMethod)
  window.open(
    'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message),
    '_blank'
  )
}
