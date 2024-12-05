import api from './api';
import type { Agenda, Situacao } from '../types/interfaces';

export const agendaService = {
  agendar: (usuarioId: number, vacinaId: number, dataInicial: string, hora: string, observacoes?: string) =>
    api.post<Agenda[]>('/agendas', { usuarioId, vacinaId, dataInicial, hora, observacoes }),

  darBaixa: (agendaId: number, situacao: Situacao) =>
    api.put<Agenda>(`/agendas/${agendaId}/baixa`, { novaSituacao: situacao }),

  listarPorUsuario: (usuarioId: number) =>
    api.get<Agenda[]>(`/agendas/usuario/${usuarioId}`),

  buscarTodas: () =>
    api.get<Agenda[]>('/agendas'),

  buscarPorSituacao: (situacao: Situacao) =>
    api.get<Agenda[]>(`/agendas/situacao/${situacao}`),

  excluir: (agendaId: number) =>
    api.delete(`/agendas/${agendaId}`),

  buscarPorId: (id: number) =>
    api.get<Agenda>(`/agendas/${id}`),
};

