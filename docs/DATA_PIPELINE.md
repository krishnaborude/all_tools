# Data Pipeline

## Source Of Truth

The tools catalog source is:

- `docs/TOOLS.md`

The app consumes:

- `src/data/osint-tools.json`

## Sync Command

Run:

```bash
npm run sync:data
```

This parses the markdown catalog and regenerates `src/data/osint-tools.json`.

## Expected Markdown Format

- Section headings must use `##`
- Tool entries should use:

```markdown
- [Tool Name](https://example.com) - Short description
```

Multi-line descriptions are supported under the same list item.

## Recommended Update Flow

1. Edit `docs/TOOLS.md`
2. Run `npm run sync:data`
3. Run `npm run build`
4. Commit both `docs/TOOLS.md` and `src/data/osint-tools.json`

