import { Status } from '../domain/task.js';
import { addComment, addHelper, createTask, deleteTask, findTask, updateTask } from '../index.js';

export function setupEvents() {
  const titleInput = document.getElementById('title') as HTMLInputElement;
  const descriptionInput = document.getElementById('description') as HTMLInputElement;

  let draggedTaskId: number | null = null;
  let modalTaskId: number | null = null;

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

    if (target.dataset.action === 'delete-task') {
      const id = Number(target.dataset.id);
      deleteTask(id, 'user1');
    }

    if (target.dataset.action === 'move') {
      const id = Number(target.dataset.id);
      const status = target.dataset.status as Status;
      updateTask(id, status, 'user1');
    }

    if (target.dataset.action === 'open-comments') {
      const id = Number(target.dataset.id);
      openModal(id);
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

  function openModal(taskId: number) {
    const modal = document.getElementById('modal')!;
    const commentsContainer = document.getElementById('modal-comments')!;

    const task = findTask(taskId);

    modalTaskId = taskId;

    commentsContainer.innerHTML = task.comments.length
      ? task.comments
          .map(
            (c) => `
        <div class="comment-item">
          <p>${c.text}</p>
          <p><strong>Autor:</strong> ${c.userId}</p>
          <span class="comment-date">${new Date(c.createdAt).toLocaleString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}</span>
        </div>
      `,
          )
          .join('')
      : '<p style="opacity:0.6;">Nenhum comentário ainda</p>';

    modal.classList.remove('hidden');

    const input = document.getElementById('modal-input') as HTMLInputElement;
    input.value = '';
    input.focus();

    commentsContainer.scrollTop = commentsContainer.scrollHeight;
  }

  document.getElementById('modal-close')?.addEventListener('click', () => {
    document.getElementById('modal')?.classList.add('hidden');
  });

  document.getElementById('modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      document.getElementById('modal')?.classList.add('hidden');
    }
  });

  const handleAddComment = () => {
    const input = document.getElementById('modal-input') as HTMLInputElement;

    if (!input.value.trim() || modalTaskId === null) return;

    addComment(modalTaskId, 'user1', input.value);
    input.value = '';

    openModal(modalTaskId);
  };

  document.getElementById('modal-add')?.addEventListener('click', handleAddComment);

  document.getElementById('modal-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleAddComment();
    }
  });
}
