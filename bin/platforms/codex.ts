/**
 * Converts a Conductor command markdown file into a Codex skill `SKILL.md`.
 * Codex skills need a `name` and `description` in frontmatter.
 */
export function convertToCodexSkill(srcName: string, content: string): string {
	const stem = srcName.replace(/\.md$/, "")
	const hasFrontmatter = content.startsWith("---\n")
	const defaultDescription = `Conductor ${stem.replace("conductor-", "")} workflow`

	if (hasFrontmatter) {
		const blockEnd = content.indexOf("\n---", 4)
		if (blockEnd !== -1) {
			const block = content.slice(4, blockEnd)
			const hasName = /^name:/m.test(block)
			const hasDescription = /^description:/m.test(block)

			if (hasName && hasDescription) {
				return content
			}

			let newBlock = block
			if (!hasName) {
				newBlock = `name: ${stem}\n${newBlock}`
			}
			if (!hasDescription) {
				newBlock = `${newBlock}\ndescription: "${defaultDescription}"`
			}

			return `---\n${newBlock}\n${content.slice(blockEnd)}`
		}
	}

	return `---\nname: ${stem}\ndescription: "${defaultDescription}"\n---\n\n${content}`
}
