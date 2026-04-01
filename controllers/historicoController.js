const db = require("../database/connection");

exports.listarHistorico = (req, res) => {
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ erro: "Usuário não autenticado" });
  }

  db.query(
    "SELECT * FROM apostas WHERE user_id = ? ORDER BY id DESC",
    [user_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao buscar histórico" });
      }

      return res.json(result);
    }
  );
};