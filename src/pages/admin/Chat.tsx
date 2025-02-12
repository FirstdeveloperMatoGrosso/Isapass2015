
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Loader2, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ShareOptions } from "@/components/ShareOptions";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  phoneNumber?: string;
  customerName?: string;
}

interface Conversation {
  id: string;
  customerPhone: string;
  customerName: string;
  messages: Message[];
  lastMessageAt: Date;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const { toast } = useToast();

  // Carregar conversa existente quando o número do cliente é fornecido
  useEffect(() => {
    const loadConversation = async () => {
      if (!customerPhone) return;

      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('customer_phone', customerPhone)
          .single();

        if (error) throw error;

        if (data) {
          setMessages(data.messages);
          setCustomerName(data.customer_name);
        }
      } catch (error) {
        console.error('Erro ao carregar conversa:', error);
      }
    };

    loadConversation();
  }, [customerPhone]);

  const saveConversation = async (newMessages: Message[]) => {
    if (!customerPhone || !customerName) return;

    try {
      const conversation: Conversation = {
        id: `${customerPhone}-${Date.now()}`,
        customerPhone,
        customerName,
        messages: newMessages,
        lastMessageAt: new Date(),
      };

      const { error } = await supabase
        .from('conversations')
        .upsert({ 
          customer_phone: customerPhone,
          customer_name: customerName,
          messages: newMessages,
          last_message_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao salvar conversa:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a conversa.",
        variant: "destructive",
      });
    }
  };

  const generateChatResponse = async (prompt: string) => {
    try {
      const { data, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'QWEN_API_KEY')
        .single();

      if (error || !data) {
        throw new Error('API Key não encontrada');
      }

      const apiKey = data.value;

      const response = await fetch('https://api.qwen.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'qwen-max',
          messages: [
            {
              role: 'system',
              content: `Você é um assistente de atendimento ao cliente especializado em uma plataforma de eventos. Suas responsabilidades incluem:

1. Ajudar com dúvidas sobre compra, troca e reembolso de ingressos
2. Resolver problemas com pagamentos e confirmação de compras
3. Informar sobre políticas de meia-entrada e documentação necessária
4. Explicar procedimentos de entrada no evento e regras gerais
5. Auxiliar com problemas técnicos no site ou aplicativo
6. Fornecer informações sobre eventos, horários e locais
7. Esclarecer dúvidas sobre áreas e tipos de ingresso
8. Informar sobre acessibilidade e necessidades especiais

Mantenha um tom cordial, profissional e prestativo, sempre buscando resolver as questões dos clientes da melhor forma possível.

Cliente atual: ${customerName}
Telefone: ${customerPhone}`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
          stream: false
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro na chamada da API');
      }

      const data2 = await response.json();
      return data2.choices[0].message.content;
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!customerPhone || !customerName) {
      toast({
        title: "Informações necessárias",
        description: "Por favor, insira o telefone e nome do cliente.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      phoneNumber: customerPhone,
      customerName: customerName,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const botResponse = await generateChatResponse(inputMessage);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        phoneNumber: customerPhone,
        customerName: customerName,
      };

      const updatedMessages = [...newMessages, botMessage];
      setMessages(updatedMessages);
      await saveConversation(updatedMessages);
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada e respondida com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Houve um erro ao processar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Chat Bot</h2>
          <p className="text-muted-foreground">
            Interaja com seus clientes através do chat automático alimentado por IA
          </p>
        </div>
        <ShareOptions />
      </div>
      
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Número do WhatsApp"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="flex-1"
              type="tel"
            />
            <Input
              placeholder="Nome do Cliente"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-[calc(100vh-16rem)] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {customerPhone ? (
              <div className="flex items-center gap-2">
                Chat com {customerName} 
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-4 w-4" /> {customerPhone}
                </span>
              </div>
            ) : (
              "Chat com Clientes"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {customerPhone 
                  ? "Inicie uma conversa com o cliente!"
                  : "Insira o número do WhatsApp e nome do cliente para começar."}
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-auto">
            <Input
              placeholder="Digite sua mensagem..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
              className="flex-1"
              disabled={isLoading || !customerPhone || !customerName}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !customerPhone || !customerName}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
