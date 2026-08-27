import crypto from 'crypto';
import { ITenantRepository } from '../interfaces';
import { Tenant, TenantTheme, ThemePreset } from '../../types';
import { prisma } from '../../lib/prisma';

function hashPassword(pass: string): string {
  return crypto.createHash('sha256').update(pass).digest('hex');
}

export class PrismaTenantRepository implements ITenantRepository {
  private mapToTenant(dbTenant: any): Tenant {
    const theme: TenantTheme = dbTenant.theme
      ? {
          preset: (dbTenant.theme.preset || 'luxury-dark') as ThemePreset,
          primaryColor: dbTenant.theme.primaryColor || '#d4af37',
          accentColor: dbTenant.theme.accentColor || '#f59e0b',
          bgColor: dbTenant.theme.bgColor || '#060a12',
          bgCardColor: dbTenant.theme.bgCardColor || '#0d131f',
          textColor: dbTenant.theme.textColor || '#f3f4f6',
          logoUrl: dbTenant.theme.logoUrl || '/images/porto-logo.jpg?v=2',
          faviconUrl: dbTenant.theme.faviconUrl || undefined,
          fontFamily: dbTenant.theme.fontFamily || 'Inter'
        }
      : {
          preset: 'luxury-dark',
          primaryColor: '#d4af37',
          accentColor: '#f59e0b',
          bgColor: '#060a12',
          bgCardColor: '#0d131f',
          textColor: '#f3f4f6',
          logoUrl: '/images/porto-logo.jpg?v=2'
        };

    const domains = dbTenant.domains ? dbTenant.domains.map((d: any) => d.domain) : [];

    return {
      id: dbTenant.id,
      slug: dbTenant.slug,
      name: dbTenant.name,
      legalName: dbTenant.legalName || undefined,
      inn: dbTenant.inn || undefined,
      domains: domains.length > 0 ? domains : [dbTenant.slug],
      theme,
      status: (dbTenant.status?.toLowerCase() || 'trial') as 'active' | 'trial' | 'suspended',
      plan: 'business',
      monthlyPrice: dbTenant.monthlyPrice ? Number(dbTenant.monthlyPrice) : 6900,
      adminPassword: dbTenant.adminPassword,
      createdAt: dbTenant.createdAt ? new Date(dbTenant.createdAt).toISOString() : new Date().toISOString()
    };
  }

