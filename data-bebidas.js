/* ── data-bebidas.js ────────────────────────────────────────── */
/* Bebidas agora usam card quadrado (sem layout: 'row').          */
/* O campo emoji é usado como fallback quando não há imagem.      */
var DATA_BEBIDAS = {
  id: 'bebidas',
  label: 'Bebidas',
  icone: '🥤',
  subcategorias: [
    {
      label: 'Refrigerantes',
      itens: [
        {
          id: 'coca_cola',
          nome: 'Coca-Cola',
          preco: 7.00,
          emoji: '🥤',
          descricao: 'Lata, KS ou Zero.',
          opcoes: [
            {
              label: 'Tipo',
              obrigatorio: true,
              choices: [
                {
                  id: 'lata',
                  label: 'Lata',
                  extra: 0
                },
                {
                  id: 'ks',
                  label: 'KS',
                  extra: 0
                },
                {
                  id: 'zero',
                  label: 'Zero',
                  extra: 0
                }
              ]
            }
          ]
        },

        {
          id: 'guarana',
          nome: 'Guaraná Antarctica',
          preco: 6.00,
          emoji: '🟢',
          descricao: 'Lata Comum.'
        },

        {
          id: 'refrigerante_15',
          nome: 'Refrigerante 1,5L',
          preco: 14.00,
          emoji: '🍶',
          descricao: 'Guaraná ou Coca-Cola.',
          opcoes: [
            {
              label: 'Sabor',
              obrigatorio: true,
              choices: [
                {
                  id: 'guarana',
                  label: 'Guaraná',
                  extra: 0
                },
                {
                  id: 'coca',
                  label: 'Coca-Cola',
                  extra: 0
                }
              ]
            }
          ]
        }
      ]
    },

    {
      label: 'Águas & Outros',
      itens: [
        {
          id: 'agua_mineral',
          nome: 'Água Mineral',
          preco: 5.00,
          emoji: '💧',
          descricao: 'Com Gás ou Comum.',
          opcoes: [
            {
              label: 'Tipo',
              obrigatorio: true,
              choices: [
                {
                  id: 'comum',
                  label: 'Sem Gás',
                  extra: 0
                },
                {
                  id: 'gas',
                  label: 'Com Gás',
                  extra: 0
                }
              ]
            }
          ]
        },

        {
          id: 'h2oh',
          nome: 'H2OH',
          preco: 7.00,
          emoji: '💚',
          descricao: 'Com Limoneto ou Comum.',
          opcoes: [
            {
              label: 'Sabor',
              obrigatorio: true,
              choices: [
                {
                  id: 'limoneto',
                  label: 'Com Limoneto',
                  extra: 0
                },
                {
                  id: 'comum',
                  label: 'Comum',
                  extra: 0
                }
              ]
            }
          ]
        },

        {
          id: 'agua_tonica',
          nome: 'Água Tônica',
          preco: 7.00,
          emoji: '🫧',
          descricao: 'Comum ou Zero.',
          opcoes: [
            {
              label: 'Tipo',
              obrigatorio: true,
              choices: [
                {
                  id: 'comum',
                  label: 'Comum',
                  extra: 0
                },
                {
                  id: 'zero',
                  label: 'Zero',
                  extra: 0
                }
              ]
            }
          ]
        },

        {
          id: 'del_valle',
          nome: 'Del Valle 1L',
          preco: 12.00,
          emoji: '🍇',
          descricao: 'Sabor Uva.'
        },

        {
          id: 'energetico',
          nome: 'Energético',
          preco: 18.00,
          emoji: '⚡',
          descricao: 'Red Bull ou Monster.',
          opcoes: [
            {
              label: 'Marca',
              obrigatorio: true,
              choices: [
                {
                  id: 'redbull',
                  label: 'Red Bull',
                  extra: 0
                },
                {
                  id: 'monster',
                  label: 'Monster',
                  extra: 0
                }
              ]
            }
          ]
        },

        {
          id: 'guaravita',
          nome: 'Guaravita',
          preco: 5.00,
          emoji: '🟡',
          descricao: 'Comum.'
        }
      ]
    }
  ]
}
