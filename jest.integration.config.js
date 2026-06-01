const { createDefaultPreset } = require("ts-jest");
const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  testEnvironment: "node",
  transform: { ...tsJestTransformCfg },
  testMatch: ["**/integration/**/*.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  setupFiles: ["<rootDir>/src/tests/env.setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  maxWorkers: 1,
};
