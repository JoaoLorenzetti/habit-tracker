# 🎯 Habit Tracker API

> API RESTful para rastreamento de hábitos diários com streak, calendário de progresso e estatísticas semanais.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-teal?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)

> 🚧 **Em desenvolvimento** — projeto construído com commits diários.

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 20+ |
| Linguagem | TypeScript 5.3 |
| Framework | Express.js |
| ORM | Prisma 5 |
| Banco de Dados | PostgreSQL |
| Autenticação | JWT + bcryptjs |
| Validação | Zod |
| Testes | Jest + ts-jest |
| Documentação | Swagger / OpenAPI 3.0 |

---

## 🚀 Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/JoaoLorenzetti/habit-tracker.git
cd habit-tracker

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute as migrations
npm run prisma:migrate

# Inicie o servidor
npm run dev
```

---

## 📁 Estrutura do Projeto

```
habit-tracker/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.ts
│   └── index.ts
└── tests/
```

---

> README será atualizado conforme o projeto evolui.
