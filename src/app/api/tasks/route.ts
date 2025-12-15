import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { validateTaskCreate } from '@/lib/middleware';

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Listar tarefas do usuário
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página atual
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Quantidade de itens por página
 *       - name: status
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed, all]
 *         description: Filtro por status da tarefa
 *     responses:
 *       200:
 *         description: Lista de tarefas com paginação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     total:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *       401:
 *         description: Não autenticado
 *
 *   post:
 *     summary: Criar uma nova tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Estudar Swagger
 *               description:
 *                 type: string
 *                 example: Documentar todas as rotas da API
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *       401:
 *         description: Não autenticado
 *       422:
 *         description: Dados inválidos
 */
export async function GET(req: Request) {
  const auth = requireAuth(req);

  if (auth.error || !auth.userId) {
    return NextResponse.json(
      { success: false, message: auth.error || 'Usuário não autenticado' },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  let page = parseInt(url.searchParams.get("page") || "1", 10);
  let limit = parseInt(url.searchParams.get("limit") || "5", 10);
  const status = url.searchParams.get("status");

  if (page < 1) page = 1;
  if (limit < 1) limit = 5;

  const offset = (page - 1) * limit;

  let allTasks = db.listTasksByUser(auth.userId);

  if (status && status !== "all") {
    allTasks = allTasks.filter((t) => t.status === status);
  }

  const total = allTasks.length;
  const tasks = allTasks.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: Request) {
  const auth = requireAuth(req);

  if (auth.error || !auth.userId) {
    return NextResponse.json(
      { success: false, message: auth.error || 'Usuário não autenticado' },
      { status: 401 }
    );
  }

  const body = await req.json();
  const errors = validateTaskCreate(body);

  if (Object.keys(errors).length) {
    return NextResponse.json(
      { success: false, message: 'Dados inválidos', errors },
      { status: 422 }
    );
  }

  const task = db.createTask({ userId: auth.userId, ...body });

  return NextResponse.json({ success: true, task }, { status: 201 });
}
