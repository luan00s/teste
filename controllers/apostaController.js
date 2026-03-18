const db = require("../database/connection");

exports.criarAposta = (req, res) => {

 const { user_id, animal, valor } = req.body;

 if (!user_id || !animal || !valor) {
  return res.status(400).json({ erro: "Dados incompletos" });
 }

 // buscar saldo do usuário
 db.query(
  "SELECT saldo FROM usuarios WHERE id = ?",
  [user_id],
  (err, result) => {

   if (err) {
    return res.status(500).json({ erro: "Erro no banco" });
   }

   if (result.length === 0) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
   }

   const saldoAtual = result[0].saldo;

   if (saldoAtual < valor) {
    return res.status(400).json({ erro: "Saldo insuficiente" });
   }

   const novoSaldo = saldoAtual - valor;

   // atualizar saldo
   db.query(
    "UPDATE usuarios SET saldo = ? WHERE id = ?",
    [novoSaldo, user_id],
    (err) => {

     if (err) {
      return res.status(500).json({ erro: "Erro ao atualizar saldo" });
     }

     // registrar aposta
     db.query(
      "INSERT INTO apostas (user_id, animal, valor) VALUES (?, ?, ?)",
      [user_id, animal, valor],
      (err) => {

       if (err) {
        return res.status(500).json({ erro: "Erro ao registrar aposta" });
       }

       res.json({
        mensagem: "Aposta registrada",
        saldo_restante: novoSaldo
       });

      }
     );

    }
   );

  }
 );

};