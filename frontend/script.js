const API = "http://localhost:3000";

function verificarLogin(){

 const token = localStorage.getItem("token");

 if(!token){
  alert("Você precisa fazer login");
  window.location.href = "login.html";
 }

}

async function cadastrar(){

 const nome = document.getElementById("nome").value;
 const email = document.getElementById("email").value;
 const senha = document.getElementById("senha").value;

 if(!nome || !email || !senha){
  alert("Preencha todos os campos");
  return;
 }

 try{

  const res = await fetch(API + "/register",{
   method:"POST",
   headers:{
    "Content-Type":"application/json"
   },
   body:JSON.stringify({
    nome,
    email,
    senha
   })
  });

  const data = await res.json();

  alert(data.message || "Cadastro realizado");

  window.location.href = "login.html";

 }catch(err){

  alert("Erro ao conectar com servidor");
  console.log(err);

 }

}

async function login(){

 const email = document.getElementById("email").value;
 const senha = document.getElementById("senha").value;

 if(!email || !senha){
  alert("Preencha os campos");
  return;
 }

 const res = await fetch(API + "/login",{
  method:"POST",
  headers:{
   "Content-Type":"application/json"
  },
  body:JSON.stringify({
   email,
   senha
  })
 });

 const data = await res.json();

 if(data.token){

  localStorage.setItem("token",data.token);

  alert("Login realizado");

  window.location.href = "dashboard.html";

 }else{

  alert(data.message || "Erro no login");

 }

}

async function apostar(){

 verificarLogin();

 const animal = document.getElementById("animal").value;
 const valor = document.getElementById("valor").value;

 if(!animal || !valor){
  alert("Preencha os campos");
  return;
 }

 const token = localStorage.getItem("token");

 const res = await fetch(API + "/aposta",{
  method:"POST",
  headers:{
   "Content-Type":"application/json",
   "Authorization":"Bearer " + token
  },
  body:JSON.stringify({
   animal,
   valor
  })
 });

 const data = await res.json();

 alert(data.message || "Aposta registrada");

}

async function verApostas(){

 verificarLogin();

 const token = localStorage.getItem("token");

 const res = await fetch(API + "/apostas",{
  headers:{
   "Authorization":"Bearer " + token
  }
 });

 const apostas = await res.json();

 const tabela = document.getElementById("tabelaApostas");

 tabela.innerHTML = "";

 apostas.forEach(aposta => {

  const resultado = verificarResultado(aposta.animal);

  tabela.innerHTML += `
  <tr>
   <td>${aposta.animal}</td>
   <td>R$ ${aposta.valor}</td>
   <td>${new Date(aposta.data).toLocaleDateString()}</td>
   <td>${resultado}</td>
  </tr>
  `;

 });

}

function gerarSorteio(){

 const animais = [
 "Avestruz","Águia","Burro","Borboleta","Cachorro",
 "Cabra","Carneiro","Camelo","Cobra","Coelho",
 "Cavalo","Elefante","Galo","Gato","Jacaré",
 "Leão","Macaco","Porco","Pavão","Peru",
 "Touro","Tigre","Urso","Veado","Vaca"
 ];

 const sorteado = animais[Math.floor(Math.random()*animais.length)];

 localStorage.setItem("resultado",sorteado);

 alert("Animal sorteado: " + sorteado);

}

function verificarResultado(animal){

 const resultado = localStorage.getItem("resultado");

 if(!resultado) return "Sem sorteio";

 if(resultado === animal){

  return "🏆 Ganhou";

 }else{

  return "❌ Perdeu";

 }

}

function logout(){

 localStorage.removeItem("token");

 window.location.href = "login.html";

}