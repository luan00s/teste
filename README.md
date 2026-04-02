BichoFull.BET

Esse projeto é um sistema web baseado no jogo do bicho, desenvolvido com o objetivo de praticar desenvolvimento fullstack, envolvendo frontend, backend e banco de dados.

A proposta é simular um ambiente de apostas, onde o usuário pode se cadastrar, entrar no sistema, realizar apostas e acompanhar seu saldo e histórico.

---

O que o sistema faz

- Permite criar conta e fazer login
- Controla o saldo do usuário (depósito e saque)
- Permite realizar apostas em:
  - Grupo (animais)
  - Dezena (00 a 99)
  - Milhar (0000 a 9999)
- Realiza sorteios automaticamente
- Calcula ganhos ou perdas
- Mostra histórico de:
  - Apostas
  - Sorteios
  - Depósitos
  - Saques

---

Tecnologias usadas

Backend

- Node.js
- Express
- MySQL
- JWT (autenticação)
- bcrypt (criptografia de senha)

Frontend

- React
- CSS

---

Como rodar o projeto

1. Backend

cd jogo-api
npm install
node server.js

O servidor vai rodar em:

http://localhost:3000

---

2. Banco de dados

Crie o banco no MySQL:

CREATE DATABASE jogo_bicho;
USE jogo_bicho;

Depois crie as tabelas necessárias ("usuarios" e "apostas").

---

3. Frontend

cd frontend
npm install
npm run dev

Acesse no navegador:

http://localhost:5173

---

Como funciona o sistema

Depois de fazer login, o sistema gera um token (JWT) que é usado para acessar rotas protegidas.

O usuário pode:

- adicionar saldo
- sacar saldo
- fazer apostas

Quando uma aposta é feita:

- o valor é descontado do saldo
- o sistema gera um sorteio com 5 números
- verifica se o usuário ganhou ou perdeu
- atualiza o saldo automaticamente

---

Regras do sistema

- O saldo não pode ficar negativo
- Cada aposta gera um novo sorteio
- Os ganhos variam conforme o tipo de aposta:
  - Grupo: 18x
  - Dezena: 60x
  - Milhar: 4000x

---

Observação

Esse sistema é apenas uma simulação para fins acadêmicos.
Não envolve dinheiro real.
