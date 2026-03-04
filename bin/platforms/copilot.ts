/**
 * Injects `name:` and `description:` fields into the file's YAML frontmatter, derived from the
 * source filename stem and an optional description field. Used to produce the custom agent format required by
 * GitHub Copilot (IDE) and GitHub Copilot CLI.
 */
export function injectCopilotFrontmatter(
	srcName: string,
	content: string,
): string {
	const stem = srcName.replace(/\.md$/, "")
	const hasFrontmatter = content.startsWith("---\n")

	if (hasFrontmatter) {
		const blockEnd = content.indexOf("\n---", 4)
		const block = content.slice(4, blockEnd)

		// Check for existing fields
		const hasName = /^name:/m.test(block)
		const hasDescription = /^description:/m.test(block)

		if (hasName && hasDescription) return content

		// Inject missing fields
		let newBlock = block
		if (!hasName) newBlock = `name: ${stem}\n${newBlock}`

		// Attempt to extract description if not present and if there's any description logic we want,
		// but the spec just says to add name and description. If we don't have a description, we can default it or parse it.
		// For now we'll just inject empty or generic description if it's not present, or try to find it.
		if (!hasDescription) {
			newBlock = `${newBlock}\ndescription: "Conductor ${stem.replace("conductor-", "")} workflow"`
		}

		return `---\n${newBlock}\n${content.slice(blockEnd)}`
	}

	return `---\nname: ${stem}\ndescription: "Conductor ${stem.replace("conductor-", "")} workflow"\n---\n\n${content}`
}
