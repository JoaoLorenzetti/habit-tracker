import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /auth/cadastrar:
 *   post:
 *     summary: Cadastrar um novo usuário
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@exemplo.com
 *               senha:
 *                 type: string
 *                 example: minhasenha123
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       409:
 *         description: E-mail já está em uso
 */
router.post('/cadastrar', (req, res, next) => authController.cadastrar(req, res, next));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Fazer login e obter token JWT
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@exemplo.com
 *               senha:
 *                 type: string
 *                 example: minhasenha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', (req, res, next) => authController.login(req, res, next));

export default router;