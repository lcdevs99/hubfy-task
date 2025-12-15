import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken, signRefreshToken, verifyPassword } from "@/lib/auth";
import { validateLogin } from "@/lib/middleware";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Credenciais inválidas
 *       422:
 *         description: Dados inválidos
 */

export async function POST(req: Request) {
  const body = await req.json();
  const errors = validateLogin(body);

  if (Object.keys(errors).length) {
    return NextResponse.json(
      { success: false, message: "Dados inválidos", errors },
      { status: 422 }
    );
  }

  const { email, password } = body;
  const user = db.findUserByEmail(email);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { success: false, message: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  const accessToken = signToken({ sub: user.id });
  const refreshToken = signRefreshToken({ sub: user.id });

  return NextResponse.json({
    success: true,
    token: accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email },
  });
}
