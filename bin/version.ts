import fs from "node:fs"
import { fileURLToPath } from "node:url"

const pkg = JSON.parse(
	fs.readFileSync(
		fileURLToPath(new URL("../package.json", import.meta.url)),
		"utf-8",
	),
)

export const version = pkg.version
