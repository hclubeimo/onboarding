
import { format, parseISO, differenceInDays, startOfMonth, addDays, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return format(parseISO(dateStr), "dd 'de' MMM", { locale: ptBR });
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
