import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { validateTaskUpdate } from '@/lib/middleware';

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Atualizar uma tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *       400:
 *         description: ID não fornecido
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Tarefa não encontrada
 *       422:
 *         description: Dados inválidos
 *
 *   delete:
 *     summary: Deletar uma tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa deletada com sucesso
 *       400:
 *         description: ID não fornecido
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Tarefa não encontrada
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'ID não fornecido' },
      { status: 400 }
    );
  }

  const auth = requireAuth(req);
  if (auth.error) {
    return NextResponse.json(
      { success: false, message: auth.error },
      { status: 401 }
    );
  }

  const task = db.findTaskById(id);

  if (!task) {
    return NextResponse.json(
      { success: false, message: 'Tarefa não encontrada' },
      { status: 404 }
    );
  }

  if (String(task.userId) !== String(auth.userId)) {
    return NextResponse.json(
      { success: false, message: 'Acesso negado' },
      { status: 403 }
    );
  }

  const body = await req.json();
  const errors = validateTaskUpdate(body);

  if (Object.keys(errors).length) {
    return NextResponse.json(
      { success: false, message: 'Dados inválidos', errors },
      { status: 422 }
    );
  }

  const updated = db.updateTask(task.id, body);

  return NextResponse.json({ success: true, task: updated });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'ID não fornecido' },
      { status: 400 }
    );
  }

  const auth = requireAuth(req);

  if (auth.error) {
    return NextResponse.json(
      { success: false, message: auth.error },
      { status: 401 }
    );
  }

  const task = db.findTaskById(id);

  if (!task) {
    return NextResponse.json(
      { success: false, message: 'Tarefa não encontrada' },
      { status: 404 }
    );
  }

  if (String(task.userId) !== String(auth.userId)) {
    return NextResponse.json(
      { success: false, message: 'Acesso negado' },
      { status: 403 }
    );
  }

  db.deleteTask(task.id);

  return NextResponse.json({
    success: true,
    message: 'Tarefa deletada com sucesso',
  });
}
