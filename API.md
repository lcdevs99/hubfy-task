 Autenticação
POST /api/auth/register

Registra um novo usuário no sistema.

Request Body
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "12345678"
}

 Regras

Email deve ser único

Senha deve conter no mínimo 8 caracteres

Email deve ter formato válido

 Response — 201 Created
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com"
  }
}

 Possíveis erros
Status	Descrição
409	Email já está em uso
422	Dados inválidos
POST /api/auth/login

Autentica um usuário existente.

 Request Body
{
  "email": "joao@email.com",
  "password": "12345678"
}

 Response — 200 OK
{
  "success": true,
  "token": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com"
  }
}

 Possíveis erros
Status	Descrição
401	Credenciais inválidas
422	Dados inválidos
POST /api/auth/refresh

Gera um novo access token a partir de um refresh token válido.

 Request Body
{
  "refreshToken": "jwt_refresh_token"
}

 Response — 200 OK
{
  "accessToken": "novo_jwt_access_token"
}

 Possíveis erros
Status	Descrição
401	Refresh token inválido ou expirado
 Tarefas (Rotas Protegidas)

Todas as rotas abaixo exigem o header:

Authorization: Bearer {token}


Todas as tarefas pertencem exclusivamente ao usuário autenticado.

GET /api/tasks

Lista as tarefas do usuário autenticado.

 Query Params (opcional)
Parâmetro	Tipo	Descrição
page	number	Página atual
limit	number	Itens por página
status	string	pending | in_progress | completed
 Response — 200 OK
{
  "success": true,
  "tasks": [
    {
      "id": 1,
      "title": "Minha tarefa",
      "description": "Descrição",
      "status": "pending"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 10,
    "totalPages": 2
  }
}

 Possíveis erros
Status	Descrição
401	Usuário não autenticado
POST /api/tasks

Cria uma nova tarefa.

As tarefas são criadas sempre com status inicial pending.

 Request Body
{
  "title": "Nova tarefa",
  "description": "Descrição da tarefa"
}

 Response — 201 Created
{
  "success": true,
  "task": {
    "id": 1,
    "title": "Nova tarefa",
    "description": "Descrição da tarefa",
    "status": "pending"
  }
}

 Possíveis erros
Status	Descrição
401	Usuário não autenticado
422	Dados inválidos
PUT /api/tasks/{id}

Atualiza uma tarefa existente.

 Path Param
Nome	Tipo
id	number
 Request Body (campos opcionais)
{
  "title": "Título atualizado",
  "description": "Nova descrição",
  "status": "in_progress"
}

 Response — 200 OK
{
  "success": true,
  "task": {
    "id": 1,
    "title": "Título atualizado",
    "status": "in_progress"
  }
}

 Possíveis erros
Status	Descrição
401	Não autenticado
403	Acesso negado
404	Tarefa não encontrada
422	Dados inválidos
DELETE /api/tasks/{id}

Remove uma tarefa do usuário autenticado.

 Response — 200 OK
{
  "success": true,
  "message": "Tarefa deletada com sucesso"
}

 Possíveis erros
Status	Descrição
401	Não autenticado
403	Acesso negado
404	Tarefa não encontrada
 Swagger (OpenAPI)

A API também está documentada via Swagger UI, permitindo testes interativos dos endpoints.

Ambiente local:
http://localhost:3000/docs