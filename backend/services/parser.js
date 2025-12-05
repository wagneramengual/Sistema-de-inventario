const axios = require("axios");
const { parse } = require("csv-parse/sync");

// Caminho correto do CSV mestre no GitHub
const INVENTARIO_CSV_URL =
  process.env.INVENTARIO_CSV_URL ||
  "https://raw.githubusercontent.com/wagneramengual/Sistema-de-inventario/main/Z_Inventarios/01_Planilhas_Mestre/RP_TermoResponsabilidade%20REDUZIDO.csv";

let cacheInventario = null;
let cacheTimestamp = 0;
const CACHE_MS = 60000; // 1 minuto

function detectarDelimitador(csv) {
  const linha = csv.split("\n")[0];
  if (linha.includes(";")) return ";";
  if (linha.includes("\t")) return "\t";
  return ",";
}

async function carregarInventario() {
  const agora = Date.now();

  // cache para não travar Railway
  if (cacheInventario && agora - cacheTimestamp < CACHE_MS) {
    return cacheInventario;
  }

  const resp = await axios.get(INVENTARIO_CSV_URL, { responseType: "text" });
  const csv = resp.data;

  const itens = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    delimiter: detectarDelimitador(csv)
  }).map((r, index) => ({
    id: index + 1,
    patrimonio: r.patrimonio || r.Patrimonio || "",
    descricao: r.descricao || r.Descrição || "",
    centroCusto:
      r.centroCusto ||
      r["Centro de Custo"] ||
      r.centro_custo ||
      r["centro de custo"] ||
      "",
    setor: r.setor || r.Setor || "",
    status: r.status || "pendente"
  }));

  cacheInventario = itens;
  cacheTimestamp = agora;

  return itens;
}

module.exports = {
  carregarInventario
};
