/**
 * Converts a markdown file with optional YAML frontmatter to a TOML file
 * intended for Gemini CLI, containing `description` and `prompt`.
 */
export function convertToGeminiToml(_: string, content: string): string {
	let description = "Conductor command"
	let promptContent = content

	// Extract description from frontmatter if present
	if (content.startsWith("---\n")) {
		const blockEnd = content.indexOf("\n---", 4)
		if (blockEnd !== -1) {
			const block = content.slice(4, blockEnd)
			const descMatch = block.match(/^description:\s*(.*)$/m)
			if (descMatch) {
				// strip quotes
				description = descMatch[1].replace(/^["'](.*)["']$/, "$1")
			}
			promptContent = content.slice(blockEnd + 5).trimStart()
		}
	}

	// Construct valid TOML
	// We need to safely encode the multi-line string.
	// Using TOML multi-line literal strings: '''
	// If the prompt contains ''', we would need to escape it, but literal strings don't support escaping.
	// Instead, we use multi-line basic strings """ and escape \ and " properly if needed.
	// But a simple JSON.stringify is technically valid TOML for basic strings anyway if it spans one line,
	// but it's cleaner to use multi-line.

	// Cleanest valid TOML for multi-line is to use literal string `'''` and replace `'''` if it ever exists.
	const safePrompt = promptContent.replace(/'''/g, "''\\'")

	const toml = `description = ${JSON.stringify(description)}
prompt = '''
${safePrompt}
'''
`
	return toml
}
