import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import { fileURLToPath } from "node:url"
import { Command } from "commander"
import * as p from "@clack/prompts"
import pc from "picocolors"

// ── Types ────────────────────────────────────────────────────────────────────

interface Platform {
  label: string
  workflowsPath: string
  transformName?: (name: string) => string
  transformContent?: (name: string, content: string) => string
}

interface PromptFile {
  name: string
  src: string
}

interface ExecOptions {
  uninstall: boolean
  dryRun: boolean
}

// ── Platform definitions ─────────────────────────────────────────────────────

const PLATFORMS: Record<string, Platform> = {
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
    transformName: (name) => name.replace(/^conductor-/, "").replace(/\.md$/, ".toml"),
    transformContent: convertToGeminiToml,
  },
  windsurf: {
    label: "Windsurf",
    workflowsPath: "~/.codeium/windsurf/global_workflows",
  },
}

const PLATFORM_KEYS = Object.keys(PLATFORMS)

// ── Helpers ──────────────────────────────────────────────────────────────────

const home = os.homedir()
const expandHome = (p: string) => p.replace(/^~/, home)
const shortenHome = (p: string) => p.replace(home, "~")

/**
 * Injects `name:` and `description:` fields into the file's YAML frontmatter, derived from the
 * source filename stem and an optional description field. Used to produce the custom agent format required by
 * GitHub Copilot (IDE) and GitHub Copilot CLI.
 */
function injectCopilotFrontmatter(srcName: string, content: string): string {
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
      newBlock = `${newBlock}\ndescription: "Conductor ${stem.replace('conductor-', '')} workflow"`
    }

    return `---\n${newBlock}\n${content.slice(blockEnd)}`
  }

  return `---\nname: ${stem}\ndescription: "Conductor ${stem.replace('conductor-', '')} workflow"\n---\n\n${content}`
}

/**
 * Converts a markdown file with optional YAML frontmatter to a TOML file
 * intended for Gemini CLI, containing `description` and `prompt`.
 */
