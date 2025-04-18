import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class PremiacaoDto {
  @IsNumber()
  @IsNotEmpty()
  vencedores: number;

  @IsNumber()
  @IsNotEmpty()
  premio: number;
}

export class LotofacilPremiacaoDto {
  @ValidateNested()
  @Type(() => PremiacaoDto)
  quinze: PremiacaoDto;

  @ValidateNested()
  @Type(() => PremiacaoDto)
  quatorze: PremiacaoDto;

  @ValidateNested()
  @Type(() => PremiacaoDto)
  treze: PremiacaoDto;

  @ValidateNested()
  @Type(() => PremiacaoDto)
  doze: PremiacaoDto;

  @ValidateNested()
  @Type(() => PremiacaoDto)
  onze: PremiacaoDto;
}

export class LotofacilResultDto {
  @IsNumber()
  @IsNotEmpty()
  concurso: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  data: Date;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  dezenas: string[];

  @ValidateNested()
  @Type(() => LotofacilPremiacaoDto)
  premiacoes: LotofacilPremiacaoDto;

  @IsBoolean()
  @IsNotEmpty()
  acumulou: boolean;

  @IsNumber()
  @IsNotEmpty()
  acumuladaProxConcurso: number;

  @IsString()
  @IsNotEmpty()
  dataProxConcurso: string;

  @IsNumber()
  @IsNotEmpty()
  proxConcurso: number;

  @IsString()
  @IsNotEmpty()
  timeCoracao: string;

  @IsString()
  @IsNotEmpty()
  mesSorte: string;
}

export class SaveResultsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LotofacilResultDto)
  results: LotofacilResultDto[];
} 