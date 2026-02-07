
import { format, differenceInDays } from 'date-fns';
import { pt } from 'date-fns/locale/pt';

const parseISO = (s: string) => {
  if (!s) return new Date();
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d || 1);
};

export const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return format(parseISO(dateStr), "dd 'de' MMM", { locale: pt });
};

export const formatFullDate = (dateStr: string) => {
  if (!dateStr) return '';
  return format(parseISO(dateStr), "dd/MM/yyyy");
};

export const getDaysInInterval = (start: string, end: string) => {
  return differenceInDays(parseISO(end), parseISO(start)) + 1;
};

export const STORAGE_KEY = 'clube_imobiliario_clients';

export const getClients = (): any[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveClients = (clients: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
};
