import api from './api';
import type { Alergia } from '../types/interfaces';

export const alergiaService = {
  criar: (alergia: Omit<Alergia, 'id'>) =>
    api.post<Alergia>('/alergias', alergia),

  listarTodas: () => api.get<Alergia[]>('/alergias'),

  buscarPorId: (id: number) => api.get<Alergia>(`/alergias/${id}`),

  buscarPorNome: (nome: string) => api.get<Alergia>(`/alergias/nome/${nome}`),

  atualizar: (id: number, alergia: Omit<Alergia, 'id'>) =>
    api.put<Alergia>(`/alergias/${id}`, alergia),

  deletar: (id: number) => api.delete(`/alergias/${id}`),
};
