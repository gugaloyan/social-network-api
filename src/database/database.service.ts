import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool: Pool;
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    try {
      return await this.pool.query<T>(text, params);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Query failed: ${error.message}`);
      } else {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        this.logger.error(`Unknown query error: ${error}`);
      }
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    try {
      return await this.pool.connect();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to get DB client:', error.message);
      } else {
        this.logger.error('Unknown error when getting DB client:', error);
      }
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.pool.end();
      this.logger.log('Database pool has been closed.');
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Error closing DB pool:', error.message);
      } else {
        this.logger.error('Unknown error during DB pool shutdown:', error);
      }
    }
  }
}
