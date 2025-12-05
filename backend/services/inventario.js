const parser = require('./parser');
const websocketService = require('./websocket');

async function listarItens({ centroCusto, status }) {
  const itens = await parser.carregarInventario();

  let filtrados = itens;

  if (centroCusto) {
    const cc = centroCusto.toString().toLowerCase();
    filtrados = filtrados.filter(
      (i) => i.centroCusto && i.centroCusto.toLowerCase().includes(cc)
    );
  }

  if (status) {
    const st = status.toString().toLowerCase();
    if (st === 'localizado' || st === 'nao_localizado' || st === 'pendente') {
      // por enquanto status vem sempre 'pendente' da planilha;
      // o controle mais detalhado continua no frontend
    }
  }

  return filtrados;
}

/**
 * Registrar uma leitura de patrimônio (scanner)
 * - Se existir na planilha => status = 'localizado'
 * - Se não existir       => status = 'fora_lista'
 *
 * O controle de "última leitura", cores, etc. pode continuar no frontend.
 */
async function registrarLeitura({ patrimonio, usuario }) {
  const itens = await parser.carregarInventario();

  const encontrado = itens.find(
    (i) => i.patrimonio && i.patrimonio.toString().trim() === patrimonio
  );

  let status = 'fora_lista';
  let item = null;

  if (encontrado) {
    status = 'localizado';
    item = encontrado;
  }

  const payload = {
    patrimonio,
    status,
    usuario,
    item,
    timestamp: new Date().toISOString()
  };

  // envia evento via websocket (se alguém estiver ouvindo)
  websocketService.broadcast('leitura', payload);

  return payload;
}

module.exports = {
  listarItens,
  registrarLeitura
};
