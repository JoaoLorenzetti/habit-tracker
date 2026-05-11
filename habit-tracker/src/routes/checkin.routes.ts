import { Router } from 'express';
import { CheckinController } from '../controllers/checkin.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true }); // herda o :id do hábito
const checkinController = new CheckinController();

router.use(authenticate);

/**
 * @swagger
 * /habits/{id}/checkin:
 *   post:
 *     summary: Realizar check-in do hábito hoje
 *     tags: [Check-in]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do hábito
 *     responses:
 *       201:
 *         description: Check-in realizado com sucesso, retorna streak atual
 *       409:
 *         description: Hábito já marcado hoje
 */
router.post('/', (req, res, next) => checkinController.realizarCheckin(req, res, next));

/**
 * @swagger
 * /habits/{id}/checkin:
 *   delete:
 *     summary: Desfazer check-in do hábito hoje
 *     tags: [Check-in]
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
 *         description: Check-in desfeito com sucesso
 *       404:
 *         description: Nenhum check-in encontrado para hoje
 */
router.delete('/', (req, res, next) => checkinController.desfazerCheckin(req, res, next));

/**
 * @swagger
 * /habits/{id}/registros:
 *   get:
 *     summary: Buscar registros do hábito em um mês
 *     tags: [Check-in]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: ano
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2026
 *       - in: query
 *         name: mes
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: Registros do mês com streak e total
 */
router.get('/registros', (req, res, next) => checkinController.buscarRegistrosMes(req, res, next));

export default router;