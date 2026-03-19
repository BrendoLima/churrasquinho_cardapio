/* ============================================================
   data.js — Assembler do cardápio
   Junta todos os arquivos de seção em um único array CARDAPIO.
   Para editar itens, acesse o arquivo da seção correspondente:
     data-especiais.js  → Especiais e Acompanhamentos
     data-porcoes.js    → Porções e Combos (cards quadrados)
     data-churrasco.js  → Churrasco na Pedra e Porção Mista (cards wide)
     data-bebidas.js    → Bebidas não-alcoólicas
     data-alcool.js     → Cervejas, Destilados, Drinks e Doces

   Campos de cada item:
     id        {string}   identificador único
     nome      {string}   nome exibido
     preco     {number}   valor base em reais
     descricao {string}   texto do modal de detalhe
     img       {string}   URL da foto (opcional)
     emoji     {string}   ícone fallback sem imagem
     info      {string}   detalhe extra, ex: "400g" (opcional)
     layout    {string}   "wide" | "row" | omitido = card quadrado
     opcoes    {Array}    grupos de sub-opções (opcional)
============================================================ */

var CARDAPIO = [
  DATA_ESPECIAIS,
  DATA_PORCOES,
  DATA_CHURRASCO,
  DATA_BEBIDAS,
  DATA_ALCOOL
]
