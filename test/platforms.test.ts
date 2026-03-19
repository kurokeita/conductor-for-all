import { describe, expect, it } from "vitest"
import { convertToCodexSkill } from "../bin/platforms/codex.js"
import { injectCopilotFrontmatter } from "../bin/platforms/copilot.js"
import { convertToGeminiToml } from "../bin/platforms/gemini.js"

describe("platform transforms", () => {
	it("adds Codex skill metadata while preserving existing descriptions", () => {
		const content = `---
description: Existing description
---

# Planning
`

		const output = convertToCodexSkill("conductor-planning.md", content)

		expect(output).toContain("name: conductor-planning")
		expect(output).toContain("description: Existing description")
		expect(output).toContain("# Planning")
	})

	it("keeps existing Codex frontmatter untouched", () => {
		const content = `---
name: conductor-review
description: Review things
---

# Review
`

		expect(convertToCodexSkill("conductor-review.md", content)).toBe(content)
	})

	it("keeps Copilot frontmatter injection behavior", () => {
		const output = injectCopilotFrontmatter("conductor-status.md", "# Status\n")

		expect(output).toContain("name: conductor-status")
		expect(output).toContain('description: "Conductor status workflow"')
	})

	it("converts markdown commands into Gemini TOML", () => {
		const output = convertToGeminiToml(
			"conductor-setup.md",
			`---
description: Setup description
---

# Setup
Body
`,
		)

		expect(output).toContain('description = "Setup description"')
		expect(output).toContain("prompt = '''")
		expect(output).toContain("# Setup")
	})
})
