const db = require("../database/connection");

exports.atualizarSaldo = (req, res) => {
  const user_id = req.user?.id;
  const { tipo, valor } = req.body || {};

  if (!user_id) {
    return res.status(401).json({ erro: "Usuário não autenticado" });
  }

  if (!tipo || valor === undefined || valor === null || valor === "") {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  const valorNumerico = Number(valor);

  if (isNaN(valorNumerico) || valorNumerico <= 0) {
    return res.status(400).json({ erro: "Valor inválido" });
  }

  db.query(
    "SELECT saldo FROM usuarios WHERE id = ?",
    [user_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao buscar saldo" });
      }

      if (result.length === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      const saldoAtual = Number(result[0].saldo);
      let novoSaldo = saldoAtual;

      if (tipo === "deposito") {
        novoSaldo = saldoAtual + valorNumerico;
      } else if (tipo === "saque") {
        if (saldoAtual < valorNumerico) {
          return res.status(400).json({ erro: "Saldo insuficiente" });
        }

        novoSaldo = saldoAtual - valorNumerico;
      } else {
        return res.status(400).json({ erro: "Tipo inválido" });
      }

      db.query(
        "UPDATE usuarios SET saldo = ? WHERE id = ?",
        [novoSaldo, user_id],
        (errUpdate) => {
          if (errUpdate) {
            return res.status(500).json({ erro: "Erro ao atualizar saldo" });
          }

          return res.json({
            mensagem: `${tipo} realizado com sucesso`,
            saldo: novoSaldo,
          });
        }
      );
    }
  );
};