# .tune Directory

This directory (`~/.tune`) serves as a global configuration and workspace for tune extensions in VSCode and Neovim.

The primary purpose of this directory is to provide a centralized location for:

- **Global settings:** Configure the behavior of tune extensions across all your projects.
- **Shared resources:** Store files, scripts, or other assets that can be accessed by the extensions.
- **Customizations:** Define custom configurations or extensions for the tool's functionality.
- **LLM Configurations:** Manage API keys and model-specific settings for various AI providers.

## Setup

### VSCode

Set the VSCode extension to point to this directory to establish a consistent environment for your development workflow.

### Neovim

1. Install the tune.nvim plugin using your preferred package manager. Example with lazy.nvim:

```lua
-- ~/.config/nvim/lua/plugins/tune.lua
return {
  "iovdin/tune.nvim",
  dependencies = {
    "iovdin/tree-sitter-chat",
    "nvim-treesitter/nvim-treesitter",
  },
  config = function()
    local custom_paths_string = vim.fn.expand("~") .. "/.tune"
    vim.env.TUNE_PATH = custom_paths_string
    require("tune").setup({})
  end,
  ft = { "chat" },
}
```

2. Configure your API keys in `~/.tune/.env`:

```bash
ANTHROPIC_KEY=""
OPENAI_KEY=""
OPENROUTER_KEY=""
GEMINI_KEY=""
GROK_KEY=""
```

3. Add custom LLM configurations as needed. Example for Grok:

```js
// ~/.tune/grok.llm.mjs
export default async (payload, context) => {
  const key = await context.read("GROK_KEY");

  return ({
    url: "https://api.x.ai/v1/chat/completions",
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      ...payload,
      model: "grok-4",
    })
  })
}
```

## Usage

- Create `.chat` files to interact with your configured LLMs
- The tune.nvim plugin will automatically load when editing `.chat` files
- Your LLM configurations and API keys from this directory will be available in both VSCode and Neovim

## Batteries Included

For additional tools, processors, and contexts, see the [tune tools repository](https://github.com/iovdin/tune/blob/main/tools/README.md). This comprehensive collection includes file operations, web integration, AI capabilities, development tools, and agent-building components that can be forked and customized for your specific needs.

## Documentation

### Tree-sitter Configuration

The `injections.scm` file configures tree-sitter to inject markdown syntax highlighting into `.chat` files. This enables proper markdown formatting within chat content sections.

**File location:** Place in your Neovim tree-sitter configuration directory:
- `~/.config/nvim/queries/chat/injections.scm`

**Content:**
```scheme
;; Chat language markdown injection queries
;; Injects markdown highlighting into content sections

((content) @injection.content
 (#set! injection.language "markdown")
 (#set! injection.include-children))
```

This configuration tells tree-sitter to treat all `content` nodes in `.chat` files as markdown, providing syntax highlighting for markdown elements like headers, lists, code blocks, and emphasis.

The `injections.scm` file in this repository serves as a reference copy for the required configuration.

**Preventing Markdown Jittering:**

When using markdown injection, you may experience visual jittering or jumps as the assistant writes content. To prevent this, add the following autocmd to your Neovim configuration:

```lua
vim.api.nvim_create_autocmd({ "FileType" }, {
  pattern = { "markdown", "chat" },
  callback = function()
    vim.wo.conceallevel = 0
  end,
})
```

This disables concealment for markdown and chat file types, eliminating the visual instability that occurs when syntax highlighting is injected during streaming responses.

### Tools Usage
**[Full Documentation](https://iovdin.github.io/tune/template-language/tools)** - Learn how to use tools in your chat sessions

Tools make LLMs "agentic" by enabling them to perform actions beyond conversation. Example usage in a `.chat` file:

```
user: @calendar what's on my schedule today?
assistant: I'll check your calendar for today's events...
```

Creating a custom tool:
```javascript
// ~/.tune/tools/calendar.js
async function calendar({ date }, context) {
    // Tool implementation
    return "Your schedule for " + date;
}
```

### MCP Integration
**[Full Documentation](https://iovdin.github.io/tune/examples/mcp)** - Set up and use Model Context Protocol (MCP) servers with tune

MCP provides a standardized way to connect AI models to various data sources and tools. Example usage:

```
system: 
@{| mcp npx -y @modelcontextprotocol/server-filesystem ./ }

user: 
what files are in my current directory?

assistant:
I'll list the files in your current directory...
```

To use MCP servers:
1. Create a `mcp.proc.mjs` processor file in your `.tune` directory
2. Use any MCP-compatible server (e.g., filesystem, GitHub, databases)
3. The processor will automatically discover and make tools available
