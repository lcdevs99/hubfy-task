import request from "supertest";
import { createTestServer } from "../../../test-utils/createTestServer";
import { resetDb } from "../../../test-utils/resetDb";
import type { Express } from "express"; // 🔑 importa o tipo do Express

describe("Auth API", () => {
  let app: Express; // ✅ tipado corretamente

  beforeEach(() => {
    resetDb();
    app = createTestServer();
  });

  it("deve registrar um novo usuário", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Lucas", email: "lucas@test.com", password: "Senha@123" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe("lucas@test.com");
  });

  it("deve impedir email duplicado", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Lucas", email: "lucas@test.com", password: "Senha@123" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Outro", email: "lucas@test.com", password: "Senha@123" });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("deve fazer login com credenciais válidas e retornar token", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Lucas", email: "lucas@test.com", password: "Senha@123" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "lucas@test.com", password: "Senha@123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe("lucas@test.com");
  });

  it("deve rejeitar login com credenciais inválidas", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "naoexiste@test.com", password: "Senha@123" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});