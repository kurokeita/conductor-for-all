#!/usr/bin/env node
import * as p from "@clack/prompts"
import { Command } from "commander"
import pc from "picocolors"
import { execute, runInteractive } from "./actions.js"
import { PLATFORM_KEYS, PLATFORMS } from "./platforms/index.js"
import { getCommandsDir, getPromptFiles } from "./utils.js"
import { version } from "./version.js"

// ── CLI (commander) ──────────────────────────────────────────────────────────

const program = new Command()

program
	.name("conductor-install")
	.description(`Install Conductor prompts to AI agent platforms (v${version})`)
	.version(version, "-v, --version")
	.option(
		"-p, --platform <names>",
		"comma-separated platform(s): antigravity, copilotCli, copilot, windsurf",
	)
	.option("-n, --dry-run", "preview changes without writing")
	.option("-u, --uninstall", "remove installed prompts")
	.option("--all", "install to all platforms")
	.action(async (opts) => {
		const commandsDir = getCommandsDir()
		const files = getPromptFiles(commandsDir)

		if (files.length === 0) {
			p.log.error("No .prompt.md files found in commands/")
			process.exit(1)
		}

		const nonInteractive =
			opts.platform || opts.dryRun || opts.uninstall || opts.all

		if (!nonInteractive) {
			await runInteractive(files)
			return
		}

		let platformKeys: string[]
		if (opts.all) {
			platformKeys = PLATFORM_KEYS
		} else if (opts.platform) {
			platformKeys = (opts.platform as string).split(",").map((s) => s.trim())
			const invalid = platformKeys.filter((k) => !PLATFORMS[k])
			if (invalid.length > 0) {
				p.log.error(
					`Unknown platform(s): ${invalid.join(", ")}. Valid: ${PLATFORM_KEYS.join(", ")}`,
				)
				process.exit(1)
			}
		} else {
			p.log.error("No platform specified. Use --platform <name> or --all.")
			process.exit(1)
		}

		p.intro(
			`${pc.bgCyan(pc.black(" conductor-install "))} ${pc.dim(`v${version}`)}`,
		)
		await execute(files, platformKeys, {
			dryRun: !!opts.dryRun,
			uninstall: !!opts.uninstall,
		})
	})

program.parse()
