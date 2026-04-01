const express = require("express");
const router = express.Router();

const { atualizarSaldo } = require("../controllers/saldoController");
const { verificarToken } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /saldo:
 *   post:
 *     summary: Realiza depósito ou saque
 *     tags: [Saldo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - valor
 *             properties:
 *               tipo:
 *                 type: string
 *                 example: deposito
 *               valor:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Saldo atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 */
router.post("/saldo", verificarToken, atualizarSaldo);

module.exports = router;