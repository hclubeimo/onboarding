
import { Client } from '../types';

// ID de implementação fornecido pelo usuário
const SCRIPT_ID = 'AKfycbwsdNXemnBzLesqwEUq3Pm1emELhf3yClryEBDqXOCOuNclVWH-7n2RZXQVHa9vu0SH5g';
const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

export const isApiConfigured = (): boolean => {
  return !!SCRIPT_ID;
};

export const fetchClientsFromSheets = async (): Promise<Client[]> => {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getClients`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) throw new Error('Erro na resposta do servidor');
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro de rede ao buscar dados:', error);
    throw error;
  }
};

export const fetchUsersFromSheets = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getUsers`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) throw new Error('Erro na resposta do servidor');
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro de rede ao buscar utilizadores:', error);
    return [];
  }
};

export const saveClientsToSheets = async (clients: Client[]): Promise<void> => {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clients),
    });
  } catch (error) {
    console.error('Erro de rede ao salvar dados:', error);
    throw error;
  }
};

export const getStoredScriptUrl = () => GOOGLE_SCRIPT_URL;
export const setStoredScriptUrl = (_url: string) => {};
