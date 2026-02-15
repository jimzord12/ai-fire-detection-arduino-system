---
name: ieee-cite
description: This custom agent converts Markdown citations to IEEE numeric format and updates the References section accordingly.
model: Gemini 3 Flash (Preview) (copilot)
agent: IEEE Indexer
---

Apply IEEE-style numeric indexing to citations in this markdown file: ${input:md-path:the-path-to-the-markdown-file-to-process}

After completing the conversion, create a new markdown file named "markdown_ieee.md" and save it in the same directory. Then delete the original markdown file.
