import { State } from '../domain/task.js';

const STORAGE_KEY = 'vanilla-state-manager';

export function saveState(state: State) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadState(): State | null {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar estado', error);
    return null;
  }
}

let timeOut: ReturnType<typeof setTimeout> | null = null;

export function debounceSaveState(state: State) {
  if (timeOut) {
    clearTimeout(timeOut);
  }

  timeOut = setTimeout(() => {
    saveState(state);
  }, 300);
}
