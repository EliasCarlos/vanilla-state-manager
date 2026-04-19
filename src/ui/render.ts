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

        <div class="comments">
          <input type="text" placeholder="Comentário" id="comment-${task.id}" />
          <button data-action="add-comment" data-id="${task.id}">
            Adicionar
          </button>
        </div>

        <div class="actions">
          <button data-action="add-helper" data-id="${task.id}">
            Ajudar
          </button>
          <button data-action="complete-task" data-id="${task.id}">
            Concluir
          </button>
          <button data-action="delete-task" data-id="${task.id}">
            Deletar
          </button>
        </div>
      </div>
    `,
    )
    .join('');
}
