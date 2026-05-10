import prisma from '../config/database';
import { AppError } from '../utils/AppError';

interface DadosCriarHabito {
  titulo: string;
  descricao?: string;
  cor?: string;
  frequencia?: 'DIARIO' | 'SEMANAL';
}

interface DadosAtualizarHabito {
  titulo?: string;
  descricao?: string;
  cor?: string;
  frequencia?: 'DIARIO' | 'SEMANAL';
  ativo?: boolean;
}

export class HabitService {
  async criar(usuarioId: string, dados: DadosCriarHabito) {
    const habito = await prisma.habit.create({
      data: {
        ...dados,
        usuarioId,
      },
    });

    return habito;
  }

  async listar(usuarioId: string) {
    const habitos = await prisma.habit.findMany({
      where: {
        usuarioId,
        ativo: true,
      },
      orderBy: { criadoEm: 'desc' },
    });

    return habitos;
  }

  async buscarPorId(usuarioId: string, habitoId: string) {
    const habito = await prisma.habit.findFirst({
      where: {
        id: habitoId,
        usuarioId, // garante que o hábito pertence ao usuário logado
      },
    });

    if (!habito) {
      throw new AppError('Hábito não encontrado', 404);
    }

    return habito;
  }

  async atualizar(usuarioId: string, habitoId: string, dados: DadosAtualizarHabito) {
    // Verifica se o hábito existe e pertence ao usuário
    await this.buscarPorId(usuarioId, habitoId);

    const habito = await prisma.habit.update({
      where: { id: habitoId },
      data: dados,
    });

    return habito;
  }

  async deletar(usuarioId: string, habitoId: string) {
    // Verifica se o hábito existe e pertence ao usuário
    await this.buscarPorId(usuarioId, habitoId);

    // Deleção em cascata — remove também todos os registros do hábito
    await prisma.habit.delete({
      where: { id: habitoId },
    });
  }
}