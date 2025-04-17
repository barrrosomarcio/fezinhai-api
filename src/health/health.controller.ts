import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get('metrics')
  @ApiOperation({ summary: 'Get health metrics' })
  @ApiResponse({
    status: 200,
    description: 'Returns health metrics of the application',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: 12345,
        memory: {
          heapUsed: 1234567,
          heapTotal: 2345678,
          external: 3456789,
        },
      },
    },
  })
  getMetrics() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external,
      },
    };
  }
}
