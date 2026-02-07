
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  ChevronLeft, 
  Home,
  LogOut,
  Building2,
  Calendar,
  Settings2,
  CloudCheck,
  CloudOff,
  RefreshCw,
  Settings,
  X,
  ExternalLink
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import GanttTimeline from './components/GanttTimeline';
import TaskEditor from './components/TaskEditor';
import { Client, AppView } from './types';
import { getClients, saveClients } from './lib/utils';
import { fetchClientsFromSheets, saveClientsToSheets, isApiConfigured } from './lib/api';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditingTasks, setIsEditingTasks] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('syncing');
  
  const isInitialMount = useRef(true);

  const loadData = async () => {
    setSyncStatus('syncing');
    try {
      const cloudData = await fetchClientsFromSheets();
      setClients(cloudData);
      saveClients(cloudData);
      setSyncStatus('synced');
    } catch (error) {
      console.warn('Falha na sincronização inicial. Usando dados locais.');
      setClients(getClients());
      setSyncStatus('error');
    }
  };

  // Carregamento Inicial
  useEffect(() => {
    loadData();
  }, []);

  // Sincronização em Tempo Real (State -> Sheets & Local)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const syncData = async () => {
      saveClients(clients); // Local sempre imediato
      
      setSyncStatus('syncing');
      try {
        await saveClientsToSheets(clients);
        setSyncStatus('synced');
      } catch (error) {
        setSyncStatus('error');
      }
    };

    const timeoutId = setTimeout(syncData, 1000);
    return () => clearTimeout(timeoutId);
  }, [clients]);

  useEffect(() => {
    if (selectedClient) {
      const updated = clients.find(c => c.id === selectedClient.id);
      if (updated) setSelectedClient(updated);
    }
  }, [clients]);

  const handleAddClient = (newClient: Client) => {
    setClients(prev => [...prev, newClient]);
    setView('home');
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleDeleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditingTasks(false);
    setView('detail');
  };

  const renderSyncIndicator = () => {
    switch (syncStatus) {
      case 'syncing':
        return (
          <div className="flex items-center gap-2 text-blue-400 text-xs font-medium">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="hidden md:inline">Sincronizando...</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-rose-400 text-xs font-medium cursor-help" title="Erro de conexão com a nuvem. Tentando novamente...">
            <CloudOff className="w-4 h-4" />
            <span className="hidden md:inline">Erro Cloud</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
            <CloudCheck className="w-4 h-4" />
            <span className="hidden md:inline">Nuvem Ativa</span>
          </div>
        );
    }
  };

  const renderView = () => {
    switch (view) {
      case 'home':
        return (
          <Dashboard 
            onViewList={() => setView('list')} 
            onViewAdd={() => setView('add')} 
            onViewRemove={() => setView('remove')} 
          />
        );
      case 'list':
      case 'remove':
        return (
          <ClientList 
            clients={clients} 
            isRemoveMode={view === 'remove'} 
            onSelect={handleSelectClient}
            onDelete={handleDeleteClient}
            onBack={() => setView('home')}
          />
        );
      case 'add':
        return (
          <ClientForm 
            onSave={handleAddClient} 
            onBack={() => setView('home')} 
          />
        );
      case 'detail':
        return selectedClient ? (
          <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 z-20 bg-white">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setView('list')}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">{selectedClient.name}</h1>
                  <p className="text-sm text-slate-500">Gestão do Processo Imobiliário</p>
                </div>
              </div>
              
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setIsEditingTasks(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!isEditingTasks ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Calendar className="w-4 h-4" />
                  Cronograma
                </button>
                <button 
                  onClick={() => setIsEditingTasks(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isEditingTasks ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Settings2 className="w-4 h-4" />
                  Editar Tarefas
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto custom-scrollbar">
              {isEditingTasks ? (
                <div className="p-6 max-w-5xl mx-auto">
                  <TaskEditor 
                    client={selectedClient} 
                    onSave={handleUpdateClient} 
                  />
                </div>
              ) : (
                <div className="p-6">
                  <GanttTimeline client={selectedClient} />
                </div>
              )}
            </div>
          </div>
        ) : null;
      default:
        return <Dashboard 
          onViewList={() => setView('list')} 
          onViewAdd={() => setView('add')} 
          onViewRemove={() => setView('remove')} 
        />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setView('home')}
          >
            <div className="bg-blue-600 p-2 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">Clube do Imobiliário</span>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            {renderSyncIndicator()}
            <button 
              onClick={() => setView('home')}
              className="hover:text-blue-400 flex items-center gap-1 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block"></div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 min-h-[70vh] overflow-hidden border border-slate-100">
          {renderView()}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-slate-400 text-sm">
        <p>&copy; 2026 Clube do Imobiliário - Sincronização Automática</p>
      </footer>
    </div>
  );
};

export default App;
