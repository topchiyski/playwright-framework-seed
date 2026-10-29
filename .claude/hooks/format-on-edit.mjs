// PostToolUse hook (Edit|Write): formats the edited file with the repo's Prettier config.
// Never blocks the agent — formatting problems are reported on stderr and the hook exits 0.
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const FORMATTABLE = new Set(['.ts', '.js', '.mjs', '.cjs', '.json', '.md', '.yml', '.yaml']);

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
  let filePath;
  try {
    filePath = JSON.parse(input).tool_input?.file_path;
  } catch {
    process.exit(0);
  }
  if (!filePath || !FORMATTABLE.has(path.extname(filePath).toLowerCase())) process.exit(0);

  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const prettier = path.join(projectDir, 'node_modules', 'prettier', 'bin', 'prettier.cjs');
  // Run from the project root so .prettierrc.json and .prettierignore (reports, .auth…) apply.
  const result = spawnSync(
    process.execPath,
    [prettier, '--write', '--log-level=warn', '--ignore-unknown', filePath],
    { cwd: projectDir, encoding: 'utf8' },
  );
  if (result.status !== 0) {
    process.stderr.write(`prettier failed for ${filePath}:\n${result.stderr || result.stdout}`);
  }
  process.exit(0);
});
