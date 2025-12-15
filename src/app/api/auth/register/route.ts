import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { validateRegister } from '@/lib/middleware';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registro de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: "Teste123@"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       409:
 *         description: Email já está em uso
 *       422:
 *         description: Dados inválidos
 */

export async function POST(req: Request) {

  const body = await req.json();

  const errors = validateRegister(body);

  if (Object.keys(errors).length) {
    return NextResponse.json(
      { success: false, message: 'Dados inválidos', errors },
      { status: 422 }
    );
  }

  const { name, email, password } = body;

  const existing = db.findUserByEmail(email);

  if (existing) {
    return NextResponse.json(
      { success: false, message: 'Email já está em uso' },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const user = db.createUser({ name, email, passwordHash });

  return NextResponse.json(
    {
      success: true,
      message: 'Usuário registrado com sucesso',
      user: { id: user.id, name: user.name, email: user.email }
    },
    { status: 201 }
  );
}
