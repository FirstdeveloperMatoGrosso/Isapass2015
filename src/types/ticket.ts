export interface Ticket {
  id: string;                 // ID único do ingresso
  orderId: string;           // ID do pedido no Pagar.me
  partnerId: string;         // ID da parceria/evento
  eventName: string;         // Nome do evento
  eventDate: string;         // Data do evento
  eventLocation: string;     // Local do evento
  ticketType: string;        // Tipo do ingresso (VIP, PISTA, CAMAROTE, etc)
  section?: string;          // Setor (se aplicável)
  row?: string;             // Fileira (se aplicável)
  seat?: string;            // Assento (se aplicável)
  price: number;            // Valor pago
  isHalfPrice: boolean;     // Se é meia-entrada
  customerName: string;      // Nome do cliente
  customerDocument: string;  // CPF do cliente
  customerEmail: string;     // Email do cliente
  customerPhone: string;     // Telefone do cliente
  status: 'valid' | 'used' | 'cancelled'; // Status do ingresso
  validations: {            // Histórico de validações
    timestamp: string;      // Data/hora da validação
    location: string;       // Local da validação (entrada, área VIP, etc)
    validatorId: string;    // ID do validador
    success: boolean;       // Se a validação foi bem sucedida
    reason?: string;       // Motivo se falhou
  }[];
  createdAt: string;        // Data de criação
  updatedAt: string;        // Última atualização
  qrCode: string;           // QR Code único do ingresso
  barcode: string;          // Código de barras do ingresso
}
