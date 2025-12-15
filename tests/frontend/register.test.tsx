import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/register/page";

describe("RegisterPage", () => {
  it("renderiza título e botão", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("heading", { name: /registrar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /registrar/i })).toBeInTheDocument();
  });

  it("mostra erro se nome for curto", async () => {
    render(<RegisterPage />);
    await userEvent.type(screen.getByPlaceholderText("Digite seu nome"), "L");
    await userEvent.click(screen.getByRole("button", { name: /registrar/i }));

    expect(
      await screen.findByText((text) => text.includes("Nome deve ter ao menos 2 caracteres"))
    ).toBeInTheDocument();
  });

  it("mostra erro se email for inválido", async () => {
    render(<RegisterPage />);
    await userEvent.type(screen.getByPlaceholderText("Digite seu nome"), "Lucas");
    await userEvent.type(screen.getByPlaceholderText("Digite seu e-mail"), "lucas"); // inválido
    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "SenhaForte123!");
    await userEvent.click(screen.getByRole("button", { name: /registrar/i }));

    expect(
      await screen.findByText((text) => text.includes("Email inválido"))
    ).toBeInTheDocument();
  });

  it("mostra erro se senha for fraca", async () => {
    render(<RegisterPage />);
    await userEvent.type(screen.getByPlaceholderText("Digite seu nome"), "Lucas");
    await userEvent.type(screen.getByPlaceholderText("Digite seu e-mail"), "lucas@teste.com");
    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "123"); // fraca
    await userEvent.click(screen.getByRole("button", { name: /registrar/i }));

    expect(
      await screen.findByText((text) =>
        text.includes("Senha deve ter 8+ caracteres")
      )
    ).toBeInTheDocument();
  });

  it("mostra mensagem de sucesso após registro válido (mockando fetch)", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: { id: "1", name: "Lucas" } }),
      } as Response)
    );

    render(<RegisterPage />);
    await userEvent.type(screen.getByPlaceholderText("Digite seu nome"), "Lucas");
    await userEvent.type(screen.getByPlaceholderText("Digite seu e-mail"), "lucas@teste.com");
    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "SenhaForte123!");
    await userEvent.click(screen.getByRole("button", { name: /registrar/i }));

    expect(
      await screen.findByText((text) => text.includes("Registro realizado com sucesso"))
    ).toBeInTheDocument();
  });
});