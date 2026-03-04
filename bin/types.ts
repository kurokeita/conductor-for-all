export interface Platform {
	label: string
	workflowsPath: string
	transformName?: (name: string) => string
	transformContent?: (name: string, content: string) => string
}

export interface PromptFile {
	name: string
	src: string
}

export interface ExecOptions {
	uninstall: boolean
	dryRun: boolean
}
