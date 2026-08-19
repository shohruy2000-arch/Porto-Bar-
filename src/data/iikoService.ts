/**
 * iikoService.ts
 * Server-side service for iikoCloud API integration.
 * Handles token caching, order creation, and guest/loyalty sync.
 *
 * Base URL: https://api-ru.iiko.services
 * All requests are POST with JSON bodies (even list queries).
 * Token lifetime: 15 minutes — auto-refreshed if older than 13 minutes.
 */

import { getTelegramConfigServer } from './telegramService';
import { IikoConfig, Order, LoyaltyMember } from '../types';

const IIKO_BASE_URL = 'https://api-ru.iiko.services';

// ─────────────────────────────────────────────
// Token Cache (in-memory, persists across HMR)
// ─────────────────────────────────────────────
const globalAny: any = global;
globalAny.iikoTokenCache = globalAny.iikoTokenCache || { token: null, expiresAt: 0 };
const tokenCache = globalAny.iikoTokenCache as { token: string | null; expiresAt: number };

// Nomenclature cache (menu items from iiko)
globalAny.iikoNomenclatureCache = globalAny.iikoNomenclatureCache || {
  items: null as any[] | null,
  revision: 0,
  fetchedAt: 0
};
const nomCache = globalAny.iikoNomenclatureCache as {
  items: any[] | null;
  revision: number;
  fetchedAt: number;
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getIikoConfig(): IikoConfig | null {
  try {
    const config = getTelegramConfigServer() as any;
    const iiko = config?.iiko as IikoConfig | undefined;
    if (!iiko?.enabled || !iiko?.apiLogin) return null;
    return iiko;
  } catch {
    return null;
  }
}

async function iikoPOST(endpoint: string, body: object, token: string): Promise<any> {
  const res = await fetch(`${IIKO_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`iiko ${endpoint} failed [${res.status}]: ${text}`);
  }

  return res.json();
}

// ─────────────────────────────────────────────
// Token Management
// ─────────────────────────────────────────────

export async function getIikoToken(forceRefresh = false): Promise<string> {
  const now = Date.now();
  // Refresh if token is missing, forced, or older than 13 minutes
  if (!forceRefresh && tokenCache.token && now < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const config = getIikoConfig();
  if (!config) throw new Error('iiko not configured or disabled');

  const res = await fetch(`${IIKO_BASE_URL}/api/1/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiLogin: config.apiLogin })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`iiko auth failed [${res.status}]: ${text}`);
  }

  const data = await res.json();
  const token = data.token as string;

  tokenCache.token = token;
  tokenCache.expiresAt = now + 13 * 60 * 1000; // 13 min to be safe

  return token;
}

// ─────────────────────────────────────────────
// Organizations & Terminals
// ─────────────────────────────────────────────

export async function getIikoOrganizations(): Promise<any[]> {
  const token = await getIikoToken();
  const data = await iikoPOST('/api/1/organizations', {}, token);
  return data.organizations || [];
}

export async function getIikoTerminalGroups(organizationId: string): Promise<any[]> {
  const token = await getIikoToken();
  const data = await iikoPOST('/api/1/terminal_groups', { organizationIds: [organizationId] }, token);
  return data.terminalGroups || [];
}

// ─────────────────────────────────────────────
// Nomenclature (Menu)
// ─────────────────────────────────────────────

export async function getIikoNomenclature(organizationId: string, forceRefresh = false): Promise<any[]> {
  const now = Date.now();
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  if (!forceRefresh && nomCache.items && (now - nomCache.fetchedAt) < CACHE_TTL) {
    return nomCache.items;
  }

  const token = await getIikoToken();
  const body: any = { organizationId };
  if (nomCache.revision > 0) body.revision = nomCache.revision;

  const data = await iikoPOST('/api/1/nomenclature', body, token);

  const products = data.products || [];
  nomCache.items = products;
  nomCache.revision = data.revision || 0;
  nomCache.fetchedAt = now;

  return products;
}

/**
 * Find iiko product by name (fuzzy match).
 * Tries exact match first, then case-insensitive contains.
 */
