import express from 'express';
import type { Request as ExpressReq, Response as ExpressRes } from 'express';

function buildWebRequest(req: ExpressReq): Request {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const headers = new Headers();

  Object.entries(req.headers).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach((val) => headers.append(k, val));
    } else if (v != null) {
      headers.set(k, String(v));
    }
  });

  const authHeader = req.get('authorization');
  if (authHeader) {
    headers.set('authorization', authHeader);
  }

  const method = req.method;
  const hasBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  const body = hasBody ? JSON.stringify(req.body) : undefined;

  return new Request(url, {
    method,
    headers,
    body,
  });
}

async function sendNextResponseToExpress(nextRes: Response, res: ExpressRes) {
  const status = nextRes.status;
  nextRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  const text = await nextRes.text();
  res.status(status).send(text);
}

export function createTestServer() {
  const app = express();

  app.use(express.json());

  const registerHandlers = require('../src/app/api/auth/register/route');
  const loginHandlers = require('../src/app/api/auth/login/route');
  const tasksHandlers = require('../src/app/api/tasks/route');
  const taskItemHandlers = require('../src/app/api/tasks/[id]/route');

  app.post('/api/auth/register', async (req, res) => {
    try {
      const webReq = buildWebRequest(req);
      const nextRes = await registerHandlers.POST(webReq);
      await sendNextResponseToExpress(nextRes, res);
    } catch (err) {
      console.error('Erro em /register:', err);
      res.status(500).json({ success: false, error: 'Internal error' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const webReq = buildWebRequest(req);
      const nextRes = await loginHandlers.POST(webReq);
      await sendNextResponseToExpress(nextRes, res);
    } catch (err) {
      console.error('Erro em /login:', err);
      res.status(500).json({ success: false, error: 'Internal error' });
    }
  });

  app.get('/api/tasks', async (req, res) => {
    const webReq = buildWebRequest(req);
    const nextRes = await tasksHandlers.GET(webReq);
    await sendNextResponseToExpress(nextRes, res);
  });

  app.post('/api/tasks', async (req, res) => {
    const webReq = buildWebRequest(req);
    const nextRes = await tasksHandlers.POST(webReq);
    await sendNextResponseToExpress(nextRes, res);
  });

  app.put('/api/tasks/:id', async (req, res) => {
    const webReq = buildWebRequest(req);
    const nextRes = await taskItemHandlers.PUT(webReq, { params: Promise.resolve({ id: req.params.id }) });
    await sendNextResponseToExpress(nextRes, res);
  });

  app.delete('/api/tasks/:id', async (req, res) => {
    const webReq = buildWebRequest(req);
    const nextRes = await taskItemHandlers.DELETE(webReq, { params: Promise.resolve({ id: req.params.id }) });
    await sendNextResponseToExpress(nextRes, res);
  });

  return app;
}