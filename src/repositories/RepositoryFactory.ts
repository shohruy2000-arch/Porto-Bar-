/**
 * @file src/repositories/RepositoryFactory.ts
 * @description Singleton factory providing data repository instances based on DATA_SOURCE environment variable.
 */

import { ITenantRepository, IMenuRepository, IOrderRepository } from './interfaces';
import { JsonTenantRepository } from './json/JsonTenantRepository';
import { JsonMenuRepository } from './json/JsonMenuRepository';
import { JsonOrderRepository } from './json/JsonOrderRepository';
import { PrismaTenantRepository } from './prisma/PrismaTenantRepository';
import { PrismaMenuRepository } from './prisma/PrismaMenuRepository';
import { PrismaOrderRepository } from './prisma/PrismaOrderRepository';

export type DataSourceType = 'json' | 'prisma';

export class RepositoryFactory {
  private static tenantRepoInstance: ITenantRepository | null = null;
  private static menuRepoInstance: IMenuRepository | null = null;
  private static orderRepoInstance: IOrderRepository | null = null;

  /**
   * Determine the configured data source. Defaults to 'json'.
   */
  public static getDataSource(): DataSourceType {
    const source = (process.env.DATA_SOURCE || 'json').toLowerCase();
    return source === 'prisma' ? 'prisma' : 'json';
  }

  /**
   * Get the singleton instance of ITenantRepository
   */
  public static getTenantRepository(): ITenantRepository {
    if (!this.tenantRepoInstance) {
      const source = this.getDataSource();
      if (source === 'prisma') {
        this.tenantRepoInstance = new PrismaTenantRepository();
      } else {
        this.tenantRepoInstance = new JsonTenantRepository();
      }
    }
    return this.tenantRepoInstance;
  }

  /**
   * Get the singleton instance of IMenuRepository
   */
  public static getMenuRepository(): IMenuRepository {
    if (!this.menuRepoInstance) {
      const source = this.getDataSource();
      if (source === 'prisma') {
        this.menuRepoInstance = new PrismaMenuRepository();
      } else {
        this.menuRepoInstance = new JsonMenuRepository();
      }
    }
    return this.menuRepoInstance;
  }

  /**
   * Get the singleton instance of IOrderRepository
   */
  public static getOrderRepository(): IOrderRepository {
    if (!this.orderRepoInstance) {
      const source = this.getDataSource();
      if (source === 'prisma') {
        this.orderRepoInstance = new PrismaOrderRepository();
      } else {
        this.orderRepoInstance = new JsonOrderRepository();
      }
    }
    return this.orderRepoInstance;
  }
}
