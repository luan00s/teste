const request = require("supertest");
const app = require("../app");
const db = require("../database/connection");

describe("Testes da API", () => {

 test("Cadastro de usuário", async () => {

  const email = `teste${Date.now()}@email.com`;

  const res = await request(app)
   .post("/register")
   .send({
    nome: "Teste",
    email: email,
    senha: "123456"
   });

  expect(res.statusCode).toBe(200);

 });

 afterAll(() => {
  db.end();
 });

});