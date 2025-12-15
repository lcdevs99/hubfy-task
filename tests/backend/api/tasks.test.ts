import request from 'supertest';
import { createTestServer } from '../../../test-utils/createTestServer';
import { resetDb } from '../../../test-utils/resetDb';
import type { Express } from "express"; // importa o tipo certo



async function registerAndLogin(app: Express, email: string) {
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'User', email, password: 'Senha@123' });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email, password: 'Senha@123' });

  return loginRes.body.token as string;
}

describe('Tasks API', () => {
  let app: Express;

  beforeEach(() => {
    resetDb();
    app = createTestServer();
  });

  it('deve criar e listar tarefas do usuário autenticado', async () => {
    const token = await registerAndLogin(app, 'u1@test.com');

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tarefa 1', description: 'Descrição', status: 'pending' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.task.title).toBe('Tarefa 1');

    const listRes = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.success).toBe(true);
    expect(Array.isArray(listRes.body.tasks)).toBe(true);
    expect(listRes.body.tasks.length).toBe(1);
    expect(listRes.body.tasks[0].title).toBe('Tarefa 1');
  });

  it('deve atualizar status de uma tarefa do usuário', async () => {
    const token = await registerAndLogin(app, 'u2@test.com');

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tarefa 2', description: 'Desc', status: 'pending' });

    const taskId = createRes.body.task.id;

    const updateRes = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.task.status).toBe('completed');
  });

  it('deve deletar uma tarefa do usuário', async () => {
    const token = await registerAndLogin(app, 'u3@test.com');

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tarefa 3' });

    const taskId = createRes.body.task.id;

    const delRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);
  });

  it('deve garantir isolamento entre usuários (403)', async () => {
    const tokenA = await registerAndLogin(app, 'a@test.com');
    const tokenB = await registerAndLogin(app, 'b@test.com');

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Privada A' });

    const taskId = createRes.body.task.id;

    const tryUpdate = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ status: 'completed' });

    expect(tryUpdate.status).toBe(403);
    expect(tryUpdate.body.success).toBe(false);

    const tryDelete = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(tryDelete.status).toBe(403);
    expect(tryDelete.body.success).toBe(false);
  });

  it('deve rejeitar acesso sem token (401)', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('deve rejeitar token inválido (401)', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', 'Bearer token_invalido');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});