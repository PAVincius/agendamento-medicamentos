import api from './api';
import type { Componente } from '../types/interfaces';

export const componenteService = {
  criar: (componente: Omit<Componente, 'id'>) =>
    api.post<Componente>('/componentes', componente),

  listarTodos: () => api.get<Componente[]>('/componentes'),

  buscarPorId: (id: number) => api.get<Componente>(`/componentes/${id}`),

  atualizar: (id: number, componente: Omit<Componente, 'id'>) =>
    api.put<Componente>(`/componentes/${id}`, componente),

  deletar: (id: number) => api.delete(`/componentes/${id}`),
};
