const express = require("express");
const router = express.Router();

const { verificarToken } = require("../middlewares/authMiddleware");
const { listarHistorico } = require("../controllers/historicoController");

/**
 * @swagger
 * /historico:
 *   get:
 *     summary: Lista o histórico de apostas do usuário
 *     tags: [Histórico]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Histórico retornado com sucesso
 *       401:
 *         description: Não autenticado
 */
router.get("/historico", verificarToken, listarHistorico);

module.exports = router;