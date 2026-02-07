
import React, { useState } from 'react';
import { Plus, Trash, CheckCircle2, Circle, Save, XCircle } from 'lucide-react';
import { Client, Task, TaskStatus } from '../types';

interface TaskEditorProps {
  client: Client;
  onSave: (client: Client) => void;
}

const TaskEditor: React.FC<TaskEditorProps> = ({ client, onSave }) => {
  const [tasks, setTasks] = useState<Task[]>(client.tasks);
  const [hasChanges, setHasChanges] = useState(false);

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
    setHasChanges(true);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    setHasChanges(true);
  };

  const updateTask = (id: string, field: keyof Task, value: any) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const updated = { ...t, [field]: value };
        // Exclusividade mútua entre Cumpriu e Faltou
        if (field === 'checked' && value === true) updated.missed = false;
        if (field === 'missed' && value === true) updated.checked = false;
        return updated;
      }
      return t;
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave({ ...client, tasks });
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Gerenciar Tarefas</h3>
          <p className="text-sm text-slate-500">Adicione, remova ou edite as etapas deste processo.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={addTask}
            className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-emerald-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              hasChanges 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
            <p className="text-slate-400">Nenhuma tarefa definida para este cliente.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm group hover:border-blue-200 transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateTask(task.id, 'checked', !task.checked)}
                        title="Cumpriu"
                        className={`p-1.5 rounded-lg transition-colors ${task.checked ? 'bg-emerald-50 text-emerald-500' : 'text-slate-200 hover:text-slate-300'}`}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => updateTask(task.id, 'missed', !task.missed)}
                        title="Faltou"
                        className={`p-1.5 rounded-lg transition-colors ${task.missed ? 'bg-rose-50 text-rose-500' : 'text-slate-200 hover:text-slate-300'}`}
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                      placeholder="Título da tarefa..."
                      className="flex-1 text-lg font-bold text-slate-800 border-none focus:ring-0 placeholder:text-slate-300 p-0"
                    />
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Início</label>
                      <input
                        type="date"
                        value={task.startDate}
                        onChange={(e) => updateTask(task.id, 'startDate', e.target.value)}
                        className="w-full text-sm bg-slate-50 border-none rounded-lg focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Prazo</label>
                      <input
                        type="date"
                        value={task.endDate}
                        onChange={(e) => updateTask(task.id, 'endDate', e.target.value)}
                        className="w-full text-sm bg-slate-50 border-none rounded-lg focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Horário</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="time"
                          value={task.startTime}
                          onChange={(e) => updateTask(task.id, 'startTime', e.target.value)}
                          className="w-full text-xs bg-slate-50 border-none rounded-lg focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-slate-300">-</span>
                        <input
                          type="time"
                          value={task.endTime}
                          onChange={(e) => updateTask(task.id, 'endTime', e.target.value)}
                          className="w-full text-xs bg-slate-50 border-none rounded-lg focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
                      <select
                        value={task.status}
                        onChange={(e) => updateTask(task.id, 'status', e.target.value as TaskStatus)}
                        className="w-full text-sm bg-slate-50 border-none rounded-lg focus:ring-1 focus:ring-blue-500 capitalize"
                      >
                        <option value="não iniciado">Não Iniciado</option>
                        <option value="em curso">Em Curso</option>
                        <option value="concluido">Concluído</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <textarea
                      value={task.observations}
                      onChange={(e) => updateTask(task.id, 'observations', e.target.value)}
                      placeholder="Observações..."
                      className="w-full text-sm bg-slate-50 border-none rounded-xl focus:ring-1 focus:ring-blue-500 p-3 min-h-[60px] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {hasChanges && (
        <div className="fixed bottom-10 right-10 animate-bounce z-50">
          <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-xs font-bold border border-amber-200 shadow-lg">
            Alterações não salvas!
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskEditor;
