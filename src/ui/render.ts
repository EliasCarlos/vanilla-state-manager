import { Status, Task } from '../domain/task.js';
import { store } from '../store/store.js';

export function render() {
  const app = document.getElementById('app');

  if (!app) return;

  const { tasks } = store.getState();

  const columns = {
    pendente: tasks.filter((task) => task.status === 'pendente'),
    emAndamento: tasks.filter((task) => task.status === 'em andamento'),
    concluido: tasks.filter((task) => task.status === 'concluida'),
  };

  function renderColumn(title: string, status: Status, tasks: Task[]) {
    return `
    <div class="column" data-status="${status}">
      <h3>${title}</h3>
      ${tasks.map((task) => renderTask(task, status)).join('')}
    </div>
  `;
  }

  function renderTask(task: Task, currentStatus: Status) {
    return `
    <div class="task" draggable="true" data-id="${task.id}">
      <h3>${task.title}</h3>
      <p>${task.description}</p>

      <p><strong>Ajudantes:</strong> ${task.helpers.length}</p>
      <p><strong>Comentários:</strong> ${task.comments.length}</p>

      <div class="comments">
        <button class="btn" data-action="open-comments" data-id="${task.id}">
          Comentários
        </button>
      </div>

      <div class="actions">
        <button class="btn btn-secondary" data-action="add-helper" data-id="${task.id}">
          Ajudar
        </button>

        <button class="btn btn-secondary" data-action="delete-task" data-id="${task.id}">
          Deletar
        </button>

        ${
          currentStatus !== 'pendente'
            ? `<button class="btn btn-secondary" data-action="move" data-id="${task.id}" data-status="pendente">⬅</button>`
            : ''
        }

        ${
          currentStatus !== 'em andamento'
            ? `<button class="btn btn-secondary" data-action="move" data-id="${task.id}" data-status="em andamento">➡</button>`
            : ''
        }

        ${
          currentStatus !== 'concluida'
            ? `<button class="btn btn-secondary" data-action="move" data-id="${task.id}" data-status="concluida">✔</button>`
            : ''
        }
      </div>
    </div>
  `;
  }

  app.innerHTML = `
  <div class="board">
    ${renderColumn('Pendente', 'pendente', columns.pendente)}
    ${renderColumn('Em andamento', 'em andamento', columns.emAndamento)}
    ${renderColumn('Concluída', 'concluida', columns.concluido)}
  </div>
`;
}
