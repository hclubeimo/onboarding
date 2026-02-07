
import React, { useState } from 'react';
import { Building2, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { AuthUser } from '../types';
import { fetchUsersFromSheets } from '../lib/api';

interface LoginProps {
  onLogin: (user: AuthUser) => void;
}

const LOCAL_USERS = [
  { username: 'hugo', name: 'Hugo', password: 'cdi07022026' },
  { username: 'pedro', name: 'Pedro', password: 'cdi07022026' }
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const localMatch = LOCAL_USERS.find(
        u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (localMatch) {
        onLogin({ username: localMatch.username, name: localMatch.name });
        return;
      }

      const remoteUsers = await fetchUsersFromSheets();
      const remoteMatch = remoteUsers.find(
        u => u.username?.toLowerCase() === username.toLowerCase() && String(u.password) === password
      );

      if (remoteMatch) {
        onLogin({ username: remoteMatch.username, name: remoteMatch.name || remoteMatch.username });
      } else {
        setError('Utilizador ou palavra-passe incorretos.');
      }
    } catch (err) {
      setError('Erro ao ligar ao servidor. Verifique a sua ligação.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="p-8 md:p-10">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-blue-600 p-4 rounded-2xl mb-4 shadow-lg shadow-blue-200">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Clube do Imobiliário</h1>
              <p className="text-slate-500 text-sm mt-1">Portal de Onboarding</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Utilizador</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                    placeholder="Nome de utilizador"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Palavra-passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    A iniciar sessão...
                  </>
                ) : (
                  'Entrar no Portal'
                )}
              </button>
            </form>
          </div>
          <div className="bg-slate-50 p-6 border-t border-slate-100 text-center text-xs text-slate-400">
            © 2026 Clube do Imobiliário. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
