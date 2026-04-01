import { useMemo, useState } from "react";
import { animais } from "../assets/animais";

const API = "http://localhost:3000";

function Dashboard({ setTela }) {
  const [animal, setAnimal] = useState(null);
  const [tipoAposta, setTipoAposta] = useState("");
  const [valor, setValor] = useState("");
  const [dezena, setDezena] = useState("");
  const [milhar, setMilhar] = useState("");
  const [resumo, setResumo] = useState({
    primeiroPremio: "",
    valorGanho: "",
    mensagem: "",
    resultado: "",
  });

  const nomeUsuario = localStorage.getItem("nome") || "usuário";
  const [saldo, setSaldo] = useState(
    Number(localStorage.getItem("saldo") || 1000)
  );

  const token = localStorage.getItem("token");

  const animalEscolhido = useMemo(
    () => animais.find((a) => a.numero === animal),
    [animal]
  );

  async function simularDeposito() {
    const entrada = prompt("Digite o valor do depósito:");
    if (!entrada) return;

    const valorDeposito = Number(entrada);

    if (isNaN(valorDeposito) || valorDeposito <= 0) {
      alert("Digite um valor válido.");
      return;
    }

    try {
      const res = await fetch(`${API}/saldo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipo: "deposito",
          valor: valorDeposito,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.erro || "Erro ao depositar");
        return;
      }

      const novoSaldo = Number(data.saldo);
      setSaldo(novoSaldo);
      localStorage.setItem("saldo", String(novoSaldo));

      alert(`Depósito de R$ ${valorDeposito.toFixed(2)} realizado com sucesso!`);
    } catch (error) {
      console.error(error);
      alert("Erro ao realizar depósito");
    }
  }

  async function simularSaque() {
    const entrada = prompt("Digite o valor do saque:");
    if (!entrada) return;

    const valorSaque = Number(entrada);

    if (isNaN(valorSaque) || valorSaque <= 0) {
      alert("Digite um valor válido.");
      return;
    }

    try {
      const res = await fetch(`${API}/saldo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipo: "saque",
          valor: valorSaque,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.erro || "Erro ao sacar");
        return;
      }

      const novoSaldo = Number(data.saldo);
      setSaldo(novoSaldo);
      localStorage.setItem("saldo", String(novoSaldo));

      alert(`Saque de R$ ${valorSaque.toFixed(2)} realizado com sucesso!`);
    } catch (error) {
      console.error(error);
      alert("Erro ao realizar saque");
    }
  }

  async function apostar() {
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    if (!tipoAposta) {
      alert("Escolha o tipo de aposta.");
      return;
    }

    if (!valor || Number(valor) <= 0) {
      alert("Digite um valor válido para apostar.");
      return;
    }

    if (saldo < Number(valor)) {
      alert("Saldo insuficiente para apostar.");
      return;
    }

    if (tipoAposta === "grupo" && !animal) {
      alert("Escolha um animal para apostar em grupo.");
      return;
    }

    if (tipoAposta === "dezena" && !/^\d{2}$/.test(dezena)) {
      alert("Digite uma dezena válida de 00 a 99.");
      return;
    }

    if (tipoAposta === "milhar" && !/^\d{4}$/.test(milhar)) {
      alert("Digite uma milhar válida de 0000 a 9999.");
      return;
    }

    try {
      const res = await fetch(`${API}/aposta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          animal,
          tipoAposta,
          valor: Number(valor),
          dezena,
          milhar,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.erro || "Não foi possível realizar a aposta.");
        return;
      }

      if (data.saldo_restante !== undefined) {
        const saldoAtualizado = Number(data.saldo_restante);
        setSaldo(saldoAtualizado);
        localStorage.setItem("saldo", String(saldoAtualizado));
      }

      setResumo({
        primeiroPremio: data.primeiro_premio || "",
        valorGanho:
          data.valor_ganho !== undefined
            ? `R$ ${Number(data.valor_ganho).toFixed(2)}`
            : "R$ 0,00",
        mensagem: data.mensagem || "",
        resultado: data.resultado || "",
      });

      setValor("");
      setDezena("");
      setMilhar("");

      alert(data.mensagem || "Aposta registrada com sucesso.");
    } catch (error) {
      console.error(error);
      alert("Erro ao realizar aposta.");
    }
  }

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("email");
    localStorage.removeItem("saldo");
    window.location.reload();
  }

  return (
    <div className="dash-page">
      <header className="dash-top">
        <div className="dash-brand">
          <div className="dash-avatar">👤</div>

          <div className="dash-user-block">
            <div className="dash-user">olá, {nomeUsuario}</div>
            <div className="dash-balance">R$ {saldo.toFixed(2)}</div>
          </div>
        </div>

        <div className="dash-actions">
          <button onClick={simularDeposito}>DEPÓSITO</button>
          <button onClick={() => setTela("historico")}>HISTÓRICO</button>
          <button onClick={simularSaque}>SAQUE</button>
          <button onClick={sair}>SAIR</button>
        </div>
      </header>

      <main className="dash-main">
        <section className="animals-panel">
          <div className="animals-grid">
            {animais.map((a) => (
              <button
                key={a.numero}
                type="button"
                className={`animal-tile ${animal === a.numero ? "selected" : ""}`}
                onClick={() => setAnimal(a.numero)}
              >
                <div className="animal-number">{a.numero}</div>
                <img src={a.img} alt={a.nome} />
                <div className="animal-name">{a.nome}</div>
              </button>
            ))}
          </div>
        </section>

        <aside className="bet-panel">
          <div className="choose-box">
            <h4>TIPO DE APOSTA</h4>

            <div className="opcoes">
              <button
                className={tipoAposta === "grupo" ? "ativo" : ""}
                onClick={() => setTipoAposta("grupo")}
              >
                GRUPO
              </button>

              <button
                className={tipoAposta === "dezena" ? "ativo" : ""}
                onClick={() => setTipoAposta("dezena")}
              >
                DEZENA
              </button>

              <button
                className={tipoAposta === "milhar" ? "ativo" : ""}
                onClick={() => setTipoAposta("milhar")}
              >
                MILHAR
              </button>
            </div>
          </div>

          {tipoAposta === "dezena" && (
            <div className="choose-box">
              <h4>DEZENA</h4>
              <input
                className="valor-input"
                type="text"
                maxLength="2"
                placeholder="00 a 99"
                value={dezena}
                onChange={(e) => setDezena(e.target.value)}
              />
            </div>
          )}

          {tipoAposta === "milhar" && (
            <div className="choose-box">
              <h4>MILHAR</h4>
              <input
                className="valor-input"
                type="text"
                maxLength="4"
                placeholder="0000 a 9999"
                value={milhar}
                onChange={(e) => setMilhar(e.target.value)}
              />
            </div>
          )}

          <div className="choose-box">
            <h4>VALOR DA APOSTA</h4>
            <input
              className="valor-input"
              type="number"
              placeholder="Digite o valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>

          <div className="result-box">
            <strong>RESUMO DA APOSTA</strong>

            <div className="result-content">
              <p>
                <strong>Animal escolhido:</strong>{" "}
                {animalEscolhido
                  ? `${animalEscolhido.numero} - ${animalEscolhido.nome}`
                  : "Nenhum"}
              </p>

              <p>
                <strong>Tipo:</strong> {tipoAposta || "Não escolhido"}
              </p>

              <p>
                <strong>Dezena:</strong> {dezena || "Não informado"}
              </p>

              <p>
                <strong>Milhar:</strong> {milhar || "Não informado"}
              </p>

              <p>
                <strong>Valor apostado:</strong>{" "}
                {valor ? `R$ ${Number(valor).toFixed(2)}` : "Não escolhido"}
              </p>

              <p>
                <strong>1º prêmio:</strong> {resumo.primeiroPremio || "Aguardando"}
              </p>

              <p>
                <strong>Resultado:</strong> {resumo.resultado || "Aguardando"}
              </p>

              <p>
                <strong>Valor ganho:</strong> {resumo.valorGanho || "R$ 0,00"}
              </p>
            </div>
          </div>

          <button className="bet-button" onClick={apostar}>
            APOSTAR
          </button>
        </aside>
      </main>
    </div>
  );
}

export default Dashboard;