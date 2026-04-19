import { Status, Task, User } from '../domain/task.js';
import { Action, reducer } from './reducer.js';

type State = {
  tasks: Task[];
  user?: User;
  filter: Status | 'todas';
};

export const actionsHistory: Action[] = [];

export const store = {
  state: {
    tasks: [],
    user: {} as User,
    filter: 'todas',
  } as State,

  listeners: [] as Array<(newState: State, prevState: State) => void>,

  getState() {
    return this.state;
  },

  dispatch(action: Action) {
    actionsHistory.push(action);
    const prevState = this.state;
    this.state = reducer(this.state, action);
    this.listeners.forEach((listener) => listener(this.state, prevState));
  },

  subscribe(listener: (newState: State, prevState: State) => void) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },
};