function findIikoProduct(products: any[], dishName: string): any | null {
  const nameLC = dishName.toLowerCase();
  // 1. Exact match
  let found = products.find((p: any) => {
    const n = (p.name || '').toLowerCase();
    return n === nameLC;
  });
  if (found) return found;

  // 2. Contains match
  found = products.find((p: any) => {
    const n = (p.name || '').toLowerCase();
    return n.includes(nameLC) || nameLC.includes(n);
  });
  return found || null;
}

// ─────────────────────────────────────────────
// Table Mapping (tableNumber → iiko table UUID)
// ─────────────────────────────────────────────

async function getTableId(organizationId: string, tableNumber: string): Promise<string | null> {
  try {
    const token = await getIikoToken();
    const data = await iikoPOST('/api/1/reserve/available_restaurant_sections', {
      organizationId
    }, token);

    const sections = data.restaurantSections || [];
    for (const section of sections) {
      const tables = section.tables || [];
      const table = tables.find((t: any) => {
        const tNum = String(t.number || t.name || '');
        return tNum === String(tableNumber);
      });
      if (table) return table.id;
    }
    return null;
  } catch (err) {
    console.error('[iiko] Failed to get table ID:', err);
    return null;
  }
}

// ─────────────────────────────────────────────
// Order Creation
// ─────────────────────────────────────────────

/**
 * Send an order from our app to iiko terminal.
 * - Maps our dish IDs to iiko productIds by name
 * - Maps table number to iiko table UUID
 * - Returns the iiko order ID on success
 */
