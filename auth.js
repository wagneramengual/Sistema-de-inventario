const usuariosService = require('./usuarios');

async function login(usuario, senha) {
  const usuarios = await usuariosService.carregarUsuarios();

  const encontrado = usuarios.find(
    (u) =>
      u.usuario &&
      u.usuario.toString().trim().toLowerCase() ===
        usuario.toString().trim().toLowerCase()
  );

  if (!encontrado) return null;

  // Aqui estou assumindo que a senha no CSV é texto puro.
  // Se estiver com hash, depois podemos trocar para bcrypt.
  if (!encontrado.senha || encontrado.senha.toString().trim() !== senha.trim()) {
    return null;
  }

  // Retorna apenas o que o frontend precisa
  return {
    usuario: encontrado.usuario,
    nome: encontrado.nome,
    perfil: encontrado.perfil,
    centroCusto: encontrado.centroCusto
  };
}

module.exports = {
  login
};
