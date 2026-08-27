/**
 * @file src/lib/yookassa.ts
 * @description YooKassa (ЮKassa) Payment Gateway integration with 3% Platform Split Fee support.
 */

export interface YooKassaPaymentRequest {
  orderId: string;
  tenantId: string;
  totalAmount: number;
  description: string;
  returnUrl: string;
  customerPhone?: string;
  customerEmail?: string;
  platformFeeRate?: number; // default 0.03
}

export interface YooKassaPaymentResponse {
  id: string;
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
  paid: boolean;
  amount: {
    value: string;
    currency: string;
  };
  confirmation?: {
    type: 'redirect';
    confirmation_url: string;
  };
  created_at: string;
  description?: string;
}

export class YooKassaService {
  private static readonly API_URL = 'https://api.yookassa.ru/v3/payments';

  /**
   * Create a new payment session with automatic 3% platform commission tracking
   * @param params - Payment parameters
   * @param shopId - YooKassa Shop ID
   * @param apiKey - YooKassa Secret API Key
   */
  public static async createPayment(
    params: YooKassaPaymentRequest,
    shopId?: string,
    apiKey?: string
  ): Promise<{ success: boolean; confirmationUrl?: string; paymentId?: string; error?: string }> {
    const finalShopId = shopId || process.env.YOOKASSA_SHOP_ID;
    const finalApiKey = apiKey || process.env.YOOKASSA_API_KEY;

    // Simulation / Sandbox fallback if credentials are not configured yet
    if (!finalShopId || !finalApiKey) {
      console.log(`[YooKassa Demo Mode] Simulating payment creation for order ${params.orderId} (${params.totalAmount} ₽)`);
      const mockPaymentId = `yoo_${Date.now()}_mock`;
      return {
        success: true,
        paymentId: mockPaymentId,
        confirmationUrl: `${params.returnUrl}?payment=mock_success&orderId=${params.orderId}&paymentId=${mockPaymentId}`
      };
    }

    try {
      const authHeader = 'Basic ' + Buffer.from(`${finalShopId}:${finalApiKey}`).toString('base64');
      const idempotenceKey = `order_${params.orderId}_${Date.now()}`;

      const platformFeeRate = params.platformFeeRate || 0.03;
      const platformFeeAmount = Math.round(params.totalAmount * platformFeeRate * 100) / 100;
      const restaurantEarnings = Math.round((params.totalAmount - platformFeeAmount) * 100) / 100;

      const payload = {
        amount: {
          value: params.totalAmount.toFixed(2),
          currency: 'RUB'
        },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: params.returnUrl
        },
        description: params.description || `Оплата заказа #${params.orderId}`,
        metadata: {
          orderId: params.orderId,
          tenantId: params.tenantId,
          platformFeeRate: platformFeeRate.toString(),
          platformFeeAmount: platformFeeAmount.toString(),
          restaurantEarnings: restaurantEarnings.toString()
        }
      };

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': idempotenceKey,
          'Authorization': authHeader
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errJson = await response.json();
        console.error('[YooKassa Error]:', errJson);
        return { success: false, error: errJson.description || 'Ошибка создания платежа в ЮKassa' };
      }

      const paymentData: YooKassaPaymentResponse = await response.json();
      return {
        success: true,
        paymentId: paymentData.id,
        confirmationUrl: paymentData.confirmation?.confirmation_url
      };
    } catch (err: any) {
      console.error('[YooKassa Exception]:', err);
      return { success: false, error: err.message || 'Сетевая ошибка при связи с ЮKassa' };
    }
  }
}
