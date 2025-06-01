import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ShareOptions } from "@/components/ShareOptions";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [welcomeEnabled, setWelcomeEnabled] = useState(false);
  const [autoResponses, setAutoResponses] = useState<Array<{ keyword: string; response: string }>>([]);
  const { toast } = useToast();

  const handleAddAutoResponse = () => {
    setAutoResponses([...autoResponses, { keyword: "", response: "" }]);
  };

  const handleAutoResponseChange = (index: number, field: "keyword" | "response", value: string) => {
    const newResponses = [...autoResponses];
    newResponses[index][field] = value;
    setAutoResponses(newResponses);
  };

  const handleRemoveAutoResponse = (index: number) => {
    setAutoResponses(autoResponses.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: "Olá! Esta é uma resposta automática. Em breve implementaremos a integração com IA.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputMessage("");
    
    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada com sucesso.",
    });
  };

  return (
    <div className="p-8 bg-gradient-to-b from-background to-background/80 min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Chat Bot</h2>
            <p className="text-muted-foreground">
              Interaja com seus clientes através do chat automático
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShareOptions />
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Respostas Automáticas</CardTitle>
              <CardDescription>Configure as respostas automáticas do chat bot</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">Respostas Automáticas</Label>
                  <Button
                    variant="outline"
                    onClick={handleAddAutoResponse}
                    className="bg-primary/10 hover:bg-primary/20 border-primary/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Resposta
                  </Button>
                </div>

                <div className="grid gap-4">
                  {autoResponses.map((response, index) => (
                    <Card key={index} className="border-primary/10 hover:border-primary/20 transition-all duration-300">
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Palavra-chave</Label>
                            <Input
                              placeholder="Ex: horário, ingresso, local"
                              value={response.keyword}
                              onChange={(e) => handleAutoResponseChange(index, 'keyword', e.target.value)}
                              className="bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Resposta</Label>
                            <Textarea
                              placeholder="Digite a resposta automática..."
                              value={response.response}
                              onChange={(e) => handleAutoResponseChange(index, 'response', e.target.value)}
                              className="min-h-[80px] bg-background/50"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAutoResponse(index)}
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">Mensagem de Boas-vindas</Label>
                  <Switch checked={welcomeEnabled} onCheckedChange={setWelcomeEnabled} />
                </div>
                <Textarea 
                  placeholder="Digite a mensagem de boas-vindas..."
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="min-h-[100px] bg-background/50 backdrop-blur"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Chat</CardTitle>
              <CardDescription>Visualize e teste o chat bot</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-6">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2 min-h-[400px]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      <p className="break-words">{message.text}</p>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="flex items-center gap-6 p-4 rounded-lg border border-primary/10 bg-gradient-to-r from-background/80 to-background hover:from-primary/5 hover:to-background transition-all duration-300 hover:border-primary/20 hover:shadow-sm">
                    Nenhuma mensagem ainda. Comece uma conversa!
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
