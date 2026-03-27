/* ============================================================
   js/render.js — Construtores de DOM e lógica de renderização
   Depende de: utils.js (createImgBlock, fmtPrice)
               modal.js (openItemModal, openOpcoesModal)
               cart.js  (addToCart)
============================================================ */

/* ── Botões e rodapé do card ── */

function createAddButton(item) {
  var btn = document.createElement('button')
  btn.className   = 'add-btn'
  btn.textContent = '+'
  btn.onclick = function(e) {
    e.stopPropagation()
    item.opcoes && item.opcoes.length
      ? openOpcoesModal(item, null, null)
      : addToCart(item, {})
  }
  return btn
}

function createCardFooter(item) {
  var footer = document.createElement('div')
  footer.className = 'card-footer'

  var price = document.createElement('span')
  price.className   = 'card-price'
  price.textContent = fmtPrice(item.preco)

  footer.appendChild(price)
  footer.appendChild(createAddButton(item))
  return footer
}

/* ── Card builders ── */

function createSquareCard(item) {
  var card = document.createElement('div')
  card.className = 'card'
  card.onclick   = function() { openItemModal(item) }

  var name = document.createElement('p')
  name.className   = 'card-name'
  name.textContent = item.nome

  var body = document.createElement('div')
  body.className = 'card-body'

  if (item.info) {
    var info = document.createElement('p')
    info.className   = 'card-info'
    info.textContent = item.info
    body.appendChild(info)
  }
  body.appendChild(createCardFooter(item))

  card.appendChild(name)
  card.appendChild(createImgBlock(item, 'card-thumb'))
  card.appendChild(body)
  return card
}

function createWideCard(item) {
  var card = document.createElement('div')
  card.className = 'card card-wide'
  card.onclick   = function() { openItemModal(item) }

  var name = document.createElement('p')
  name.className   = 'card-name'
  name.textContent = item.nome

  var body = document.createElement('div')
  body.className = 'card-body'

  if (item.info) {
    var info = document.createElement('p')
    info.className   = 'card-info'
    info.textContent = item.info
    body.appendChild(info)
  }

  var desc = document.createElement('p')
  desc.className   = 'card-desc'
  desc.textContent = item.descricao
  body.appendChild(desc)
  body.appendChild(createCardFooter(item))

  card.appendChild(name)
  card.appendChild(createImgBlock(item, 'wide-img'))
  card.appendChild(body)
  return card
}

/* Roteador: 'wide' → card largo, qualquer outro → card quadrado */
function createItemCard(item) {
  return item.layout === 'wide' ? createWideCard(item) : createSquareCard(item)
}

/* ── Skeleton loader ── */

function createSkeletonGrid(itemCount) {
  var grid = document.createElement('div')
  grid.className = 'skel-grid'
  for (var i = 0; i < Math.min(itemCount, 6); i++) {
    grid.innerHTML +=
      '<div class="skel-card">' +
        '<div class="skel-block skel-name-top"></div>' +
        '<div class="skel-block skel-thumb"></div>' +
        '<div class="skel-body"><div class="skel-block skel-price"></div></div>' +
      '</div>'
  }
  return grid
}

/* ── Header e abas de navegação ── */

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

  document.getElementById('logo-title').onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  var nav = document.getElementById('nav-tabs')
  CARDAPIO.forEach(function(section) {
    var tab = document.createElement('button')
    tab.className   = 'tab'
    tab.id          = 'tab-' + section.id
    tab.textContent = section.label
    tab.onclick = function() {
      var target = document.getElementById('section-' + section.id)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    nav.appendChild(tab)
  })
}

/* ── Seções de itens ── */

function renderAllSections() {
  var main = document.getElementById('main')
  main.innerHTML = ''

  CARDAPIO.forEach(function(section) {
    var sectionEl = document.createElement('section')
    sectionEl.id        = 'section-' + section.id
    sectionEl.className = 'cat-section'

    var totalItems = section.subcategorias.reduce(function(n, sub) {
      return n + sub.itens.length
    }, 0)
    sectionEl.appendChild(createSkeletonGrid(totalItems))

    /* IIFE para capturar referências corretas no closure */
    ;(function(el, data) {
      setTimeout(function() {
        el.innerHTML = ''

        var title = document.createElement('h1')
        title.className   = 'cat-title'
        title.textContent = data.label
        el.appendChild(title)

        data.subcategorias.forEach(function(sub) {
          if (sub.label) {
            var subtitle = document.createElement('h2')
            subtitle.className   = 'sub-title'
            subtitle.textContent = sub.label
            el.appendChild(subtitle)
          }

          var grid = document.createElement('div')
          grid.className = 'grid'
          sub.itens.forEach(function(item) {
            grid.appendChild(createItemCard(item))
          })
          el.appendChild(grid)
        })
      }, 280)
    })(sectionEl, section)

    main.appendChild(sectionEl)
  })

  setupScrollSpy()
}

/* ── Scroll spy: aba ativa acompanha o scroll ── */

function setupScrollSpy() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return
      var id = entry.target.id.replace('section-', '')
      document.querySelectorAll('.tab').forEach(function(tab) {
        tab.classList.toggle('active', tab.id === 'tab-' + id)
      })
    })
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 })

  CARDAPIO.forEach(function(section) {
    var el = document.getElementById('section-' + section.id)
    if (el) observer.observe(el)
  })

  var firstTab = document.getElementById('tab-' + CARDAPIO[0].id)
  if (firstTab) firstTab.classList.add('active')
}
