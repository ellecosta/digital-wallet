const { createDefaultPreset } = require("ts-jest");
const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  testEnvironment: "node",
  transform: { ...tsJestTransformCfg },
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/integration/"],
  setupFiles: ["<rootDir>/src/tests/env.setup.ts"],
  maxWorkers: 1,
};
