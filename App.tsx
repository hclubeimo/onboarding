
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Home,
  LogOut,
  Building2,
  Calendar,
  Settings2,
  CloudCheck,
  CloudOff,
  RefreshCw,
} from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import GanttTimeline from './components/GanttTimeline';
import TaskEditor from './components/TaskEditor';
import { Client, AppView, AuthUser } from './types';
import { getClients, saveClients } from './lib/utils';
import { fetchClientsFromSheets, saveClientsToSheets } from './lib/api';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('cdi_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [view, setView] = useState<AppView>('home');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditingTasks, setIsEditingTasks] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('syncing');
  
  const isInitialMount = useRef(true);

  const loadData = async () => {
    if (!currentUser) return;
    setSyncStatus('syncing');
    try {
      const cloudData = await fetchClientsFromSheets();
      setClients(cloudData);
      saveClients(cloudData);
      setSyncStatus('synced');
    } catch (error) {
      console.warn('Falha na sincronização inicial. A usar dados locais.');
      setClients(getClients());
      setSyncStatus('error');
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!currentUser) return;

    const syncData = async () => {
      saveClients(clients); 
      
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
  }, [clients, currentUser]);

  useEffect(() => {
    if (selectedClient) {
      const updated = clients.find(c => c.id === selectedClient.id);
      if (updated) setSelectedClient(updated);
    }
  }, [clients]);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('cdi_auth_user', JSON.stringify(user));
    setView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cdi_auth_user');
    setView('home');
  };

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
          <div className="flex items-center gap-1.5 text-blue-400 text-[10px] md:text-xs font-medium">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span className="hidden sm:inline">A sincronizar...</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1.5 text-rose-400 text-[10px] md:text-xs font-medium cursor-help" title="Erro de ligação à Cloud">
            <CloudOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Erro Cloud</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] md:text-xs font-medium">
            <CloudCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nuvem Ativa</span>
          </div>
        );
    }
  };

  const renderView = () => {
    switch (view) {
      case 'home':
        return (
          <Dashboard 
            userName={currentUser?.name || ''}
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
            <div className="p-3 md:p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between sticky top-0 z-20 bg-white gap-3 md:gap-4">
              <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => setView('list')}
                  className="p-1.5 md:p-2 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <div className="min-w-0">
                  <h1 className="text-base md:text-xl font-bold text-slate-800 truncate">{selectedClient.name}</h1>
                  <p className="text-[10px] md:text-xs text-slate-500">Gestão do Processo Imobiliário</p>
                </div>
              </div>
              
              <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                <button 
                  onClick={() => setIsEditingTasks(false)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${!isEditingTasks ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="whitespace-nowrap">Cronograma</span>
                </button>
                <button 
                  onClick={() => setIsEditingTasks(true)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${isEditingTasks ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Settings2 className="w-4 h-4" />
                  <span className="whitespace-nowrap">Editar</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto custom-scrollbar">
              {isEditingTasks ? (
                <div className="p-3 md:p-6 lg:p-8 max-w-5xl mx-auto">
                  <TaskEditor 
                    client={selectedClient} 
                    onSave={handleUpdateClient} 
                  />
                </div>
              ) : (
                <div className="p-0 sm:p-4 md:p-6 h-full">
                  <GanttTimeline client={selectedClient} />
                </div>
              )}
            </div>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">
      <nav className="bg-slate-900 text-white p-3 md:p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer flex-shrink-0" 
            onClick={() => setView('home')}
          >
            <div className="bg-blue-600 p-1.5 rounded-lg flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-base md:text-lg font-bold tracking-tight whitespace-nowrap">Clube do Imobiliário</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6">
            {renderSyncIndicator()}
            <button 
              onClick={() => setView('home')}
              className="hover:text-blue-400 flex items-center gap-1 transition-colors p-1.5"
            >
              <Home className="w-5 h-5" />
              <span className="hidden lg:inline text-sm font-medium">Início</span>
            </button>
            <div className="h-5 w-px bg-slate-700 hidden sm:block"></div>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 group flex items-center gap-2"
            >
              <span className="hidden sm:inline text-xs font-bold">{currentUser.name}</span>
              <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto p-2 md:p-4 lg:p-8">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl shadow-slate-200 min-h-[85vh] overflow-hidden border border-slate-100 flex flex-col">
          {renderView()}
        </div>
      </main>

      <footer className="p-4 md:p-6 text-center text-slate-400 text-[10px] md:text-xs">
        <p>&copy; 2026 Clube do Imobiliário - Acolhimento Digital</p>
      </footer>
    </div>
  );
};

export default App;
