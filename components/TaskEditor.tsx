
import React, { useState } from 'react';
import { Plus, Trash, CheckCircle2, Save, XCircle } from 'lucide-react';
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
    if (confirm('Tem a certeza que deseja remover esta tarefa?')) {
      setTasks(tasks.filter(t => t.id !== id));
      setHasChanges(true);
    }
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
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave({ ...client, tasks });
    setHasChanges(false);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
        <div>
          <h3 className="text-base md:text-lg font-bold text-slate-800">Gerir Tarefas</h3>
          <p className="text-[10px] md:text-xs text-slate-500">Edite as etapas deste processo de acolhimento.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={addTask}
            className="flex-1 sm:flex-none bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors text-xs"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-xs ${
              hasChanges 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <p className="text-slate-400 text-sm font-medium">Nenhuma tarefa definida para este cliente.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="flex gap-1 mt-0.5">
                    <button
                      onClick={() => updateTask(task.id, 'checked', !task.checked)}
                      className={`p-1.5 rounded-lg transition-colors ${task.checked ? 'bg-emerald-50 text-emerald-500' : 'text-slate-200 hover:text-slate-300'}`}
                      title="Marcar como Concluída"
                    >
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={() => updateTask(task.id, 'missed', !task.missed)}
                      className={`p-1.5 rounded-lg transition-colors ${task.missed ? 'bg-rose-50 text-rose-500' : 'text-slate-200 hover:text-slate-300'}`}
                      title="Marcar como Faltou"
                    >
                      <XCircle className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                    placeholder="Título da tarefa..."
                    className="flex-1 text-sm md:text-lg font-bold text-slate-800 border-none focus:ring-0 placeholder:text-slate-300 p-1 bg-transparent"
                  />
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors p-2 flex-shrink-0"
                    title="Remover Tarefa"
                  >
                    <Trash className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Data Início</label>
                    <input
                      type="date"
                      value={task.startDate}
                      onChange={(e) => updateTask(task.id, 'startDate', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-transparent rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Data Prazo</label>
                    <input
                      type="date"
                      value={task.endDate}
                      onChange={(e) => updateTask(task.id, 'endDate', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-transparent rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Horário (De - Até)</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="time"
                        value={task.startTime}
                        onChange={(e) => updateTask(task.id, 'startTime', e.target.value)}
                        className="w-full text-[10px] md:text-xs bg-slate-50 border border-transparent rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white p-2"
                      />
                      <span className="text-slate-300">-</span>
                      <input
                        type="time"
                        value={task.endTime}
                        onChange={(e) => updateTask(task.id, 'endTime', e.target.value)}
                        className="w-full text-[10px] md:text-xs bg-slate-50 border border-transparent rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white p-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Estado Atual</label>
                    <select
                      value={task.status}
                      onChange={(e) => updateTask(task.id, 'status', e.target.value as TaskStatus)}
                      className="w-full text-xs bg-slate-50 border border-transparent rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white p-2.5 capitalize appearance-none"
                    >
                      <option value="não iniciado">Não Iniciado</option>
                      <option value="em curso">Em Curso</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Notas e Observações</label>
                  <textarea
                    value={task.observations}
                    onChange={(e) => updateTask(task.id, 'observations', e.target.value)}
                    placeholder="Adicione observações importantes sobre esta etapa..."
                    className="w-full text-xs bg-slate-50 border border-transparent rounded-xl focus:ring-1 focus:ring-blue-500 focus:bg-white p-3 min-h-[60px] resize-none"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-[10px] font-bold border border-amber-200 shadow-2xl animate-bounce">
            Alterações não guardadas
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskEditor;
