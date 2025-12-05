const { loadCSV } = require('../services/csvLoader');

const URL_USUARIOS =
  "https://wagneramengual.github.io/Sistema-de-inventario/Z_Inventarios/usuarios.csv";

exports.listarUsuarios = async (req, res) => {
  const usuarios = await loadCSV(URL_USUARIOS);
  res.json(usuarios);
};

exports.login = async (req, res) => {
  const { usuario, senha } = req.body;

  const usuarios = await loadCSV(URL_USUARIOS);
  const encontrado = usuarios.find(u =>
    u.usuario === usuario && u.senha === senha
  );

  if (!encontrado) {
    return res.status(401).json({ erro: "Usuário ou senha inválidos" });
  }

  res.json({
    usuario: encontrado.usuario,
    centro_custo: encontrado.centro_custo
  });
};
