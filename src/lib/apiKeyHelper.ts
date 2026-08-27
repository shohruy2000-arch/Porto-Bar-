/**
 * @file src/lib/apiKeyHelper.ts
 * @description Utilities for generating, hashing, and validating Tenant API Keys.
 */

import crypto from 'crypto';
import { prisma } from './prisma';

/**
 * Generate a new secure API key with 'gm_live_' prefix
 */
export function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(24).toString('hex');
  return `gm_live_${randomBytes}`;
}

export interface ApiKeyVerificationResult {
  valid: boolean;
  error?: string;
  tenant?: any;
  apiKey?: any;
  permissions?: string[];
}

/**
 * Verify an API key against the database
 */
export async function verifyApiKey(key: string, requiredPermission?: string): Promise<ApiKeyVerificationResult> {
  if (!key || typeof key !== 'string' || !key.startsWith('gm_live_')) {
    return { valid: false, error: 'Некорректный формат API-ключа' };
  }

  try {
    const keyRecord = await prisma.tenantApiKey.findUnique({
      where: { key },
      include: {
        tenant: {
          include: {
            theme: true,
            config: true
          }
        }
      }
    });

    if (!keyRecord) {
      return { valid: false, error: 'API-ключ не найден' };
    }

    if (!keyRecord.isActive) {
      return { valid: false, error: 'API-ключ деактивирован' };
    }

    if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
      return { valid: false, error: 'Срок действия API-ключа истек' };
    }

    if (keyRecord.tenant.status === 'SUSPENDED') {
      return { valid: false, error: 'Аккаунт ресторана временно заблокирован' };
    }

    // Check required permission if provided
    if (requiredPermission && keyRecord.permissions && keyRecord.permissions.length > 0) {
      if (!keyRecord.permissions.includes(requiredPermission) && !keyRecord.permissions.includes('*')) {
        return { valid: false, error: `Недостаточно прав. Требуется: ${requiredPermission}` };
      }
    }

    // Update lastUsedAt asynchronously (non-blocking)
    prisma.tenantApiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsedAt: new Date() }
    }).catch(err => console.error('Failed to update lastUsedAt for API key:', err));

    return {
      valid: true,
      tenant: keyRecord.tenant,
      apiKey: keyRecord,
      permissions: keyRecord.permissions
    };
  } catch (err: any) {
    console.error('[verifyApiKey] Database Error:', err);
    return { valid: false, error: 'Ошибка проверки API-ключа' };
  }
}
