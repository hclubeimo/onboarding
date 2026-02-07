
import React from 'react';
import { Search, PlusCircle, Trash2, ArrowRight } from 'lucide-react';

interface DashboardProps {
  userName: string;
  onViewList: () => void;
  onViewAdd: () => void;
  onViewRemove: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userName, onViewList, onViewAdd, onViewRemove }) => {
  return (
    <div className="p-4 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            Bem-vindo ao Portal, {userName}
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto">
            Selecione uma ação para gerir os seus clientes e acompanhar os seus processos.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          <button 
            onClick={onViewList}
            className="group relative bg-white border-2 border-slate-100 rounded-2xl md:rounded-3xl p-6 md:p-8 text-left hover:border-blue-500 hover:shadow-xl transition-all duration-300"
          >
            <div className="bg-blue-50 text-blue-600 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">Consultar</h3>
            <p className="text-slate-500 text-xs md:text-sm mb-4">Veja todos os seus processos e cronogramas.</p>
            <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              <span>Aceder</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>

          <button 
            onClick={onViewAdd}
            className="group relative bg-white border-2 border-slate-100 rounded-2xl md:rounded-3xl p-6 md:p-8 text-left hover:border-emerald-500 hover:shadow-xl transition-all duration-300"
          >
            <div className="bg-emerald-50 text-emerald-600 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">Adicionar</h3>
            <p className="text-slate-500 text-xs md:text-sm mb-4">Crie um novo processo de acolhimento.</p>
            <div className="flex items-center text-emerald-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              <span>Novo Registo</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>

          <button 
            onClick={onViewRemove}
            className="group relative bg-white border-2 border-slate-100 rounded-2xl md:rounded-3xl p-6 md:p-8 text-left hover:border-rose-500 hover:shadow-xl transition-all duration-300"
          >
            <div className="bg-rose-50 text-rose-600 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <Trash2 className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">Remover</h3>
            <p className="text-slate-500 text-xs md:text-sm mb-4">Arquive clientes que concluíram o processo.</p>
            <div className="flex items-center text-rose-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              <span>Gerir lista</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
