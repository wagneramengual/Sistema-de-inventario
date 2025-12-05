const axios = require('axios');
const { parse } = require('csv-parse/sync');

// URL RAW do CSV de usuários no GitHub
const USUARIOS_CSV_URL =
  process.env.USUARIOS_CSV_URL ||
  'https://raw.githubusercontent.com/wagneramengual/Sistema-de-inventario/main/Z_Inventarios/usuarios.csv';

let cacheUsuarios = null;
let cacheTimestamp = 0;
const CACHE_MS = 60 * 1000; // 1 minuto

async function carregarUsuarios() {
  const agora = Date.now();
  if (cacheUsuarios && agora - cacheTimestamp < CACHE_MS) {
    return cacheUsuarios;
  }

  const resp = await axios.get(USUARIOS_CSV_URL, {
    responseType: 'text'
  });

  const csv = resp.data;

  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    delimiter: detectDelimiter(csv)
  });

  // Normaliza campos mais comuns
  const usuarios = records.map((r) => ({
    usuario: r.usuario || r.login || r.username || r.Usuario || r.Login,
    senha: r.senha || r.Senha || r.password || r.Password,
    nome:
      r.nome || r.Nome || r.nome_completo || r['Nome completo'] || r['Nome Completo'],
    perfil: r.perfil || r.Perfil || r.role || r.Role,
    centroCusto:
      r.centroCusto ||
      r.centro_custo ||
      r['Centro de Custo'] ||
      r['centro de custo'] ||
      null,
    raw: r
  }));

  cacheUsuarios = usuarios;
  cacheTimestamp = agora;
  return usuarios;
}

function detectDelimiter(csv) {
  const firstLine = csv.split('\n')[0];
  if (firstLine.includes(';')) return ';';
  if (firstLine.includes('\t')) return '\t';
  return ',';
}

module.exports = {
  carregarUsuarios
};
