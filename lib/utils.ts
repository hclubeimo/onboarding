
import { format, differenceInDays } from 'date-fns';
import { pt } from 'date-fns/locale/pt';

/**
 * Converte uma string de data para um objeto Date de forma segura.
 * Lida com formatos YYYY-MM-DD (locais) e ISO 8601 (UTC).
 */
export const parseSafeDate = (s: string): Date => {
  if (!s) return new Date();
  
  // Se contiver 'T', é um ISO string completo (ex: 2024-05-20T12:00:00Z)
  if (s.includes('T')) {
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d;
  }

  // Fallback para formato YYYY-MM-DD ou DD/MM/YYYY
  const parts = s.split(/[-/]/);
  if (parts.length >= 3) {
    // Assume-se YYYY-MM-DD para strings vindas de inputs tipo date
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    
    // Se o primeiro elemento não for o ano (ex: DD/MM/YYYY)
    if (y < 1000) {
      const realD = parseInt(parts[0], 10);
      const realM = parseInt(parts[1], 10) - 1;
      const realY = parseInt(parts[2], 10);
      return new Date(realY, realM, realD);
    }
    
    return new Date(y, m, d);
  }

  const finalDate = new Date(s);
  return isNaN(finalDate.getTime()) ? new Date() : finalDate;
};

export const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  // Usamos formatação dd/MM/yyyy para clareza em Portugal
  return format(parseSafeDate(dateStr), "dd/MM/yyyy", { locale: pt });
};

export const formatFullDate = (dateStr: string) => {
  if (!dateStr) return '';
  return format(parseSafeDate(dateStr), "dd/MM/yyyy HH:mm");
};

export const getDaysInInterval = (start: string, end: string) => {
  return differenceInDays(parseSafeDate(end), parseSafeDate(start)) + 1;
};

export const STORAGE_KEY = 'clube_imobiliario_clients';

export const getClients = (): any[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveClients = (clients: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
};
