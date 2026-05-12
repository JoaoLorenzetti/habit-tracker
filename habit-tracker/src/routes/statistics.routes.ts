import { Router } from 'express';
import { StatisticsController } from '../controllers/statistics.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const statisticsController = new StatisticsController();

router.use(authenticate);

/**
 * @swagger
 * /statistics/resumo:
 *   get:
 *     summary: Resumo geral do usuário
 *     tags: [Estatísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retorna total de hábitos, completados hoje, maior streak e taxa de conclusão
 */
router.get('/resumo', (req, res, next) => statisticsController.resumoGeral(req, res, next));

/**
 * @swagger
 * /statistics/semanal:
 *   get:
 *     summary: Progresso dos últimos 7 dias
 *     tags: [Estatísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retorna array com completados e porcentagem por dia — usado nos gráficos
 */
router.get('/semanal', (req, res, next) => statisticsController.progressoSemanal(req, res, next));

/**
 * @swagger
 * /statistics/habitos:
 *   get:
 *     summary: Progresso individual por hábito
 *     tags: [Estatísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retorna cada hábito com streak e completados na semana
 */
router.get('/habitos', (req, res, next) => statisticsController.progressoPorHabito(req, res, next));

export default router;