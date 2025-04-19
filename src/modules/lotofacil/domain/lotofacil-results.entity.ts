import { BaseEntity } from '../../../infra/database/interfaces/base-entity.interface';
import { v4 as uuidv4 } from 'uuid';

export interface LotofacilPremiacao {
  quinze: {
    vencedores: number;
    premio: number;
  };
  quatorze: {
    vencedores: number;
    premio: number;
  };
  treze: {
    vencedores: number;
    premio: number;
  };
  doze: {
    vencedores: number;
    premio: number;
  };
  onze: {
    vencedores: number;
    premio: number;
  };
}

export class LotofacilResultsEntity implements BaseEntity {
  readonly id: string;
  readonly concurso: number;
  readonly data: Date;
  readonly dezenas: string[];
  readonly premiacoes: LotofacilPremiacao;
  readonly acumulou: boolean;
  readonly acumuladaProxConcurso: number;
  readonly dataProxConcurso: string;
  readonly proxConcurso: number;
  readonly timeCoracao: string;
  readonly mesSorte: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  private constructor(props: {
    id: string;
    concurso: number;
    data: Date;
    dezenas: string[];
    premiacoes: LotofacilPremiacao;
    acumulou: boolean;
    acumuladaProxConcurso: number;
    dataProxConcurso: string;
    proxConcurso: number;
    timeCoracao: string;
    mesSorte: string;
    createdAt: string;
    updatedAt: string;
  }) {
    this.id = props.id;
    this.concurso = props.concurso;
    this.data = props.data;
    this.dezenas = props.dezenas;
    this.premiacoes = props.premiacoes;
    this.acumulou = props.acumulou;
    this.acumuladaProxConcurso = props.acumuladaProxConcurso;
    this.dataProxConcurso = props.dataProxConcurso;
    this.proxConcurso = props.proxConcurso;
    this.timeCoracao = props.timeCoracao;
    this.mesSorte = props.mesSorte;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<LotofacilResultsEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): LotofacilResultsEntity {
    return new LotofacilResultsEntity({
      ...props,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}
