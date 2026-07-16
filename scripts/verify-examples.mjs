import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

const examples = [
  {
    directory: 'preact',
    packageName: '@reglow/example-preact',
    source: 'src/app.tsx',
    dependencies: ['@reglow/elements', '@reglow/preact', '@reglow/tokens', 'preact'],
    markers: ['@reglow/preact', '<rg-input', 'onrg-press'],
    registeredComponents: ['button', 'input', 'rating', 'select', 'switch'],
  },
  {
    directory: 'svelte',
    packageName: '@reglow/example-svelte',
    source: 'src/App.svelte',
    dependencies: ['@reglow/elements', '@reglow/svelte', '@reglow/tokens', 'svelte'],
    markers: ['@reglow/svelte', '<RgInput', 'bind:value'],
  },
  {
    directory: 'lit',
    packageName: '@reglow/example-lit',
    source: 'src/app.ts',
    dependencies: ['@reglow/elements', '@reglow/tokens', 'lit'],
    markers: ['defineElements', '.options=', '@rg-press='],
    registeredComponents: ['button', 'input', 'rating', 'select', 'switch'],
  },
  {
    directory: 'astro',
    packageName: '@reglow/example-astro',
    source: 'src/pages/index.astro',
    dependencies: ['@reglow/elements', '@reglow/tokens', 'astro'],
    markers: ['defineElements', '<rg-input', 'addEventListener'],
    registeredComponents: ['button', 'input', 'rating', 'select', 'switch'],
  },
  {
    directory: 'angular',
    packageName: '@reglow/example-angular',
    source: ['src/main.ts', 'src/app/app.ts', 'src/app/app.html'],
    dependencies: [
      '@angular/core',
      '@angular/forms',
      '@reglow/angular',
      '@reglow/elements',
      '@reglow/tokens',
    ],
    markers: ['REGLOW_FORM_DIRECTIVES', 'formControl', '<rg-input'],
    registeredComponents: ['badge', 'button', 'input', 'rating', 'select', 'switch'],
  },
];

const failures = [];
const workspace = readFileSync(resolve(root, 'pnpm-workspace.yaml'), 'utf8');
if (!workspace.includes('examples/*')) failures.push('pnpm workspace does not include examples/*');

for (const example of examples) {
  const directory = resolve(root, 'examples', example.directory);
  const manifestPath = resolve(directory, 'package.json');
  const sourceFiles = Array.isArray(example.source) ? example.source : [example.source];
  const sourcePaths = sourceFiles.map((source) => resolve(directory, source));

  if (!existsSync(manifestPath)) {
    failures.push(`${example.directory}: missing package.json`);
    continue;
  }
  const missingSource = sourceFiles.find((_, index) => !existsSync(sourcePaths[index]));
  if (missingSource) {
    failures.push(`${example.directory}: missing ${missingSource}`);
    continue;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.name !== example.packageName) {
    failures.push(`${example.directory}: expected package name ${example.packageName}`);
  }
  if (manifest.private !== true) failures.push(`${example.directory}: example must be private`);
  if (!manifest.scripts?.dev || !manifest.scripts?.build) {
    failures.push(`${example.directory}: dev and build scripts are required`);
  }

  const dependencies = { ...manifest.dependencies, ...manifest.devDependencies };
  for (const dependency of example.dependencies) {
    if (!dependencies[dependency]) failures.push(`${example.directory}: missing ${dependency}`);
  }

  const source = sourcePaths.map((sourcePath) => readFileSync(sourcePath, 'utf8')).join('\n');
  for (const marker of example.markers) {
    if (!source.includes(marker)) failures.push(`${example.directory}: source must use ${marker}`);
  }

  if (example.registeredComponents) {
    if (source.includes('@reglow/elements/register')) {
      failures.push(`${example.directory}: full element registration defeats tree-shaking`);
    }

    const registeredComponents = [
      ...source.matchAll(/@reglow\/elements\/components\/([a-z-]+)/g),
    ].map((match) => match[1]);
    const expectedComponents = [...example.registeredComponents].sort();
    const actualComponents = [...new Set(registeredComponents)].sort();
    if (actualComponents.join(',') !== expectedComponents.join(',')) {
      failures.push(
        `${example.directory}: expected selective registrations ${expectedComponents.join(', ')}, received ${actualComponents.join(', ') || 'none'}`,
      );
    }
  }
}

if (!existsSync(resolve(root, 'examples/README.md'))) {
  failures.push('missing examples/README.md');
}

if (failures.length > 0) {
  throw new Error(`Example project contract failed:\n- ${failures.join('\n- ')}`);
}

console.log(`Verified ${examples.length} runnable framework example projects.`);
