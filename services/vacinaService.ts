import api from './api';
import type { Vacina } from '../types/interfaces';

export const vacinaService = {
  criar: (vacina: Omit<Vacina, 'id'>) => api.post<Vacina>('/vacinas', vacina),

  listarTodas: () => api.get<Vacina[]>('/vacinas'),

  buscarPorId: (id: number) => api.get<Vacina>(`/vacinas/${id}`),

  atualizar: (id: number, vacina: Omit<Vacina, 'id'>) =>
    api.put<Vacina>(`/vacinas/${id}`, vacina),

  deletar: (id: number) => api.delete(`/vacinas/${id}`),
};
