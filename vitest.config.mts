import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Test configuration.
 *
 * Two projects, because the two kinds of test want different environments and
 * running the DOM setup for pure arithmetic is a waste:
 *
 *   unit  — node, no DOM. lib/ and data/ integrity.
 *   dom   — jsdom, Testing Library. Components and their behaviour.
 *
 * `vite-tsconfig-paths` resolves the `@/*` alias from tsconfig, so tests
 * import exactly what the application imports.
 */
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    restoreMocks: true,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["tests/unit/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "jsdom",
          setupFiles: ["./tests/setup.ts"],
          include: ["tests/dom/**/*.test.tsx"],
        },
      },
    ],
  },
});
