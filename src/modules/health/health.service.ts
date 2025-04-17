import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HealthMetricsDto } from './dto/health-metrics.dto';

@Injectable()
export class HealthService {
  constructor(private readonly configService: ConfigService) {}

  getMetrics(): Observable<HealthMetricsDto> {
    return of({}).pipe(
      map(() => {
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        const uptime = process.uptime();
        const activeConnections = process.listenerCount('connection');
        const version = this.configService.get<string>('APP_VERSION', '1.0.0');
        const environment = this.configService.get<string>(
          'NODE_ENV',
          'development',
        );

        return {
          memory: {
            heapUsed: memoryUsage.heapUsed,
            heapTotal: memoryUsage.heapTotal,
            external: memoryUsage.external,
            rss: memoryUsage.rss,
          },
          cpuUsage: {
            user: cpuUsage.user,
            system: cpuUsage.system,
          },
          uptime,
          activeConnections,
          version,
          environment,
          timestamp: new Date(),
        };
      }),
    );
  }
}
