import fs from "node:fs"

const pkg = JSON.parse(
	fs.readFileSync(
		new URL("../package.json", import.meta.url).pathname,
		"utf-8",
	),
)

export const version = pkg.version
