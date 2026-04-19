import { Status, Task, TaskComment } from './domain/task.js';
import { store } from './store/store.js';
import { setupEvents } from './ui/events.js';
import { render } from './ui/render.js';

export function createTask(title: string, description: string, userId: string): Task {
  const task: Task = {
    id: Date.now(),
    title,
    description,
    userId,
    status: 'pendente',
    helpers: [],
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  store.dispatch({ type: 'CREATE_TASK', payload: task });

  return task;
}

export function findTask(taskId: number): Task {
  const { tasks } = store.getState();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    throw new Error('Task não encontrada');
  }

  return task;
}

export function updateTask(taskId: number, status: Status, userId: string): Task {
  const task = findTask(taskId);

  if (status === 'concluida' && task.userId !== userId) {
    throw new Error('Você não tem permissão para concluir esta task');
  }

  store.dispatch({ type: 'UPDATE_TASK', payload: { taskId, status, userId } });

  return findTask(taskId);
}

export function addHelper(taskId: number, userId: string) {
  const task = findTask(taskId);

  if (task.userId === userId) {
    throw new Error('Você não pode ser helper da sua própria task');
  }

  if (task.helpers.indexOf(userId) !== -1) {
    throw new Error('Você já é um helper desta task');
  }

  store.dispatch({ type: 'ADD_HELPER', payload: { taskId, userId } });

  return findTask(taskId);
}

export function addComment(taskId: number, userId: string, text: string) {
  if (!text.trim()) {
    throw new Error('Comentário não pode ser vazio');
  }

  const task = findTask(taskId);

  if (!canUserInteract(task, userId)) {
    throw new Error('Você não tem permissão para comentar nesta task');
  }

  const comment: TaskComment = {
    id: Date.now(),
    userId,
    text,
    createdAt: new Date(),
  };

  store.dispatch({
    type: 'ADD_COMMENT',
    payload: { taskId, userId, text, commentId: comment.id },
  });

  return findTask(taskId);
}

export function removeComment(taskId: number, userId: string, commentId: number) {
  const task = findTask(taskId);

  if (!canUserInteract(task, userId)) {
    throw new Error('Você não tem permissão para remover este comentário');
  }

  store.dispatch({ type: 'REMOVE_COMMENT', payload: { taskId, userId, commentId } });

  return findTask(taskId);
}

function canUserInteract(task: Task, userId: string): boolean {
  return task.userId === userId || task.helpers.indexOf(userId) !== -1;
}

export function deleteTask(taskId: number, userId: string) {
  const task = findTask(taskId);

  if (task.userId !== userId) {
    throw new Error('Você não tem permissão para deletar esta task');
  }

  store.dispatch({ type: 'DELETE_TASK', payload: { taskId, userId } });

  return { message: 'Task deletada com sucesso' };
}

store.subscribe(render);

setupEvents();

render();
