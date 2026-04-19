import { addHelper, createTask } from '../index.js';

export function setupEvents() {
  const titleInput = document.getElementById('title') as HTMLInputElement;
  const descriptionInput = document.getElementById('description') as HTMLInputElement;

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
  });
}
