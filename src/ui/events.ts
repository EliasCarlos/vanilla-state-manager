import { Status } from '../domain/task.js';
import { addComment, addHelper, createTask, deleteTask, updateTask } from '../index.js';

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
      const id = Number(target.dataset.id);
      addHelper(id, 'user2');
    }

    if (target.dataset.action === 'complete-task') {
      const id = Number(target.dataset.id);
      updateTask(id, 'concluida', 'user1');
    }

    if (target.dataset.action === 'delete-task') {
      const id = Number(target.dataset.id);
      deleteTask(id, 'user1');
    }

    if (target.dataset.action === 'add-comment') {
      const id = Number(target.dataset.id);
      const commentInput = document.getElementById(`comment-${id}`) as HTMLInputElement;
      const comment = commentInput.value;
      addComment(id, 'user1', comment);

      commentInput.value = '';
    }

    if (target.dataset.action === 'move') {
      const id = Number(target.dataset.id);
      const status = target.dataset.status as Status;
      updateTask(id, status, 'user1');
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
  });

  document.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  document.addEventListener('drop', (e) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const column = target.closest('.column') as HTMLElement;

    if (column && draggedTaskId !== null) {
      const newStatus = column.dataset.status as Status;
      updateTask(draggedTaskId, newStatus, 'user1');
      draggedTaskId = null;
    }
  });
}
