const express = require("express");
const router = express.Router();

const sorteioController = require("../controllers/sorteioController");

router.post("/sortear", sorteioController.sortear);

module.exports = router;