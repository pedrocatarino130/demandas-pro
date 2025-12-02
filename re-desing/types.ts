export enum Priority {
  HIGH = 'Alta',
  MEDIUM = 'Média',
  LOW = 'Baixa'
}

export enum Status {
  TODO = 'A Fazer',
  IN_PROGRESS = 'Em Progresso',
  DONE = 'Concluído'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  tags: string[];
  dueDate: string;
  assignee?: string;
}
