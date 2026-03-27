/* ============================================================
   js/cart.js — Estado e UI do carrinho
   Depende de: utils.js, opcoes.js (opcoesOpen, opcoesClose),
               toast.js (toastShow), whatsapp-message.js (sendWhatsApp)
============================================================ */

/*
  Estado do carrinho — objeto indexado por chave única.
  Formato de cada entrada:
  {
    key:        string   — buildCartKey(item, selections)
    item:       object   — referência ao item do CARDAPIO
    selections: object   — { [grupo.label]: choiceId }
    preco:      number   — preço final (base + extras)
    qty:        number
  }
*/
var cart = {}

/* ── Operações de dados ──────────────────────────────────────── */

function cartAdd(item, selections) {
  var key   = buildCartKey(item, selections)
  var preco = calcPreco(item, selections)

  if (cart[key]) {
    cart[key].qty++
  } else {
    cart[key] = { key: key, item: item, selections: selections, preco: preco, qty: 1 }
  }

  cartUpdateBadge()
  toastShow('✔ ' + item.nome + ' adicionado!')
}

function cartIncrement(key) {
  if (!cart[key]) return
  cart[key].qty++
  cartUpdateBadge()
  cartOpen()
}

function cartDecrement(key) {
  if (!cart[key]) return
  cart[key].qty--
  if (cart[key].qty <= 0) delete cart[key]
  cartUpdateBadge()
  cartOpen()
}

/* Atualiza o badge numérico no botão flutuante */
function cartUpdateBadge() {
  var total = Object.values(cart).reduce(function(s, e) { return s + e.qty }, 0)
  var badge = document.getElementById('cart-count')
  badge.textContent = total
  badge.classList.toggle('hidden', total === 0)
}

/* ── UI do carrinho ──────────────────────────────────────────── */

function cartOpen() {
  var overlay = document.getElementById('cart-overlay')
  var entries = Object.values(cart)
  var total   = entries.reduce(function(s, e) { return s + e.preco * e.qty }, 0)

  overlay.innerHTML =
    '<div class="sheet">' +
      '<div class="sheet-handle"></div>' +
      '<h2 class="cart-title">🛒 Seu pedido</h2>' +
      '<div id="cart-list"></div>' +
    '</div>'

  var list = document.getElementById('cart-list')

  /* Carrinho vazio */
  if (!entries.length) {
    list.innerHTML = '<p class="cart-empty">Nenhum item adicionado ainda.</p>'
    overlay.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
    return
  }

  /* Lista de itens */
  var ul = document.createElement('ul')
  entries.forEach(function(e) {
    var subLabel = buildSelectionsLabel(e.item, e.selections)
    var li = document.createElement('li')
    li.className = 'cart-item'

    /* Coluna de info: nome, opções escolhidas, qty × preço */
    var info = document.createElement('div')
    info.className = 'cart-item-info'
    info.innerHTML =
      '<p class="cart-item-name">' + e.item.nome + '</p>' +
      (subLabel ? '<p class="cart-item-opts">' + subLabel + '</p>' : '') +
      '<p class="cart-item-qty-price">' +
        '<span class="cart-item-qty">' + e.qty + '×</span> ' +
        '<span class="cart-item-price">' + fmtPrice(e.preco * e.qty) + '</span>' +
      '</p>'

    /* Controles em linha: − ··· + */
    var controls = document.createElement('div')
    controls.className = 'cart-controls'

    var btnMinus = document.createElement('button')
    btnMinus.className   = 'ctrl-btn ctrl-minus'
    btnMinus.textContent = '−'
    btnMinus.title       = 'Remover uma unidade'
    btnMinus.onclick = function() { cartDecrement(e.key) }

    var btnEdit = document.createElement('button')
    btnEdit.className = 'ctrl-btn ctrl-edit'
    btnEdit.title     = 'Alterar opções'
    btnEdit.innerHTML = '<span class="dots">•••</span>'
    btnEdit.onclick   = function() {
      cartClose()
      opcoesOpen(e.item, e.key, e.selections)
    }
    /* Oculta o botão se o item não tem opcoes */
    if (!e.item.opcoes || !e.item.opcoes.length) btnEdit.style.display = 'none'

    var btnPlus = document.createElement('button')
    btnPlus.className   = 'ctrl-btn ctrl-plus'
    btnPlus.textContent = '+'
    btnPlus.title       = 'Adicionar mais um'
    btnPlus.onclick = function() { cartIncrement(e.key) }

    controls.appendChild(btnMinus)
    controls.appendChild(btnEdit)
    controls.appendChild(btnPlus)

    li.appendChild(info)
    li.appendChild(controls)
    ul.appendChild(li)
  })
  list.appendChild(ul)

  /* Total */
  list.insertAdjacentHTML('beforeend',
    '<div class="cart-total">' +
      '<span class="cart-total-label">Total</span>' +
      '<span class="cart-total-value">' + fmtPrice(total) + '</span>' +
    '</div>'
  )

  /* Seletor de pagamento (dropdown para baixo) */
  list.appendChild(buildPaymentSelector(entries, total))

  overlay.classList.remove('hidden')
  document.body.style.overflow = 'hidden'
}

