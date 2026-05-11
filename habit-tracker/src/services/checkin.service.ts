import { startOfDay } from 'date-fns';
import prisma from '../config/database';
import { AppError } from '../utils/AppError';

export class CheckinService {
  async realizarCheckin(usuarioId: string, habitoId: string) {
    // Verifica se o hábito existe e pertence ao usuário
    const habito = await prisma.habit.findFirst({
      where: { id: habitoId, usuarioId },
    });

    if (!habito) {
      throw new AppError('Hábito não encontrado', 404);
    }

    // Normaliza a data para meia-noite — ignora o horário
    const hoje = startOfDay(new Date());

    // Verifica se já fez check-in hoje
    const checkinExistente = await prisma.habitLog.findUnique({
      where: {
        habitoId_data: {
          habitoId,
          data: hoje,
        },
      },
    });

    if (checkinExistente) {
      throw new AppError('Hábito já marcado hoje', 409);
    }

    // Registra o check-in
    const checkin = await prisma.habitLog.create({
      data: {
        habitoId,
        data: hoje,
      },
    });

    // Calcula o streak após o check-in
    const streak = await this.calcularStreak(habitoId);

    return { checkin, streak };
  }

  async desfazerCheckin(usuarioId: string, habitoId: string) {
    // Verifica se o hábito existe e pertence ao usuário
    const habito = await prisma.habit.findFirst({
      where: { id: habitoId, usuarioId },
    });

    if (!habito) {
      throw new AppError('Hábito não encontrado', 404);
    }

    const hoje = startOfDay(new Date());

    // Verifica se existe check-in hoje para desfazer
    const checkin = await prisma.habitLog.findUnique({
      where: {
        habitoId_data: {
          habitoId,
          data: hoje,
        },
      },
    });

    if (!checkin) {
      throw new AppError('Nenhum check-in encontrado para hoje', 404);
    }

    await prisma.habitLog.delete({
      where: { id: checkin.id },
    });
  }

  async calcularStreak(habitoId: string): Promise<number> {
    // Busca todos os registros do hábito ordenados do mais recente pro mais antigo
    const registros = await prisma.habitLog.findMany({
      where: { habitoId },
      orderBy: { data: 'desc' },
    });

    if (registros.length === 0) return 0;

    let streak = 0;
    let dataEsperada = startOfDay(new Date());

    for (const registro of registros) {
      const dataRegistro = startOfDay(new Date(registro.data));
      const diferencaEmMs = dataEsperada.getTime() - dataRegistro.getTime();
      const diferencaEmDias = diferencaEmMs / (1000 * 60 * 60 * 24);

      if (diferencaEmDias === 0 || diferencaEmDias === 1) {
        // Dia consecutivo ou hoje — incrementa o streak
        streak++;
        dataEsperada = dataRegistro;
      } else {
        // Sequência quebrada — para de contar
        break;
      }
    }

    return streak;
  }

  async buscarRegistrosMes(usuarioId: string, habitoId: string, ano: number, mes: number) {
    // Verifica se o hábito pertence ao usuário
    const habito = await prisma.habit.findFirst({
      where: { id: habitoId, usuarioId },
    });

    if (!habito) {
      throw new AppError('Hábito não encontrado', 404);
    }

    // Define o intervalo do mês inteiro
    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 0, 23, 59, 59);

    const registros = await prisma.habitLog.findMany({
      where: {
        habitoId,
        data: { gte: inicio, lte: fim },
      },
      orderBy: { data: 'asc' },
    });

    const streak = await this.calcularStreak(habitoId);

    return {
      registros,
      streak,
      totalNoMes: registros.length,
    };
  }
}