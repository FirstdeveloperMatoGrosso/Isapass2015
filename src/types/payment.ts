export type PaymentStatus = 'pending' | 'paid' | 'cancelled' | 'expired';

export interface PixPayment {
  id: string;           // ID único do pagamento (ISA + timestamp + random)
  partnerId: string;    // ID da parceria/evento
  ticketId: string;     // ID do ingresso (gerado após pagamento)
  value: number;        // Valor do pagamento
  status: PaymentStatus;// Status do pagamento
  pixKey: string;       // Chave PIX do beneficiário
  txid: string;         // ID da transação PIX
  createdAt: Date;      // Data de criação
  paidAt?: Date;        // Data do pagamento (se pago)
  cancelledAt?: Date;   // Data do cancelamento (se cancelado)
  expiresAt: Date;      // Data de expiração (30 min após criação)
  customerEmail: string;// Email do cliente
  customerName: string; // Nome do cliente
  customerPhone: string;// Telefone do cliente
}

export interface PixConfig {
  enabled: boolean;
  key: string;          // Chave PIX
  merchantName: string; // Nome do beneficiário
  merchantCity: string; // Cidade do beneficiário
  partnerId: string;    // ID da parceria atual
  expirationMinutes: number; // Minutos até expirar o pagamento
}

export interface PaymentWebhook {
  txid: string;         // ID da transação PIX
  status: PaymentStatus;// Novo status
  paidAt?: string;      // Data do pagamento (se status=paid)
  value: number;        // Valor pago
}
