import { useEffect, useState } from "react";

const API = "http://localhost:3000";

function Historico({ setTela }) {
  const nomeUsuario = localStorage.getItem("nome") || "usuário";
  const saldo = Number(localStorage.getItem("saldo") || 1000).toFixed(2);
  const token = localStorage.getItem("token");

  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    async function buscarHistorico() {
      try {
        const res = await fetch(`${API}/historico`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setHistorico(data);
        }
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      }
    }

    if (token) {
      buscarHistorico();
    }
  }, [token]);

  return (
    <div className="dash-page">
      <header className="dash-top historico-top">
        <div className="dash-brand">
          <div className="dash-avatar">👤</div>

          <div className="dash-user-block">
            <div className="dash-user">olá, {nomeUsuario}</div>
            <div className="dash-balance">R$ {saldo}</div>
          </div>
        </div>

        <div className="historico-top-actions">
          <button onClick={() => setTela("dashboard")}>VOLTAR</button>
        </div>
      </header>

      <div className="historico-layout">
        <div className="historico-box historico-apostas">
          <div className="historico-header">
            <h3>HISTÓRICO DE APOSTAS</h3>
          </div>

          <div className="historico-content">
            {historico.length > 0 ? (
              historico.map((item) => (
                <div key={item.id} className="historico-item">
                  <span>{new Date(item.criado_em).toLocaleString("pt-BR")}</span>
                  <span>{item.tipo_aposta}</span>
                  <span>R$ {Number(item.valor).toFixed(2)}</span>
                  <span>{item.resultado}</span>
                </div>
              ))
            ) : (
              <div className="historico-empty">Nenhuma aposta registrada.</div>
            )}
          </div>
        </div>

        <div className="historico-box historico-side">
          <div className="historico-header">
            <h3>HISTÓRICO DE SORTEIOS</h3>
          </div>

          <div className="historico-content">
            {historico.length > 0 ? (
              historico.map((item) => (
                <div key={`s-${item.id}`} className="historico-item">
                  <span>{item.premio_1 || "-"}</span>
                  <span>{item.premio_2 || "-"}</span>
                  <span>{item.premio_3 || "-"}</span>
                  <span>{item.premio_4 || "-"}</span>
                </div>
              ))
            ) : (
              <div className="historico-empty">Nenhum sorteio registrado.</div>
            )}
          </div>
        </div>

        <div className="historico-box historico-bottom">
          <div className="historico-header">
            <h3>DETALHES DAS APOSTAS</h3>
          </div>

          <div className="historico-content">
            {historico.length > 0 ? (
              historico.map((item) => (
                <div key={`d-${item.id}`} className="historico-item">
                  <span>Animal: {item.animal ?? "-"}</span>
                  <span>Dezena: {item.dezena ?? "-"}</span>
                  <span>Milhar: {item.milhar ?? "-"}</span>
                  <span>Ganho: R$ {Number(item.valor_ganho).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="historico-empty">Nenhum detalhe disponível.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Historico;