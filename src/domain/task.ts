export type Status = 'pendente' | 'concluida' | 'em andamento';

export type State = { tasks: Task[] };

export type TaskComment = {
  userId: string;
  text: string;
  createdAt: Date;
};

export interface Task {
  id: number;
  userId: string;
  title: string;
  description: string;
  status: Status;
  helpers: string[];
  comments: TaskComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
}
