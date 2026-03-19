/* ============================================================
   app.js — Lógica da aplicação
   Depende de: data-*.js + data.js (carregados antes no HTML)
   Seções:
     1. Estado
     2. Utilitários
     3. Builders de card
     4. Render da página (scroll-based, tudo renderizado de uma vez)
     5. Modal de detalhes do item
     6. Modal de opções (itens com sub-seleções)
     7. Carrinho
     8. Toast
     9. Inicialização
============================================================ */


/* ── 1. ESTADO ──────────────────────────────────────────────── */

var cart = {}   /* { [key]: { key, item, selections, preco, qty } } */


/* ── 2. UTILITÁRIOS ─────────────────────────────────────────── */

function fmtPrice(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',')
}

var FALLBACK_EMOJI = '🍽️'

/* Gera chave única para agrupamento: mesmo item + mesmas opções = mesma chave */
function buildCartKey(item, selections) {
  if (!selections || !Object.keys(selections).length) return item.id
  var parts = Object.keys(selections).sort().map(function(k) { return k + '=' + selections[k] })
  return item.id + '|' + parts.join('|')
}

/* Preço base + soma dos extras das opções escolhidas */
function calcPreco(item, selections) {
  if (!item.opcoes || !selections) return item.preco
  var extras = item.opcoes.reduce(function(sum, grupo) {
    var choice = grupo.choices.find(function(c) { return c.id === selections[grupo.label] })
    return sum + (choice ? choice.extra : 0)
  }, 0)
  return item.preco + extras
}

/* Texto resumido das opções para exibir no carrinho e no WhatsApp */
function buildSelectionsLabel(item, selections) {
  if (!item.opcoes || !selections) return ''
  return item.opcoes.map(function(grupo) {
    var choice = grupo.choices.find(function(c) { return c.id === selections[grupo.label] })
    return choice ? choice.label : null
  }).filter(Boolean).join(' • ')
}

/* Bloco de imagem com lazy load e fallback para emoji */
function buildImg(item, className) {
  var wrap     = document.createElement('div')
  var fallback = item.emoji || FALLBACK_EMOJI
  wrap.className = className

  if (item.img) {
    var img = document.createElement('img')
    img.src     = item.img
    img.alt     = item.nome
    img.loading = 'lazy'                       /* ← lazy load */
    img.onerror = function() { wrap.innerHTML = fallback }
    wrap.appendChild(img)
  } else {
    wrap.textContent = fallback
  }
  return wrap
}

/* Botão "+" — abre modal de opções se necessário, senão adiciona direto */
function buildAddBtn(item) {
  var btn = document.createElement('button')
  btn.className   = 'add-btn'
  btn.textContent = '+'
  btn.onclick = function(e) {
    e.stopPropagation()
    if (item.opcoes && item.opcoes.length) opcoesOpen(item, null, null)
    else cartAdd(item, {})
  }
  return btn
}

/* Rodapé do card: preço à esquerda, botão à direita */
function buildFooter(item) {
  var footer = document.createElement('div')
  footer.className = 'card-footer'

  var price = document.createElement('span')
  price.className   = 'card-price'
  price.textContent = fmtPrice(item.preco)

  footer.appendChild(price)
  footer.appendChild(buildAddBtn(item))
  return footer
}


/* ── 3. BUILDERS DE CARD ────────────────────────────────────── */

/* Card quadrado: nome acima da imagem, centralizado */
function buildCard(item) {
  var card = document.createElement('div')
  card.className = 'card'
  card.onclick   = function() { modalOpen(item) }

  var name = document.createElement('p')
  name.className   = 'card-name'
  name.textContent = item.nome

  var body = document.createElement('div')
  body.className = 'card-body'
  if (item.info) {
    var info = document.createElement('p')
    info.className = 'card-info'; info.textContent = item.info
    body.appendChild(info)
  }
  body.appendChild(buildFooter(item))

  card.appendChild(name)
  card.appendChild(buildImg(item, 'card-thumb'))
  card.appendChild(body)
  return card
}

