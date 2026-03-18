const db = require("../database/connection");

const animais = [
 "Avestruz","Águia","Burro","Borboleta","Cachorro",
 "Cabra","Carneiro","Camelo","Cobra","Coelho",
 "Cavalo","Elefante","Galo","Gato","Jacaré",
 "Leão","Macaco","Porco","Pavão","Peru",
 "Touro","Tigre","Urso","Veado","Vaca"
];

exports.sortear = (req, res) => {

 const animalSorteado = animais[Math.floor(Math.random() * animais.length)];

 // salvar sorteio
 db.query(
  "INSERT INTO sorteios (animal) VALUES (?)",
  [animalSorteado],
  (err) => {

   if (err) {
    return res.status(500).json({ erro: "Erro no sorteio" });
   }

   // buscar apostas
   db.query("SELECT * FROM apostas", (err, apostas) => {

    if (err) {
     return res.status(500).json({ erro: "Erro ao buscar apostas" });
    }

    apostas.forEach((aposta) => {

     if (aposta.animal === animalSorteado) {

      const premio = aposta.valor * 10;

      db.query(
       "UPDATE usuarios SET saldo = saldo + ? WHERE id = ?",
       [premio, aposta.user_id]
      );

     }

    });

    res.json({
     animal_sorteado: animalSorteado,
     total_apostas: apostas.length
    });

   });

  }
 );

};