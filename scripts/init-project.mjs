// One-time project initialisation: removes the bundled demo app (SauceDemo + Restful-Booker) and
// installs a working skeleton from templates/skeleton/. Usage:
//   npm run init:project -- --name my-app          # dry run: show what would change
//   npm run init:project -- --name my-app --yes    # apply
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SKELETON = path.join(ROOT, 'templates', 'skeleton');

/** Demo-only files and folders. Everything else in src/, tests/ and config/ is framework code. */
const DEMO_PATHS = [
  'src/pages/login.page.ts',
  'src/pages/inventory.page.ts',
  'src/pages/cart.page.ts',
  'src/pages/checkout.pages.ts',
  'src/pages/components/header.component.ts',
  'src/pages/components/side-menu.component.ts',
  'src/pages/components/product-card.component.ts',
  'src/api/auth.api.ts',
  'src/api/booking.api.ts',
  'src/api/schemas/booking.schema.ts',
  'src/utils/builders.ts',
  'src/utils/catalog.ts',
  'src/utils/money.ts',
  'src/types/product.types.ts',
  'tests/e2e',
  'tests/api',
  'docs/adr/0006-public-demo-applications-as-targets.md',
];

/** Output of earlier demo runs (saved sessions, reports) that would be stale afterwards. */
const LOCAL_OUTPUT = ['.auth', 'test-results', 'reports', 'allure-results'];

/** The init machinery itself — removed once it has run. */
const INIT_ONLY = ['templates', 'scripts/init-project.mjs', '.github/workflows/seed-init.yml'];

function parseArgs(argv) {
  const args = { yes: false, name: undefined, help: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--yes' || argv[i] === '-y') args.yes = true;
    else if (argv[i] === '--help' || argv[i] === '-h') args.help = true;
    else if (argv[i] === '--name') args.name = argv[++i];
    else if (argv[i].startsWith('--name=')) args.name = argv[i].slice('--name='.length);
    else fail(`Unknown argument: ${argv[i]}`);
  }
  return args;
}

function fail(message) {
  console.error(`init:project — ${message}`);
  process.exit(1);
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

const remove = (p) => fs.rmSync(path.join(ROOT, p), { recursive: true, force: true });

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log('Usage: npm run init:project -- --name <package-name> [--yes]');
  process.exit(0);
}
if (!fs.existsSync(SKELETON))
  fail('templates/skeleton is missing — this project has already been initialised.');
if (!args.name || !/^[a-z0-9][a-z0-9._-]*$/.test(args.name)) {
  fail('pass --name <package-name> (lowercase letters, digits, ".", "_" or "-"), e.g. --name checkout-e2e');
}

const templateFiles = listFiles(SKELETON).map((file) => path.relative(SKELETON, file));
const plan = [
  ['Delete demo code', DEMO_PATHS],
  ['Delete local demo output', LOCAL_OUTPUT],
  ['Write skeleton files', templateFiles.map((f) => f.split(path.sep).join('/'))],
  [
    'Update package.json',
    [`name → ${args.name}`, 'version → 0.1.0', 'remove init:project script and seed repository link'],
  ],
  ['Remove init machinery', INIT_ONLY],
];

console.log(`\nInitialising "${args.name}" from the Playwright framework seed\n`);
for (const [step, items] of plan) {
  console.log(`${step}:`);
  for (const item of items) console.log(`  - ${item}`);
}

if (!args.yes) {
  console.log('\nDry run — nothing changed. Re-run with --yes to apply.');
  process.exit(0);
}

for (const p of [...DEMO_PATHS, ...LOCAL_OUTPUT]) remove(p);

for (const file of templateFiles) {
  const target = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(SKELETON, file), target);
}

const pkgPath = path.join(ROOT, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.name = args.name;
pkg.version = '0.1.0';
pkg.description = 'End-to-end and API tests built on the Playwright framework seed.';
for (const key of ['repository', 'author', 'keywords']) delete pkg[key];
delete pkg.scripts['init:project'];
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

/** Rewrites a text file in place. */
function edit(file, transform) {
  const full = path.join(ROOT, file);
  fs.writeFileSync(full, transform(fs.readFileSync(full, 'utf8')));
}
const withoutLines = (needle) => (text) =>
  text
    .split('\n')
    .filter((line) => !line.includes(needle))
    .join('\n');

edit('README.md', (text) => text.replace('TODO: project name', args.name));
edit('docs/adr/README.md', withoutLines('0006-public-demo'));
edit('.claude/rules/config-and-reporting.md', withoutLines('init-project.mjs'));
// The "Changing the seed itself" section is the last one in CONTRIBUTING.md.
edit('CONTRIBUTING.md', (text) => text.replace(/\n+## Changing the seed itself[\s\S]*$/, '\n'));

if (!fs.existsSync(path.join(ROOT, '.env'))) {
  fs.copyFileSync(path.join(ROOT, '.env.example'), path.join(ROOT, '.env'));
  console.log('\nCreated .env from .env.example.');
} else {
  console.log('\nKept your existing .env — compare it with the new .env.example.');
}

for (const p of INIT_ONLY) remove(p);

console.log(`
Done. "${args.name}" now contains the framework plus a minimal skeleton that tests a local sandbox app.

Next steps:
  1. npm test                      # the skeleton passes out of the box
  2. Follow docs/make-it-yours.md  # point it at your application
  3. Commit: git add -A && git commit -m "chore: initialise ${args.name} from Playwright seed"
`);
