// jest.frontend.config.js
export const preset = "ts-jest";
export const testEnvironment = "jsdom";
export const roots = ["<rootDir>/tests/frontend"];
export const testMatch = ["**/*.test.(js|jsx|ts|tsx)"];
export const moduleNameMapper = {
  "^@/(.*)$": "<rootDir>/src/$1", // ajusta se usa alias @/
};
export const setupFilesAfterEnv = ["<rootDir>/jest.frontend.setup.ts"];