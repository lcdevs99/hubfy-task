// jest.frontend.setup.ts
import "@testing-library/jest-dom";

// mock do next/navigation para testes
jest.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
    redirect: jest.fn(),
  };
});

// mock global do fetch para ambiente Node (Jest não tem fetch nativo)
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;