/* Card wide (Porções Maiores): nome acima da imagem, ocupa 2 colunas */
function buildWide(item) {
  var card = document.createElement('div')
  card.className = 'card card-wide'
  card.onclick   = function() { modalOpen(item) }

  var name = document.createElement('p')
  name.className   = 'card-name'
  name.textContent = item.nome

  var body = document.createElement('div')
  body.className = 'card-body'
  if (item.info) {
    var info = document.createElement('p')
    info.className = 'card-info'; info.textContent = item.info
    body.appendChild(info)
  }
  var desc = document.createElement('p')
  desc.className = 'card-desc'; desc.textContent = item.descricao
  body.appendChild(desc)
  body.appendChild(buildFooter(item))

  card.appendChild(name)
  card.appendChild(buildImg(item, 'wide-img'))
  card.appendChild(body)
  return card
}

/* Row: linha horizontal para bebidas sem foto */
function buildRow(item) {
  var row = document.createElement('div')
  row.className = 'row'
  row.onclick   = function() { modalOpen(item) }
  row.innerHTML =
    '<div class="row-icon">' + (item.emoji || FALLBACK_EMOJI) + '</div>' +
    '<div class="row-info">' +
      '<p class="row-name">' + item.nome      + '</p>' +
      '<p class="row-desc">' + item.descricao + '</p>' +
    '</div>' +
    '<span class="row-price">' + fmtPrice(item.preco) + '</span>'
  return row
}

/* Roteador: 'wide' → card largo, qualquer outro → card quadrado */
function buildItem(item) {
  if (item.layout === 'wide') return buildWide(item)
  return buildCard(item)
}

/* Skeleton proporcional à quantidade de itens */
function buildSkeletons(n) {
  var grid = document.createElement('div')
  grid.className = 'skel-grid'
  for (var i = 0; i < Math.min(n, 6); i++) {
    grid.innerHTML +=
      '<div class="skel-card">' +
        '<div class="skel-block skel-name-top"></div>' +
        '<div class="skel-block skel-thumb"></div>' +
        '<div class="skel-body"><div class="skel-block skel-price"></div></div>' +
      '</div>'
  }
  return grid
}


/* ── 4. RENDER DA PÁGINA ────────────────────────────────────── */

/*
  Estratégia de navegação por scroll:
  - Todo o conteúdo é renderizado de uma vez no carregamento inicial
  - Cada categoria recebe uma <section id="section-{id}">
  - Clicar numa aba faz scrollIntoView na section correspondente
  - IntersectionObserver detecta qual section está visível
    e atualiza a aba ativa automaticamente conforme o usuário rola
*/

function renderHeader() {
  var header = document.getElementById('header')
  header.innerHTML =
    '<div class="header-top">' +
      '<div class="logo-block">' +
        '<p class="logo-sub">Cardápio</p>' +
        '<p class="logo-1" id="logo-title">Churrasquinho do Juanete</p>' +
        '<p class="logo-sub">Restaurante</p>' +
      '</div>' +
    '</div>' +
    '<nav id="nav-tabs"></nav>'

  /* Logo clicável: volta ao topo da página */
  document.getElementById('logo-title').onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  var nav = document.getElementById('nav-tabs')
  CARDAPIO.forEach(function(cat) {
    var btn = document.createElement('button')
    btn.className    = 'tab'
    btn.id           = 'tab-' + cat.id
    btn.textContent  = cat.label
    btn.onclick = function() {
      var section = document.getElementById('section-' + cat.id)
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    nav.appendChild(btn)
  })
}

function renderAllSections() {
  var main = document.getElementById('main')
  main.innerHTML = ''

  CARDAPIO.forEach(function(cat) {
    /* Wrapper da categoria com id para o scroll */
    var section = document.createElement('section')
    section.id        = 'section-' + cat.id
    section.className = 'cat-section'

    /* Skeleton enquanto as imagens carregam via lazy load */
    var totalItens = cat.subcategorias.reduce(function(n, sub) {
      return n + sub.itens.length
    }, 0)
    section.appendChild(buildSkeletons(totalItens))

    /* Substituímos o skeleton pelo conteúdo real em um frame */
    ;(function(s, categoria) {
      setTimeout(function() {
        s.innerHTML = ''

        /* Título da categoria como âncora visual */
        var h1 = document.createElement('h1')
        h1.className   = 'cat-title'
        h1.textContent = categoria.label
        s.appendChild(h1)

        categoria.subcategorias.forEach(function(sub) {
          if (sub.label) {
            var h2 = document.createElement('h2')
            h2.className   = 'sub-title'
            h2.textContent = sub.label
            s.appendChild(h2)
          }
          var wrapper = document.createElement('div')
          wrapper.className = 'grid'
          sub.itens.forEach(function(item) { wrapper.appendChild(buildItem(item)) })
          s.appendChild(wrapper)
        })
      }, 280)
    })(section, cat)

    main.appendChild(section)
  })

  setupScrollSpy()
}

/* IntersectionObserver: atualiza aba ativa conforme o scroll */
function setupScrollSpy() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id.replace('section-', '')
        document.querySelectorAll('.tab').forEach(function(t) {
          t.classList.toggle('active', t.id === 'tab-' + id)
        })
      }
    })
  }, {
    rootMargin: '-40% 0px -55% 0px',   /* ativa quando a seção está no terço do meio da tela */
    threshold: 0
  })

  CARDAPIO.forEach(function(cat) {
    var el = document.getElementById('section-' + cat.id)
    if (el) observer.observe(el)
  })

  /* Marca a primeira aba como ativa imediatamente */
  var firstTab = document.getElementById('tab-' + CARDAPIO[0].id)
  if (firstTab) firstTab.classList.add('active')
}


