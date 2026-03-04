import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import * as p from "@clack/prompts"
import type { PromptFile } from "./types.js"

const home = os.homedir()

export const expandHome = (p: string) => p.replace(/^~/, home)
export const shortenHome = (p: string) => p.replace(home, "~")

export function getCommandsDir(): string {
	const __dirname = path.dirname(fileURLToPath(import.meta.url))
	const candidates = [
		path.resolve(__dirname, "..", "commands"),
		path.resolve(process.cwd(), "commands"),
	]
	for (const c of candidates) {
		if (fs.existsSync(c)) return c
	}
	p.log.error("Cannot find commands/ directory.")
	process.exit(1)
}

export function getPromptFiles(dir: string): PromptFile[] {
	return fs
		.readdirSync(dir)
		.filter((f) => f.endsWith(".md") && !f.startsWith("."))
		.map((f) => ({ name: f, src: path.join(dir, f) }))
}
