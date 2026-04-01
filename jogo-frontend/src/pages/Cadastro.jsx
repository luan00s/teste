import { useState } from "react";

const API = "http://localhost:3000";

function Cadastro({ setTela }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function cadastrar() {
    if (!nome || !email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.mensagem || "Cadastro realizado com sucesso");
        setTela("login");
      } else {
        alert(data.erro || "Erro ao cadastrar");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-wrap">
          <h1 className="auth-logo">
            BICHOFULL.<span>BET</span>
          </h1>
        </div>

        <div className="auth-box">
          <input
            type="text"
            placeholder="NOME"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="SENHA"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button onClick={cadastrar}>CADASTRAR</button>

          <p className="auth-link-text">
            Já tem conta?{" "}
            <span onClick={() => setTela("login")}>VOLTAR PARA LOGIN</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;