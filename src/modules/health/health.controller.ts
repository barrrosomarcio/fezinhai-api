import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthMetricsDto } from './dto/health-metrics.dto';
import { Observable } from 'rxjs';  

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get application health metrics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the current health metrics of the application',
    type: HealthMetricsDto
  })
  getMetrics(): Observable<HealthMetricsDto> {
    return this.healthService.getMetrics();
  }
} 