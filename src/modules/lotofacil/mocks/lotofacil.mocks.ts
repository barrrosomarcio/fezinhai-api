import {
  SaveResultsDto,
  LotofacilPremiacaoDto,
  LotofacilResultDto,
} from '../dto/save-results.dto';
import { LotofacilResultsEntity } from '../domain/lotofacil-results.entity';

const mockPremiacao: LotofacilPremiacaoDto = {
  quinze: { vencedores: 1, premio: 1000000 },
  quatorze: { vencedores: 50, premio: 1000 },
  treze: { vencedores: 100, premio: 500 },
  doze: { vencedores: 1000, premio: 100 },
  onze: { vencedores: 10000, premio: 50 },
};

const mockLotofacilResult: LotofacilResultDto = {
  concurso: 1,
  data: new Date('2024-01-01'),
  dezenas: [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
  ],
  premiacoes: mockPremiacao,
  acumulou: false,
  acumuladaProxConcurso: 0,
  dataProxConcurso: '2024-01-03',
  proxConcurso: 2,
  timeCoracao: 'Time do Coração',
  mesSorte: 'Janeiro',
};

export const mockResultDto: SaveResultsDto = {
  results: [mockLotofacilResult],
};

export const mockSavedEntity: LotofacilResultsEntity =
  LotofacilResultsEntity.create({
    concurso: mockLotofacilResult.concurso,
    data: mockLotofacilResult.data,
    dezenas: mockLotofacilResult.dezenas,
    premiacoes: mockLotofacilResult.premiacoes,
    acumulou: mockLotofacilResult.acumulou,
    acumuladaProxConcurso: mockLotofacilResult.acumuladaProxConcurso,
    dataProxConcurso: mockLotofacilResult.dataProxConcurso,
    proxConcurso: mockLotofacilResult.proxConcurso,
    timeCoracao: mockLotofacilResult.timeCoracao,
    mesSorte: mockLotofacilResult.mesSorte,
  });
