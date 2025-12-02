import React, { useState, useMemo } from 'react';
import { Plus, Zap, CheckCircle2, Clock } from 'lucide-react';
import { Task, Priority, Status } from './types';
import { ComplexSearch } from './components/ComplexSearch';
import { TaskCard } from './components/TaskCard';
import { Modal } from './components/Modal';
import { NeonButton } from './components/NeonButton';

// Initial Mock Data
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Implementar Nova UI',
    description: 'Atualizar os componentes para usar o novo design system cyberpunk.',
    priority: Priority.HIGH,
    status: Status.IN_PROGRESS,
    tags: ['design', 'frontend'],
    dueDate: '2023-10-25',
    assignee: 'Pedro'
  },
  {
    id: '2',
    title: 'Revisão de Código',
    description: 'Revisar pull requests pendentes do time de backend.',
    priority: Priority.MEDIUM,
    status: Status.TODO,
    tags: ['backend', 'review'],
    dueDate: '2023-10-26',
    assignee: 'Ana'
  },
  {
    id: '3',
    title: 'Deploy Produção',
    description: 'Realizar deploy da versão 2.0.',
    priority: Priority.HIGH,
    status: Status.DONE,
    tags: ['devops'],
    dueDate: '2023-10-20',
    assignee: 'Carlos'
  }
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Stats
  const completedToday = tasks.filter(t => t.status === Status.DONE).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : (completedToday / totalTasks) * 100;

  // Filter Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, filterPriority]);

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } as Task : t));
    } else {
      const newTask: Task = {
        ...taskData as Task,
        id: Math.random().toString(36).substr(2, 9),
      };
      setTasks(prev => [...prev, newTask]);
    }
  };

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { 
          ...t, 
          status: t.status === Status.DONE ? Status.TODO : Status.DONE 
        };
      }
      return t;
    }));
  };

  const openNewTaskModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-20 relative bg-[#0f0f10] overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="fixed -top-[200px] -left-[200px] w-[500px] h-[500px] bg-[#cf30aa] rounded-full blur-[150px] opacity-[0.15] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#03a9f4] rounded-full blur-[180px] opacity-[0.1] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f441a5] to-[#03a9f4] flex items-center justify-center shadow-[0_0_20px_rgba(244,65,165,0.4)]">
                <Zap className="text-white w-7 h-7 fill-white" />
             </div>
             <div>
               <h1 className="text-3xl font-bold text-white tracking-tight">Gerenciador Pedro</h1>
               <p className="text-gray-400 text-sm">Dashboard de Produtividade</p>
             </div>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto">
             <div className="hidden md:block text-right">
                <p className="text-white text-sm font-semibold">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <div className="flex items-center justify-end gap-2 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Online
                </div>
             </div>
             <div className="h-10 w-[1px] bg-gray-800 hidden md:block"></div>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 flex items-center justify-center">
                  <span className="font-bold text-xs text-white">PD</span>
                </div>
             </div>
          </div>
        </header>

        {/* Search & Action Area */}
        <div className="mb-12 flex flex-col lg:flex-row items-center gap-8">
           <div className="flex-1 w-full">
             <ComplexSearch value={searchQuery} onChange={setSearchQuery} />
           </div>
           
           <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
              <select 
                className="h-[60px] px-6 rounded-xl bg-[#161329] border border-white/5 text-gray-300 outline-none focus:border-[#03a9f4] transition-all appearance-none cursor-pointer"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">Todas Prioridades</option>
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              
              <NeonButton onClick={openNewTaskModal} className="h-[60px] px-8">
                <Plus size={20} />
                <span>Nova Tarefa</span>
              </NeonButton>
           </div>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Section Header */}
           <div className="flex items-center gap-3 mb-2 col-span-full">
              <div className="p-2 rounded-lg bg-[#cf30aa]/10">
                 <Clock className="w-5 h-5 text-[#cf30aa]" />
              </div>
              <h2 className="text-xl font-bold text-white">Próximas Tarefas</h2>
              <div className="ml-auto flex gap-2">
                 <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/5">
                   Total: {filteredTasks.length}
                 </span>
              </div>
           </div>
        </div>

        {/* Empty State or Grid */}
        {filteredTasks.length === 0 ? (
          <div className="w-full h-96 rounded-3xl bg-[#161329]/50 border border-dashed border-gray-700 flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-500">
             <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10 text-gray-600" />
             </div>
             <p className="text-gray-400 font-medium">Nenhuma tarefa encontrada.</p>
             <NeonButton variant="secondary" onClick={openNewTaskModal}>
               Criar primeira tarefa
             </NeonButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                onEdit={openEditTaskModal}
              />
            ))}
          </div>
        )}

        {/* Sticky Stats Footer */}
        <div className="fixed bottom-6 left-0 right-0 px-4 pointer-events-none z-40">
           <div className="max-w-4xl mx-auto bg-[#1a1a1c]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl pointer-events-auto flex items-center gap-6">
              <div className="flex-1">
                 <div className="flex justify-between text-xs mb-2 font-medium">
                    <span className="text-gray-400">Progresso Diário</span>
                    <span className="text-white">{Math.round(progress)}%</span>
                 </div>
                 <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#03a9f4] to-[#f441a5] transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                 </div>
              </div>
              <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                 <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Concluídas</p>
                    <p className="text-xl font-bold text-white leading-none">{completedToday}/{totalTasks}</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                    🔥
                 </div>
              </div>
           </div>
        </div>

      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTask}
        initialData={editingTask}
      />
    </div>
  );
}