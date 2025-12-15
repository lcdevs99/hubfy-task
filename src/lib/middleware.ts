const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type TaskStatus = "pending" | "in_progress" | "completed";

export type TaskCreateBody = {
  title: string;
  description?: string;
  status?: TaskStatus;
};

export type TaskUpdateBody = {
  title?: string;
  description?: string;
  status?: TaskStatus;
};

export const validateRegister = (body: RegisterBody) => {
  const errors: Record<string, string> = {};
  if (!body.name || body.name.trim().length < 2) {
    errors.name = "Nome deve ter ao menos 2 caracteres";
  }
  if (!body.email || !emailRegex.test(body.email)) {
    errors.email = "Email inválido";
  }
  if (!body.password || !strongPasswordRegex.test(body.password)) {
    errors.password =
      "Senha deve ter 8+ caracteres, com maiúscula, minúscula, número e símbolo";
  }
  return errors;
};

export const validateLogin = (body: LoginBody) => {
  const errors: Record<string, string> = {};

  if (!body.email || body.email.trim().length === 0) {
    errors.email = "E-mail é obrigatório";
  } else if (!emailRegex.test(body.email)) {
    errors.email = "E-mail inválido";
  }

  if (!body.password || !strongPasswordRegex.test(body.password)) {
    errors.password =
      "Senha deve ter 8+ caracteres, com maiúscula, minúscula, número e símbolo";
  }

  return errors;
};

const allowedStatuses: TaskStatus[] = ["pending", "in_progress", "completed"];

export const validateTaskCreate = (body: TaskCreateBody) => {
  const errors: Record<string, string> = {};
  if (!body.title || body.title.trim().length < 2) {
    errors.title = "Título deve ter ao menos 2 caracteres";
  }
  if (body.description && typeof body.description !== "string") {
    errors.description = "Descrição deve ser texto";
  }
  if (body.status && !allowedStatuses.includes(body.status)) {
    errors.status = `Status deve ser um de: ${allowedStatuses.join(", ")}`;
  }
  return errors;
};

export const validateTaskUpdate = (body: TaskUpdateBody) => {
  const errors: Record<string, string> = {};
  if (body.title && body.title.trim().length < 2) {
    errors.title = "Título deve ter ao menos 2 caracteres";
  }
  if (body.description && typeof body.description !== "string") {
    errors.description = "Descrição deve ser texto";
  }
  if (body.status && !allowedStatuses.includes(body.status)) {
    errors.status = `Status deve ser um de: ${allowedStatuses.join(", ")}`;
  }
  return errors;
};