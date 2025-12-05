function renderTabela(lista, processados) {
  const div = document.getElementById("tabela-container");

  div.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Patrimônio</th>
          <th>Antigo</th>
          <th>Descrição</th>
          <th>Status</th>
          <th>Data/Hora</th>
        </tr>
      </thead>
      <tbody>
        ${lista.map(i => `
          <tr class="${getLinhaClass(i.status)}">
            <td>${i.patrimonio}</td>
            <td>${i.antigo}</td>
            <td>${i.descricao}</td>
            <td>${traduzStatus(i.status)}</td>
            <td>${i.dataHora || ""}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function getLinhaClass(status) {
  return {
    "localizado": "row-ok",
    "antigo": "row-antigo",
    "fora": "row-fora",
    "nao-localizado": "row-nao"
  }[status];
}

function traduzStatus(s) {
  return {
    "localizado": "Localizado",
    "antigo": "Etiqueta Antiga",
    "fora": "Fora da Lista",
    "nao-localizado": "Não Localizado"
  }[s];
}
