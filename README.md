# churrasquinho-cardapio

Cardápio virtual mobile para o **Churrasquinho do Juanete**, churrascaria localizada em Porciuncula/RJ.  
Desenvolvido para funcionar diretamente no navegador, sem servidor — basta abrir o `index.html`.

---

### URL: <https://churrasquinho-cardapio.vercel.app/>

---

### Comentários do Autor

Ainda pretendo fazer várias alterações na lista a seguir:

- Segurança: Como criar variáveis de ambiente para abarcar dados sensíveis.
- Mantenabilidade: Modularizar funções, reduzindo complexidade.
- Legibilidade: Tipificar o layout e separar o CSS.
- Organização: Padronizar e reescrever commits.

---

## Visão geral

Um cardápio interativo pensado para celular, com navegação por scroll, seleção de sub-opções por item, carrinho de pedidos e integração direta com WhatsApp para finalizar o pedido.

---

## Funcionalidades

- **Navegação por scroll contínuo** — todas as categorias renderizadas de uma vez; as abas do topo acompanham a posição na tela automaticamente via `IntersectionObserver`
- **Cards de itens** com nome acima da imagem, foto com lazy load e fallback para emoji
- **Sub-opções por item** — tipo de carne, acompanhamento, sabor; preço atualizado ao vivo conforme a escolha
- **Carrinho inteligente** — agrupa apenas pedidos com exatamente as mesmas opções; permite incrementar, decrementar e editar cada entrada
- **Seletor de pagamento** — Dinheiro, PIX, Cartão de Crédito ou Cartão de Débito; botão de copiar a chave PIX embutido
- **Finalização via WhatsApp** — mensagem formatada com todos os itens, total e método de pagamento; botão bloqueado até o método ser escolhido
- **Design responsivo** com tema madeira escura + dourado, fonte Nunito (Google Fonts)

---

## Estrutura de arquivos

```
churrasquinho-cardapio/
│
├── index.html               # Shell HTML — carrega CSS e JS na ordem correta
│
├── css/                     # Estilos modulares
│   ├── tokens.css           # Variáveis de design (cores, pesos, raios, transições)
│   ├── reset.css            # Normalização base e estilos do body
│   ├── animations.css       # Keyframes reutilizáveis (fadeSlide, shake, shimmer…)
│   ├── layout.css           # Header, nav e estrutura de seções
│   ├── cards.css            # Card quadrado e card wide (Porções Maiores)
│   ├── skeleton.css         # Loader de placeholder antes das imagens
│   ├── modals.css           # Overlays, sheets, modal de detalhes e de opções
│   ├── cart.css             # Itens, controles, pagamento, PIX e botão WhatsApp
│   └── ui.css               # Botão flutuante do carrinho e toast
│
├── data-especiais.js        # Dados: Especiais e Acompanhamentos
├── data-porcoes.js          # Dados: Porções e Combos
├── data-churrasco.js        # Dados: Porções Maiores (cards wide)
├── data-bebidas.js          # Dados: Bebidas não-alcoólicas
├── data-alcool.js           # Dados: Cervejas, Drinks, Destilados e Doces
│
├── js/                      # Módulos JavaScript
│   ├── registry.js          # Registro de seções → monta o array CARDAPIO
│   ├── utils.js             # Funções puras (fmtPrice, calcPreco, buildCartKey…)
│   ├── toast.js             # Feedback visual de ação
│   ├── modal.js             # Modal de detalhes do item
│   ├── opcoes.js            # Modal de sub-opções (tipo de carne, acompanhamento…)
│   ├── cart.js              # Estado do carrinho e toda a UI de compra
│   ├── render.js            # Builders de card e render da página
│   └── init.js              # Ponto de entrada: event listeners + render inicial
│
└── whatsapp-message.js      # Template e envio da mensagem via WhatsApp
```

---

## Ordem de carregamento

```
data-*.js  →  js/registry.js  →  js/utils.js  →  js/toast.js
→  js/modal.js  →  js/opcoes.js  →  js/cart.js  →  js/render.js
→  whatsapp-message.js  →  js/init.js
```

---

## Como adicionar uma nova seção ao cardápio

1. Crie o arquivo de dados na raiz, ex.: `data-sobremesas.js`:
```js
var DATA_SOBREMESAS = {
  id: 'sobremesas',
  label: 'Sobremesas',
  subcategorias: [
    {
      itens: [
        { id: 'pudim', nome: 'Pudim', preco: 12.00, img: '', descricao: '...' }
      ]
    }
  ]
}
```

2. Adicione o `<script>` no `index.html`, antes de `js/registry.js`:
```html
<script src="data-sobremesas.js"></script>
```

3. Registre em `js/registry.js`:
```js
var SECTION_REGISTRY = [
  { varName: 'DATA_ESPECIAIS'   },
  { varName: 'DATA_PORCOES'     },
  { varName: 'DATA_CHURRASCO'   },
  { varName: 'DATA_BEBIDAS'     },
  { varName: 'DATA_ALCOOL'      },
  { varName: 'DATA_SOBREMESAS'  },  // ← nova linha
]
```

A ordem do array define a ordem no cardápio. Para desativar temporariamente
uma seção, basta remover a entrada do registry — sem precisar mexer no HTML.

---

## Como editar itens existentes

Edite o arquivo `data-*.js` correspondente à seção desejada.

### Campos disponíveis por item

```js
{
  id:        'id_unico',         // identificador interno
  nome:      'Nome do Item',     // exibido no card e no carrinho
  preco:     22.00,              // valor base em reais
  descricao: 'Descrição curta.', // exibida no modal de detalhe
  img:       '',                 // URL ou caminho da foto ('' = sem imagem)
  info:      '400g',             // detalhe extra, ex: "400g" (opcional)
  layout:    'wide',             // 'wide' = card largo; omitido = card quadrado
  opcoes: [                      // sub-seleções (opcional)
    {
      label:       'Acompanhamento',
      obrigatorio: true,
      choices: [
        { id: 'batata', label: 'Batata Frita', extra: 0   },
        { id: 'mand',   label: 'Mandioquinha', extra: 0   },
        { id: 'queijo', label: 'Com Queijo',   extra: 3.0 }
      ]
    }
  ]
}
```

> **Imagens:** substitua `img: ''` pela URL ou caminho relativo,
> ex.: `img: 'assets/churrasquinho.jpg'`

---

## Configurações rápidas

| O que mudar            | Onde mudar                                          |
|------------------------|-----------------------------------------------------|
| Número do WhatsApp     | `whatsapp-message.js` → `var WHATSAPP_NUMBER`       |
| Chave PIX              | `js/cart.js` → `navigator.clipboard.writeText(...)` |
| Cores e fontes         | `css/tokens.css`                                    |
| Tamanhos e espaçamentos| `css/layout.css`, `css/cards.css`, `css/cart.css`   |
| Animações              | `css/animations.css`                                |
| Imagens dos itens      | Arquivo `data-*.js` correspondente → campo `img`    |

---

## Tecnologias

- HTML5 / CSS3 / JavaScript ES5 puro — sem frameworks, sem bundler
- [Google Fonts — Nunito](https://fonts.google.com/specimen/Nunito)
- [Vercel Analytics](https://vercel.com/docs/analytics) — via `/_vercel/insights/script.js`
- APIs Web: `IntersectionObserver`, `navigator.clipboard`

---

## Licença

Projeto de uso privado do estabelecimento **Churrasquinho do Juanete**.  
Repositório público para fins de portfólio e divulgação. Não são aceitas contribuições externas.
