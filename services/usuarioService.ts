import api from './api';
import type { Usuario } from '../types/interfaces';

export const usuarioService = {
  salvar: (usuario: Omit<Usuario, 'id'>) =>
    api.post<Usuario>('/usuarios', usuario),

  listarTodos: () => api.get<Usuario[]>('/usuarios'),

  buscarPorId: (id: number) => api.get<Usuario>(`/usuarios/${id}`),

  buscarPorNome: (nome: string) => api.get<Usuario[]>(`/usuarios/nome/${nome}`),

  atualizar: (id: number, usuario: Omit<Usuario, 'id'>) =>
    api.put<Usuario>(`/usuarios/${id}`, usuario),

  deletar: (id: number) => api.delete(`/usuarios/${id}`),
};
