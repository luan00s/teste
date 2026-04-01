const db = require("../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { nome, email, senha } = req.body || {};

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({ erro: "Erro no servidor" });
      }

      if (result.length > 0) {
        return res.status(400).json({ erro: "Email já cadastrado" });
      }

      try {
        const senhaHash = await bcrypt.hash(senha, 10);

        db.query(
          "INSERT INTO usuarios (nome, email, senha, saldo) VALUES (?, ?, ?, ?)",
          [nome, email, senhaHash, 1000],
          (errInsert) => {
            if (errInsert) {
              return res.status(500).json({ erro: "Erro ao cadastrar usuário" });
            }

            return res.status(201).json({
              mensagem: "Usuário cadastrado com sucesso",
            });
          }
        );
      } catch (error) {
        return res.status(500).json({ erro: "Erro ao processar cadastro" });
      }
    }
  );
};

exports.login = (req, res) => {
  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({ erro: "Erro no servidor" });
      }

      if (result.length === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      try {
        const usuario = result[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
          return res.status(401).json({ erro: "Senha incorreta" });
        }

        const token = jwt.sign(
          { id: usuario.id, email: usuario.email },
          process.env.JWT_SECRET || "segredo",
          { expiresIn: "1d" }
        );

        return res.json({
          mensagem: "Login realizado com sucesso",
          token,
          usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            saldo: Number(usuario.saldo),
          },
        });
      } catch (error) {
        return res.status(500).json({ erro: "Erro ao fazer login" });
      }
    }
  );
};