import dotenv from 'dotenv';

// Carrega variáveis do .env.test
dotenv.config({ path: '.env.test' });


// jest.setup.ts
// Configurações globais para os testes

// Aumenta timeout padrão (opcional)
jest.setTimeout(10000);

// Limpa mocks automaticamente entre testes
afterEach(() => {
  jest.clearAllMocks();
});