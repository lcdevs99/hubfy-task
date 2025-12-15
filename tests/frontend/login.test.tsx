import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/login/page";

describe("LoginPage", () => {
  it("renderiza título e botão", () => {
    render(<LoginPage />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("mostra erro se email estiver vazio", async () => {
    render(<LoginPage />);
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(screen.getByText(/e-mail é obrigatório/i)).toBeInTheDocument();
  });

  it("mostra erro se email for inválido", async () => {
    render(<LoginPage />);
    await userEvent.type(screen.getByPlaceholderText("Digite seu e-mail"), "lucas"); // inválido
    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "SenhaForte123!");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument();
  });

  it("mostra erro se senha for fraca", async () => {
    render(<LoginPage />);
    await userEvent.type(screen.getByPlaceholderText("Digite seu e-mail"), "lucas@teste.com");
    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "123"); // fraca
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(
  screen.getByText(/senha deve ter 8\+ caracteres/i)
).toBeInTheDocument();

  });

  it("mostra mensagem de sucesso após login válido (mockando fetch)", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "abc123" }),
      } as Response)
    );

    render(<LoginPage />);
    await userEvent.type(screen.getByPlaceholderText("Digite seu e-mail"), "lucas@teste.com");
    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "SenhaForte123!");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByText(/login realizado com sucesso/i)).toBeInTheDocument();
  });
});