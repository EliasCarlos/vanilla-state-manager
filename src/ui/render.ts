import { store } from '../store/store.js';

export function render() {
  const app = document.getElementById('app');
  const { tasks } = store.getState();

  if (!app) return;

  app.innerHTML = tasks
    .map(
      (task) => `
      <div class="task">
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Status: ${task.status}</p>
        <p><strong>Helpers:</strong> ${task.helpers.length} ${task.helpers.join(', ') || 'Nenhum'}</p>
        <p><strong>Comentários:</strong> ${task.comments.length} ${task.comments.map((c) => c.text).join(', ') || 'Nenhum'}</p>

        <div class="actions">
          <button data-action="add-helper" data-id="${task.id}">
            Ajudar
          </button>
          <button data-action="complete-task" data-id="${task.id}">
            Concluir
          </button>
        </div>
      </div>
    `,
    )
    .join('');
}
