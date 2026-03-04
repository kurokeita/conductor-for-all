import fs from "node:fs"
import * as p from "@clack/prompts"
import pc from "picocolors"
import { copyFile, removeFile } from "./file-ops.js"
import { PLATFORMS, PLATFORM_KEYS } from "./platforms/index.js"
import type { ExecOptions, PromptFile } from "./types.js"
import { expandHome, shortenHome } from "./utils.js"
import { version } from "./version.js"

export async function runInteractive(files: PromptFile[]): Promise<void> {
	p.intro(
		`${pc.bgCyan(pc.black(" conductor-install "))} ${pc.dim(`v${version}`)}`,
	)

	const action = await p.select({
		message: "What do you want to do?",
		options: [
			{ value: "install", label: "Install prompts" },
			{ value: "uninstall", label: "Uninstall prompts" },
		],
		initialValue: "install",
	})
	if (p.isCancel(action)) {
		p.cancel("Cancelled.")
		process.exit(0)
	}

	const selectedKeys = await p.multiselect({
		message: "Which platforms?",
		options: PLATFORM_KEYS.map((key) => ({
			value: key,
			label: PLATFORMS[key].label,
			hint: shortenHome(expandHome(PLATFORMS[key].workflowsPath)),
		})),
		required: true,
	})
	if (p.isCancel(selectedKeys)) {
		p.cancel("Cancelled.")
		process.exit(0)
	}

	const dryRun = await p.confirm({
		message: "Dry run? (preview without writing)",
		initialValue: false,
	})
	if (p.isCancel(dryRun)) {
		p.cancel("Cancelled.")
		process.exit(0)
	}

	await execute(files, selectedKeys as string[], {
		uninstall: action === "uninstall",
		dryRun: dryRun as boolean,
	})
}

export async function execute(
	files: PromptFile[],
	platformKeys: string[],
	opts: ExecOptions,
): Promise<void> {
	const { uninstall, dryRun } = opts
	const dryNote = dryRun ? pc.dim(" (dry run)") : ""
	const verb = uninstall ? "Uninstalling" : "Installing"

	p.log.info(
		`${pc.bold(verb)} ${pc.cyan(String(files.length))} prompt(s) across ${pc.cyan(String(platformKeys.length))} platform(s)${dryNote}`,
	)

	const s = p.spinner()
	let totalCount = 0

	for (const key of platformKeys) {
		const platform = PLATFORMS[key]
		const dest = expandHome(platform.workflowsPath)

		s.start(`${pc.bold(platform.label)}  ${pc.dim(shortenHome(dest))}`)

		if (!dryRun && !uninstall) {
			fs.mkdirSync(dest, { recursive: true })
		}

		const results: string[] = []

		if (uninstall) {
			if (!fs.existsSync(dest)) {
				s.stop(
					`${pc.bold(platform.label)}  ${pc.dim("directory not found, skipped")}`,
				)
				continue
			}
			for (const file of files) {
				const destName = platform.transformName
					? platform.transformName(file.name)
					: file.name
				const { filePath, existed } = removeFile(file, dest, dryRun, destName)
				if (existed) {
					results.push(`  ${pc.red("removed")}  ${pc.dim(filePath)}`)
					totalCount++
				}
			}
		} else {
			for (const file of files) {
				const destName = platform.transformName
					? platform.transformName(file.name)
					: file.name
				const fp = copyFile(
					file,
					dest,
					dryRun,
					destName,
					platform.transformContent,
				)
				const action = dryRun ? pc.dim("[dry-run]") : pc.green("copied ")
				results.push(`  ${action}  ${pc.dim(fp)}`)
				totalCount++
			}
		}

		const summary =
			results.length > 0 ? `${results.length} file(s)` : "nothing to do"
		s.stop(
			`${pc.bold(platform.label)}  ${pc.dim(shortenHome(dest))}  ${pc.cyan(summary)}`,
		)
		results.forEach((r) => {
			console.log(r)
		})
	}

	const pastVerb = uninstall ? "removed" : "installed"
	const dryFinal = dryRun ? pc.dim(" — no changes made") : ""
	p.outro(
		`${pc.green("✓")} ${pc.bold(String(totalCount))} file(s) ${pastVerb}${dryFinal}`,
	)
}
