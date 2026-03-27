/* ============================================================
   data/sections.js — Registry de seções do cardápio
   Para adicionar uma nova seção:
     1. Crie o arquivo JSON em data/
     2. Adicione um objeto neste array
============================================================ */

var SECTIONS = [
  { id: 'especiais', label: 'Especiais',  file: 'data/especiais.json' },
  { id: 'porcoes',   label: 'Porções',    file: 'data/porcoes.json'   },
  { id: 'churrasco', label: 'Churrasco',  file: 'data/churrasco.json' },
  { id: 'bebidas',   label: 'Bebidas',    file: 'data/bebidas.json'   },
  { id: 'alcool',    label: 'Alcoólicas', file: 'data/alcool.json'    }
]
