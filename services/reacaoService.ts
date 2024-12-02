import api from './api';
import type { Reacao } from '../types/interfaces';

export const reacaoService = {
  incluirReacao: (agendaId: number, descricao: string, dataReacao: string) =>
    api.post<Reacao>('/reacoes', null, {
      params: { agendaId, descricao, dataReacao },
    }),

  listarTodas: () => api.get<Reacao[]>('/reacoes'),

  buscarPorAgenda: (agendaId: number) =>
    api.get<Reacao[]>(`/reacoes/agenda/${agendaId}`),

  buscarPorUsuario: (usuarioId: number) =>
    api.get<Reacao[]>(`/reacoes/usuario/${usuarioId}`),

  excluirReacao: (id: number) => api.delete(`/reacoes/${id}`),
};
