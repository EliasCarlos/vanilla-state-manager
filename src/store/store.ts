import { State, Task } from '../domain/task.js';
import { Action, reducer } from './reducer.js';
import { debounceSaveState, loadState } from './storage.js';

export const store = {
  state:
    loadState() ||
    ({
      tasks: [],
      ui: { modalTaskId: null },
    } as State),

  listeners: [] as Array<(newState: State, prevState: State) => void>,

  getState() {
    return this.state;
  },

  dispatch(action: Action) {
    const prevState = this.state;
    this.state = reducer(this.state, action);
    debounceSaveState(this.state);
    this.listeners.forEach((listener) => listener(this.state, prevState));
  },

  subscribe(listener: (newState: State, prevState: State) => void) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },
};
