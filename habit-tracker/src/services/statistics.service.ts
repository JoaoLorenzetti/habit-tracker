import { startOfDay, subDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import prisma from '../config/database';
import { CheckinService } from './checkin.service';

const checkinService = new CheckinService();

export class StatisticsService {
  async resumoGeral(usuarioId: string) {
    // Total de hábitos ativos
    const totalHabitos = await prisma.habit.count({
      where: { usuarioId, ativo: true },
    });

    // Hábitos completados hoje
    const hoje = startOfDay(new Date());
    const completadosHoje = await prisma.habitLog.count({
      where: {
        data: hoje,
        habito: { usuarioId },
      },
    });

    // Busca todos os hábitos para calcular o streak de cada um
    const habitos = await prisma.habit.findMany({
      where: { usuarioId, ativo: true },
      select: { id: true },
    });

    // Calcula o maior streak entre todos os hábitos
    const streaks = await Promise.all(
      habitos.map((h) => checkinService.calcularStreak(h.id))
    );
    const maiorStreak = streaks.length > 0 ? Math.max(...streaks) : 0;

    // Taxa de conclusão geral (últimos 7 dias)
    const taxaConclusao = await this.calcularTaxaConclusao(usuarioId, 7);

    return {
      totalHabitos,
      completadosHoje,
      maiorStreak,
      taxaConclusao,
    };
  }

  async progressoSemanal(usuarioId: string) {
    const hoje = startOfDay(new Date());

    // Monta os últimos 7 dias
    const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
      const data = subDays(hoje, 6 - i);
      return {
        data,
        label: format(data, 'EEE', { locale: ptBR }), // ex: "seg", "ter"
        dataFormatada: format(data, 'dd/MM'),
      };
    });

    // Total de hábitos ativos (denominador da taxa)
    const totalHabitos = await prisma.habit.count({
      where: { usuarioId, ativo: true },
    });

    // Para cada dia busca quantos hábitos foram completados
    const progresso = await Promise.all(
      ultimos7Dias.map(async ({ data, label, dataFormatada }) => {
        const completados = await prisma.habitLog.count({
          where: {
            data,
            habito: { usuarioId },
          },
        });

        return {
          dia: label,
          data: dataFormatada,
          completados,
          total: totalHabitos,
          // Porcentagem de conclusão do dia (0-100)
          porcentagem: totalHabitos > 0
            ? Math.round((completados / totalHabitos) * 100)
            : 0,
        };
      })
    );

    return progresso;
  }

  async progressoPorHabito(usuarioId: string) {
    const hoje = startOfDay(new Date());
    const inicioSemana = subDays(hoje, 6);

    // Busca todos os hábitos com seus registros dos últimos 7 dias
    const habitos = await prisma.habit.findMany({
      where: { usuarioId, ativo: true },
      include: {
        registros: {
          where: {
            data: { gte: inicioSemana, lte: hoje },
          },
        },
      },
    });

    // Para cada hábito calcula o streak e o progresso semanal
    const resultado = await Promise.all(
      habitos.map(async (habito) => {
        const streak = await checkinService.calcularStreak(habito.id);
        const completadosNaSemana = habito.registros.length;

        return {
          id: habito.id,
          titulo: habito.titulo,
          cor: habito.cor,
          frequencia: habito.frequencia,
          streak,
          completadosNaSemana,
          // Hábito diário tem meta de 7 por semana, semanal tem meta de 1
          metaSemanal: habito.frequencia === 'DIARIO' ? 7 : 1,
        };
      })
    );

    return resultado;
  }

  private async calcularTaxaConclusao(usuarioId: string, dias: number): Promise<number> {
    const hoje = startOfDay(new Date());
    const inicio = subDays(hoje, dias - 1);

    const totalHabitos = await prisma.habit.count({
      where: { usuarioId, ativo: true },
    });

    if (totalHabitos === 0) return 0;

    const totalCheckins = await prisma.habitLog.count({
      where: {
        data: { gte: inicio, lte: hoje },
        habito: { usuarioId },
      },
    });

    // Total possível = hábitos × dias
    const totalPossivel = totalHabitos * dias;
    return Math.round((totalCheckins / totalPossivel) * 100);
  }
}