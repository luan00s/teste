const express = require("express");
const router = express.Router();

const apostaController = require("../controllers/apostaController");

router.post("/aposta", apostaController.criarAposta);

module.exports = router; 