export async function createIikoOrder(
  order: Order,
  dishMap: Map<string, { name: string; price: number }>
): Promise<{ success: true; iikoOrderId: string } | { success: false; error: string }> {
  try {
    const config = getIikoConfig();
    if (!config) return { success: false, error: 'iiko disabled or not configured' };
    if (!config.organizationId || !config.terminalGroupId) {
      return { success: false, error: 'iiko organizationId or terminalGroupId not set' };
    }

    const token = await getIikoToken();

    // 1. Get iiko menu for product mapping
    const iikoProducts = await getIikoNomenclature(config.organizationId);

    // 2. Map order items → iiko productIds
    const iikoItems: any[] = [];
    const unmappedDishes: string[] = [];

    for (const item of order.items) {
      const dishInfo = dishMap.get(item.dishId);
      if (!dishInfo) continue;

      const iikoProduct = findIikoProduct(iikoProducts, dishInfo.name);
      if (!iikoProduct) {
        console.warn(`[iiko] No product match for dish: "${dishInfo.name}"`);
        unmappedDishes.push(dishInfo.name);
        continue;
      }

      iikoItems.push({
        productId: iikoProduct.id,
        amount: item.quantity,
        price: dishInfo.price,
        type: 'Product'
      });
    }

    if (iikoItems.length === 0) {
      return {
        success: false,
        error: `Не удалось сопоставить блюда с номенклатурой iiko: ${unmappedDishes.join(', ')}`
      };
    }

    // 3. Build order body
    const iikoOrderBody: any = {
      organizationId: config.organizationId,
      terminalGroupId: config.terminalGroupId,
      order: {
        items: iikoItems,
        comment: buildOrderComment(order),
        guests: { count: 1 }
      },
      createOrderSettings: {
        transportToFrontOffice: true
      }
    };

    // 4. Table mapping (for table orders)
    if (order.type === 'table' && order.tableNumber) {
      const tableId = await getTableId(config.organizationId, order.tableNumber);
      if (tableId) {
        iikoOrderBody.order.tableIds = [tableId];
      } else {
        console.warn(`[iiko] Could not find table UUID for table #${order.tableNumber}`);
        // Still send the order but add table number in comment
        iikoOrderBody.order.comment = `[Стол №${order.tableNumber}] ${iikoOrderBody.order.comment}`;
      }
    }

    // 5. Room number (for room service orders)
    if (order.type === 'room' && order.roomNumber) {
      iikoOrderBody.order.comment = `[Номер ${order.roomNumber}] ${iikoOrderBody.order.comment}`;
    }

    // 6. Send to iiko
    const result = await iikoPOST('/api/1/order/create', iikoOrderBody, token);

    const iikoOrderId = result?.orderInfo?.id || result?.id || result?.createdOrder?.id;
    if (!iikoOrderId) {
      console.warn('[iiko] Order created but no ID returned:', JSON.stringify(result));
      return { success: true, iikoOrderId: 'created' };
    }

    console.log(`[iiko] ✅ Order created in iiko: ${iikoOrderId}`);
    return { success: true, iikoOrderId };

  } catch (err: any) {
    console.error('[iiko] createIikoOrder error:', err?.message || err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

function buildOrderComment(order: Order): string {
  const parts: string[] = [];
  if (order.guestName) parts.push(`Гость: ${order.guestName}`);
  if (order.phone) parts.push(`Тел: ${order.phone}`);
  parts.push(`Заказ #${order.id} через Porto Menu`);
  return parts.join(' | ');
}

// ─────────────────────────────────────────────
// Guest / Loyalty Sync
// ─────────────────────────────────────────────

/**
 * Create or update a guest profile in iiko loyalty system.
 * Called when a new member registers in Porto Club.
 */
export async function syncGuestToIiko(
  member: LoyaltyMember
): Promise<{ success: true; iikoCustomerId: string } | { success: false; error: string }> {
  try {
    const config = getIikoConfig();
    if (!config) return { success: false, error: 'iiko disabled or not configured' };
    if (!config.organizationId) return { success: false, error: 'iiko organizationId not set' };

    const token = await getIikoToken();

    const customerPayload: any = {
      organizationId: config.organizationId,
      customer: {
        phone: member.phone,
        name: member.name,
        cardNumber: member.cardNumber
      }
    };

    if (member.email) customerPayload.customer.email = member.email;

    const result = await iikoPOST(
      '/api/1/loyalty/iiko/customer/create_or_update',
      customerPayload,
      token
    );

    const customerId = result?.id || result?.customer?.id;
    console.log(`[iiko] ✅ Guest synced to iiko: ${member.name} (${member.phone}), id: ${customerId}`);
    return { success: true, iikoCustomerId: customerId || 'synced' };

  } catch (err: any) {
    console.error('[iiko] syncGuestToIiko error:', err?.message || err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

/**
 * Get guest info from iiko by phone number.
 */
export async function getIikoCustomerByPhone(
  phone: string
): Promise<any | null> {
  try {
    const config = getIikoConfig();
    if (!config?.organizationId) return null;

    const token = await getIikoToken();
    const result = await iikoPOST('/api/1/loyalty/iiko/customer/info', {
      organizationId: config.organizationId,
      phone
    }, token);

    return result?.customer || result || null;
  } catch (err: any) {
    console.error('[iiko] getIikoCustomerByPhone error:', err?.message || err);
    return null;
  }
}

// ─────────────────────────────────────────────
// Connection Test
// ─────────────────────────────────────────────

/**
 * Test iiko connectivity and return organizations list.
 * Used by admin panel "Test Connection" button.
 */
export async function testIikoConnection(apiLogin: string): Promise<{
  success: boolean;
  organizations?: any[];
  error?: string;
}> {
  try {
    // Temporarily get a token with the provided apiLogin
    const res = await fetch(`${IIKO_BASE_URL}/api/1/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiLogin })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      return { success: false, error: `Auth failed [${res.status}]: ${text}` };
    }

    const tokenData = await res.json();
    const token = tokenData.token as string;

    const orgsRes = await fetch(`${IIKO_BASE_URL}/api/1/organizations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!orgsRes.ok) {
      return { success: false, error: `Failed to fetch organizations [${orgsRes.status}]` };
    }

    const orgsData = await orgsRes.json();
    return { success: true, organizations: orgsData.organizations || [] };

  } catch (err: any) {
    return { success: false, error: err?.message || 'Connection failed' };
  }
}
