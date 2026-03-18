const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/connection");


// =========================
// REGISTER
// =========================
exports.register = async (req, res) => {

 try {

  const { nome, email, senha } = req.body;

  const senhaHash = await bcrypt.hash(senha, 10);

  const sql = `
   INSERT INTO usuarios (nome, email, senha)
   VALUES (?, ?, ?)
  `;

  db.query(sql, [nome, email, senhaHash], (err, result) => {

   if (err) {

    if (err.code === "ER_DUP_ENTRY") {
     return res.status(400).json({
      erro: "Email já cadastrado"
     });
    }

    console.error(err);

    return res.status(500).json({
     erro: "Erro ao criar usuário"
    });

   }

   res.json({
    mensagem: "Usuário criado com sucesso"
   });

  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   erro: "Erro no servidor"
  });

 }

};



// =========================
// LOGIN
// =========================
exports.login = (req, res) => {

 const { email, senha } = req.body;

 const sql = "SELECT * FROM usuarios WHERE email = ?";

 db.query(sql, [email], async (err, results) => {

  if (err) {
   return res.status(500).json({
    erro: "Erro no servidor"
   });
  }

  if (results.length === 0) {
   return res.status(400).json({
    erro: "Usuário não encontrado"
   });
  }

  const usuario = results[0];

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
   return res.status(401).json({
    erro: "Senha incorreta"
   });
  }

  const token = jwt.sign(
   { id: usuario.id },
   "segredo",
   { expiresIn: "1h" }
  );

  res.json({
   mensagem: "Login realizado com sucesso",
   token: token
  });

 });

};