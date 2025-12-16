"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Task } from "@/lib/db";
import toast from "react-hot-toast";

const statusLabels: Record<Task["status"], string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  completed: "Finalizada",
};

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState<
    "all" | "pending" | "in_progress" | "completed"
  >("all");

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  function showSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  function showError(msg: string) {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  }

  function handleAuthError(message: string) {
    if (message.includes("Token inválido") || message.includes("expirado")) {
      localStorage.removeItem("token");
      router.push("/login");
    } else {
      showError(message);
    }
  }

  const PAGE_SIZE = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchTasks(token, page, filter);
    }
  }, [filter, page]);

  async function fetchTasks(
    token: string,
    pageNumber: number,
    statusFilter: string
  ) {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/tasks?page=${pageNumber}&limit=${PAGE_SIZE}&status=${statusFilter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setTasks(data.tasks);
        const newPage = Math.min(
          data.pagination.page,
          data.pagination.totalPages
        );
        setPage(newPage);

        setTotalPages(data.pagination.totalPages);
      } else {
        handleAuthError(data.message || "Erro ao carregar tarefas");
      }
    } catch {
      showError("Erro de conexão com servidor");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      showError("Título da tarefa é obrigatório");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status: "pending" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showSuccess("Tarefa criada com sucesso!");
        setTitle("");
        setDescription("");
        fetchTasks(token!, page, filter);
      } else {
        handleAuthError(data.message || "Erro ao criar tarefa");
      }
    } catch (err) {
      console.error("[handleCreateTask] Erro:", err);
      showError("Erro de conexão");
    }
  }

  async function handleDeleteTask(id: string) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showSuccess("Tarefa deletada!");
        fetchTasks(token!, page, filter);
      } else {
        handleAuthError(data.message || "Erro ao deletar tarefa");
      }
    } catch (err) {
      console.error("[handleDeleteTask] Erro:", err);
      showError("Erro de conexão");
    }
  }

  async function handleUpdateTask(id: string, status: Task["status"]) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showSuccess("Tarefa atualizada!");
        fetchTasks(token!, page, filter);
      } else {
        handleAuthError(data.message || "Erro ao atualizar tarefa");
      }
    } catch (err) {
      console.error("[handleUpdateTask] Erro:", err);
      showError("Erro de conexão");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Logout realizado com sucesso!"); // toast de sucesso
    router.push("/login");
  }

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-500 to-purple-700 p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard de Tarefas</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Feedback */}
      {error && <p className="text-red-200 text-sm">{error}</p>}
      {success && <p className="text-green-200 text-sm">{success}</p>}

      {/* Formulário nova tarefa */}
      <form onSubmit={handleCreateTask} className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          placeholder="Título da tarefa"
          className="h-12 px-4 rounded text-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descrição"
          className="h-12 px-4 rounded text-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="h-12 bg-green-600 rounded hover:bg-green-700 transition font-semibold"
        >
          Criar Tarefa
        </button>
      </form>

      {/* Filtro */}
      <div className="mb-4">
        <label>Status: </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="text-black px-2 py-1 rounded"
        >
          <option value="all">Todas</option>
          <option value="pending">Pendente</option>
          <option value="in_progress">Em andamento</option>
          <option value="completed">Finalizada</option>
        </select>
      </div>

      {/* Lista de tarefas */}
      {loading && tasks.length === 0 ? (
        <p>Carregando tarefas...</p>
      ) : (
        <>
          {tasks.length === 0 ? (
            <p className="text-red-200 text-sm font-semibold">
              Nenhuma tarefa cadastrada para esse status. Adicione uma nova para
              começar!
            </p>
          ) : (
            <ul className="space-y-2">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center bg-white text-black p-3 rounded shadow"
                >
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-sm">{task.description}</p>
                    <p className="text-xs italic">
                      Status: {statusLabels[task.status]}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateTask(task.id, "in_progress")}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Em andamento
                    </button>
                    <button
                      onClick={() => handleUpdateTask(task.id, "completed")}
                      className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Finalizar
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Deletar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Paginação */}
          <div className="flex gap-4 items-center mt-6">
            <button
              disabled={page <= 1}
              onClick={() =>
                fetchTasks(localStorage.getItem("token")!, page - 1, filter)
              }
              className="bg-gray-200 text-black px-3 py-1 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {page} de {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() =>
                fetchTasks(localStorage.getItem("token")!, page + 1, filter)
              }
              className="bg-gray-200 text-black px-3 py-1 rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}
