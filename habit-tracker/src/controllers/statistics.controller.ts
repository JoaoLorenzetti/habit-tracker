import { Request, Response, NextFunction } from 'express';
import { StatisticsService } from '../services/statistics.service';

const statisticsService = new StatisticsService();

export class StatisticsController {
  async resumoGeral(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId;
      const resultado = await statisticsService.resumoGeral(usuarioId);
      res.status(200).json({ status: 'sucesso', dados: resultado });
    } catch (erro) {
      next(erro);
    }
  }

  async progressoSemanal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId;
      const resultado = await statisticsService.progressoSemanal(usuarioId);
      res.status(200).json({ status: 'sucesso', dados: resultado });
    } catch (erro) {
      next(erro);
    }
  }

  async progressoPorHabito(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId;
      const resultado = await statisticsService.progressoPorHabito(usuarioId);
      res.status(200).json({ status: 'sucesso', dados: resultado });
    } catch (erro) {
      next(erro);
    }
  }
}