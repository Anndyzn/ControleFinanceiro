import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function conectarBanco() {
    const db = await open({
        filename: "./financeiro.db",
        driver: sqlite3.Database
    });
    await db.exec(`
        CREATE TABLE IF NOT EXISTS movimentacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT NOT NULL,
            valor REAL NOT NULL,
            tipo TEXT NOT NULL,
            data TEXT NOT NULL
        )

    `);

    return db;
}