export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
};

type DbStore = {
  users: User[];
  tasks: Task[];
  userIdCounter: number;
  taskIdCounter: number;
};

declare global {
  var __db: DbStore | undefined;
}

if (!globalThis.__db) {
  globalThis.__db = {
    users: [],
    tasks: [],
    userIdCounter: 1,
    taskIdCounter: 1,
  };
}

const store = globalThis.__db!;

export const db = {
  findUserByEmail: (email: string): User | undefined =>
    store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()),

  createUser: ({ name, email, passwordHash }: Omit<User, "id">): User => {
    const user: User = {
      id: String(store.userIdCounter++),
      name,
      email,
      passwordHash,
    };
    store.users.push(user);
    return user;
  },

  listTasksByUser: (
    userId: string,
    opts?: { offset: number; limit: number }
  ): Task[] => {
    const userTasks = store.tasks.filter((t) => t.userId === userId);
    if (opts) {
      return userTasks.slice(opts.offset, opts.offset + opts.limit);
    }
    return userTasks;
  },

  countTasksByUser: (userId: string): number =>
    store.tasks.filter((t) => t.userId === userId).length,

  createTask: ({
    userId,
    title,
    description,
    status,
  }: Omit<Task, "id" | "createdAt" | "updatedAt">): Task => {
    const now = new Date().toISOString();
    const task: Task = {
      id: String(store.taskIdCounter++),
      userId,
      title,
      description: description || "",
      status: status || "pending",
      createdAt: now,
      updatedAt: now,
    };
    store.tasks.push(task);
    return task;
  },

  findTaskById: (id: string): Task | undefined =>
    store.tasks.find((t) => t.id === id),

  updateTask: (
    id: string,
    data: Partial<Omit<Task, "id" | "userId" | "createdAt">>
  ): Task | null => {
    const idx = store.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    store.tasks[idx] = {
      ...store.tasks[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return store.tasks[idx];
  },

  deleteTask: (id: string): boolean => {
    const idx = store.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    store.tasks.splice(idx, 1);
    return true;
  },

  _reset: (): void => {
    store.users = [];
    store.tasks = [];
    store.userIdCounter = 1;
    store.taskIdCounter = 1;
  },
};