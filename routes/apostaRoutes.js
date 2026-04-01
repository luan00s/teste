const express = require("express");
const router = express.Router();

const { criarAposta } = require("../controllers/apostaController");
const { verificarToken } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /aposta:
 *   post:
 *     summary: Registra uma aposta
 *     tags: [Apostas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipoAposta
 *               - valor
 *             properties:
 *               animal:
 *                 type: integer
 *                 example: 5
 *               tipoAposta:
 *                 type: string
 *                 example: grupo
 *               valor:
 *                 type: number
 *                 example: 50
 *               dezena:
 *                 type: string
 *                 example: "05"
 *               milhar:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Aposta registrada com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 */
router.post("/aposta", verificarToken, criarAposta);

module.exports = router;