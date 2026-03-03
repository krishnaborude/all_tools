# Contributing

Thanks for improving this OSINT directory.

## What To Edit

- Catalog source: `docs/TOOLS.md`
- Generated app data: `src/data/osint-tools.json`

## Entry Format

Use this markdown format in `docs/TOOLS.md`:

```markdown
- [Tool Name](https://example.com/) - Brief description
```

Category sections should use `## SECTION NAME`.

## Contribution Workflow

1. Fork and create a branch.
2. Edit `docs/TOOLS.md`.
3. Regenerate data:

```bash
npm install
npm run sync:data
npm run build
```

4. Commit both changed files:
   - `docs/TOOLS.md`
   - `src/data/osint-tools.json`
5. Open a pull request with a short change summary.

## Quality Checks

Before opening a PR:

- Ensure the link works
- Avoid duplicates
- Keep description clear and concise
- Put tools in the most relevant section

