import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { HabitService } from '../services/habit.service';

const habitService = new HabitService();

// Schemas de validação
const schemaCriar = z.object({
  titulo: z.string().min(1, 'O título é obrigatório').max(100, 'Título muito longo'),
  descricao: z.string().max(255).optional(),
  cor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida — use formato hex ex: #6366f1').optional(),
  frequencia: z.enum(['DIARIO', 'SEMANAL']).optional(),
});

const schemaAtualizar = schemaCriar.partial().extend({
  ativo: z.boolean().optional(),
});

export class HabitController {
  async criar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId;
      const dados = schemaCriar.parse(req.body);
      const habito = await habitService.criar(usuarioId, dados);
      res.status(201).json({ status: 'sucesso', dados: habito });
    } catch (erro) {
      next(erro);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId;
      const habitos = await habitService.listar(usuarioId);
      res.status(200).json({ status: 'sucesso', dados: habitos });
    } catch (erro) {
      next(erro);
    }
  }

  async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId;
      const { id } = req.params;
      const habito = await habitService.buscarPorId(usuarioId, id);
      res.status(200).json({ status: 'sucesso', dados: habito });
    } catch (erro) {
      next(erro);
    }
  }

  async atualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId;
      const { id } = req.params;
      const dados = schemaAtualizar.parse(req.body);
      const habito = await habitService.atualizar(usuarioId, id, dados);
      res.status(200).json({ status: 'sucesso', dados: habito });
    } catch (erro) {
      next(erro);
    }
  }

  async deletar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = req.user!.userId;
      const { id } = req.params;
      await habitService.deletar(usuarioId, id);
      res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  }
}