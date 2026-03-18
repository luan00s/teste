const express = require("express");

const authRoutes = require("./routes/authRoutes");
const apostaRoutes = require("./routes/apostaRoutes");
const sorteioRoutes = require("./routes/sorteioRoutes");

const app = express();

app.use(express.json());

app.use(authRoutes);
app.use(apostaRoutes);
app.use(sorteioRoutes);

module.exports = app;