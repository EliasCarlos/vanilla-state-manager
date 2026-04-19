# 🧠 Vanilla State Manager

### 🚀 Mini Trello com JavaScript puro (sem frameworks)


---

## 🎥 Preview

> ⚠️ Adicione um GIF aqui (altamente recomendado)

```md
![demo](./demo.gif)
```

---

## 💡 Ideia

Este projeto é um **mini Trello** construído com **JavaScript puro**, com o objetivo de demonstrar:

- Como funciona um **state manager por baixo dos panos**
- Como gerenciar UI sem frameworks
- Como estruturar um projeto frontend de forma escalável

---

## ✨ O que você pode fazer

- 📝 Criar tarefas
- 📦 Organizar em colunas (Kanban)
- 🖱️ Arrastar tasks entre colunas (drag and drop)
- 👥 Adicionar helpers
- 💬 Gerenciar comentários via modal
- 🗑️ Deletar tarefas
- 💾 Persistência automática no navegador

---

## 🧠 Arquitetura (o diferencial)

Inspirado em **Redux + Clean Architecture**

```bash
src/
├── domain/    # regras de negócio
├── store/     # estado global (store + reducer)
├── ui/        # render + eventos
└── index.ts
```

### 🔄 Fluxo de dados

```text
UI → dispatch → reducer → state → render
```

👉 Sem magia. Sem framework. Controle total.

---

## 🔥 Destaques técnicos

- ⚙️ State manager customizado
- 🧩 Separação clara de responsabilidades
- 🧠 Arquitetura escalável
- 🖱️ Drag and drop nativo (sem libs)
- 💾 Persistência com debounce
- 💬 Modal dinâmico de comentários
- 📦 Código organizado e modular

---

## ⚔️ Por que isso importa?

A maioria dos projetos usa frameworks.

Este projeto mostra que eu sei:

- Como frameworks funcionam internamente
- Como gerenciar estado manualmente
- Como construir aplicações sem abstrações

👉 Isso demonstra **base sólida de frontend**

---

## 🛠️ Stack

- TypeScript
- JavaScript (Vanilla)
- HTML5
- CSS3

---

## ▶️ Como rodar

```bash
npm install
npm run build
npm start
```

Abra:

```text
http://localhost:3000
```

---

## 📈 Próximos passos

- [x] Reordenar tasks dentro da coluna (drag avançado)
- [ ] Sistema de usuários
- [ ] Backend (API Node.js)
- [ ] Deploy online
- [ ] Melhorias de UX

---

## 👨‍💻 Autor

Elias Carlos

---

## 📄 Licença

MIT