/* ── 5. MODAL DE DETALHES DO ITEM ───────────────────────────── */

function modalOpen(item) {
  var overlay  = document.getElementById('modal-overlay')
  var fallback = item.emoji || FALLBACK_EMOJI

  /* Imagem com lazy load no modal */
  var mediaHTML = item.img
    ? '<div class="modal-img"><img src="' + item.img + '" alt="' + item.nome + '" loading="lazy" onerror="this.parentNode.innerHTML=\'' + fallback + '\'"></div>'
    : '<div class="modal-img">' + fallback + '</div>'

  var addLabel = (item.opcoes && item.opcoes.length) ? 'Escolher opções' : '+ Adicionar ao pedido'

  overlay.innerHTML =
    '<div class="sheet">' +
      '<div class="sheet-handle"></div>' +
      mediaHTML +
      '<h2 class="modal-title">'  + item.nome + '</h2>' +
      (item.info ? '<p class="modal-info">' + item.info + '</p>' : '') +
      '<p class="modal-desc">'    + item.descricao + '</p>' +
      '<p class="modal-price">'   + fmtPrice(item.preco) + '</p>' +
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


/* ── 6. MODAL DE OPÇÕES ─────────────────────────────────────── */

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
      '<p class="opcoes-preco" id="opcoes-preco">' + fmtPrice(calcPreco(item, selections)) + '</p>' +
    '</div>'

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
      pill.textContent = choice.label + (choice.extra > 0 ? ' (+' + fmtPrice(choice.extra) + ')' : '')
      if (selections[grupo.label] === choice.id) pill.classList.add('selected')

      pill.onclick = function() {
        pills.querySelectorAll('.opcoes-pill').forEach(function(p) { p.classList.remove('selected') })
        pill.classList.add('selected')
        selections[grupo.label] = choice.id
        document.getElementById('opcoes-preco').textContent = fmtPrice(calcPreco(item, selections))
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
    document.getElementById('opcoes-add-btn').disabled = hasUnfilled(item, selections)
  }
}

function hasUnfilled(item, selections) {
  return item.opcoes.some(function(g) { return g.obrigatorio && !selections[g.label] })
}

function opcoesClose() {
  document.getElementById('opcoes-overlay').classList.add('hidden')
  document.body.style.overflow = ''
}


/* ── 7. CARRINHO ────────────────────────────────────────────── */

function cartAdd(item, selections) {
  var key   = buildCartKey(item, selections)
  var preco = calcPreco(item, selections)
  if (cart[key]) cart[key].qty++
  else cart[key] = { key: key, item: item, selections: selections, preco: preco, qty: 1 }
  cartUpdateBadge()
  toastShow('✔ ' + item.nome + ' adicionado!')
}

function cartIncrement(key) {
  if (cart[key]) { cart[key].qty++; cartUpdateBadge(); cartOpen() }
}

function cartDecrement(key) {
  if (!cart[key]) return
  cart[key].qty--
  if (cart[key].qty <= 0) delete cart[key]
  cartUpdateBadge()
  cartOpen()
}

