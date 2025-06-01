import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X, MoreVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'A Fazer',
    tasks: [
      { id: '1', title: 'Configurar Gateway', description: 'Integrar novo gateway de pagamento', priority: 'high' },
      { id: '2', title: 'Ajustar Layout', description: 'Melhorar responsividade', priority: 'medium' },
    ],
  },
  {
    id: 'in-progress',
    title: 'Em Andamento',
    tasks: [
      { id: '3', title: 'Relatórios', description: 'Implementar novos gráficos', priority: 'medium' },
    ],
  },
  {
    id: 'done',
    title: 'Concluído',
    tasks: [
      { id: '4', title: 'Login', description: 'Sistema de autenticação', priority: 'high' },
    ],
  },
];

const KanbanPage = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as const });
  const [addingTo, setAddingTo] = useState<string | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...destColumn.tasks];
    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);

    setColumns(columns.map(col => {
      if (col.id === source.droppableId) {
        return { ...col, tasks: sourceTasks };
      }
      if (col.id === destination.droppableId) {
        return { ...col, tasks: destTasks };
      }
      return col;
    }));
  };

  const handleAddTask = (columnId: string) => {
    if (!newTask.title) return;

    const newTaskWithId = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
    };

    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: [...col.tasks, newTaskWithId],
        };
      }
      return col;
    }));

    setNewTask({ title: '', description: '', priority: 'medium' });
    setAddingTo(null);
  };

  const handleRemoveTask = (columnId: string, taskId: string) => {
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: col.tasks.filter(task => task.id !== taskId),
        };
      }
      return col;
    }));
  };

  return (
    <div className="p-8 bg-gradient-to-b from-background to-background/80 min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Kanban
            </h2>
            <p className="text-muted-foreground text-lg">
              Gerencie suas tarefas e projetos
            </p>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(column => (
              <div key={column.id} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-primary">{column.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAddingTo(column.id)}
                    className="hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-col gap-4"
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60"
                            >
                              <CardContent className="p-4 space-y-2">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-medium">{task.title}</h4>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveTask(column.id, task.id)}
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">{task.description}</p>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      task.priority === 'high'
                                        ? 'bg-destructive/10 text-destructive'
                                        : task.priority === 'medium'
                                        ? 'bg-yellow-500/10 text-yellow-500'
                                        : 'bg-green-500/10 text-green-500'
                                    }`}
                                  >
                                    {task.priority}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {addingTo === column.id && (
                        <Card className="border-dashed border-2 border-primary/20">
                          <CardContent className="p-4 space-y-4">
                            <div className="space-y-2">
                              <Label>Título</Label>
                              <Input
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                placeholder="Digite o título da tarefa..."
                                className="bg-background/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Descrição</Label>
                              <Textarea
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                placeholder="Digite a descrição da tarefa..."
                                className="bg-background/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Prioridade</Label>
                              <select
                                value={newTask.priority}
                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                                className="w-full p-2 rounded-md border border-input bg-background/50"
                              >
                                <option value="low">Baixa</option>
                                <option value="medium">Média</option>
                                <option value="high">Alta</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleAddTask(column.id)}
                                className="bg-primary/10 hover:bg-primary/20 border-primary/20"
                              >
                                Adicionar
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => setAddingTo(null)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanPage;
