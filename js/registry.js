/* ============================================================
   js/registry.js — Registro de seções do cardápio

   Como adicionar uma nova seção:
     1. Crie o arquivo  data-novasecao.js  na raiz do projeto,
        declarando  var DATA_NOVASECAO = { id, label, subcategorias }
     2. Adicione <script src="data-novasecao.js"> no index.html
        (antes de js/registry.js)
     3. Adicione uma entrada no array SECTION_REGISTRY abaixo,
        usando o mesmo nome da variável declarada no arquivo

   O typeof guard garante que seções não carregadas são ignoradas
   silenciosamente — útil para desativar temporariamente uma seção
   sem precisar mexer no index.html.

   A ordem das entradas define a ordem de exibição no cardápio.
============================================================ */

var SECTION_REGISTRY = [
  { varName: 'DATA_ESPECIAIS' },
  { varName: 'DATA_PORCOES' },
  { varName: 'DATA_CHURRASCO' },
  { varName: 'DATA_BEBIDAS' },
  { varName: 'DATA_ALCOOL' },
]

/* Monta o array global CARDAPIO a partir das variáveis registradas */
var CARDAPIO = (function () {
  return SECTION_REGISTRY
    .map(function (entry) {
      /* Acessa a variável pelo nome via window (escopo global) */
      return typeof window[entry.varName] !== 'undefined'
        ? window[entry.varName]
        : null
    })
    .filter(Boolean)   /* descarta entradas não carregadas */
})()
