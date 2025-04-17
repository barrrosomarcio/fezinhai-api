import { ApiProperty } from '@nestjs/swagger';

export class MemoryDto {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
}

export class CpuUsageDto {
  user: number;
  system: number;
}

export class HealthMetricsDto {
  @ApiProperty({ description: 'Memory usage in bytes' })
  memory: MemoryDto;

  @ApiProperty({ description: 'CPU usage percentage' })
  cpuUsage: CpuUsageDto;

  @ApiProperty({ description: 'Application uptime in milliseconds' })
  uptime: number;

  @ApiProperty({ description: 'Number of active connections' })
  activeConnections: number;

  @ApiProperty({ description: 'Application version' })
  version: string;

  @ApiProperty({ description: 'Application environment' })
  environment: string;

  @ApiProperty({ description: 'Timestamp of the metrics' })
  timestamp: Date;
}
