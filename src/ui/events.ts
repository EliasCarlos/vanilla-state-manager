import { Status } from '../domain/task.js';
import {
  addComment,
  addHelper,
  createTask,
  deleteTask,
  removeComment,
  updateTask,
} from '../index.js';
import { store } from '../store/store.js';

export function setupEvents() {
  const titleInput = document.getElementById('title') as HTMLInputElement;
  const descriptionInput = document.getElementById('description') as HTMLInputElement;

  let draggedTaskId: number | null = null;

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    if (target.dataset.action === 'create-task') {
      const title = titleInput.value;
      const description = descriptionInput.value;

      if (!title.trim() || !description.trim()) return;

      createTask(title, description, 'user1');
      titleInput.value = '';
      descriptionInput.value = '';
    }

    if (target.dataset.action === 'add-helper') {
      addHelper(Number(target.dataset.id), 'user2');
    }
    if (target.dataset.action === 'delete-task') {
      deleteTask(Number(target.dataset.id), 'user1');
    }

    if (target.dataset.action === 'move') {
      updateTask(Number(target.dataset.id), target.dataset.status as Status, 'user1');
    }
    if (target.dataset.action === 'open-comments') {
      store.dispatch({ type: 'OPEN_MODAL', payload: { taskId: Number(target.dataset.id) } });
    }

    if (target.dataset.action === 'close-modal') {
      store.dispatch({ type: 'CLOSE_MODAL' });
    }
    if (target.id === 'modal') {
      store.dispatch({ type: 'CLOSE_MODAL' });
    }

    if (target.dataset.action === 'remove-comment') {
      const { ui } = store.getState();
      if (ui.modalTaskId) {
        removeComment(ui.modalTaskId, 'user1', Number(target.dataset.id));
      }
    }

    if (target.dataset.action === 'submit-comment') {
      handleAddComment();
    }
  });

  const handleAddComment = () => {
    const { ui } = store.getState();
    const input = document.getElementById('modal-input') as HTMLInputElement;

    if (!input || !input.value.trim() || !ui.modalTaskId) return;

    addComment(ui.modalTaskId, 'user1', input.value);
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const { ui } = store.getState();
      const input = document.activeElement as HTMLElement;
      if (ui.modalTaskId && input.id === 'modal-input') {
        handleAddComment();
      }
    }
  });

  document.addEventListener('dragstart', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('task')) {
      draggedTaskId = Number(target.dataset.id);
      target.classList.add('dragging');
    }
  });

  document.addEventListener('dragend', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('task')) {
      target.classList.remove('dragging');
    }
    document.querySelectorAll('.column').forEach((c) => c.classList.remove('drag-over'));
  });

  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    const column = (e.target as HTMLElement).closest('.column');
    document.querySelectorAll('.column').forEach((c) => c.classList.remove('drag-over'));
    if (column) column.classList.add('drag-over');
  });

  document.addEventListener('dragleave', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('column')) {
      target.classList.remove('drag-over');
    }
  });

  document.addEventListener('drop', (e) => {
    e.preventDefault();
    document.querySelectorAll('.column').forEach((c) => c.classList.remove('drag-over'));

    const target = e.target as HTMLElement;
    const column = target.closest('.column') as HTMLElement;
    const targetTaskEl = target.closest('.task') as HTMLElement;

    if (!column || draggedTaskId === null) return;

    const newStatus = column.dataset.status as Status;
    const { tasks } = store.getState();

    const movingTask = tasks.find((t) => t.id === draggedTaskId);
    if (!movingTask) return;

    const tasksInColumn = tasks
      .filter((t) => t.status === newStatus && t.id !== draggedTaskId)
      .sort((a, b) => a.order - b.order);

    let newIndex = tasksInColumn.length;

    if (targetTaskEl) {
      const targetId = Number(targetTaskEl.dataset.id);
      const index = tasksInColumn.findIndex((t) => t.id === targetId);
      if (index !== -1) {
        newIndex = index;
      }
    }

    tasksInColumn.splice(newIndex, 0, {
      ...movingTask,
      status: newStatus,
    });

    const reordered = tasksInColumn.map((t, index) => ({
      ...t,
      order: index,
    }));

    store.dispatch({
      type: 'REORDER_TASKS',
      payload: { updatedTasks: reordered },
    });

    draggedTaskId = null;
  });
}
