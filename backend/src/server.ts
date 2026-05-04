import express from "express";
import cors from "cors";
import { conectarBanco } from "./database";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(" API de Controle Financeiro rodando");
});

app.post("/movimentacoes", async (req, res) => {
  const { descricao, valor, tipo, data } = req.body;

  if (!descricao || !valor || !tipo || !data) {
    return res.status(400).json({
      erro: "Preencha todos os campos"
  });
}

  const db = await conectarBanco();

  await db.run(
    `
    INSERT INTO movimentacoes (descricao, valor, tipo, data)
    VALUES (?, ?, ?, ?)
    `,
    [descricao, valor, tipo, data]
  );

  res.status(201).json({
    mensagem: "Movimentação cadastrada com sucesso"
  });
});

app.get("/movimentacoes", async (req, res) => {
  const db = await conectarBanco();

  const movimentacoes = await db.all(`
    SELECT * FROM movimentacoes
    ORDER BY data DESC
  `);

  res.json(movimentacoes);
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});