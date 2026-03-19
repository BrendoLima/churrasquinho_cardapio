# churrasquinho-cardapio

Cardápio virtual mobile para o **Churrasquinho do Juanete**, churrascaria localizada em Porciuncula/RJ.  
Desenvolvido para funcionar diretamente no navegador, sem servidor — basta abrir o `index.html`.

### URL: <https://churrasquinho-cardapio.vercel.app/>

---

### Comentários do Autor (Importante!!!)

__ Ainda pretendo fazer várias alterações na lista a seguir:

* Segurança: Como criar variáveis de ambiente para abarcar dados sensíveis.
* Mantenabilidade: Modularizar funções, reduzindo complexidade.
* Legibilidade: Tipificar o layout e separar o CSS.
* Organização: Padronizar e reescrever commits.

---

## Visão geral

Um cardápio interativo pensado para celular, com navegação por scroll, seleção de sub-opções por item, carrinho de pedidos e integração direta com WhatsApp para finalizar o pedido.

![Preview do cardápio em modo escuro com tema madeira e dourado]()

---

## Funcionalidades

* **Navegação por scroll contínuo** — todas as categorias renderizadas de uma vez; as abas do topo acompanham a posição na tela automaticamente via `IntersectionObserver`
* **Cards de itens** com nome acima da imagem, foto com lazy load e fallback para emoji
* **Sub-opções por item** — ex.: tipo de carne, acompanhamento, sabor; preço atualizado ao vivo conforme a escolha
* **Carrinho inteligente** — agrupa apenas pedidos com exatamente as mesmas opções; permite incrementar, decrementar e editar cada entrada
* **Seletor de pagamento** — Dinheiro, PIX, Cartão de Crédito ou Cartão de Débito; botão de copiar a chave PIX embutido
* **Finalização via WhatsApp** — mensagem formatada com todos os itens, total e método de pagamento; botão bloqueado até o método ser escolhido
* **Design responsivo** com tema madeira escura + dourado, fonte Nunito (Google Fonts)

---

## Estrutura de arquivos

```
churrasquinho-cardapio/
│
├── index.html              # Shell HTML — carrega os scripts na ordem correta
├── style.css               # Todo o estilo do projeto
│
├── data-especiais.js       # Dados: Especiais e Acompanhamentos
├── data-porcoes.js         # Dados: Porções e Combos
├── data-churrasco.js       # Dados: Porções Maiores (cards wide)
├── data-bebidas.js         # Dados: Bebidas não-alcoólicas
├── data-alcool.js          # Dados: Cervejas, Drinks, Destilados e Doces
├── data.js                 # Assembler — monta o array global CARDAPIO
│
├── app.js                  # Lógica da aplicação (render, carrinho, modais)
└── whatsapp-message.js     # Template e envio da mensagem via WhatsApp
```

### Ordem de carregamento obrigatória

```html
data-especiais.js → data-porcoes.js → data-churrasco.js
→ data-bebidas.js → data-alcool.js → data.js → app.js → whatsapp-message.js
```

---

## Como usar

1. Baixe ou clone este repositório
2. Abra o arquivo `index.html` em qualquer navegador moderno
3. Nenhum servidor, build ou dependência necessária

```bash
git clone https://github.com/seu-usuario/churrasquinho-cardapio.git
cd churrasquinho-cardapio
# abra index.html no navegador
```

---

## Como editar o cardápio

Cada seção tem seu próprio arquivo de dados. Para alterar preços, nomes, imagens ou opções, edite o arquivo correspondente:

| Arquivo | O que contém |
|---|---|
| `data-especiais.js` | Churrasquinho, Jantinha e Acompanhamentos |
| `data-porcoes.js` | Porções fritas, Combos |
| `data-churrasco.js` | Churrasco na Pedra e Porção Mista (400g / 800g) |
| `data-bebidas.js` | Refrigerantes, Águas e outros |
| `data-alcool.js` | Cervejas, Destilados, Drinks e Doces |

### Campos de cada item

```js
{
  id:        'id_unico',          // identificador interno
  nome:      'Nome do Item',      // exibido no card e no carrinho
  preco:     22.00,               // valor base em reais
  descricao: 'Descrição curta.',  // exibida no modal de detalhe
  img:       'https://...',       // URL da foto (opcional)
  emoji:     '🍖',               // fallback quando não há foto
  info:      '400g',              // informação extra (opcional)
  layout:    'wide',              // 'wide' = card largo; omitido = card quadrado
  opcoes: [                       // sub-seleções (opcional)
    {
      label:      'Acompanhamento',
      obrigatorio: true,
      choices: [
        { id: 'batata', label: 'Batata Frita', extra: 0 },
        { id: 'mand',   label: 'Mandioquinha', extra: 0 }
      ]
    }
  ]
}
```

---

## Configurações rápidas

| O que mudar | Onde mudar |
|---|---|
| Número do WhatsApp | `whatsapp-message.js` → `var WHATSAPP_NUMBER` |
| Chave PIX | `app.js` → `navigator.clipboard.writeText('...')` |
| Cores e fontes | `style.css` → seção `1. Variáveis & Tipografia` |
| Imagens dos itens | Arquivo `data-*.js` correspondente → campo `img` |

---

## Tecnologias

* HTML5 / CSS3 / JavaScript ES5 puro — sem frameworks, sem bundler
* [Google Fonts — Nunito](https://fonts.google.com/specimen/Nunito)
* [loremflickr.com](https://loremflickr.com) — imagens placeholder (substituir por fotos reais)
* API Web: `IntersectionObserver`, `navigator.clipboard`

---

## Licença

Projeto de uso privado do estabelecimento **Churrasquinho do Juanete**.  
Repositório público para fins de portfólio e divulgação. Não são aceitas contribuições externas.
