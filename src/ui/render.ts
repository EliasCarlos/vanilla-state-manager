import { Status, Task } from '../domain/task.js';
import { store } from '../store/store.js';

export function render() {
  const app = document.getElementById('app');
  const modalContainer = document.getElementById('modal-container');

  if (!app || !modalContainer) return;

  const { tasks, ui } = store.getState();

  function getColumnTasks(status: Status) {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.order - b.order);
  }

  const columns = {
    pendente: getColumnTasks('pendente'),
    emAndamento: getColumnTasks('em andamento'),
    concluido: getColumnTasks('concluida'),
  };

  function renderColumn(title: string, status: Status, tasks: Task[]) {
    return `
    <div class="column" data-status="${status}">
      <h3>${title}</h3>
      <div class="column-tasks">
        ${tasks.map((task) => renderTask(task, status)).join('')}
      </div>
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

  function renderModal(taskId: number | null) {
    if (taskId === null) return '';

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return '';

    return `
      <div id="modal" class="modal">
        <div class="modal-content">
          <h3>Comentários</h3>
  
          <div id="modal-comments" class="comments-list">
            ${
              task.comments.length
                ? task.comments
                    .map(
                      (c) => `
              <div class="comment-item">
                <p>${c.text}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                  <div>
                    <p style="font-size: 0.8rem; font-weight: bold; margin: 0;">${c.userId}</p>
                    <span class="comment-date">${new Date(c.createdAt).toLocaleString('pt-BR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</span>
                  </div>
                  <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.7rem;" data-action="remove-comment" data-id="${c.id}">Remover</button>
                </div>
              </div>
            `,
                    )
                    .join('')
                : '<p style="opacity:0.6; text-align: center;">Nenhum comentário ainda</p>'
            }
          </div>
  
          <div class="modal-input-area">
            <input id="modal-input" placeholder="Escreva um comentário..." />
            <button id="modal-add" class="btn" data-action="submit-comment">Adicionar</button>
          </div>
  
          <button id="modal-close" class="btn" data-action="close-modal">Fechar</button>
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

  modalContainer.innerHTML = renderModal(ui.modalTaskId);

  if (ui.modalTaskId) {
    const input = document.getElementById('modal-input') as HTMLInputElement;
    if (input) input.focus();
    const container = document.getElementById('modal-comments');
    if (container) container.scrollTop = container.scrollHeight;
  }
}
