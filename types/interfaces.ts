import type { Sexo, UF, Periodicidade } from './enums';

export enum Situacao {
  AGENDADO = 'AGENDADO',
  REALIZADO = 'REALIZADO',
  CANCELADO = 'CANCELADO',
}

export interface Agenda {
  id: number;
  data: Date;
  hora: string;
  situacao: Situacao;
  dataSituacao?: Date;
  observacoes?: string;
  usuario: Usuario;
  vacina: Vacina;
}

export interface Alergia {
  id: number;
  nome: string;
}

export interface Componente {
  id: number;
  nome: string;
}

export interface Reacao {
  id: number;
  descricao: string;
  dataReacao: Date;
  agenda: Agenda;
}

export interface Usuario {
  id: number;
  nome: string;
  dataNascimento: Date;
  sexo: Sexo;
  logradouro: string;
  setor: string;
  cidade: string;
  uf: UF;
  alergias: Alergia[];
}

export interface UsuarioAlergia {
  id: number;
  usuario: Usuario;
  alergia: Alergia;
}

export interface Vacina {
  id: number;
  titulo: string;
  descricao: string;
  doses: number;
  periodicidade?: Periodicidade;
  intervalo?: number;
  componentes: Componente[];
}
