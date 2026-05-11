import { Router } from 'express';
import { HabitController } from '../controllers/habit.controller';
import { authenticate } from '../middlewares/auth.middleware';
import checkinRoutes from './checkin.routes';

const router = Router();
const habitController = new HabitController();

// Todas as rotas de hábitos exigem autenticação
router.use(authenticate);
router.use('/:id/checkin', checkinRoutes);
router.use('/:id', checkinRoutes);

/**
 * @swagger
 * /habits:
 *   post:
 *     summary: Criar um novo hábito
 *     tags: [Hábitos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo]
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Beber água
 *               descricao:
 *                 type: string
 *                 example: Beber 2 litros por dia
 *               cor:
 *                 type: string
 *                 example: "#6366f1"
 *               frequencia:
 *                 type: string
 *                 enum: [DIARIO, SEMANAL]
 *                 example: DIARIO
 *     responses:
 *       201:
 *         description: Hábito criado com sucesso
 */
router.post('/', (req, res, next) => habitController.criar(req, res, next));

/**
 * @swagger
 * /habits:
 *   get:
 *     summary: Listar todos os hábitos do usuário
 *     tags: [Hábitos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de hábitos retornada com sucesso
 */
router.get('/', (req, res, next) => habitController.listar(req, res, next));

/**
 * @swagger
 * /habits/{id}:
 *   get:
 *     summary: Buscar um hábito pelo ID
 *     tags: [Hábitos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hábito encontrado
 *       404:
 *         description: Hábito não encontrado
 */
router.get('/:id', (req, res, next) => habitController.buscarPorId(req, res, next));

/**
 * @swagger
 * /habits/{id}:
 *   patch:
 *     summary: Atualizar um hábito
 *     tags: [Hábitos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               cor:
 *                 type: string
 *               frequencia:
 *                 type: string
 *                 enum: [DIARIO, SEMANAL]
 *               ativo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Hábito atualizado com sucesso
 *       404:
 *         description: Hábito não encontrado
 */
router.patch('/:id', (req, res, next) => habitController.atualizar(req, res, next));

/**
 * @swagger
 * /habits/{id}:
 *   delete:
 *     summary: Deletar um hábito
 *     tags: [Hábitos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Hábito deletado com sucesso
 *       404:
 *         description: Hábito não encontrado
 */
router.delete('/:id', (req, res, next) => habitController.deletar(req, res, next));

export default router;