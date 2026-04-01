const db = require("../database/connection");

function sortearMilhar() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, "0");
}

function gerarCincoPremios() {
  const premios = [];
  const usados = new Set();

  while (premios.length < 5) {
    const numero = sortearMilhar();
    if (!usados.has(numero)) {
      usados.add(numero);
      premios.push(numero);
    }
  }

  return premios;
}

function obterGrupoPorDezena(dezena) {
  const dezenaNum = Number(dezena === "00" ? 100 : dezena);
  return Math.ceil(dezenaNum / 4);
}

exports.criarAposta = (req, res) => {
  const user_id = req.user?.id;
  const { animal, tipoAposta, valor, dezena, milhar } = req.body || {};

  console.log("DADOS RECEBIDOS NA APOSTA:", {
    user_id,
    animal,
    tipoAposta,
    valor,
    dezena,
    milhar,
  });

  if (!user_id) {
    return res.status(401).json({
      erro: "Usuário não autenticado",
    });
  }

  if (!tipoAposta || valor === undefined || valor === null || valor === "") {
    return res.status(400).json({
      erro: "Dados incompletos",
    });
  }

  const tiposValidos = ["grupo", "dezena", "milhar"];

  if (!tiposValidos.includes(tipoAposta)) {
    return res.status(400).json({
      erro: "Tipo de aposta inválido",
    });
  }

  const valorNumerico = Number(valor);

  if (isNaN(valorNumerico) || valorNumerico <= 0) {
    return res.status(400).json({
      erro: "Valor inválido",
    });
  }

  if (tipoAposta === "grupo") {
    const animalNumerico = Number(animal);

    if (isNaN(animalNumerico) || animalNumerico < 1 || animalNumerico > 25) {
      return res.status(400).json({
        erro: "Animal inválido",
      });
    }
  }

  if (tipoAposta === "dezena" && !/^\d{2}$/.test(String(dezena))) {
    return res.status(400).json({
      erro: "Dezena inválida",
    });
  }

  if (tipoAposta === "milhar" && !/^\d{4}$/.test(String(milhar))) {
    return res.status(400).json({
      erro: "Milhar inválida",
    });
  }

  db.query(
    "SELECT saldo FROM usuarios WHERE id = ?",
    [user_id],
    (err, result) => {
      if (err) {
        console.error("ERRO AO BUSCAR SALDO:", err);
        return res.status(500).json({
          erro: "Erro ao buscar saldo",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          erro: "Usuário não encontrado",
        });
      }

      const saldoAtual = Number(result[0].saldo);

      if (saldoAtual < valorNumerico) {
        return res.status(400).json({
          erro: "Saldo insuficiente",
        });
      }

      const premios = gerarCincoPremios();
      const primeiroPremio = premios[0];
      const dezenaPrimeiroPremio = primeiroPremio.slice(-2);
      const grupoPrimeiroPremio = obterGrupoPorDezena(dezenaPrimeiroPremio);

      let valorGanho = 0;
      let resultado = "PERDEU";

      if (tipoAposta === "grupo") {
        if (Number(animal) === grupoPrimeiroPremio) {
          valorGanho = valorNumerico * 18;
          resultado = "GANHOU";
        }
      }

      if (tipoAposta === "dezena") {
        if (String(dezena) === dezenaPrimeiroPremio) {
          valorGanho = valorNumerico * 60;
          resultado = "GANHOU";
        }
      }

      if (tipoAposta === "milhar") {
        if (String(milhar) === primeiroPremio) {
          valorGanho = valorNumerico * 4000;
          resultado = "GANHOU";
        }
      }

      const saldoFinal = saldoAtual - valorNumerico + valorGanho;

      db.query(
        "UPDATE usuarios SET saldo = ? WHERE id = ?",
        [saldoFinal, user_id],
        (errUpdate) => {
          if (errUpdate) {
            console.error("ERRO AO ATUALIZAR SALDO:", errUpdate);
            return res.status(500).json({
              erro: "Erro ao atualizar saldo",
            });
          }

          db.query(
            `INSERT INTO apostas
            (user_id, animal, tipo_aposta, valor, dezena, milhar, resultado, premio_1, premio_2, premio_3, premio_4, premio_5, valor_ganho)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              user_id,
              animal || null,
              tipoAposta,
              valorNumerico,
              dezena || null,
              milhar || null,
              resultado,
              premios[0],
              premios[1],
              premios[2],
              premios[3],
              premios[4],
              valorGanho,
            ],
            (errInsert) => {
              if (errInsert) {
                console.error("ERRO AO REGISTRAR APOSTA:", errInsert);
                return res.status(500).json({
                  erro: "Erro ao registrar aposta",
                  detalhe: errInsert.sqlMessage || errInsert.message,
                });
              }

              return res.json({
                mensagem: "Aposta registrada com sucesso",
                resultado,
                saldo_restante: saldoFinal,
                premios,
                primeiro_premio: primeiroPremio,
                grupo_primeiro_premio: grupoPrimeiroPremio,
                dezena_primeiro_premio: dezenaPrimeiroPremio,
                valor_ganho: valorGanho,
              });
            }
          );
        }
      );
    }
  );
};