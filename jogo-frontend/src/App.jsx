import { useState } from "react";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Historico from "./pages/Historico";

function App() {
  const [tela, setTela] = useState("login");
  const token = localStorage.getItem("token");

  if (!token) {
    if (tela === "cadastro") {
      return <Cadastro setTela={setTela} />;
    }

    return <Login setTela={setTela} />;
  }

  if (tela === "historico") {
    return <Historico setTela={setTela} />;
  }

  return <Dashboard setTela={setTela} />;
}

export default App;