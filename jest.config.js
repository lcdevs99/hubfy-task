export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const testMatch = ["**/tests/backend/**/*.test.ts"];
export const moduleNameMapper = {
    '^@/(.*)$': '<rootDir>/src/$1',
};
export const setupFilesAfterEnv = ['<rootDir>/jest.setup.ts'];