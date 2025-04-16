import { ApiProperty } from '@nestjs/swagger';

export class HealthMetricsDto {
  @ApiProperty({ description: 'Application uptime in milliseconds' })
  uptime: number;

  @ApiProperty({ description: 'Memory usage in bytes' })
  memoryUsage: number;

  @ApiProperty({ description: 'CPU usage percentage' })
  cpuUsage: number;

  @ApiProperty({ description: 'Number of active connections' })
  activeConnections: number;

  @ApiProperty({ description: 'Database connection status' })
  databaseStatus: 'connected' | 'disconnected';

  @ApiProperty({ description: 'Application version' })
  version: string;

  @ApiProperty({ description: 'Application environment' })
  environment: string;

  @ApiProperty({ description: 'Timestamp of the metrics' })
  timestamp: Date;
} 