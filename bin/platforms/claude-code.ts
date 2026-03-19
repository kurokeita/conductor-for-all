/**
 * Injects a `name:` field into the file's YAML frontmatter, derived from the
 * source filename stem. Claude Code skills require `name:` and `description:`
 * in their frontmatter to be discoverable.
 */
export function injectClaudeCodeFrontmatter(
	srcName: string,
	content: string,
): string {
	const stem = srcName.replace(/\.md$/, "")
	const hasFrontmatter = content.startsWith("---\n")

	if (hasFrontmatter) {
		const blockEnd = content.indexOf("\n---", 4)
		const block = content.slice(4, blockEnd)
		const hasName = /^name:/m.test(block)

		if (hasName) return content

		return `---\nname: ${stem}\n${block}\n${content.slice(blockEnd)}`
	}

	return `---\nname: ${stem}\n---\n\n${content}`
}