  public async getById(id: string): Promise<Tenant | null> {
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { id },
        include: {
          theme: true,
          config: true,
          domains: true
        }
      });
      if (!tenant) return null;
      return this.mapToTenant(tenant);
    } catch (err) {
      console.error('[PrismaTenantRepository] getById error:', err);
      return null;
    }
  }

  public async getBySlug(slug: string): Promise<Tenant | null> {
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { slug: slug.toLowerCase().trim() },
        include: {
          theme: true,
          config: true,
          domains: true
        }
      });
      if (!tenant) return null;
      return this.mapToTenant(tenant);
    } catch (err) {
      console.error('[PrismaTenantRepository] getBySlug error:', err);
      return null;
    }
  }

  public async getByDomain(domain: string): Promise<Tenant | null> {
    try {
      const cleanDomain = domain.toLowerCase().split(':')[0].trim();

      // Search by Domain relation
      const domainRecord = await prisma.domain.findUnique({
        where: { domain: cleanDomain },
        include: {
          tenant: {
            include: {
              theme: true,
              config: true,
              domains: true
            }
          }
        }
      });

      if (domainRecord?.tenant) {
        return this.mapToTenant(domainRecord.tenant);
      }

      // Fallback search by slug
      return await this.getBySlug(cleanDomain);
    } catch (err) {
      console.error('[PrismaTenantRepository] getByDomain error:', err);
      return null;
    }
  }

  public async getAll(): Promise<Tenant[]> {
    try {
      const tenants = await prisma.tenant.findMany({
        include: {
          theme: true,
          config: true,
          domains: true
        },
        orderBy: { createdAt: 'desc' }
      });
      return tenants.map((t: any) => this.mapToTenant(t));
    } catch (err) {
      console.error('[PrismaTenantRepository] getAll error:', err);
      return [];
    }
  }

  public async create(data: Omit<Tenant, 'createdAt'>): Promise<Tenant> {
    const hashedPassword = hashPassword(data.adminPassword || 'admin123');

    const created = await prisma.tenant.create({
      data: {
        id: data.id,
        slug: data.slug.toLowerCase().trim(),
        name: data.name,
        legalName: data.legalName || null,
        inn: data.inn || null,
        status: (data.status?.toUpperCase() || 'TRIAL') as any,
        monthlyPrice: data.monthlyPrice || 6900,
        adminPassword: hashedPassword,
        domains: {
          create: (data.domains || [data.slug]).map(d => ({ domain: d.toLowerCase().trim() }))
        },
        theme: {
          create: {
            preset: data.theme?.preset || 'luxury-dark',
            primaryColor: data.theme?.primaryColor || '#d4af37',
            accentColor: data.theme?.accentColor || '#f59e0b',
            bgColor: data.theme?.bgColor || '#060a12',
            bgCardColor: data.theme?.bgCardColor || '#0d131f',
            textColor: data.theme?.textColor || '#f3f4f6',
            logoUrl: data.theme?.logoUrl || '/images/porto-logo.jpg?v=2',
            faviconUrl: data.theme?.faviconUrl || null,
            fontFamily: data.theme?.fontFamily || 'Inter'
          }
        },
        config: {
          create: {
            workHoursStart: '10:00',
            workHoursEnd: '23:00'
          }
        }
      },
      include: {
        theme: true,
        config: true,
        domains: true
      }
    });

    // Seed starter categories and dishes into PostgreSQL for the new tenant
    try {
      const { INITIAL_CATEGORIES, INITIAL_DISHES } = require('../../data/initialMenu');
      const catMap = new Map<string, string>();
      let sort = 0;
      for (const cat of INITIAL_CATEGORIES) {
        sort += 10;
        const createdCat = await prisma.category.create({
          data: {
            tenantId: created.id,
            nameRu: cat.name.ru,
            nameEn: cat.name.en || null,
            nameZh: cat.name.zh || null,
            sortOrder: sort
          }
        });
        catMap.set(cat.id, createdCat.id);
      }

      for (const dish of INITIAL_DISHES) {
        const catId = catMap.get(dish.category) || Array.from(catMap.values())[0];
        if (!catId) continue;
        await prisma.dish.create({
          data: {
            tenantId: created.id,
            categoryId: catId,
            nameRu: dish.name.ru,
            nameEn: dish.name.en || null,
            nameZh: dish.name.zh || null,
            descriptionRu: dish.description?.ru || null,
            descriptionEn: dish.description?.en || null,
            descriptionZh: dish.description?.zh || null,
            price: dish.price || 0,
            weight: dish.weight || null,
            image: dish.image || null,
            visible: dish.visible ?? true,
            outOfStock: dish.outOfStock ?? false,
            quantityLimit: dish.quantityLimit !== undefined ? dish.quantityLimit : null,
            calories: dish.kbju?.calories || null,
            proteins: dish.kbju?.proteins || null,
            fats: dish.kbju?.fats || null,
            carbs: dish.kbju?.carbs || null,
            labels: dish.labels || []
          }
        });
      }
    } catch (seedErr) {
      console.error('[PrismaTenantRepository] Error seeding starter menu for tenant:', seedErr);
    }

    return this.mapToTenant(created);
  }

  public async update(id: string, data: Partial<Tenant>): Promise<Tenant | null> {
    try {
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.slug) updateData.slug = data.slug.toLowerCase().trim();
      if (data.legalName !== undefined) updateData.legalName = data.legalName;
      if (data.inn !== undefined) updateData.inn = data.inn;
      if (data.status) updateData.status = data.status.toUpperCase();
      if (data.monthlyPrice !== undefined) updateData.monthlyPrice = data.monthlyPrice;

      // Hash password if updating
      if (data.adminPassword) {
        updateData.adminPassword = hashPassword(data.adminPassword);
      }

      // Update theme if passed
      if (data.theme) {
        updateData.theme = {
          upsert: {
            create: {
              preset: data.theme.preset || 'luxury-dark',
              primaryColor: data.theme.primaryColor || '#d4af37',
              accentColor: data.theme.accentColor || '#f59e0b',
              bgColor: data.theme.bgColor || '#060a12',
              bgCardColor: data.theme.bgCardColor || '#0d131f',
              textColor: data.theme.textColor || '#f3f4f6',
              logoUrl: data.theme.logoUrl || null,
              faviconUrl: data.theme.faviconUrl || null,
              fontFamily: data.theme.fontFamily || 'Inter'
            },
            update: {
              preset: data.theme.preset,
              primaryColor: data.theme.primaryColor,
              accentColor: data.theme.accentColor,
              bgColor: data.theme.bgColor,
              bgCardColor: data.theme.bgCardColor,
              textColor: data.theme.textColor,
              logoUrl: data.theme.logoUrl,
              faviconUrl: data.theme.faviconUrl,
              fontFamily: data.theme.fontFamily
            }
          }
        };
      }

      const updated = await prisma.tenant.update({
        where: { id },
        data: updateData,
        include: {
          theme: true,
          config: true,
          domains: true
        }
      });

      return this.mapToTenant(updated);
    } catch (err) {
      console.error('[PrismaTenantRepository] update error:', err);
      return null;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      if (id === 'porto-bar') return false; // Protected
      await prisma.tenant.delete({
        where: { id }
      });
      return true;
    } catch (err) {
      console.error('[PrismaTenantRepository] delete error:', err);
      return false;
    }
  }
}
