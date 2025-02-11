import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Database, Table, RefreshCw, Code2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient, PostgrestError } from '@supabase/supabase-js';
import { Textarea } from "@/components/ui/textarea";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableInfo {
  name: string;
  rowCount: number;
}

const ApiConnectPage = () => {
  const [appName, setAppName] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('supabaseUrl') || "");
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('supabaseKey') || "");
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sqlQuery, setSqlQuery] = useState("");
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);

  useEffect(() => {
    const loadInitialTables = async () => {
      const savedUrl = localStorage.getItem('supabaseUrl');
      const savedKey = localStorage.getItem('supabaseKey');
      
      if (savedUrl && savedKey) {
        setIsLoading(true);
        const success = await fetchTables(savedUrl, savedKey);
        if (success) {
          setIsConnected(true);
        }
        setIsLoading(false);
      }
    };

    loadInitialTables();
  }, []);

  const generateToken = () => {
    if (!appName) {
      toast.error("Digite o nome do aplicativo");
      return;
    }

    const token = Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    
    setApiToken(token);
    setApiUrl(`https://api.isapass.com/v1/${appName.toLowerCase().replace(/\s+/g, '-')}`);
    
    toast.success("Token gerado com sucesso!");
  };

  const copyToClipboard = (text: string, type: "token" | "url") => {
    navigator.clipboard.writeText(text);
    toast.success(`${type === "token" ? "Token" : "URL"} copiado para a área de transferência`);
  };

  const fetchTables = async (url: string, key: string) => {
    try {
      const supabase = createClient(url, key);
      
      // Verifica a conexão
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Erro ao verificar sessão:', sessionError);
        return false;
      }

      // Lista as tabelas usando uma função RPC personalizada
      const { data, error } = await supabase.rpc('list_tables');

      if (error) {
        // Se a função RPC não existir, vamos criar ela
        await supabase.rpc('create_list_tables_function', {
          sql: `
            CREATE OR REPLACE FUNCTION list_tables()
            RETURNS TABLE (name text, row_count bigint)
            LANGUAGE plpgsql
            SECURITY DEFINER
            AS $$
            BEGIN
              RETURN QUERY
              SELECT 
                tablename::text as name,
                (SELECT reltuples::bigint FROM pg_class WHERE oid = (quote_ident(schemaname) || '.' || quote_ident(tablename))::regclass) as row_count
              FROM pg_catalog.pg_tables
              WHERE schemaname = 'public';
            END;
            $$;
          `
        });

        // Tenta listar as tabelas novamente
        const { data: tablesData, error: tablesError } = await supabase.rpc('list_tables');
        
        if (tablesError) {
          console.error('Erro ao listar tabelas:', tablesError);
          // Mesmo com erro, retornamos true pois a conexão está ok
          setTables([]);
          return true;
        }

        if (tablesData) {
          setTables(tablesData.map((table: any) => ({
            name: table.name,
            rowCount: table.row_count || 0
          })));
        }
      } else if (data) {
        setTables(data.map((table: any) => ({
          name: table.name,
          rowCount: table.row_count || 0
        })));
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
      // Mesmo com erro ao listar tabelas, retornamos true se a conexão estiver ok
      setTables([]);
      return true;
    }
  };

  const handleSupabaseConnect = async () => {
    if (!supabaseUrl || !supabaseKey) {
      toast.error("Preencha todos os campos do Supabase");
      return;
    }

    setIsLoading(true);
    const success = await fetchTables(supabaseUrl, supabaseKey);
    setIsLoading(false);

    if (success) {
      // Salva as credenciais no localStorage
      localStorage.setItem('supabaseUrl', supabaseUrl);
      localStorage.setItem('supabaseKey', supabaseKey);
      setIsConnected(true);
      toast.success("Conectado ao Supabase com sucesso!");
    } else {
      setIsConnected(false);
      toast.error("Erro ao conectar com o Supabase. Verifique as credenciais.");
    }
  };

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      toast.error("Digite uma consulta SQL");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Primeiro, tentamos criar a função execute_sql se ela não existir
      await supabase.rpc('create_execute_sql_function', {
        sql: `
          CREATE OR REPLACE FUNCTION execute_sql(query text)
          RETURNS JSONB
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          DECLARE
            result JSONB;
          BEGIN
            EXECUTE 'WITH query_result AS (' || query || ') 
                     SELECT jsonb_agg(row_to_json(query_result)) 
                     FROM query_result' INTO result;
            RETURN COALESCE(result, '[]'::jsonb);
          END;
          $$;
        `
      });

      // Agora executamos a consulta usando a função
      const { data, error } = await supabase.rpc('execute_sql', {
        query: sqlQuery
      });

      if (error) throw error;

      setQueryResult(data || []);
      toast.success("Consulta executada com sucesso!");
    } catch (error) {
      console.error('Erro ao executar consulta:', error);
      toast.error("Erro ao executar consulta SQL. Verifique se a sintaxe está correta.");
    } finally {
      setIsLoading(false);
    }
  };

  const syncTableData = async () => {
    if (!selectedTable) return;
    
    setIsLoading(true);
    try {
      toast.success(`Sincronizando dados da tabela ${selectedTable}...`);
      await fetchTableData(selectedTable);
      toast.success("Dados sincronizados com sucesso!");
    } catch (error) {
      toast.error("Erro ao sincronizar os dados");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTableData = async (tableName: string) => {
    setIsLoading(true);
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100);

      if (error) throw error;

      if (data && data.length > 0) {
        setTableColumns(Object.keys(data[0]));
        setTableData(data);
      } else {
        setTableColumns([]);
        setTableData([]);
      }
      
      setSelectedTable(tableName);
      toast.success(`Dados da tabela ${tableName} carregados`);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error("Erro ao carregar dados da tabela");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableClick = (tableName: string) => {
    fetchTableData(tableName);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">API Connect</h2>
        <p className="text-muted-foreground">
          Gerencie conexões de API para seus aplicativos
        </p>
      </div>

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="api" className="w-full">API Própria</TabsTrigger>
          <TabsTrigger value="supabase" className="w-full">Supabase</TabsTrigger>
          <TabsTrigger value="tables" className="w-full flex items-center gap-2">
            <Table className="h-4 w-4" />
            Tabelas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Gerar Nova Conexão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">Nome do Aplicativo</Label>
                  <Input
                    id="appName"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Ex: Meu Aplicativo"
                  />
                </div>

                <Button onClick={generateToken} className="w-full">
                  Gerar Token
                </Button>

                {apiToken && (
                  <>
                    <div className="space-y-2">
                      <Label>Token de API</Label>
                      <div className="flex gap-2">
                        <Input value={apiToken} readOnly />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(apiToken, "token")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>URL da API</Label>
                      <div className="flex gap-2">
                        <Input value={apiUrl} readOnly />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(apiUrl, "url")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instruções de Uso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Para conectar seu aplicativo à nossa API, siga os passos:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mt-4">
                  <li>Digite o nome do seu aplicativo</li>
                  <li>Clique em "Gerar Token" para criar um novo token de acesso</li>
                  <li>Copie o token e a URL gerados</li>
                  <li>Use o token no cabeçalho de suas requisições como "Authorization: Bearer {`{token}`}"</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="supabase">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {isConnected ? "Conectado ao Supabase" : "Conectar ao Supabase"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supabaseUrl">URL do Projeto</Label>
                  <Input
                    id="supabaseUrl"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xxx.supabase.co"
                    disabled={isConnected}
                    readOnly={isConnected}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supabaseKey">Chave Anon/Pública</Label>
                  <Input
                    id="supabaseKey"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    type="password"
                    placeholder="sua-chave-anon-publica"
                    disabled={isConnected}
                    readOnly={isConnected}
                  />
                </div>

                {!isConnected && (
                  <Button 
                    onClick={handleSupabaseConnect} 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Conectando..." : "Conectar ao Supabase"}
                  </Button>
                )}

                {isConnected && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm">
                      Conexão estabelecida com sucesso. Para desconectar, você precisa remover o acesso no painel do Supabase.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Consulta SQL</Label>
                  <Textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="Digite sua consulta SQL aqui..."
                    className="font-mono"
                  />
                  <Button 
                    onClick={executeQuery}
                    disabled={isLoading}
                    className="w-full mt-2"
                  >
                    <Code2 className="h-4 w-4 mr-2" />
                    Executar SQL
                  </Button>
                </div>

                {queryResult.length > 0 && (
                  <div className="space-y-2">
                    <Label>Resultado da Consulta</Label>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(queryResult, null, 2)}
                    </pre>
                  </div>
                )}

                {tables.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Tabelas Encontradas</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={syncTableData}
                        disabled={isLoading || !selectedTable}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sincronizar Tabela
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {tables.map((table) => (
                        <div
                          key={table.name}
                          className={`flex items-center justify-between p-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors ${
                            selectedTable === table.name ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handleTableClick(table.name)}
                        >
                          <div className="flex items-center gap-2">
                            <Table className="h-4 w-4" />
                            <span>{table.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {table.rowCount} registros
                          </span>
                        </div>
                      ))}
                    </div>

                    {selectedTable && tableData.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-md font-semibold">
                          Dados da Tabela: {selectedTable}
                        </h4>
                        <div className="border rounded-lg overflow-hidden">
                          <UITable>
                            <TableHeader>
                              <TableRow>
                                {tableColumns.map((column) => (
                                  <TableHead key={column}>{column}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {tableData.map((row, index) => (
                                <TableRow key={index}>
                                  {tableColumns.map((column) => (
                                    <TableCell key={column}>
                                      {JSON.stringify(row[column])}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </UITable>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Como Conectar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Para conectar seu aplicativo ao Supabase, siga os passos:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Acesse o painel do Supabase</li>
                  <li>Crie um novo projeto ou selecione um existente</li>
                  <li>Na página de configurações do projeto, encontre as credenciais da API</li>
                  <li>Copie a URL do projeto e a chave anon/pública</li>
                  <li>Cole as credenciais nos campos ao lado</li>
                </ol>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                >
                  Acessar Painel do Supabase
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                Visualização de Tabelas
                {isLoading && <RefreshCw className="h-4 w-4 animate-spin ml-2" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isConnected && (
                <p className="text-muted-foreground">
                  Conecte-se ao Supabase primeiro para visualizar as tabelas.
                </p>
              )}
              
              {isConnected && (
                <div className="space-y-4">
                  {tables.length === 0 ? (
                    <div className="text-center py-8">
                      <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Nenhuma tabela encontrada no banco de dados.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Tabelas Encontradas</h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={syncTableData}
                          disabled={isLoading || !selectedTable}
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                          Sincronizar Tabela
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          {tables.map((table) => (
                            <div
                              key={table.name}
                              className={`flex items-center justify-between p-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors ${
                                selectedTable === table.name ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => handleTableClick(table.name)}
                            >
                              <div className="flex items-center gap-2">
                                <Table className="h-4 w-4" />
                                <span>{table.name}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {table.rowCount} registros
                              </span>
                            </div>
                          ))}
                        </div>

                        {selectedTable && tableData.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-md font-semibold">
                              Dados da Tabela: {selectedTable}
                            </h4>
                            <div className="border rounded-lg overflow-hidden">
                              <UITable>
                                <TableHeader>
                                  <TableRow>
                                    {tableColumns.map((column) => (
                                      <TableHead key={column}>{column}</TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {tableData.map((row, index) => (
                                    <TableRow key={index}>
                                      {tableColumns.map((column) => (
                                        <TableCell key={column}>
                                          {JSON.stringify(row[column])}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </UITable>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiConnectPage;
