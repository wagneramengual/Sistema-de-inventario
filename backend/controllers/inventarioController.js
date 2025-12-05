const { loadCSV } = require('../services/csvLoader');

const URL_BENS =
  "https://wagneramengual.github.io/Sistema-de-inventario/Z_Inventarios/01_Planilhas_Mestre/RP_TermoResponsabilidade%20REDUZIDO.csv";

exports.getInventarioByCentro = async (req, res) => {
  try {
    const centro = req.params.centro.toUpperCase();
    const bens = await loadCSV(URL_BENS);

    const filtrados = bens.filter(item =>
      String(item.CENTRO_CUSTO || "").toUpperCase() === centro
    );

    res.json(filtrados);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
};
