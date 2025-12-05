/* ------------------------------
   VARIÁVEIS GLOBAIS
--------------------------------*/
let usuarioLogado = null;
let itensCache = [];
let itensFiltrados = [];

/* ------------------------------
   LOGIN
--------------------------------*/
document.getElementById("btn-login").addEventListener("click", async () => {
    const usuario = document.getElementById("login-usuario").value.trim();
    const senha = document.getElementById("login-senha").value.trim();

    if (!usuario || !senha) return;

    try {
        const resp = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, senha })
        });

        const data = await resp.json();

        if (!data.sucesso) {
            document.getElementById("login-erro").textContent = data.mensagem;
            return;
        }

        usuarioLogado = data.usuario;

        document.getElementById("login-section").style.display = "none";
        document.getElementById("app-section").style.display = "block";

        document.getElementById("user-info").textContent =
            `${usuarioLogado.nome} (${usuarioLogado.centroCusto})`;

        carregarCentrosCusto();
        carregarInventario();

    } catch (e) {
        console.error(e);
    }
});

/* Logout */
document.getElementById("btn-sair").addEventListener("click", () => {
    usuarioLogado = null;
    document.getElementById("login-section").style.display = "block";
    document.getElementById("app-section").style.display = "none";
});

/* ------------------------------
   CARREGAR CENTROS DE CUSTO
--------------------------------*/
async function carregarCentrosCusto() {
    const resp = await fetch(`${API_URL}/api/centros-custo`);
    const data = await resp.json();

    const select = document.getElementById("filtro-centro-custo");
    select.innerHTML = `<option value="">Todos</option>`;

    data.centrosCusto.forEach(cc => {
        const opt = document.createElement("option");
        opt.value = cc;
        opt.textContent = cc;
        select.appendChild(opt);
    });
}

/* ------------------------------
   CARREGAR INVENTÁRIO
--------------------------------*/
async function carregarInventario() {
    const resp = await fetch(`${API_URL}/api/inventario`);
    const data = await resp.json();

    itensCache = data.itens || [];
    aplicarFiltros();
}

/* ------------------------------
   FILTROS
--------------------------------*/
document.getElementById("btn-aplicar-filtros").addEventListener("click", aplicarFiltros);

function aplicarFiltros() {
    const ccFiltro = document.getElementById("filtro-centro-custo").value;
    const stFiltro = document.getElementById("filtro-status").value;

    itensFiltrados = itensCache.filter(item => {

        if (usuarioLogado.centroCusto &&
            item.centroCusto !== usuarioLogado.centroCusto &&
            usuarioLogado.perfil !== "admin") return false;

        if (ccFiltro && item.centroCusto !== ccFiltro) return false;

        if (stFiltro && item.status !== stFiltro) return false;

        return true;
    });

    atualizarTabela();
}

/* ------------------------------
   ATUALIZAR TABELA
--------------------------------*/
function atualizarTabela() {
    const corpo = document.getElementById("tabela-corpo");
    corpo.innerHTML = "";

    itensFiltrados.forEach(item => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${item.patrimonio}</td>
            <td>${item.descricao}</td>
            <td>${item.centroCusto}</td>
            <td>${item.setor}</td>
            <td>${formatarStatus(item.status)}</td>
        `;

        tr.classList.add(item.status);
        corpo.appendChild(tr);
    });
}

function formatarStatus(status) {
    if (status === "localizado") return "Localizado";
    if (status === "fora_lista") return "Fora da Lista";
    return "Pendente";
}

/* ------------------------------
   SCANNER (simples, versão desktop/mobile)
--------------------------------*/
document.getElementById("btn-scanner").addEventListener("click", async () => {
    const patrimonio = prompt("Digite o número do patrimônio:");

    if (!patrimonio) return;

    registrarLeitura(patrimonio);
});

/* ------------------------------
   REGISTRAR LEITURA
--------------------------------*/
async function registrarLeitura(patrimonio) {
    try {
        const resp = await fetch(`${API_URL}/api/inventario/leitura`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                patrimonio,
                usuario: usuarioLogado?.usuario || null
            })
        });

        const data = await resp.json();
        mostrarFeedback(data.status);

        // Atualiza visualmente
        const item = itensCache.find(i => i.patrimonio === patrimonio);

        if (item) item.status = "localizado";
        else itensCache.push({
            patrimonio,
            descricao: "(Não encontrado)",
            centroCusto: usuarioLogado.centroCusto,
            setor: "",
            status: "fora_lista"
        });

        aplicarFiltros();

    } catch (e) {
        console.error(e);
    }
}

function mostrarFeedback(status) {
    const box = document.getElementById("scanner-feedback");

    if (status === "localizado") {
        box.textContent = "✓ Item localizado!";
        box.style.color = "green";
    } else {
        box.textContent = "✗ Item fora da lista!";
        box.style.color = "red";
    }

    setTimeout(() => (box.textContent = ""), 3000);
}
