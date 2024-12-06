import api from './api';
import type { Agenda, Situacao } from '../types/interfaces';

export const agendaService = {
  agendar: (usuarioId: number, vacinaId: number, dataInicial: string, horaString: string, observacoes?: string) =>
  api.post<Agenda[]>('/agendas', null, { 
    params: { usuarioId, vacinaId, dataInicial, horaString, observacoes }
  }),

  darBaixa: (agendaId: number, novaSituacao: Situacao) =>
    api.put<Agenda>(`/agendas/${agendaId}/baixa`, null, { params: { situacao: novaSituacao } }),

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

