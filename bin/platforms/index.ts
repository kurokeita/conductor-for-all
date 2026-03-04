import type { Platform } from "../types.js"
import { injectCopilotFrontmatter } from "./copilot.js"
import { convertToGeminiToml } from "./gemini.js"

export const PLATFORMS: Record<string, Platform> = {
	antigravity: {
		label: "Antigravity",
		workflowsPath: "~/.gemini/antigravity/global_workflows",
	},
	copilot: {
		label: "GitHub Copilot",
		workflowsPath: "~/.github/agents",
		transformContent: injectCopilotFrontmatter,
	},
	copilotCli: {
		label: "GitHub Copilot CLI",
		workflowsPath: "~/.copilot/agents",
		transformContent: injectCopilotFrontmatter,
	},
	gemini: {
		label: "Gemini CLI",
		workflowsPath: "~/.gemini/commands/conductor",
		transformName: (name) =>
			name.replace(/^conductor-/, "").replace(/\.md$/, ".toml"),
		transformContent: convertToGeminiToml,
	},
	windsurf: {
		label: "Windsurf",
		workflowsPath: "~/.codeium/windsurf/global_workflows",
	},
}

export const PLATFORM_KEYS = Object.keys(PLATFORMS)
