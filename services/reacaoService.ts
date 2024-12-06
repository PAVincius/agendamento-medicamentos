import api from './api';
import type { Reacao } from '../types/interfaces';

export const reacaoService = {
  incluirReacao: (agendaId: number, descricao: string, dataReacao: string) => {
  // Convert the ISO string to a date in the format YYYY-MM-DD
  const formattedDate = dataReacao.split('T')[0];
  return api.post<Reacao>('/reacoes', null, { params: { agendaId, descricao, dataReacao: formattedDate } });
},

  listarTodas: () =>
    api.get<Reacao[]>('/reacoes'),

  buscarPorAgenda: (agendaId: number) =>
    api.get<Reacao[]>(`/reacoes/agenda/${agendaId}`),

  buscarPorUsuario: (usuarioId: number) =>
    api.get<Reacao[]>(`/reacoes/usuario/${usuarioId}`),

  excluirReacao: (id: number) =>
    api.delete(`/reacoes/${id}`),

  atualizarReacao: (id: number, reacao: Omit<Reacao, 'id'>) =>
    api.put<Reacao>(`/reacoes/${id}`, reacao),
};

