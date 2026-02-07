
import React, { useState } from 'react';
import { ChevronLeft, Plus, Trash, CheckCircle2, Info, Calendar, XCircle } from 'lucide-react';
import { Client, Task, TaskStatus } from '../types';

interface ClientFormProps {
  onSave: (client: Client) => void;
  onBack: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSave, onBack }) => {
  const [clientName, setClientName] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = () => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '18:00',
      status: 'não iniciado',
      checked: false,
      missed: false,
      observations: ''
    };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id: string, field: keyof Task, value: any) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const updated = { ...t, [field]: value };
        if (field === 'checked' && value === true) updated.missed = false;
        if (field === 'missed' && value === true) updated.checked = false;
        return updated;
      }
      return t;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || tasks.length === 0) {
      alert('Por favor, preencha o nome do cliente e adicione pelo menos uma tarefa.');
      return;
    }
    
    const newClient: Client = {
      id: crypto.randomUUID(),
      name: clientName,
      tasks: tasks,
      createdAt: new Date().toISOString()
    };
    
    onSave(newClient);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 md:p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">Novo Acolhimento</h2>
            <p className="text-xs md:text-sm text-slate-500">Registe o cliente e as respetivas etapas.</p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-10 overflow-auto custom-scrollbar">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          <section className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200">
            <h3 className="text-md md:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Informações do Cliente
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Nome Completo</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: João da Silva Santos"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm md:text-base"
                required
              />
            </div>
          </section>

          <section>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h3 className="text-md md:text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                Cronograma de Tarefas
              </h3>
              <button
                type="button"
                onClick={addTask}
                className="w-full sm:w-auto bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Adicionar Tarefa
              </button>
            </div>

            <div className="space-y-4 md:space-y-6">
              {tasks.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
                  <p className="text-slate-400 text-sm">Clique em "Adicionar Tarefa" para começar.</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="relative bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm group">
                    <button
                      type="button"
                      onClick={() => removeTask(task.id)}
                      className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 transition-colors p-2"
                    >
                      <Trash className="w-5 h-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Título da Tarefa</label>
                        <input
                          type="text"
                          value={task.name}
                          onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                          placeholder="Ex: Assinatura do contrato"
                          className="w-full px-4 py-2 bg-slate-50 rounded-lg border-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all text-slate-800 font-medium text-sm"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Início</label>
                          <input
                            type="date"
                            value={task.startDate}
                            onChange={(e) => updateTask(task.id, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 rounded-lg focus:ring-1 focus:ring-blue-500 text-xs md:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Prazo Final</label>
                          <input
                            type="date"
                            value={task.endDate}
                            onChange={(e) => updateTask(task.id, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 rounded-lg focus:ring-1 focus:ring-blue-500 text-xs md:text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Hora Início</label>
                          <input
                            type="time"
                            value={task.startTime}
                            onChange={(e) => updateTask(task.id, 'startTime', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs md:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Hora Fim</label>
                          <input
                            type="time"
                            value={task.endTime}
                            onChange={(e) => updateTask(task.id, 'endTime', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs md:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Estado</label>
                        <select
                          value={task.status}
                          onChange={(e) => updateTask(task.id, 'status', e.target.value as TaskStatus)}
                          className="w-full px-4 py-2 bg-slate-50 rounded-lg focus:ring-1 focus:ring-blue-500 capitalize text-sm"
                        >
                          <option value="não iniciado">Não Iniciado</option>
                          <option value="em curso">Em Curso</option>
                          <option value="concluido">Concluído</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start gap-4 pt-4 border-t border-slate-100 mt-4">
                       <div className="flex flex-row md:flex-col gap-4 items-center md:items-start w-full md:w-auto">
                         <label className="block text-[10px] font-bold text-slate-400 uppercase md:mb-1">Resultado</label>
                         <div className="flex gap-2">
                           <button
                             type="button"
                             onClick={() => updateTask(task.id, 'checked', !task.checked)}
                             className={`p-2 rounded-lg border transition-all ${task.checked ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}
                             title="Concluída"
                           >
                             <CheckCircle2 className="w-5 h-5" />
                           </button>
                           <button
                             type="button"
                             onClick={() => updateTask(task.id, 'missed', !task.missed)}
                             className={`p-2 rounded-lg border transition-all ${task.missed ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}
                             title="Faltou"
                           >
                             <XCircle className="w-5 h-5" />
                           </button>
                         </div>
                       </div>
                       
                       <div className="flex-1 w-full">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Observações</label>
                          <textarea
                            value={task.observations}
                            onChange={(e) => updateTask(task.id, 'observations', e.target.value)}
                            placeholder="Notas importantes sobre esta etapa..."
                            className="w-full px-4 py-2 bg-slate-50 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all resize-none text-xs md:text-sm min-h-[60px]"
                          />
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="sticky bottom-0 pt-4 bg-white/80 backdrop-blur-sm pb-4">
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all text-base md:text-lg"
            >
              Concluir Processo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
