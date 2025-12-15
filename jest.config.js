export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const testMatch = ["**/tests/backend/**/*.test.ts"];
export const moduleNameMapper = {
    '^@/(.*)$': '<rootDir>/src/$1', // se seu código estiver em src/
  // ou use '<rootDir>/$1' se estiver direto na raiz
};
export const setupFilesAfterEnv = ['<rootDir>/jest.setup.ts'];