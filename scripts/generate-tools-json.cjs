const fs = require("fs");
const path = require("path");

function normalize(text) {
  return String(text || "").toLowerCase().trim();
}

function cleanMarkdownText(text) {
  return String(text || "")
    .replace(/~~/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseReadme(markdown) {
  const sections = new Map();
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let currentSection = "";
  let pending = null;
  let sequence = 0;

  const commitPending = () => {
    if (!pending || !currentSection) return;
    if (!sections.has(currentSection)) sections.set(currentSection, []);

    const name = cleanMarkdownText(pending.name);
    const description = cleanMarkdownText(pending.description);

    sections.get(currentSection).push({
      id: `${slugify(currentSection)}-${slugify(name)}-${++sequence}`,
      name,
      url: pending.url,
      description,
      section: currentSection,
      searchBlob: normalize(`${name} ${description} ${currentSection}`),
    });

    pending = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      commitPending();
      const nextSection = cleanMarkdownText(headingMatch[1]);
      currentSection = nextSection.toLowerCase() === "index" ? "" : nextSection;
      continue;
    }

    const itemMatch = line.match(
      /^- \[(.+?)\]\((https?:\/\/.+?)\)\s*(?:-\s*(.*))?$/
    );
    if (itemMatch && currentSection) {
      commitPending();
      pending = {
        name: itemMatch[1],
        url: itemMatch[2],
        description: itemMatch[3] || "",
      };
      continue;
    }

    if (!pending) continue;
    if (/^##\s+/.test(line)) continue;
    if (/^- \[/.test(line)) continue;
    if (line.startsWith("<br")) continue;
    if (line.startsWith("[") && line.toLowerCase().includes("top")) continue;
    pending.description = pending.description
      ? `${pending.description} ${line}`
      : line;
  }

  commitPending();

  const sectionList = Array.from(sections.keys())
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({
      name,
      count: sections.get(name).length,
    }));

  const items = sectionList.flatMap((section) => sections.get(section.name));

  return { sections: sectionList, items };
}

function main() {
  const root = process.cwd();
  const primarySourcePath = path.join(root, "docs", "TOOLS.md");
  const fallbackSourcePath = path.join(root, "README.md");
  const readmePath = fs.existsSync(primarySourcePath)
    ? primarySourcePath
    : fallbackSourcePath;
  const outPath = path.join(root, "src", "data", "osint-tools.json");
  const markdown = fs.readFileSync(readmePath, "utf8");
  const parsed = parseReadme(markdown);
  fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2) + "\n", "utf8");
  console.log(`Generated ${outPath}`);
  console.log(`Source: ${readmePath}`);
  console.log(`Sections: ${parsed.sections.length}, Items: ${parsed.items.length}`);
}

main();
