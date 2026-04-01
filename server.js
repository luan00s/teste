const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");

const app = express();


const authRoutes = require("./routes/authRoutes");
const saldoRoutes = require("./routes/saldoRoutes");
const apostaRoutes = require("./routes/apostaRoutes");
const historicoRoutes = require("./routes/historicoRoutes");


app.use(cors());
app.use(express.json());


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


app.use(authRoutes);
app.use(saldoRoutes);
app.use(apostaRoutes);
app.use(historicoRoutes);


app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});