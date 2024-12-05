export enum Situacao {
  AGENDADO = 'AGENDADO',
  REALIZADO = 'REALIZADO',
  CANCELADO = 'CANCELADO',
}

export enum Sexo {
  M = 'M',
  F = 'F',
}

export const UFs = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const;

export type UF = (typeof UFs)[number];

export enum Periodicidade {
  DIAS = 1,
  SEMANAS = 2,
  MESES = 3,
  ANOS = 4,
}
