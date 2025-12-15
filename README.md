# 📋 Sistema de Gestão de Tarefas – Hubfy.ai

## 📌 Sobre o Desafio

Este projeto foi desenvolvido como parte do desafio técnico da **Hubfy.ai**. O objetivo é construir uma aplicação **full stack completa**, do zero, demonstrando domínio em frontend, backend, banco de dados, autenticação, testes e documentação.

A aplicação consiste em um **sistema de gerenciamento de tarefas**, onde usuários autenticados podem criar, listar, atualizar e remover suas próprias tarefas.

---

## 🎯 Objetivo do Projeto

Desenvolver uma aplicação web full stack que inclua:

* Frontend moderno e responsivo
* Backend com API RESTful
* Banco de dados relacional
* Autenticação segura com JWT
* Documentação clara e completa
* Boas práticas de arquitetura e segurança

---

## 🧱 Stack Tecnológica

* **Next.js 16** (App Router)
* **React 19**
* **TypeScript**
* **Tailwind CSS**
* **MySQL 8**
* **Prisma ORM**
* **JWT (JSON Web Token)**
* **Swagger (OpenAPI 3.0)**
* **GitHub Actions (CI)**
* **Vercel (Deploy)**

---

## 🗄️ Banco de Dados

Este projeto **não possui um banco de dados provisionado em nuvem**. A persistência de dados é feita localmente, e o objetivo é demonstrar **modelagem, estrutura e capacidade de integração com MySQL**, não a infraestrutura final.

Foram criadas **duas formas complementares de definição do banco**:

### 📄 `schema.sql`

Arquivo SQL contendo toda a estrutura do banco de dados (DDL), incluindo:

* Criação do banco
* Criação das tabelas `users` e `tasks`
* Índices para otimização
* Chaves estrangeiras garantindo integridade referencial

Esse arquivo permite que qualquer avaliador crie o banco manualmente em um MySQL local.

### 🔁 Prisma ORM (`schema.prisma`)

Além do SQL puro, o projeto utiliza **Prisma ORM** para:

* Abstração do acesso ao banco
* Segurança contra SQL Injection
* Facilidade de manutenção e evolução do schema
* Padronização de queries

### 📌 Observação importante

> O banco **não vem pronto**: o avaliador ou desenvolvedor deve criar o banco localmente utilizando o `schema.sql` ou as migrations do Prisma.

---

## 🔐 Autenticação e Segurança

* Autenticação baseada em **JWT (Bearer Token)**
* Tokens com expiração
* Refresh Token implementado
* Senhas armazenadas com **hash seguro**
* Middleware para proteção de rotas
* Isolamento total de dados entre usuários
* Variáveis sensíveis protegidas via `.env`

---

## 🚀 Funcionalidades

### Autenticação

* Registro de usuário
* Login
* Refresh de token

### Tarefas

* Criar tarefa
* Listar tarefas (com paginação e filtro por status)
* Atualizar tarefa
* Deletar tarefa

---

## 🧪 Testes

* Testes de integração da API (em progresso)
* Validação de fluxos críticos:

  * Registro
  * Login
  * Autorização
  * CRUD de tarefas

> 🎯 Meta: Cobertura mínima de 60% dos endpoints
# Rodar todos os testes (backend + frontend)
npm test

# Rodar apenas os testes do backend
npm run test:backend

# Rodar apenas os testes do frontend
npm run test:frontend

# Rodar testes em modo watch (útil durante o desenvolvimento)
npm run test:watch

---

## 📦 Estrutura de Pastas (simplificada)

```
src/
├── app/
│   └── api/
│       ├── auth/
│       └── tasks/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── middleware.ts
├── database/
│   └── schema.prisma
    └── schema.sql
├── swagger/
│   └── swagger.ts
```

---

## ⚙️ Instalação e Execução

### Pré-requisitos

* Node.js 18+
* MySQL 8+

### Passos

```bash
# Instalar dependências
npm install

# Rodar migrations (Prisma)
npx prisma migrate dev

# Rodar o projeto
npm run dev
```

---

## 📚 Documentação da API

A API está documentada utilizando **Swagger (OpenAPI 3.0)**.

* Ambiente local: `http://localhost:3000/docs`

---

## 🛠️ CI/CD

* **CI** configurado com GitHub Actions
* Execução automática de lint e build em PRs
* **Deploy automático** via Vercel

---

## 🧠 Decisões Técnicas

### Status inicial das tarefas

Todas as tarefas são criadas **sempre com o status `pending`** por padrão. Essa decisão foi tomada para:

* Garantir previsibilidade no fluxo de criação
* Evitar inconsistências causadas por inputs inválidos no momento da criação
* Simplificar a regra de negócio inicial

Após a criação, as tarefas são listadas no dashboard do usuário, onde ele pode **alterar o status manualmente** para:

* `in_progress`
* `completed`

Essa mudança é feita através de ações explícitas na interface (ex: botão ou seletor de status), o que deixa a experiência mais clara e controlada.

### Isolamento de dados por usuário

Todas as operações de tarefas validam o usuário autenticado via JWT, garantindo que:

* Um usuário só consiga visualizar suas próprias tarefas
* Não seja possível editar ou deletar tarefas de outros usuários

### Uso de Prisma + schema.sql

Foi adotada uma abordagem híbrida:

* `schema.sql` para documentação clara da modelagem e criação manual do banco
* Prisma ORM para acesso seguro aos dados, abstração de queries e facilidade de manutenção

Essa decisão permite flexibilidade para diferentes ambientes e facilita a avaliação técnica.

---

## 🔮 Melhorias Futuras

* Finalizar cobertura completa de testes
* Ordenação de tarefas
* Deploy do banco em ambiente cloud
* Rate limiting
* Logs estruturados

---

### Trabalho com Git e histórico de commits

O projeto foi desenvolvido inicialmente **de forma local** e, posteriormente, versionado e enviado para o **GitHub**. Por esse motivo, o repositório pode apresentar uma quantidade menor de commits do que um projeto desenvolvido desde o início diretamente no repositório remoto.

Ressalto que possuo **4 anos de experiência prática** utilizando **GitHub, GitLab e Azure DevOps**, trabalhando com controle de versão, branches, pull requests, code review e integração contínua (CI).

Essa abordagem de iniciar o desenvolvimento localmente permitiu maior foco na arquitetura e nas regras de negócio antes da publicação do código, mantendo um histórico de commits mais limpo e organizado.

---

## 👨‍💻 Autor

Projeto desenvolvido como desafio técnico, seguindo boas práticas de desenvolvimento full stack.
