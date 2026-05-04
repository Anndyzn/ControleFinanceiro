const form = document.getElementById("formMovimentacao");
const lista = document.getElementById("listaMovimentacoes");

const selectAno = document.getElementById("anoFiltro");
const selectMes = document.getElementById("mesFiltro");

const API_URL = "http://localhost:3000/movimentacoes";


// ===============================
// EVENTO DO FORMULÁRIO
// ===============================

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const descricao = document.getElementById("descricao").value;
  const valor = Number(document.getElementById("valor").value);
  const tipo = document.getElementById("tipo").value;
  const data = document.getElementById("data").value;

  const movimentacao = {
    descricao,
    valor,
    tipo,
    data
  };

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(movimentacao)
  });

  form.reset();

  await carregarFiltros();
});


// ===============================
// CARREGAR FILTROS DE ANO E MÊS
// ===============================

async function carregarFiltros() {
  const resposta = await fetch(API_URL);
  const movimentacoes = await resposta.json();

  const anos = [...new Set(
    movimentacoes.map(item => item.data.slice(0, 4))
  )];

  anos.sort().reverse();

  selectAno.innerHTML = "";

  anos.forEach((ano) => {
    const option = document.createElement("option");
    option.value = ano;
    option.textContent = ano;

    selectAno.appendChild(option);
  });

  atualizarMeses();
}


// ===============================
// ATUALIZAR MESES PELO ANO
// ===============================

async function atualizarMeses() {
  const anoSelecionado = selectAno.value;

  const resposta = await fetch(API_URL);
  const movimentacoes = await resposta.json();

  const meses = movimentacoes
    .filter(item => item.data.startsWith(anoSelecionado))
    .map(item => item.data.slice(5, 7));

  const mesesUnicos = [...new Set(meses)];

  mesesUnicos.sort().reverse();

  selectMes.innerHTML = "";

  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  mesesUnicos.forEach((mes) => {
    const option = document.createElement("option");
    option.value = mes;
    option.textContent = nomesMeses[Number(mes) - 1];

    selectMes.appendChild(option);
  });

  carregarMovimentacoes();
}


// ===============================
// CARREGAR MOVIMENTAÇÕES
// ===============================

async function carregarMovimentacoes() {
  const anoSelecionado = selectAno.value;
  const mesSelecionado = selectMes.value;

  const resposta = await fetch(API_URL);
  let movimentacoes = await resposta.json();

  movimentacoes = movimentacoes.filter(item => {
    const ano = item.data.slice(0, 4);
    const mes = item.data.slice(5, 7);

    return ano === anoSelecionado && mes === mesSelecionado;
  });

  lista.innerHTML = "";

  let receitas = 0;
  let despesas = 0;
  let investimentos = 0;

  movimentacoes.forEach((item) => {
    if (item.tipo === "receita") {
      receitas += item.valor;
    }

    if (item.tipo === "despesa") {
      despesas += item.valor;
    }

    if (item.tipo === "investimento") {
      investimentos += item.valor;
    }

    criarCardMovimentacao(item);
  });

  atualizarResumo(receitas, despesas, investimentos);
}


// ===============================
// CRIAR CARD DO LANÇAMENTO
// ===============================

function criarCardMovimentacao(item) {
  const li = document.createElement("li");

  li.classList.add("movimentacao-card");
  li.classList.add(item.tipo);

  const sinal = item.tipo === "receita" ? "+" :
                item.tipo === "despesa" ? "-" : "";

  li.innerHTML = `
    <div class="topo-card">
      <span class="descricao">${item.descricao}</span>
      <span class="valor">${sinal} R$ ${item.valor.toFixed(2)}</span>
    </div>

    <div class="info">
      <span>${item.tipo}</span>
      <span>${item.data}</span>
    </div>
  `;

  lista.appendChild(li);
}


// ===============================
// ATUALIZAR RESUMO FINANCEIRO
// ===============================

function atualizarResumo(receitas, despesas, investimentos) {
  const saldo = receitas - despesas;

  document.getElementById("saldoTotal").innerText =
    `R$ ${saldo.toFixed(2)}`;

  document.getElementById("totalReceitas").innerText =
    `R$ ${receitas.toFixed(2)}`;

  document.getElementById("totalDespesas").innerText =
    `R$ ${despesas.toFixed(2)}`;

  document.getElementById("totalInvestimentos").innerText =
    `R$ ${investimentos.toFixed(2)}`;
}


// ===============================
// EVENTOS DOS FILTROS
// ===============================

selectAno.addEventListener("change", atualizarMeses);
selectMes.addEventListener("change", carregarMovimentacoes);


// ===============================
// INICIAR SISTEMA
// ===============================

carregarFiltros();