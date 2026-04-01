const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const apostaRoutes = require("./routes/apostaRoutes");
const saldoRoutes = require("./routes/saldoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(apostaRoutes);
app.use(saldoRoutes);

module.exports = app;