import { store } from '../store/store.js';

export function render() {
  const app = document.getElementById('app');
  const { tasks } = store.getState();

  if (!app) return;

  app.innerHTML = tasks
    .map(
      (task) => `
      <div style="border:1px solid #ccc; margin:10px; padding:10px;">
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Status: ${task.status}</p>
        <p>Helpers: ${task.helpers.length} ${task.helpers.join(', ')}</p>
        <p>Comentários: ${task.comments.length} ${task.comments.map((c) => c.text).join(', ')}</p>

        <button data-action="add-helper" data-id="${task.id}">
          Ajudar
        </button>
      </div>
    `,
    )
    .join('');
}
