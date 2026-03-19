/* ── data-porcoes.js ────────────────────────────────────────── */
/* Todos os cards são quadrados (sem layout: 'wide' ou 'row').   */
var DATA_PORCOES = {
  id: 'porcoes',
  label: 'Porções',
  icone: '🍖',
  subcategorias: [
    {
      itens: [
        {
          id: 'torresminho',
          nome: 'Torresminho',
          preco: 28.00,
          img: 'https://loremflickr.com/400/400/pork,crackling,crispy',
          descricao: 'Crocante e saboroso, perfeito para petiscar.'
        },

        {
          id: 'lambari',
          nome: 'Lambari',
          preco: 30.00,
          img: 'https://loremflickr.com/400/400/fried,fish,crispy',
          descricao: 'Lambari frito crocantinho da nossa cozinha.'
        },

        {
          id: 'linguica_mel',
          nome: 'Linguiça no Mel',
          preco: 28.00,
          img: 'https://loremflickr.com/400/400/sausage,grilled,honey',
          descricao: 'Linguicinha caramelada com mel irresistível.'
        },

        {
          id: 'batata_frita',
          nome: 'Batata Frita',
          preco: 22.00,
          info: '400g',
          img: 'https://loremflickr.com/400/400/french,fries,crispy',
          descricao: 'Batata frita crocante, sequinha e dourada.'
        },

        {
          id: 'mandioquinha',
          nome: 'Mandioquinha',
          preco: 22.00,
          info: '400g',
          img: 'https://loremflickr.com/400/400/yuca,fried,food',
          descricao: 'Mandioquinha frita sequinha e temperada.'
        },

        {
          id: 'anel_cebola',
          nome: 'Anel de Cebola',
          preco: 24.00,
          info: '400g',
          img: 'https://loremflickr.com/400/400/onion,rings,fried',
          descricao: 'Anéis de cebola empanados e crocantes.'
        },

        {
          id: 'tilapia',
          nome: 'Tilápia',
          preco: 38.00,
          info: '400g',
          img: 'https://loremflickr.com/400/400/tilapia,fish,fried',
          descricao: 'Tilápia frita crocante, temperada na medida.'
        },

        {
          id: 'bucho_frito',
          nome: 'Bucho Frito',
          preco: 32.00,
          info: '350g',
          img: 'https://loremflickr.com/400/400/tripe,fried,food',
          descricao: 'Bucho frito empanado, prato da tradição.'
        },

        {
          id: 'frango_empanado',
          nome: 'Frango Empanado',
          preco: 30.00,
          info: '350g',
          img: 'https://loremflickr.com/400/400/chicken,fried,crispy',
          descricao: 'Frango empanado douradinho e crocante.'
        },

        {
          id: 'camarao',
          nome: 'Camarão',
          preco: 36.00,
          info: '6 un',
          img: 'https://loremflickr.com/400/400/shrimp,fried,seafood',
          descricao: 'Camarão empanado e crocante, direto da frigideira.'
        },

        {
          id: 'pastel_comum',
          nome: 'Pastel Comum',
          preco: 28.00,
          info: '8 un',
          img: 'https://loremflickr.com/400/400/empanada,fried,pastry',
          descricao: 'Pastel recheado frito na hora.'
        },

        {
          id: 'pastel_angu',
          nome: 'Pastel de Angu',
          preco: 30.00,
          info: '12 un',
          img: 'https://loremflickr.com/400/400/cornmeal,dumpling,fried',
          descricao: 'Pastel de angu, sabor único e especial.'
        }
      ]
    },

    {
      label: 'Combos',
      itens: [
        {
          id: 'trio_amigos',
          nome: 'Trio dos Amigos',
          preco: 55.00,
          img: 'https://loremflickr.com/400/400/bbq,platter,feast',
          descricao: 'Torresmo de Rolo + Mandioquinha + Linguiça.'
        },

        {
          id: 'macarrao_chapa',
          nome: 'Macarrão na Chapa',
          preco: 45.00,
          img: 'https://loremflickr.com/400/400/noodles,wok,stirfry',
          descricao: 'Macarrão, Calabreza, Frango e Molho Shoyu.'
        },

        {
          id: 'pizza_cone',
          nome: 'Pizza no Cone',
          preco: 18.00,
          img: 'https://loremflickr.com/400/400/pizza,street,food',
          descricao: 'Frango c/ Catupiry ou Moda da Casa (calabresa).',
          opcoes: [
            {
              label: 'Sabor',
              obrigatorio: true,
              choices: [
                {
                  id: 'frango_cat',
                  label: 'Frango c/ Catupiry',
                  extra: 0
                },
                {
                  id: 'calabresa',
                  label: 'Moda da Casa',
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
