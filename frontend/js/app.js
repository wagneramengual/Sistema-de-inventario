async function login() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, senha })
  });

  if (!res.ok) {
    alert("Usuário ou senha incorretos");
    return;
  }

  const data = await res.json();
  localStorage.setItem("usuario", JSON.stringify(data));

  carregarInventario(data.centro_custo);
}

async function carregarInventario(centro) {
  const res = await fetch("/inventario/" + centro);
  const lista = await res.json();
  console.log(lista);
}
