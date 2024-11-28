export enum Sexo {
    MASCULINO = 'MASCULINO',
    FEMININO = 'FEMININO'
  }
  
  export enum Periodicidade {
    DIAS = 'DIAS',
    SEMANAS = 'SEMANAS',
    MESES = 'MESES',
    ANOS = 'ANOS'
  }
  
  export enum SituacaoAgenda {
    AGENDADO = 'AGENDADO',
    CANCELADO = 'CANCELADO',
    REALIZADO = 'REALIZADO'
  }
  
  // Define UFs as a regular array for easier iteration
  export const UFs = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ] as const
  
  export type UF = (typeof UFs)[number]
  
  