function cartUpdateBadge() {
  var total = Object.values(cart).reduce(function(s, e) { return s + e.qty }, 0)
  var badge = document.getElementById('cart-count')
  badge.textContent = total
  badge.classList.toggle('hidden', total === 0)
}

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

  if (!entries.length) {
    list.innerHTML = '<p class="cart-empty">Nenhum item adicionado ainda.</p>'
    overlay.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
    return
  }

  var ul = document.createElement('ul')
  entries.forEach(function(e) {
    var subLabel = buildSelectionsLabel(e.item, e.selections)
    var li = document.createElement('li')
    li.className = 'cart-item'

    /* Info: nome, opções escolhidas, quantidade e preço */
    var info = document.createElement('div')
    info.className = 'cart-item-info'
    info.innerHTML =
      '<p class="cart-item-name">'  + e.item.nome + '</p>' +
      (subLabel ? '<p class="cart-item-opts">' + subLabel + '</p>' : '') +
      '<p class="cart-item-qty-price">' +
        '<span class="cart-item-qty">' + e.qty + '×</span> ' +
        '<span class="cart-item-price">' + fmtPrice(e.preco * e.qty) + '</span>' +
      '</p>'

    /*
      Controles verticais, ordem de cima para baixo:
        + (azul)   — adiciona uma unidade
        ··· (cinza) — edita opções (só aparece se o item tem opcoes)
        − (vermelho) — remove uma unidade
    */
    var controls = document.createElement('div')
    controls.className = 'cart-controls'

    var btnPlus = document.createElement('button')
    btnPlus.className   = 'ctrl-btn ctrl-plus'
    btnPlus.textContent = '+'
    btnPlus.title       = 'Adicionar mais um'
    btnPlus.onclick = function() { cartIncrement(e.key) }

    var btnEdit = document.createElement('button')
    btnEdit.className = 'ctrl-btn ctrl-edit'
    btnEdit.title     = 'Alterar opções'
    btnEdit.innerHTML = '<span class="dots">•••</span>'
    btnEdit.onclick = function() {
      cartClose()
      opcoesOpen(e.item, e.key, e.selections)
    }
    if (!e.item.opcoes || !e.item.opcoes.length) btnEdit.style.display = 'none'

    var btnMinus = document.createElement('button')
    btnMinus.className   = 'ctrl-btn ctrl-minus'
    btnMinus.textContent = '−'
    btnMinus.title       = 'Remover uma unidade'
    btnMinus.onclick = function() { cartDecrement(e.key) }

    /* Ordem top→bottom: + ··· − */
    controls.appendChild(btnPlus)
    controls.appendChild(btnEdit)
    controls.appendChild(btnMinus)

    li.appendChild(info)
    li.appendChild(controls)
    ul.appendChild(li)
  })
  list.appendChild(ul)

  list.insertAdjacentHTML('beforeend',
    '<div class="cart-total">' +
      '<span class="cart-total-label">Total</span>' +
      '<span class="cart-total-value">' + fmtPrice(total) + '</span>' +
    '</div>'
  )

  /* ── Seletor de pagamento (dropdown para baixo com pills) ── */
  var selectedPayment = ''

  var payWrap = document.createElement('div')
  payWrap.className = 'payment-wrap'

  /* Botão trigger: mostra o método selecionado ou placeholder */
  var payTrigger = document.createElement('button')
  payTrigger.className   = 'payment-trigger'
  payTrigger.id          = 'payment-trigger'
  payTrigger.innerHTML   =
    '<span id="pay-label">Selecionar forma de pagamento</span>' +
    '<span class="pay-arrow" id="pay-arrow">▾</span>'

  /* Painel de opções que desce */
  var payPanel = document.createElement('div')
  payPanel.className = 'payment-panel'
  payPanel.id        = 'payment-panel'

  var payOpts = [
    { value: 'Dinheiro',          icon: '💵' },
    { value: 'PIX',               icon: '📱' },
    { value: 'Cartão de Crédito', icon: '💳' },
    { value: 'Cartão de Débito',  icon: '💳' }
  ]

  payOpts.forEach(function(opt) {
    var btn = document.createElement('button')
    btn.className   = 'pay-opt'
    btn.dataset.val = opt.value
    btn.textContent = opt.icon + '  ' + opt.value
    btn.onclick = function() {
      /* Marca selecionado */
      payPanel.querySelectorAll('.pay-opt').forEach(function(b) { b.classList.remove('selected') })
      btn.classList.add('selected')
      selectedPayment = opt.value

      /* Atualiza trigger */
      document.getElementById('pay-label').textContent = opt.icon + '  ' + opt.value
      payTrigger.classList.add('chosen')

      /* Fecha o painel */
      togglePayPanel(false)

      /* PIX: mostra botão de copiar chave */
      pixWrap.classList.toggle('hidden', opt.value !== 'PIX')

      /* Habilita o botão WhatsApp */
      wBtn.disabled = false
      wBtn.classList.remove('whats-btn--locked')
    }
    payPanel.appendChild(btn)
  })

  /* Toggle do painel ao clicar no trigger */
  var panelOpen = false
  payTrigger.onclick = function() { togglePayPanel(!panelOpen) }
  function togglePayPanel(open) {
    panelOpen = open
    payPanel.classList.toggle('open', open)
    document.getElementById('pay-arrow').textContent = open ? '▴' : '▾'
  }

  /* PIX: botão copiar chave (oculto por padrão) */
  var pixWrap = document.createElement('div')
  pixWrap.className = 'pix-wrap hidden'
  pixWrap.innerHTML =
    '<button id="pix-copy-btn" class="pix-copy-btn">📋 Copiar chave PIX</button>' +
    '<p class="pix-key">49.549.786/0001-90</p>'

  pixWrap.querySelector('#pix-copy-btn').onclick = function() {
    navigator.clipboard.writeText('49549786000190').then(function() {
      var btn = pixWrap.querySelector('#pix-copy-btn')
      if (btn) {
        btn.textContent = '✅ Chave copiada!'
        setTimeout(function() { btn.textContent = '📋 Copiar chave PIX' }, 2500)
      }
    })
  }

  payWrap.appendChild(payTrigger)
  payWrap.appendChild(payPanel)
  payWrap.appendChild(pixWrap)
  list.appendChild(payWrap)

  /* ── Botão WhatsApp ── */
  var wBtn = document.createElement('button')
  wBtn.className  = 'whats-btn whats-btn--locked'
  wBtn.id         = 'whats-btn'
  wBtn.disabled   = true
  wBtn.innerHTML  =
    'Finalizar pedido pelo WhatsApp' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">' +
      '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
    '</svg>'

  wBtn.onclick = function() {
    if (!selectedPayment) {
      /* Animação de shake nos elementos de pagamento */
      ;[payWrap, wBtn].forEach(function(el) {
        el.classList.remove('shake')
        void el.offsetWidth   /* reflow para reiniciar animação */
        el.classList.add('shake')
        el.addEventListener('animationend', function() { el.classList.remove('shake') }, { once: true })
      })
      /* Abre o painel de opções automaticamente */
      togglePayPanel(true)
      return
    }
    sendWhatsApp(entries, total, selectedPayment)
  }

  list.appendChild(wBtn)

  overlay.classList.remove('hidden')
  document.body.style.overflow = 'hidden'
}

function cartClose() {
  document.getElementById('cart-overlay').classList.add('hidden')
  document.body.style.overflow = ''
}

/* cartSendWhatsApp removido — agora utiliza sendWhatsApp() de whatsapp-message.js */


/* ── 8. TOAST ───────────────────────────────────────────────── */

var toastTimer = null

function toastShow(msg) {
  var el = document.getElementById('toast')
  el.textContent = msg
  el.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(function() { el.classList.remove('show') }, 2000)
}


/* ── 9. INICIALIZAÇÃO ───────────────────────────────────────── */

document.getElementById('cart-btn').onclick = cartOpen

document.getElementById('modal-overlay').onclick = function(e) {
  if (e.target === e.currentTarget) modalClose()
}
document.getElementById('cart-overlay').onclick = function(e) {
  if (e.target === e.currentTarget) cartClose()
}
document.getElementById('opcoes-overlay').onclick = function(e) {
  if (e.target === e.currentTarget) opcoesClose()
}

/* Render inicial: header + todas as seções de uma vez */
renderHeader()
renderAllSections()
