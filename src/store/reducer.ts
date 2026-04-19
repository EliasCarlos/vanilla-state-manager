import { State, Status, Task } from '../domain/task.js';

export type Action =
  | { type: 'CREATE_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { taskId: number; status: Status; userId: string } }
  | { type: 'ADD_HELPER'; payload: { taskId: number; userId: string } }
  | { type: 'ADD_COMMENT'; payload: { taskId: number; userId: string; text: string } }
  | { type: 'DELETE_TASK'; payload: { taskId: number; userId: string } };

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'CREATE_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t: Task) =>
          t.id === action.payload.taskId
            ? { ...t, status: action.payload.status, updatedAt: new Date() }
            : t,
        ),
      };

    case 'ADD_HELPER':
      return {
        ...state,
        tasks: state.tasks.map((t: Task) =>
          t.id === action.payload.taskId
            ? { ...t, helpers: [...t.helpers, action.payload.userId], updatedAt: new Date() }
            : t,
        ),
      };

    case 'ADD_COMMENT':
      return {
        ...state,
        tasks: state.tasks.map((t: Task) =>
          t.id === action.payload.taskId
            ? {
                ...t,
                comments: [
                  ...t.comments,
                  {
                    userId: action.payload.userId,
                    text: action.payload.text,
                    createdAt: new Date(),
                  },
                ],
                updatedAt: new Date(),
              }
            : t,
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t: Task) => t.id !== action.payload.taskId),
      };

    default:
      return state;
  }
}
