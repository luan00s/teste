const app = require("./app");
const db = require("./database/connection");

const PORT = 3000;

app.listen(PORT, async () => {
  console.log("Servidor rodando na porta", PORT);

  try {
    const conn = await db.getConnection();
    console.log("Conectado ao MySQL");
    conn.release();
  } catch (err) {
    console.error("Erro ao conectar:", err);
  }
});
