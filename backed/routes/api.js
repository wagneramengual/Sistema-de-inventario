const express = require('express');
const router = express.Router();

const authService = require('../services/auth');
const inventarioService = require('../services/inventario');
const centrosCustoService = require('../services/centrosCusto');

// --------- AUTH ---------

router.post('/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Usuário e senha são obrigatórios.'
      });
    }

    const result = await authService.login(usuario, senha);

    if (!result) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário ou senha inválidos.'
      });
    }

    res.json({
      sucesso: true,
      usuario: result
    });
  } catch (error) {
    console.error('[POST /api/login]', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao processar login.'
    });
  }
});

// --------- INVENTÁRIO ---------

// Lista de itens (já com filtro opcional por centro de custo e status)
router.get('/inventario', async (req, res) => {
  try {
    const { centroCusto, status } = req.query;

    const itens = await inventarioService.listarItens({
      centroCusto,
      status
    });

    res.json({
      sucesso: true,
      itens
    });
  } catch (error) {
    console.error('[GET /api/inventario]', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao carregar inventário.'
    });
  }
});

// Registro de leitura (para o scanner)
router.post('/inventario/leitura', async (req, res) => {
  try {
    const { patrimonio, usuario } = req.body;

    if (!patrimonio) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Campo "patrimonio" é obrigatório.'
      });
    }

    const resultado = await inventarioService.registrarLeitura({
      patrimonio: String(patrimonio).trim(),
      usuario: usuario || null
    });

    res.json({
      sucesso: true,
      ...resultado
    });
  } catch (error) {
    console.error('[POST /api/inventario/leitura]', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao registrar leitura.'
    });
  }
});

// --------- CENTROS DE CUSTO ---------

router.get('/centros-custo', async (req, res) => {
  try {
    const lista = await centrosCustoService.listarCentrosCusto();
    res.json({
      sucesso: true,
      centrosCusto: lista
    });
  } catch (error) {
    console.error('[GET /api/centros-custo]', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao carregar centros de custo.'
    });
  }
});

module.exports = router;