function cartClose() {
  document.getElementById('cart-overlay').classList.add('hidden')
  document.body.style.overflow = ''
}

/* ── Seletor de pagamento ─────────────────────────────────────── */
/*
  Separado em função própria para manter cartOpen() legível.
  Retorna o elemento completo (trigger + painel + PIX + botão WA).
*/
function buildPaymentSelector(entries, total) {
  var selectedPayment = ''

  var payWrap = document.createElement('div')
  payWrap.className = 'payment-wrap'

  /* Trigger */
  var payTrigger = document.createElement('button')
  payTrigger.className = 'payment-trigger'
  payTrigger.id        = 'payment-trigger'
  payTrigger.innerHTML =
    '<span id="pay-label">Selecionar forma de pagamento</span>' +
    '<span class="pay-arrow" id="pay-arrow">▾</span>'

  /* Painel de opções */
  var payPanel = document.createElement('div')
  payPanel.className = 'payment-panel'
  payPanel.id        = 'payment-panel'

  var payOpts = [
    { value: 'Dinheiro',          icon: '💵' },
    { value: 'PIX',               icon: '📱' },
    { value: 'Cartão de Crédito', icon: '💳' },
    { value: 'Cartão de Débito',  icon: '💳' }
  ]

  /* PIX wrap — criado antes das opções para poder referenciar */
  var pixWrap = document.createElement('div')
  pixWrap.className = 'pix-wrap hidden'
  pixWrap.innerHTML =
    '<button class="pix-copy-btn">📋 Copiar chave PIX</button>' +
    '<p class="pix-key">49.549.786/0001-90</p>'

  pixWrap.querySelector('.pix-copy-btn').onclick = function() {
    var btn = pixWrap.querySelector('.pix-copy-btn')
    navigator.clipboard.writeText('49549786000190').then(function() {
      btn.textContent = '✅ Chave copiada!'
      setTimeout(function() { btn.textContent = '📋 Copiar chave PIX' }, 2500)
    })
  }

  /* Botão WhatsApp — bloqueado até escolher pagamento */
  var wBtn = document.createElement('button')
  wBtn.className = 'whats-btn whats-btn--locked'
  wBtn.disabled  = true
  wBtn.innerHTML =
    'Finalizar pedido pelo WhatsApp' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">' +
      '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
    '</svg>'

  wBtn.onclick = function() {
    if (!selectedPayment) {
      /* Shake nos dois elementos para indicar que falta escolher */
      ;[payWrap, wBtn].forEach(function(el) {
        el.classList.remove('shake')
        void el.offsetWidth
        el.classList.add('shake')
        el.addEventListener('animationend', function() {
          el.classList.remove('shake')
        }, { once: true })
      })
      togglePanel(true)
      return
    }
    sendWhatsApp(entries, total, selectedPayment)
  }

  /* Opções de pagamento */
  payOpts.forEach(function(opt) {
    var btn = document.createElement('button')
    btn.className   = 'pay-opt'
    btn.dataset.val = opt.value
    btn.textContent = opt.icon + '  ' + opt.value

    btn.onclick = function() {
      payPanel.querySelectorAll('.pay-opt').forEach(function(b) {
        b.classList.remove('selected')
      })
      btn.classList.add('selected')
      selectedPayment = opt.value

      document.getElementById('pay-label').textContent = opt.icon + '  ' + opt.value
      payTrigger.classList.add('chosen')
      togglePanel(false)

      pixWrap.classList.toggle('hidden', opt.value !== 'PIX')

      wBtn.disabled = false
      wBtn.classList.remove('whats-btn--locked')
    }
    payPanel.appendChild(btn)
  })

  /* Toggle do painel */
  var panelOpen = false
  payTrigger.onclick = function() { togglePanel(!panelOpen) }
  function togglePanel(open) {
    panelOpen = open
    payPanel.classList.toggle('open', open)
    var arrow = document.getElementById('pay-arrow')
    if (arrow) arrow.textContent = open ? '▴' : '▾'
  }

  /* Monta a hierarquia */
  payWrap.appendChild(payTrigger)
  payWrap.appendChild(payPanel)
  payWrap.appendChild(pixWrap)
  payWrap.appendChild(wBtn)

  return payWrap
}
