
export type TaskStatus = 'concluido' | 'em curso' | 'não iniciado';

export interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: TaskStatus;
  checked: boolean; // Representa "Realizada" (Visto)
  missed: boolean;  // Representa "Faltou" (Cruz)
  observations: string;
}

export interface Client {
  id: string;
  name: string;
  tasks: Task[];
  createdAt: string;
}

export interface AuthUser {
  username: string;
  name: string;
}

export type AppView = 'login' | 'home' | 'list' | 'add' | 'remove' | 'detail';
