import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["bin/install.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "node18",
  bundle: true,
  splitting: false,
  clean: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
  noExternal: [],
  external: ["@clack/prompts", "commander", "picocolors"],
})
