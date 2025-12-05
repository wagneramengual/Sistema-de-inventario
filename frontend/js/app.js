let usuarioLogado = null;
let listaBens = [];
let processados = new Set();

const API = "https://sistema-de-inventario-production-2c46.up.railway.app/";

async function login() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ usuario, senha })
  });

  if (!res.ok) return alert("Usuário ou senha inválidos.");

  usuarioLogado = await res.json();
  localStorage.setItem("usuario", JSON.stringify(usuarioLogado));

  document.getElementById("login-container").classList.add("hidden");
  document.getElementById("app-container").classList.remove("hidden");

  document.getElementById("titulo-centro").innerText =
    `Centro de Custo: ${usuarioLogado.centro_custo}`;

  carregarInventario();
}

async function carregarInventario() {
  const res = await fetch(`${API}/inventario/${usuarioLogado.centro_custo}`);
  listaBens = await res.json();

  listaBens = listaBens.map(b => ({
    patrimonio: b.REGISTRO_PATRIMONIAL,
    antigo: b.REGISTRO_ANTIGO,
    descricao: b.DESCRICAO,
    centro: usuarioLogado.centro_custo,
    status: "nao-localizado",
    dataHora: ""
  }));

  renderTabela(listaBens, processados);
}

function logout() {
  localStorage.clear();
  location.reload();
}
