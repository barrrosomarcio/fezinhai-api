import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { LotofacilService } from './lotofacil.service';
import { SaveResultsDto } from './dto/save-results.dto';
import { LotofacilResultsEntity } from './domain/lotofacil-results.entity';

@ApiTags('Lotofacil')
@Controller('lotofacil')
export class LotofacilController {
  constructor(private readonly service: LotofacilService) {}

  @Post('save-results')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save lotofacil results' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Results saved successfully',
    type: LotofacilResultsEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  saveResults(@Body() dto: SaveResultsDto): Observable<LotofacilResultsEntity> {
    return this.service.saveResults(dto);
  }
} 