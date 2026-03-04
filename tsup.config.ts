import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["bin/install.ts"],
	outDir: "dist",
	format: ["esm"],
	target: "node18",
	bundle: true,
	splitting: false,
	clean: true,
	treeshake: true,
	noExternal: [],
	external: [
		"@clack/prompts",
		"commander",
		"picocolors",
		"node:fs",
		"node:os",
		"node:path",
		"node:url",
	],
})
