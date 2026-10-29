// Verifies relative links and #anchors in every Markdown file of the repository.
// External (http/mailto) links are not fetched. Links inside code blocks/spans are ignored.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'reports',
  'test-results',
  'allure-results',
  'allure-report',
  'playwright-report',
  '.auth',
  // Skeleton docs link relative to where init:project copies them; checked in CI after init.
  'templates',
]);

function findMarkdown(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return SKIP_DIRS.has(entry.name) ? [] : findMarkdown(full);
    return entry.name.endsWith('.md') ? [full] : [];
  });
}

/** Removes fenced code blocks and inline code so example links are not checked. */
function stripCode(markdown) {
  return markdown.replace(/^(```|~~~)[\s\S]*?^\1/gm, '').replace(/`[^`\n]*`/g, '');
}

/** GitHub-style heading anchors, including -1, -2 suffixes for duplicates. */
function anchorsOf(markdown) {
  const seen = new Map();
  const anchors = new Set();
  for (const [, text] of stripCode(markdown).matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    const base = text
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s_-]/gu, '')
      .trim()
      .replace(/\s/g, '-');
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    anchors.add(count === 0 ? base : `${base}-${count}`);
  }
  return anchors;
}

const anchorCache = new Map();
function anchorsFor(file) {
  if (!anchorCache.has(file)) anchorCache.set(file, anchorsOf(fs.readFileSync(file, 'utf8')));
  return anchorCache.get(file);
}

const errors = [];
const files = findMarkdown(ROOT);

for (const file of files) {
  const body = stripCode(fs.readFileSync(file, 'utf8'));
  for (const [, rawTarget] of body.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(rawTarget)) continue; // http:, https:, mailto:, …
    const [linkPath, anchor] = rawTarget.split('#');
    const target = linkPath ? path.resolve(path.dirname(file), decodeURIComponent(linkPath)) : file;
    const where = `${path.relative(ROOT, file)} → ${rawTarget}`;

    if (!fs.existsSync(target)) {
      errors.push(`${where}: file not found`);
    } else if (anchor && target.endsWith('.md') && !anchorsFor(target).has(anchor)) {
      errors.push(`${where}: no heading with anchor #${anchor}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Broken documentation links (${errors.length}):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`docs:check — ${files.length} Markdown files, all relative links resolve.`);
