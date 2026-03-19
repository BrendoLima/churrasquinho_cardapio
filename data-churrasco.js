/* ── data-churrasco.js ──────────────────────────────────────── */
/* Único arquivo com layout 'wide' — Porções Maiores.            */
var DATA_CHURRASCO = {
  id: 'churrasco',
  label: 'Churrasco',
  subcategorias: [
    {
      label: 'Porções Maiores',
      itens: [
        {
          id: 'churrasco_casal',
          nome: 'Churrasco na Pedra',
          preco: 65.00,
          layout: 'wide',
          info: 'Para Casal — 400g',
          img: '',
          descricao: 'Carne + farofa + tomate + pimentão + cebola + batata frita ou mandioquinha.',
          opcoes: [
            {
              label: 'Acompanhamento',
              obrigatorio: true,
              choices: [
                {
                  id: 'batata',
                  label: 'Batata Frita',
                  extra: 0
                },
                {
                  id: 'mandioquinha',
                  label: 'Mandioquinha',
                  extra: 0
                }
              ]
            }
          ]
        },

        {
          id: 'churrasco_galera',
          nome: 'Churrasco na Pedra',
          preco: 110.00,
          layout: 'wide',
          info: 'Para Galera — 800g',
          img: '',
          descricao: '800g de carne + farofa + tomate + pimentão + cebola + batata frita ou mandioquinha.',
          opcoes: [
            {
              label: 'Acompanhamento',
              obrigatorio: true,
              choices: [
                {
                  id: 'batata',
                  label: 'Batata Frita',
                  extra: 0
                },
                {
                  id: 'mandioquinha',
                  label: 'Mandioquinha',
                  extra: 0
                }
              ]
            }
          ]
        },

        {
          id: 'mista_casal',
          nome: 'Porção Mista',
          preco: 70.00,
          layout: 'wide',
          info: 'Para Casal — 400g',
          img: '',
          descricao: 'Boi + Porco + Frango + Linguiça + pimentão + farofa + tomate + cebola + batata frita ou mandioquinha.',
          opcoes: [
            {
              label: 'Acompanhamento',
              obrigatorio: true,
              choices: [
                {
                  id: 'batata',
                  label: 'Batata Frita',
                  extra: 0
                },
                {
                  id: 'mandioquinha',
                  label: 'Mandioquinha',
                  extra: 0
                }
              ]
            }
          ]
        },

        {
          id: 'mista_galera',
          nome: 'Porção Mista',
          preco: 120.00,
          layout: 'wide',
          info: 'Para Galera — 800g',
          img: '',
          descricao: '800g de Boi + Porco + Frango + Linguiça + pimentão + farofa + tomate + cebola + batata frita ou mandioquinha.',
          opcoes: [
            {
              label: 'Acompanhamento',
              obrigatorio: true,
              choices: [
                {
                  id: 'batata',
                  label: 'Batata Frita',
                  extra: 0
                },
                {
                  id: 'mandioquinha',
                  label: 'Mandioquinha',
                  extra: 0
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
