/* ── data-especiais.js ──────────────────────────────────────── */
var DATA_ESPECIAIS = {
  id: 'especiais',
  label: 'Especiais',
  subcategorias: [
    {
      itens: [
        {
          id: 'churrasquinho',
          nome: 'Churrasquinho',
          preco: 8.00,
          img: 'https://www.fmetropolitana.com.br/wp-content/uploads/2022/11/Para-cair-na-Gandaia_Divulgacao-2.jpg',
          descricao: 'Boi, Porco, Linguiça, Misto, Coração, Frango, Pão de Alho, Sambiquira, Salsichão, Queijo ou Medalhão.',
          opcoes: [
            {
              label: 'Tipo de Carne',
              obrigatorio: true,
              choices: [
                { id: 'boi', label: 'Boi', extra: 0 },
                { id: 'porco', label: 'Porco', extra: 0 },
                { id: 'linguica', label: 'Linguiça', extra: 0 },
                { id: 'misto', label: 'Misto (Boi, Porco e Linguiça)', extra: 0 },
                { id: 'coracao', label: 'Coração', extra: 0 },
                { id: 'frango', label: 'Frango', extra: 0 },
                { id: 'pao_alho', label: 'Pão de Alho', extra: 0 },
                { id: 'sambiquira', label: 'Sambiquira', extra: 0 },
                { id: 'salsichao', label: 'Salsichão', extra: 0 },
                { id: 'queijo', label: 'Queijo', extra: 2 },
                { id: 'medalhao', label: 'Medalhão', extra: 2 }
              ]
            }
          ]
        },

        {
          id: 'jantinha',
          nome: 'Jantinha',
          preco: 22.00,
          img: './assets/Jantinha.png',
          descricao: '1 Churrasquinho + Arroz + Farofa + Vinagrete. Queijo (R$27) ou Medalhão (R$27) disponíveis.',
          opcoes: [
            {
              label: 'Tipo de Carne',
              obrigatorio: true,
              choices: [
                { id: 'boi', label: 'Boi', extra: 0 },
                { id: 'porco', label: 'Porco', extra: 0 },
                { id: 'linguica', label: 'Linguiça', extra: 0 },
                { id: 'misto', label: 'Misto (Boi, Porco e Linguiça)', extra: 0 },
                { id: 'coracao', label: 'Coração', extra: 0 },
                { id: 'frango', label: 'Frango', extra: 0 },
                { id: 'queijo', label: 'Queijo', extra: 5 },
                { id: 'medalhao', label: 'Medalhão', extra: 5 }
              ]
            }
          ]
        }
      ]
    },

    {
      label: 'Acompanhamentos',
      itens: [
        {
          id: 'arroz',
          nome: 'Arroz',
          preco: 8.00,
          img: '',
          descricao: 'Porção de arroz branco soltinho.'
        },

        {
          id: 'farofa',
          nome: 'Farofa',
          preco: 8.00,
          img: '',
          descricao: 'Farofa temperada e crocante.'
        },

        {
          id: 'vinagrete',
          nome: 'Vinagrete',
          preco: 8.00,
          img: '',
          descricao: 'Vinagrete fresco de tomate e cebola.'
        }
      ]
    }
  ]
}
