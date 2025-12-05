const axios = require('axios');
const ExcelJS = require('exceljs');

// URL RAW da planilha de termo de responsabilidade
const INVENTARIO_XLSX_URL =
  process.env.INVENTARIO_XLSX_URL ||
  'https://raw.githubusercontent.com/wagneramengual/Sistema-de-inventario/main/Z_Inventarios/01_Planilhas_Mestre/RP_TermoResponsabilidade_REDUZIDO.xlsx';

let cacheInventario = null;
let cacheTimestamp = 0;
const CACHE_MS = 2 * 60 * 1000; // 2 minutos

async function carregarInventario() {
  const agora = Date.now();
  if (cacheInventario && agora - cacheTimestamp < CACHE_MS) {
    return cacheInventario;
  }

  const resp = await axios.get(INVENTARIO_XLSX_URL, {
    responseType: 'arraybuffer'
  });

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(resp.data);

  const itens = [];

  workbook.eachSheet((sheet) => {
    if (!sheet) return;

    // Lê centro de custo da célula B11 (ajuste se necessário)
    const centroCustoCabecalho = sheet.getCell('B11').value || '';
    const centroCusto = extrairCentroCusto(centroCustoCabecalho);

    // Aqui você ajusta a partir de que linha/coluna começam os itens.
    // Exemplo: cabeçalho na linha 13, dados a partir da 14.
    const LINHA_INICIO_DADOS = 14;

    // Descobre índices de colunas pelo cabeçalho
    const headerRow = sheet.getRow(LINHA_INICIO_DADOS - 1);
    const colIndex = identificarColunas(headerRow);

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber < LINHA_INICIO_DADOS) return;

      const patrimonio = getCellValue(row, colIndex.patrimonio);
      const descricao = getCellValue(row, colIndex.descricao);

      if (!patrimonio && !descricao) return; // linha vazia

      const setor = getCellValue(row, colIndex.setor);
      const status = 'pendente';

      itens.push({
        id: `${sheet.name}-${rowNumber}`,
        folha: sheet.name,
        centroCusto,
        patrimonio: String(patrimonio || '').trim(),
        descricao: String(descricao || '').trim(),
        setor: String(setor || '').trim(),
        status
      });
    });
  });

  cacheInventario = itens;
  cacheTimestamp = agora;
  return itens;
}

// tenta extrair algo útil do texto da B11
function extrairCentroCusto(texto) {
  if (!texto) return '';

  const s = String(texto);
  // Ex: "EHCC.30.000090030 - Deslocamento para Lav..."
  const partes = s.split('-');
  return partes.map((p) => p.trim()).join(' - ');
}

function identificarColunas(headerRow) {
  const map = {
    patrimonio: null,
    descricao: null,
    setor: null
  };

  headerRow.eachCell((cell, colNumber) => {
    const valor = (cell.value || '').toString().toLowerCase();

    if (!valor) return;

    if (!map.patrimonio && valor.includes('patrim')) map.patrimonio = colNumber;
    if (!map.descricao && (valor.includes('descri') || valor.includes('bem')))
      map.descricao = colNumber;
    if (!map.setor && valor.includes('setor')) map.setor = colNumber;
  });

  // fallback se não achar pelos nomes
  if (!map.patrimonio) map.patrimonio = 3; // ex: coluna C
  if (!map.descricao) map.descricao = 4; // ex: coluna D
  if (!map.setor) map.setor = 5; // ex: coluna E

  return map;
}

function getCellValue(row, idx) {
  if (!idx) return null;
  const cell = row.getCell(idx);
  return cell ? cell.value : null;
}

module.exports = {
  carregarInventario
};
