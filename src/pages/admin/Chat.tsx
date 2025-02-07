
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ChatPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Chat Bot</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Chat com Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sistema de chat com IA será implementado aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
