Here's everything you need to know about creating custom slash commands (prompt files) in VS Code Copilot with arguments.

## What Are Prompt Files?

Prompt files are Markdown files with a `.prompt.md` extension that act as custom slash commands in Copilot Chat. They live in `.github/prompts/` (workspace-scoped) or in the `prompts/` folder of your VS Code profile (available across all workspaces). [code.visualstudio](https://code.visualstudio.com/docs/copilot/customization/prompt-files)

## File Structure

```
.github/
└── prompts/
    └── my-command.prompt.md
```

Once saved, typing `/my-command` in Copilot Chat will surface it as a slash command. [code.visualstudio](https://code.visualstudio.com/docs/copilot/customization/prompt-files)

## Frontmatter Syntax

The optional YAML frontmatter at the top configures behavior: [code.visualstudio](https://code.visualstudio.com/docs/copilot/customization/prompt-files)

```yaml
---
name: 'my-command'           # optional, defaults to filename
description: 'What it does'
argument-hint: 'Describe expected args here'
agent: 'ask' | 'agent' | 'plan' | '<custom-agent>'
model: 'Claude Sonnet 4' | 'GPT-4o' | ...
tools: ['search', 'read', 'edit', 'githubRepo']
---
```

## Accepting Arguments (Variables)

This is the core syntax for making prompts dynamic. You have several variable types: [code.visualstudio](https://code.visualstudio.com/docs/copilot/customization/prompt-files)

| Variable | Description |
|---|---|
| `${input:varName}` | Prompts user to type a value when running |
| `${input:varName:placeholder}` | Same, but with placeholder hint text |
| `${selectedText}` / `${selection}` | Currently highlighted code in editor |
| `${file}` / `${fileBasename}` | Active file path / filename |
| `${fileDirname}` | Directory of the active file |
| `${fileBasenameNoExtension}` | Filename without extension |
| `${workspaceFolder}` | Root path of the workspace |

### Example: Prompt with `${input}` Arguments

```markdown
---
description: 'Generate unit tests for the current file'
agent: 'agent'
tools: ['search', 'read', 'edit']
argument-hint: 'framework (e.g. jest or vitest)'
---
Generate unit tests for [${fileBasename}](${file}).

* Place the test file in: ${fileDirname}
* Name it: ${fileBasenameNoExtension}.test.ts
* Test framework: ${input:framework:jest or vitest}

If there is a selection, only generate tests for:
${selection}
```

When you run `/generate-tests` in chat, Copilot will pause and ask you to fill in the `framework` input before proceeding. [code.visualstudio](https://code.visualstudio.com/docs/copilot/customization/prompt-files)

## Passing Args Inline at Invocation

You can also pass free-form arguments directly in the chat input when invoking the command — Copilot reads them as additional context: [code.visualstudio](https://code.visualstudio.com/docs/copilot/customization/prompt-files)

```
/create-react-form formName=MyForm
/create-api for listing customers
```

This is less structured than `${input:varName}` variables but useful for quick one-offs.

## Practical Example (TypeScript-Focused)

Here's a prompt tailored for your Next.js/TypeScript workflow:

```markdown
---
name: 'new-component'
description: 'Scaffold a new Next.js TypeScript component'
argument-hint: 'component name and type (e.g. Button, form)'
agent: 'agent'
tools: ['read', 'edit', 'search']
---
Scaffold a new React component named `${input:componentName}` of type `${input:componentType:ui or form}`.

* File location: ${fileDirname}
* Use TypeScript with strict types
* Export as named export
* If it's a form, use react-hook-form + zod for validation
* Follow conventions in the currently open file: ${file}
```

## How to Create One Quickly

1. Open Copilot Chat and type `/prompts` to open the **Configure Prompt Files** menu [code.visualstudio](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
2. Select **New prompt file** and choose **Workspace** or **User profile** scope
3. Name the file (e.g. `new-component.prompt.md`) — the filename becomes the slash command
4. Write your frontmatter + body, save, and it's immediately available as `/new-component`