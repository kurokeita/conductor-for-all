import fs from "node:fs"
import path from "node:path"
import type { PromptFile } from "./types.js"
import { shortenHome } from "./utils.js"

export function copyFile(
	file: PromptFile,
	dest: string,
	dryRun: boolean,
	destName = file.name,
	transformContent?: (name: string, content: string) => string,
): string {
	const destFile = path.join(dest, destName)
	if (!dryRun) {
		fs.mkdirSync(path.dirname(destFile), { recursive: true })
		try {
			fs.rmSync(destFile)
		} catch {
			/* doesn't exist */
		}
		if (transformContent) {
			const content = fs.readFileSync(file.src, "utf8")
			fs.writeFileSync(destFile, transformContent(file.name, content), "utf8")
		} else {
			fs.copyFileSync(file.src, destFile)
		}
	}
	return shortenHome(destFile)
}

export function removeFile(
	file: PromptFile,
	dest: string,
	dryRun: boolean,
	destName = file.name,
): { filePath: string; existed: boolean } {
	const destFile = path.join(dest, destName)
	let existed = false
	try {
		fs.lstatSync(destFile)
		existed = true
	} catch {
		/* doesn't exist */
	}
	if (existed && !dryRun) fs.rmSync(destFile)
	return { filePath: shortenHome(destFile), existed }
}
