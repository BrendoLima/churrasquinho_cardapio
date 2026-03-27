/* ============================================================
   js/cart.js — Estado e UI do carrinho de pedidos
   Depende de: utils.js, modal.js (openOpcoesModal),
               whatsapp-message.js (sendWhatsApp)
============================================================ */

/* ── Estado ── */

var cart = {}  /* { [key]: { key, item, selections, price, qty } } */

/* ── Mutações do estado ── */

function addToCart(item, selections) {
  var key   = buildCartKey(item, selections)
  var price = calcFinalPrice(item, selections)

  if (cart[key]) cart[key].qty++
  else cart[key] = { key: key, item: item, selections: selections, price: price, qty: 1 }

  updateCartBadge()
  showToast('✔ ' + item.nome + ' adicionado!')
}

function incrementCartItem(key) {
  if (!cart[key]) return
  cart[key].qty++
  updateCartBadge()
  openCartDrawer()
}

function decrementCartItem(key) {
  if (!cart[key]) return
  cart[key].qty--
  if (cart[key].qty <= 0) delete cart[key]
  updateCartBadge()
  openCartDrawer()
}

function updateCartBadge() {
  var totalItems = Object.values(cart).reduce(function(sum, e) { return sum + e.qty }, 0)
  var badge = document.getElementById('cart-count')
  badge.textContent = totalItems
  badge.classList.toggle('hidden', totalItems === 0)
}

/* ── UI do carrinho ── */

function openCartDrawer() {
  var overlay = document.getElementById('cart-overlay')
  var entries = Object.values(cart)
  var total   = entries.reduce(function(sum, e) { return sum + e.price * e.qty }, 0)

  overlay.innerHTML =
    '<div class="sheet">' +
      '<div class="sheet-handle"></div>' +
      '<h2 class="cart-title">🛒 Seu pedido</h2>' +
      '<div id="cart-list"></div>' +
    '</div>'

  var list = document.getElementById('cart-list')

  if (!entries.length) {
    list.innerHTML = '<p class="cart-empty">Nenhum item adicionado ainda.</p>'
    overlay.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
    return
  }

  var ul = document.createElement('ul')
  entries.forEach(function(entry) {
    ul.appendChild(createCartItemRow(entry))
  })
  list.appendChild(ul)

  list.insertAdjacentHTML('beforeend',
    '<div class="cart-total">' +
      '<span class="cart-total-label">Total</span>' +
      '<span class="cart-total-value">' + fmtPrice(total) + '</span>' +
    '</div>'
  )

  list.appendChild(createCheckoutSection(entries, total))

  overlay.classList.remove('hidden')
  document.body.style.overflow = 'hidden'
}

function closeCartDrawer() {
  document.getElementById('cart-overlay').classList.add('hidden')
  document.body.style.overflow = ''
}

/* ── Linha de item no carrinho ── */

function createCartItemRow(entry) {
  var subLabel = buildSelectionsLabel(entry.item, entry.selections)

  var li = document.createElement('li')
  li.className = 'cart-item'

  /* Coluna de informações */
  var info = document.createElement('div')
  info.className = 'cart-item-info'
  info.innerHTML =
    '<p class="cart-item-name">'  + entry.item.nome + '</p>' +
    (subLabel ? '<p class="cart-item-opts">' + subLabel + '</p>' : '') +
    '<p class="cart-item-qty-price">' +
      '<span class="cart-item-qty">'   + entry.qty + '×</span> ' +
      '<span class="cart-item-price">' + fmtPrice(entry.price * entry.qty) + '</span>' +
    '</p>'

  /* Coluna de controles: − ··· + */
  var controls = document.createElement('div')
  controls.className = 'cart-controls'

  var minusBtn = createCtrlButton('−', 'ctrl-btn ctrl-minus', function() {
    decrementCartItem(entry.key)
  })

  var editBtn = createCtrlButton('', 'ctrl-btn ctrl-edit', function() {
    closeCartDrawer()
    openOpcoesModal(entry.item, entry.key, entry.selections)
  })
  editBtn.innerHTML = '<span class="dots">•••</span>'
  if (!entry.item.opcoes || !entry.item.opcoes.length) editBtn.style.display = 'none'

  var plusBtn = createCtrlButton('+', 'ctrl-btn ctrl-plus', function() {
    incrementCartItem(entry.key)
  })

  controls.appendChild(minusBtn)
  controls.appendChild(editBtn)
  controls.appendChild(plusBtn)

  li.appendChild(info)
  li.appendChild(controls)
  return li
}

