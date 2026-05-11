import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CheckinService } from '../services/checkin.service';

const checkinService = new CheckinService();

const schemaRegistrosMes = z.object({
  ano: z.coerce.number().min(2000).max(2100),
  mes: z.coerce.number().min(1).max(12),
});

export class CheckinController {
  async realizarCheckin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId;
      const { id } = req.params;
      const resultado = await checkinService.realizarCheckin(usuarioId, id);
      res.status(201).json({ status: 'sucesso', dados: resultado });
    } catch (erro) {
      next(erro);
    }
  }

  async desfazerCheckin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId;
      const { id } = req.params;
      await checkinService.desfazerCheckin(usuarioId, id);
      res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  }

  async buscarRegistrosMes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId;
      const { id } = req.params;
      const { ano, mes } = schemaRegistrosMes.parse(req.query);
      const resultado = await checkinService.buscarRegistrosMes(usuarioId, id, ano, mes);
      res.status(200).json({ status: 'sucesso', dados: resultado });
    } catch (erro) {
      next(erro);
    }
  }
}