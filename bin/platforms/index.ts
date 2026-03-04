import type { Platform } from "../types.js"
import { injectCopilotFrontmatter } from "./copilot.js"
import { convertToGeminiToml } from "./gemini.js"

export const PLATFORMS: Record<string, Platform> = {
	antigravity: {
		label: "Antigravity",
		workflowsPath: "~/.gemini/antigravity/global_workflows",
	},
	copilotAgents: {
		label: "GitHub Copilot Agents (IDE)",
		workflowsPath: ".github/agents",
		transformContent: injectCopilotFrontmatter,
	},
	copilotPrompts: {
		label: "GitHub Copilot Prompts (IDE)",
		workflowsPath: ".github/prompts",
		transformName: (name) => name.replace(/\.md$/, ".prompt.md"),
	},
	copilotCliAgents: {
		label: "GitHub Copilot CLI Agents",
		workflowsPath: "~/.copilot/agents",
		transformContent: injectCopilotFrontmatter,
	},
	copilotCliSkills: {
		label: "GitHub Copilot CLI Skills",
		workflowsPath: "~/.copilot/skills",
		transformName: (name) => `${name.replace(/\.md$/, "")}/SKILL.md`,
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