function convertToGeminiToml(srcName: string, content: string): string {
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
        description = descMatch[1].replace(/^["'](.*)["']$/, '$1')
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
  let safePrompt = promptContent.replace(/'''/g, "''\\'")

  const toml = `description = ${JSON.stringify(description)}
prompt = '''
${promptContent}
'''
`
  return toml
}

function getCommandsDir(): string {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const candidates = [
    path.resolve(__dirname, "..", "commands"),
    path.resolve(process.cwd(), "commands"),
  ]
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }
  p.log.error("Cannot find commands/ directory.")
  process.exit(1)
}

function getPromptFiles(dir: string): PromptFile[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("."))
    .map((f) => ({ name: f, src: path.join(dir, f) }))
}

function copyFile(
  file: PromptFile,
  dest: string,
  dryRun: boolean,
  destName = file.name,
  transformContent?: (name: string, content: string) => string,
): string {
  const destFile = path.join(dest, destName)
  if (!dryRun) {
    fs.mkdirSync(path.dirname(destFile), { recursive: true })
    try { fs.rmSync(destFile) } catch { /* doesn't exist */ }
    if (transformContent) {
      const content = fs.readFileSync(file.src, "utf8")
      fs.writeFileSync(destFile, transformContent(file.name, content), "utf8")
    } else {
      fs.copyFileSync(file.src, destFile)
    }
  }
  return shortenHome(destFile)
}

function removeFile(file: PromptFile, dest: string, dryRun: boolean, destName = file.name): { filePath: string; existed: boolean } {
  const destFile = path.join(dest, destName)
  let existed = false
  try {
    fs.lstatSync(destFile)
    existed = true
  } catch { /* doesn't exist */ }
  if (existed && !dryRun) fs.rmSync(destFile)
  return { filePath: shortenHome(destFile), existed }
}

// ── Interactive flow ─────────────────────────────────────────────────────────

async function runInteractive(files: PromptFile[]): Promise<void> {
  p.intro(pc.bgCyan(pc.black(" conductor-install ")))

  const action = await p.select({
    message: "What do you want to do?",
    options: [
      { value: "install", label: "Install prompts" },
      { value: "uninstall", label: "Uninstall prompts" },
    ],
    initialValue: "install",
  })
  if (p.isCancel(action)) { p.cancel("Cancelled."); process.exit(0) }

  const selectedKeys = await p.multiselect({
    message: "Which platforms?",
    options: PLATFORM_KEYS.map((key) => ({
      value: key,
      label: PLATFORMS[key].label,
      hint: shortenHome(expandHome(PLATFORMS[key].workflowsPath)),
    })),
    required: true,
  })
  if (p.isCancel(selectedKeys)) { p.cancel("Cancelled."); process.exit(0) }

  const dryRun = await p.confirm({
    message: "Dry run? (preview without writing)",
    initialValue: false,
  })
  if (p.isCancel(dryRun)) { p.cancel("Cancelled."); process.exit(0) }

  await execute(files, selectedKeys as string[], {
    uninstall: action === "uninstall",
    dryRun: dryRun as boolean,
  })
}

// ── Execute ──────────────────────────────────────────────────────────────────

async function execute(files: PromptFile[], platformKeys: string[], opts: ExecOptions): Promise<void> {
  const { uninstall, dryRun } = opts
  const dryNote = dryRun ? pc.dim(" (dry run)") : ""
  const verb = uninstall ? "Uninstalling" : "Installing"

  p.log.info(
    `${pc.bold(verb)} ${pc.cyan(String(files.length))} prompt(s) across ${pc.cyan(String(platformKeys.length))} platform(s)${dryNote}`
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
        s.stop(`${pc.bold(platform.label)}  ${pc.dim("directory not found, skipped")}`)
        continue
      }
      for (const file of files) {
        const destName = platform.transformName ? platform.transformName(file.name) : file.name
        const { filePath, existed } = removeFile(file, dest, dryRun, destName)
        if (existed) {
          results.push(`  ${pc.red("removed")}  ${pc.dim(filePath)}`)
          totalCount++
        }
      }
    } else {
      for (const file of files) {
        const destName = platform.transformName ? platform.transformName(file.name) : file.name
        const fp = copyFile(file, dest, dryRun, destName, platform.transformContent)
        const action = dryRun ? pc.dim("[dry-run]") : pc.green("copied ")
        results.push(`  ${action}  ${pc.dim(fp)}`)
        totalCount++
      }
    }

    const summary = results.length > 0 ? `${results.length} file(s)` : "nothing to do"
    s.stop(`${pc.bold(platform.label)}  ${pc.dim(shortenHome(dest))}  ${pc.cyan(summary)}`)
    results.forEach((r) => console.log(r))
  }

  const pastVerb = uninstall ? "removed" : "installed"
  const dryFinal = dryRun ? pc.dim(" — no changes made") : ""
  p.outro(`${pc.green("✓")} ${pc.bold(String(totalCount))} file(s) ${pastVerb}${dryFinal}`)
}

// ── CLI (commander) ──────────────────────────────────────────────────────────

const program = new Command()

program
  .name("conductor-install")
  .description("Install Conductor prompts to AI agent platforms")
  .option("-p, --platform <names>", "comma-separated platform(s): antigravity, copilotCli, copilot, windsurf")
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

    const nonInteractive = opts.platform || opts.dryRun || opts.uninstall || opts.all

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
        p.log.error(`Unknown platform(s): ${invalid.join(", ")}. Valid: ${PLATFORM_KEYS.join(", ")}`)
        process.exit(1)
      }
    } else {
      p.log.error("No platform specified. Use --platform <name> or --all.")
      process.exit(1)
    }

    p.intro(pc.bgCyan(pc.black(" conductor-install ")))
    await execute(files, platformKeys, {
      dryRun: !!opts.dryRun,
      uninstall: !!opts.uninstall,
    })
  })

program.parse()
