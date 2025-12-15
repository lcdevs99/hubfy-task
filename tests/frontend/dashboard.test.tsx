import { render, screen } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";

describe("DashboardPage", () => {
  it("renderiza o título do dashboard", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/dashboard de tarefas/i)).toBeInTheDocument();
  });

  it("renderiza botão de logout", () => {
    render(<DashboardPage />);
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("renderiza formulário de criação de tarefa", () => {
    render(<DashboardPage />);
    expect(screen.getByPlaceholderText(/título da tarefa/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /criar tarefa/i })).toBeInTheDocument();
  });

  it("renderiza filtro de status", () => {
    render(<DashboardPage />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText(/todas/i)).toBeInTheDocument();
    expect(screen.getByText(/pendente/i)).toBeInTheDocument();
    expect(screen.getByText(/em andamento/i)).toBeInTheDocument();
    expect(screen.getByText(/finalizada/i)).toBeInTheDocument();
  });

  it("mostra carregando inicialmente", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/carregando tarefas/i)).toBeInTheDocument();
  });
});