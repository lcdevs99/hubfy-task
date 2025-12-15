"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiLogin } from "react-icons/hi";
import { validateLogin } from "@/lib/middleware";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInputs>();

  async function onSubmit(data: LoginFormInputs) {
    const validationErrors = validateLogin(data);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field as keyof LoginFormInputs, { type: "manual", message });
      });
      return;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok && result.token) {
      setSuccess("Login realizado com sucesso!");
      localStorage.setItem("token", result.token);
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      setError("root", {
        type: "server",
        message: result.message || "Erro no login",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-700 px-4">
      <div
        className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 
                      border border-gray-200 rounded-3xl shadow-xl 
                      w-full max-w-md p-6 sm:p-10 flex flex-col gap-6 text-white"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">Login</h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full max-w-sm mx-auto"
        >
          {/* Campo E-mail */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-sm font-medium">E-mail</label>
            <input
              type="text"
              placeholder="Digite seu e-mail"
              className="h-12 px-5 pl-12 text-base border border-gray-300 rounded-full 
                         focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
              {...register("email")}
            />
            <HiMail className="absolute left-4 top-9 text-gray-600" size={20} />
            {errors.email && (
              <p className="text-red-200 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Campo Senha */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-sm font-medium">Senha</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              className="h-12 px-5 pl-12 pr-12 text-base border border-gray-300 rounded-full 
                         focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black"
              {...register("password")}
            />
            <HiLockClosed
              className="absolute left-4 top-9 text-gray-600"
              size={20}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-9 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
            </button>
            {errors.password && (
              <p className="text-red-200 text-sm">{errors.password.message}</p>
            )}
          </div>

          {errors.root && (
            <p className="text-red-200 text-sm text-center">
              {errors.root.message}
            </p>
          )}
          {success && (
            <p className="text-green-200 text-sm text-center">{success}</p>
          )}

          <button
            type="submit"
            className="h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition 
                       font-semibold text-base flex items-center justify-center gap-2"
          >
            <HiLogin size={20} /> Entrar
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Não tem conta ainda?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-blue-200 hover:underline cursor-pointer"
          >
            Cadastre-se
          </span>
        </p>
      </div>
    </div>
  );
}
