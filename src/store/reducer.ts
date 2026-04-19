import { State, Status, Task, TaskComment } from '../domain/task.js';

export type Action =
  | { type: 'CREATE_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { taskId: number; status: Status; userId: string } }
  | { type: 'ADD_HELPER'; payload: { taskId: number; userId: string } }
  | {
      type: 'ADD_COMMENT';
      payload: { taskId: number; userId: string; text: string; commentId: number };
    }
  | { type: 'REMOVE_COMMENT'; payload: { taskId: number; userId: string; commentId: number } }
  | { type: 'DELETE_TASK'; payload: { taskId: number; userId: string } }
  | { type: 'OPEN_MODAL'; payload: { taskId: number } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'REORDER_TASKS'; payload: { updatedTasks: Task[] } };

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
                    id: action.payload.commentId,
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

    case 'REMOVE_COMMENT':
      return {
        ...state,
        tasks: state.tasks.map((t: Task) =>
          t.id === action.payload.taskId
            ? {
                ...t,
                comments: t.comments.filter((c: TaskComment) => c.id !== action.payload.commentId),
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

    case 'OPEN_MODAL':
      return {
        ...state,
        ui: { ...state.ui, modalTaskId: action.payload.taskId },
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        ui: { ...state.ui, modalTaskId: null },
      };

    case 'REORDER_TASKS':
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          const updated = action.payload.updatedTasks.find((u) => u.id === t.id);
          return updated ? updated : t;
        }),
      };

    default:
      return state;
  }
}
