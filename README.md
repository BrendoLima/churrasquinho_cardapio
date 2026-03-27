# churrasquinho-cardapio

Cardápio virtual mobile para o **Churrasquinho do Juanete**, churrascaria em Porciúncula/RJ.  
Funciona diretamente no navegador — sem servidor, sem build, sem dependências.

---

### URL: <https://churrasquinho-cardapio.vercel.app/>

---

### Notas do autor

Melhorias planejadas para versões futuras:

- **Segurança** — variáveis de ambiente para dados sensíveis
- **Manutenibilidade** — modularizar funções, reduzindo complexidade
- **Legibilidade** — tipificar o layout e separar o CSS
- **Organização** — padronizar e reescrever commits

---

## Funcionalidades

- **Navegação por scroll** — todas as seções renderizadas de uma vez; abas acompanham o scroll via `IntersectionObserver`
- **Sub-opções por item** — ex.: tipo de carne, acompanhamento, sabor; preço atualizado ao vivo
- **Carrinho inteligente** — agrupa apenas pedidos com as mesmas opções; suporta incrementar, decrementar e editar
- **Seletor de pagamento** — Dinheiro, PIX, Cartão de Crédito ou Débito; botão para copiar a chave PIX
- **Finalização via WhatsApp** — mensagem formatada com itens, total e método de pagamento; botão bloqueado até escolher o método
- **Lazy load** nas imagens; fallback automático para emoji quando a imagem falha
- **Vercel Analytics** integrado via `/_vercel/insights/script.js`

---

## Estrutura de arquivos

```
churrasquinho-cardapio/
│
├── index.html              # Shell HTML — carrega os scripts na ordem correta
├── style.css               # Estilos (tema madeira escura + dourado, fonte Nunito)
├── whatsapp-message.js     # Template e envio da mensagem via WhatsApp
│
├── data/
│   ├── sections.js         # Registry: lista de seções e seus arquivos JSON
│   ├── especiais.json      # Dados: Churrasquinho, Jantinha e Acompanhamentos
│   ├── porcoes.json        # Dados: Porções e Combos
│   ├── churrasco.json      # Dados: Porções Maiores (cards wide)
│   ├── bebidas.json        # Dados: Refrigerantes, Águas e outros
│   └── alcool.json         # Dados: Cervejas, Destilados, Drinks e Doces
│
└── js/
    ├── config.js           # Constantes: número do WhatsApp, chave PIX
    ├── utils.js            # Funções puras reutilizáveis
    ├── render.js           # Construtores de DOM (cards, header, seções)
    ├── modal.js            # Modais de detalhe e opções
    ├── cart.js             # Estado e UI do carrinho
    └── main.js             # Fetch dos JSONs e inicialização do app
```

### Ordem de carregamento dos scripts

```
sections.js → config.js → utils.js → render.js
→ modal.js → cart.js → whatsapp-message.js → main.js
```

---

## Como adicionar uma nova seção ao cardápio

1. Crie `data/nova-secao.json` com a estrutura abaixo
2. Adicione uma entrada em `data/sections.js`:
```js
{ id: 'nova-secao', label: 'Nome da Seção', file: 'data/nova-secao.json' }
```
Só isso — o resto acontece automaticamente.

---

## Estrutura do JSON de uma seção

```json
{
  "subcategorias": [
    {
      "label": "Nome da Subcategoria (opcional)",
      "itens": [
        {
          "id":        "id_unico",
          "nome":      "Nome do Item",
          "preco":     22.00,
          "descricao": "Descrição exibida no modal.",
          "img":       "",
          "info":      "400g",
          "layout":    "wide",
          "opcoes": [
            {
              "label":      "Acompanhamento",
              "obrigatorio": true,
              "choices": [
                { "id": "batata", "label": "Batata Frita", "extra": 0 },
                { "id": "mand",   "label": "Mandioquinha",  "extra": 0 }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

> `img: ""` = aguardando foto real. Substitua pela URL ou caminho relativo.  
> `layout: "wide"` = card retangular (use apenas em Porções Maiores).  
> `opcoes` e `info` são opcionais.

---

## Configurações rápidas

| O que mudar | Arquivo | Campo |
|---|---|---|
| Número do WhatsApp | `js/config.js` | `CONFIG.whatsappNumber` |
| Chave PIX | `js/config.js` | `CONFIG.pixKey` e `CONFIG.pixKeyDisplay` |
| Cores e fontes | `style.css` | Seção `1. Variáveis & Tipografia` |
| Imagem de um item | `data/*.json` | Campo `img` do item |

---

## Pré-requisitos para desenvolvimento local

Como os dados são carregados via `fetch()`, abrir o `index.html` diretamente pelo sistema de arquivos (`file://`) não funciona. Use um servidor local:

```bash
# Com Node.js
npx serve .

# Com Python
python -m http.server 8000

# Com VS Code
# Instale a extensão "Live Server" e clique em "Go Live"
```

Em produção (Vercel), nenhuma configuração adicional é necessária.

---

## Tecnologias

- HTML5 / CSS3 / JavaScript ES5 — sem frameworks, sem bundler
- [Google Fonts — Nunito](https://fonts.google.com/specimen/Nunito)
- [Vercel Analytics](https://vercel.com/docs/analytics) — ativo automaticamente ao hospedar na Vercel
- Web APIs: `fetch`, `Promise.all`, `IntersectionObserver`, `navigator.clipboard`

---

## Licença

Projeto de uso privado do estabelecimento **Churrasquinho do Juanete**.  
Repositório público para fins de portfólio. Não são aceitas contribuições externas.
