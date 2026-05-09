import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

// Schemas de validação
const schemaCadastro = z.object({
  nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

const schemaLogin = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(1, 'A senha é obrigatória'),
});

export class AuthController {
  async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dados = schemaCadastro.parse(req.body);
      const resultado = await authService.cadastrar(dados);
      res.status(201).json({ status: 'sucesso', dados: resultado });
    } catch (erro) {
      next(erro);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dados = schemaLogin.parse(req.body);
      const resultado = await authService.login(dados);
      res.status(200).json({ status: 'sucesso', dados: resultado });
    } catch (erro) {
      next(erro);
    }
  }
}