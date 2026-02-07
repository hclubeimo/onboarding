
import React from 'react';
import { Search, PlusCircle, Trash2, ArrowRight } from 'lucide-react';

interface DashboardProps {
  onViewList: () => void;
  onViewAdd: () => void;
  onViewRemove: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewList, onViewAdd, onViewRemove }) => {
  return (
    <div className="p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Bem-vindo ao Portal de Onboarding</h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            Selecione uma ação abaixo para gerenciar seus clientes e acompanhar seus processos imobiliários.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Action Cards */}
          <button 
            onClick={onViewList}
            className="group relative bg-white border-2 border-slate-100 rounded-3xl p-8 text-left hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300"
          >
            <div className="bg-blue-50 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Consultar Processos</h3>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">Veja todos os seus clientes e visualize seus cronogramas detalhados.</p>
            <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
              <span>Acessar agora</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </button>

          <button 
            onClick={onViewAdd}
            className="group relative bg-white border-2 border-slate-100 rounded-3xl p-8 text-left hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-300"
          >
            <div className="bg-emerald-50 text-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Adicionar Cliente</h3>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">Crie um novo processo de onboarding e defina tarefas e prazos.</p>
            <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
              <span>Novo Registro</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </button>

          <button 
            onClick={onViewRemove}
            className="group relative bg-white border-2 border-slate-100 rounded-3xl p-8 text-left hover:border-rose-500 hover:shadow-2xl hover:shadow-rose-100 transition-all duration-300"
          >
            <div className="bg-rose-50 text-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Remover Cliente</h3>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">Arquive ou remova clientes que concluíram ou desistiram do processo.</p>
            <div className="flex items-center text-rose-600 font-semibold group-hover:translate-x-2 transition-transform">
              <span>Gerir lista</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </button>
        </div>

        <div className="mt-16 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-6">
          <div className="flex -space-x-4">
             <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://picsum.photos/100/100?random=1" alt="" />
             <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://picsum.photos/100/100?random=2" alt="" />
             <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://picsum.photos/100/100?random=3" alt="" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Sistema integrado com Google Sheets</p>
            <p className="text-xs text-slate-500">Dados sincronizados em tempo real com sua base de dados externa.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
