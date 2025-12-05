const parser = require('./parser');

async function listarCentrosCusto() {
  const itens = await parser.carregarInventario();

  const set = new Set();
  itens.forEach((i) => {
    if (i.centroCusto) {
      set.add(i.centroCusto);
    }
  });

  return Array.from(set).sort();
}

module.exports = {
  listarCentrosCusto
};