/* Cria um botão de controle genérico */
function createCtrlButton(label, className, onClick) {
  var btn = document.createElement('button')
  btn.className   = className
  btn.textContent = label
  btn.onclick     = onClick
  return btn
}

/* ── Seção de checkout: pagamento + PIX + WhatsApp ── */

function createCheckoutSection(entries, total) {
  var selectedMethod = ''

  var wrap = document.createElement('div')
  wrap.className = 'payment-wrap'

  /* Trigger do dropdown de pagamento */
  var trigger = document.createElement('button')
  trigger.className = 'payment-trigger'
  trigger.innerHTML =
    '<span id="pay-label">Selecionar forma de pagamento</span>' +
    '<span class="pay-arrow" id="pay-arrow">▾</span>'

  /* Painel de opções que abre para baixo */
  var panel = document.createElement('div')
  panel.className = 'payment-panel'

  var paymentMethods = [
    { value: 'Dinheiro',          icon: '💵' },
    { value: 'PIX',               icon: '📱' },
    { value: 'Cartão de Crédito', icon: '💳' },
    { value: 'Cartão de Débito',  icon: '💳' }
  ]

  paymentMethods.forEach(function(method) {
    var optBtn = document.createElement('button')
    optBtn.className   = 'pay-opt'
    optBtn.textContent = method.icon + '  ' + method.value
    optBtn.onclick = function() {
      panel.querySelectorAll('.pay-opt').forEach(function(b) { b.classList.remove('selected') })
      optBtn.classList.add('selected')
      selectedMethod = method.value

      document.getElementById('pay-label').textContent = method.icon + '  ' + method.value
      trigger.classList.add('chosen')
      togglePanel(false)

      pixWrap.classList.toggle('hidden', method.value !== 'PIX')
      whatsappBtn.disabled = false
      whatsappBtn.classList.remove('whats-btn--locked')
    }
    panel.appendChild(optBtn)
  })

  var panelOpen = false
  trigger.onclick = function() { togglePanel(!panelOpen) }

  function togglePanel(open) {
    panelOpen = open
    panel.classList.toggle('open', open)
    document.getElementById('pay-arrow').textContent = open ? '▴' : '▾'
  }

  /* Seção PIX (oculta por padrão) */
  var pixWrap = document.createElement('div')
  pixWrap.className = 'pix-wrap hidden'

  var pixCopyBtn = document.createElement('button')
  pixCopyBtn.className   = 'pix-copy-btn'
  pixCopyBtn.textContent = '📋 Copiar chave PIX'
  pixCopyBtn.onclick = function() {
    navigator.clipboard.writeText(CONFIG.pixKey).then(function() {
      pixCopyBtn.textContent = '✅ Chave copiada!'
      setTimeout(function() { pixCopyBtn.textContent = '📋 Copiar chave PIX' }, 2500)
    })
  }

  var pixKeyLabel = document.createElement('p')
  pixKeyLabel.className   = 'pix-key'
  pixKeyLabel.textContent = CONFIG.pixKeyDisplay

  pixWrap.appendChild(pixCopyBtn)
  pixWrap.appendChild(pixKeyLabel)

  /* Botão de finalização via WhatsApp (bloqueado até escolher pagamento) */
  var whatsappBtn = document.createElement('button')
  whatsappBtn.className = 'whats-btn whats-btn--locked'
  whatsappBtn.disabled  = true
  whatsappBtn.innerHTML =
    'Finalizar pedido pelo WhatsApp' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">' +
      '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
    '</svg>'

  whatsappBtn.onclick = function() {
    if (!selectedMethod) {
      shakeElements([wrap, whatsappBtn])
      togglePanel(true)
      return
    }
    sendWhatsApp(entries, total, selectedMethod)
  }

  wrap.appendChild(trigger)
  wrap.appendChild(panel)
  wrap.appendChild(pixWrap)
  wrap.appendChild(whatsappBtn)
  return wrap
}
