import { PixQrCode } from 'pix-utils';
import { PixConfig, PixPayment, PaymentStatus, PaymentWebhook } from '../types/payment';

export class PaymentService {
  private static instance: PaymentService;
  private payments: Map<string, PixPayment>;
  private config: PixConfig;

  private constructor() {
    this.payments = new Map();
    this.config = {
      enabled: false,
      key: '',
      merchantName: '',
      merchantCity: '',
      partnerId: '',
      expirationMinutes: 30
    };
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  public setConfig(config: PixConfig) {
    this.config = config;
  }

  public async createPayment(params: {
    value: number;
    customerEmail: string;
    customerName: string;
    customerPhone: string;
  }): Promise<PixPayment> {
    if (!this.config.enabled || !this.config.key) {
      throw new Error('PIX não está configurado');
    }

    const now = new Date();
    const payment: PixPayment = {
      id: `ISA${Date.now()}${Math.random().toString(36).substring(2, 7)}`,
      partnerId: this.config.partnerId,
      ticketId: '', // Será gerado após o pagamento
      value: params.value,
      status: 'pending',
      pixKey: this.config.key,
      txid: `${this.config.partnerId}${Date.now()}`,
      createdAt: now,
      expiresAt: new Date(now.getTime() + this.config.expirationMinutes * 60000),
      customerEmail: params.customerEmail,
      customerName: params.customerName,
      customerPhone: params.customerPhone
    };

    this.payments.set(payment.id, payment);
    return payment;
  }

  public generatePixQrCode(payment: PixPayment): string {
    const pix = new PixQrCode({
      version: '01',
      key: payment.pixKey,
      name: this.config.merchantName,
      city: this.config.merchantCity,
      transactionId: payment.txid,
      message: `Ingresso - ${payment.customerName}`,
      value: payment.value,
    });

    return pix.getBRCode();
  }

  public async handleWebhook(webhook: PaymentWebhook): Promise<PixPayment | null> {
    // Encontrar o pagamento pelo txid
    const payment = Array.from(this.payments.values()).find(p => p.txid === webhook.txid);
    if (!payment) return null;

    // Atualizar status
    payment.status = webhook.status;
    
    if (webhook.status === 'paid') {
      payment.paidAt = webhook.paidAt ? new Date(webhook.paidAt) : new Date();
      // Gerar ID do ingresso após confirmação do pagamento
      payment.ticketId = `TK${Date.now()}${Math.random().toString(36).substring(2, 7)}`;
    } else if (webhook.status === 'cancelled') {
      payment.cancelledAt = new Date();
    }

    this.payments.set(payment.id, payment);
    return payment;
  }

  public getPayment(id: string): PixPayment | undefined {
    return this.payments.get(id);
  }

  public getPaymentByTxid(txid: string): PixPayment | undefined {
    return Array.from(this.payments.values()).find(p => p.txid === txid);
  }

  public listPayments(partnerId: string): PixPayment[] {
    return Array.from(this.payments.values())
      .filter(p => p.partnerId === partnerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Limpar pagamentos expirados periodicamente
  public cleanExpiredPayments() {
    const now = new Date();
    for (const [id, payment] of this.payments.entries()) {
      if (payment.status === 'pending' && payment.expiresAt < now) {
        payment.status = 'expired';
        this.payments.set(id, payment);
      }
    }
  }
}
