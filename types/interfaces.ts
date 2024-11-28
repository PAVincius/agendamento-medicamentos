import type { Periodicidade, SituacaoAgenda, Sexo, UF } from './enums';

export interface Vacina {
  id: string;
  doses: number;
  periodicidade: Periodicidade;
  intervalo: number;
}

export interface Agenda {
  id: string;
  vacinaId: string;
  usuarioId: string;
  data: Date;
  situacao: SituacaoAgenda;
  dataSituacao: Date | null;
}

export interface Usuario {
  id: string;
  nome: string;
  sexo: Sexo;
  uf: UF;
  alergias: string[];
}

export interface Alergia {
  id: string;
  nome: string;
  descricao: string;
}
