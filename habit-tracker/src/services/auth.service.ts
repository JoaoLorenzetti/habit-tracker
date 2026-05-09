import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { AppError } from '../utils/AppError';

interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
}

interface DadosLogin {
  email: string;
  senha: string;
}

export class AuthService {
  async cadastrar(dados: DadosCadastro) {
    // Verifica se o email já está em uso
    const usuarioExistente = await prisma.user.findUnique({
      where: { email: dados.email },
    });

    if (usuarioExistente) {
      throw new AppError('E-mail já está em uso', 409);
    }

    // Criptografa a senha antes de salvar
    const senhaCriptografada = await bcrypt.hash(dados.senha, 12);

    const usuario = await prisma.user.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: senhaCriptografada,
      },
    });

    const token = this.gerarToken(usuario.id, usuario.email);

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  }

  async login(dados: DadosLogin) {
    // Busca o usuário pelo email
    const usuario = await prisma.user.findUnique({
      where: { email: dados.email },
    });

    // Mesma mensagem para email e senha inválidos — não revela qual está errado
    if (!usuario) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const senhaCorreta = await bcrypt.compare(dados.senha, usuario.senha);

    if (!senhaCorreta) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const token = this.gerarToken(usuario.id, usuario.email);

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  }

  private gerarToken(usuarioId: string, email: string): string {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!secret) {
      throw new AppError('Erro de configuração do servidor', 500, false);
    }

    // Gera o token com o ID e email do usuário no payload
    return jwt.sign({ userId: usuarioId, email }, secret, { expiresIn } as jwt.SignOptions);
  }
}