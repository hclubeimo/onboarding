
import React from 'react';
import { ChevronLeft, User, Calendar, Trash2, ExternalLink } from 'lucide-react';
import { Client } from '../types';
import { formatDate } from '../lib/utils';

interface ClientListProps {
  clients: Client[];
  isRemoveMode: boolean;
  onSelect: (client: Client) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, isRemoveMode, onSelect, onDelete, onBack }) => {
  return (
    <div className="flex flex-col h-full">
      <header className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {isRemoveMode ? 'Remover Clientes' : 'Os Seus Clientes'}
            </h2>
            <p className="text-sm text-slate-500">Total de {clients.length} processos ativos</p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-auto custom-scrollbar">
        {clients.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Nenhum cliente registado ainda.</p>
            <p className="text-xs text-slate-400 mt-1">Comece por adicionar um novo cliente no menu principal.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map(client => (
              <div 
                key={client.id}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-slate-100 text-slate-600 p-3 rounded-xl">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                        {client.name}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400 text-xs mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>Criado a {formatDate(client.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Tarefas totais</span>
                      <span className="font-bold">{client.tasks.length}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${(client.tasks.filter(t => t.checked).length / (client.tasks.length || 1)) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span>Progresso</span>
                      <span>{Math.round((client.tasks.filter(t => t.checked).length / (client.tasks.length || 1)) * 100)}%</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-50">
                    {isRemoveMode ? (
                      <button 
                        onClick={() => onDelete(client.id)}
                        className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remover
                      </button>
                    ) : (
                      <button 
                        onClick={() => onSelect(client)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Ver Timeline
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;
