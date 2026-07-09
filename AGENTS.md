<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Ruflo — Default Workflow

Use **Ruflo** (`/ruflo`) for planning, building, and fixing in this repo. See `.cursor/rules/ruflo-default.mdc` for the full pipeline.

**Quick reference:**
- Non-trivial work → parallel subagent pipeline (research → architect → coder → tester → reviewer)
- Trivial one-liner fixes → solo is fine
- Always: French route + sitemap for new pages, Supabase MCP for SQL, preview before agent work
