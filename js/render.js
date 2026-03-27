/* ============================================================
   js/render.js — Builders de card e render da página
   Depende de: utils.js, modal.js (modalOpen), opcoes.js (opcoesOpen),
               cart.js (cartAdd), CARDAPIO (data.js)
============================================================ */

/* ── Bloco de imagem com lazy load ───────────────────────────── */
function buildImg(item, className) {
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

/* ── Botão "+" — abre opções ou adiciona direto ──────────────── */
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

/* ── Rodapé do card: preço + botão ───────────────────────────── */
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

/* ── Card quadrado (padrão) ──────────────────────────────────── */
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
    info.className   = 'card-info'
    info.textContent = item.info
    body.appendChild(info)
  }
  body.appendChild(buildFooter(item))

  card.appendChild(name)
  card.appendChild(buildImg(item, 'card-thumb'))
  card.appendChild(body)
  return card
}

/* ── Card wide (Porções Maiores — layout:'wide') ─────────────── */
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
    info.className   = 'card-info'
    info.textContent = item.info
    body.appendChild(info)
  }
  var desc = document.createElement('p')
  desc.className   = 'card-desc'
  desc.textContent = item.descricao
  body.appendChild(desc)
  body.appendChild(buildFooter(item))

  card.appendChild(name)
  card.appendChild(buildImg(item, 'wide-img'))
  card.appendChild(body)
  return card
}

/* ── Roteador: escolhe o builder pelo campo layout ───────────── */
function buildItem(item) {
  if (item.layout === 'wide') return buildWide(item)
  return buildCard(item)
}

/* ── Skeleton loader proporcional ao nº de itens ─────────────── */
function buildSkeletons(n) {
  var grid = document.createElement('div')
  grid.className = 'skel-grid'
  for (var i = 0; i < Math.min(n, 6); i++) {
    grid.innerHTML +=
      '<div class="skel-card">' +
        '<div class="skel-block skel-name-top"></div>' +
        '<div class="skel-block skel-thumb"></div>' +
        '<div class="skel-body">' +
          '<div class="skel-block skel-price"></div>' +
        '</div>' +
      '</div>'
  }
  return grid
}

/* ── Header: logo + abas de navegação ───────────────────────── */
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

  /* Clique no logo volta ao topo */
  document.getElementById('logo-title').onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  var nav = document.getElementById('nav-tabs')
  CARDAPIO.forEach(function(cat) {
    var btn = document.createElement('button')
    btn.className   = 'tab'
    btn.id          = 'tab-' + cat.id
    btn.textContent = cat.label
    btn.onclick = function() {
      var section = document.getElementById('section-' + cat.id)
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    nav.appendChild(btn)
  })
}

/*
  renderAllSections — Renderiza todo o cardápio de uma vez.
  Cada categoria vira uma <section id="section-{id}"> para o scroll-spy.
  Exibe skeleton primeiro; substitui pelo conteúdo real após 280ms.
*/
function renderAllSections() {
  var main = document.getElementById('main')
  main.innerHTML = ''

  CARDAPIO.forEach(function(cat) {
    var section = document.createElement('section')
    section.id        = 'section-' + cat.id
    section.className = 'cat-section'

    var totalItens = cat.subcategorias.reduce(function(n, sub) {
      return n + sub.itens.length
    }, 0)
    section.appendChild(buildSkeletons(totalItens))

    ;(function(s, categoria) {
      setTimeout(function() {
        s.innerHTML = ''

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

/*
  setupScrollSpy — IntersectionObserver que atualiza a aba ativa
  conforme a seção entra no terço central da tela.
*/
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
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  })

  CARDAPIO.forEach(function(cat) {
    var el = document.getElementById('section-' + cat.id)
    if (el) observer.observe(el)
  })

  var firstTab = document.getElementById('tab-' + CARDAPIO[0].id)
  if (firstTab) firstTab.classList.add('active')
}
