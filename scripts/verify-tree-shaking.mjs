import { gzipSync } from 'node:zlib';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { build } from 'vite';

const root = resolve(import.meta.dirname, '..');
const consumerRoot = mkdtempSync(join(tmpdir(), 'reglow-tree-shaking-'));
const packageScope = join(consumerRoot, 'node_modules', '@reglow');
mkdirSync(packageScope, { recursive: true });
for (const packageName of ['elements', 'preact', 'react', 'svelte', 'vue']) {
  symlinkSync(
    resolve(root, 'packages', packageName),
    join(packageScope, packageName),
    process.platform === 'win32' ? 'junction' : 'dir',
  );
}
process.once('exit', () => rmSync(consumerRoot, { recursive: true, force: true }));

const customElementsManifest = JSON.parse(
  readFileSync(resolve(root, 'packages/elements/custom-elements.json'), 'utf8'),
);
const publicElementTags = customElementsManifest.modules.flatMap(
  (module) => module.declarations?.flatMap((declaration) => declaration.tagName ?? []) ?? [],
);

const cases = [
  {
    name: 'elements-button',
    source: `import { RgButtonElement } from '@reglow/elements'; console.log(RgButtonElement.tagName);`,
    maxGzipBytes: 8_000,
    expectedComponents: ['rg-button'],
  },
  {
    name: 'elements-all',
    source: `import '@reglow/elements/register';`,
  },
  {
    name: 'elements-source-register',
    source: `import ${JSON.stringify(resolve(root, 'packages/elements/src/register.ts'))};`,
    expectedComponentCount: publicElementTags.length,
  },
  {
    name: 'preact-types',
    source: `import '@reglow/preact'; console.log('typed');`,
    external: 'preact',
    maxGzipBytes: 200,
    expectedComponents: [],
  },
  {
    name: 'react-button',
    source: `import { Button } from '@reglow/react'; console.log(Button.displayName);`,
    external: 'react',
    maxGzipBytes: 14_000,
    expectedComponents: ['rg-button'],
  },
  {
    name: 'react-all',
    source: `import * as Reglow from '@reglow/react'; console.log(Object.keys(Reglow));`,
    external: 'react',
  },
  {
    name: 'svelte-button',
    source: `import { RgButton } from '@reglow/svelte'; console.log(RgButton);`,
    external: 'svelte',
    maxGzipBytes: 14_000,
    expectedComponents: ['rg-button'],
  },
  {
    name: 'svelte-all',
    source: `import * as Reglow from '@reglow/svelte'; console.log(Object.keys(Reglow));`,
    external: 'svelte',
  },
  {
    name: 'vue-button',
    source: `import { RgButton } from '@reglow/vue'; console.log(RgButton.name);`,
    external: 'vue',
    maxGzipBytes: 16_000,
    expectedComponents: ['rg-button'],
  },
  {
    name: 'vue-all',
    source: `import * as Reglow from '@reglow/vue'; console.log(Object.keys(Reglow));`,
    external: 'vue',
  },
];

async function bundle(testCase) {
  const virtualId = '\0reglow-tree-shaking-entry';
  const result = await build({
    configFile: false,
    root: consumerRoot,
    logLevel: 'silent',
    plugins: [
      svelte({
        configFile: resolve(root, 'packages/svelte/svelte.config.js'),
      }),
      {
        name: 'reglow-tree-shaking-entry',
        resolveId(id) {
          if (id === 'reglow-tree-shaking-entry') return virtualId;
        },
        load(id) {
          if (id === virtualId) return testCase.source;
        },
      },
    ],
    build: {
      write: false,
      minify: 'oxc',
      rollupOptions: {
        input: 'reglow-tree-shaking-entry',
        external: (id) =>
          Boolean(
            testCase.external &&
            (id === testCase.external || id.startsWith(`${testCase.external}/`)),
          ),
      },
    },
  });
  const outputs = Array.isArray(result) ? result.flatMap((entry) => entry.output) : result.output;
  const code = outputs
    .filter((entry) => entry.type === 'chunk')
    .map((entry) => entry.code)
    .join('\n');

  return {
    name: testCase.name,
    rawBytes: Buffer.byteLength(code),
    gzipBytes: gzipSync(code).byteLength,
    componentTags: publicElementTags.filter(
      (tag) =>
        code.includes(`"${tag}"`) || code.includes(`'${tag}'`) || code.includes(`\`${tag}\``),
    ),
  };
}

const results = [];
for (const testCase of cases) results.push(await bundle(testCase));

console.table(
  results.map(({ name, rawBytes, gzipBytes, componentTags }) => ({
    name,
    rawBytes,
    gzipBytes,
    componentCount: componentTags.length,
    components:
      componentTags.length <= 3 ? componentTags.join(', ') : `all ${componentTags.length}`,
  })),
);

const failures = [];
for (const testCase of cases) {
  const result = results.find(({ name }) => name === testCase.name);
  if (testCase.maxGzipBytes && result.gzipBytes > testCase.maxGzipBytes) {
    failures.push(
      `${testCase.name} is ${result.gzipBytes} bytes gzip; expected at most ${testCase.maxGzipBytes}`,
    );
  }
  if (
    testCase.expectedComponents &&
    result.componentTags.join(',') !== testCase.expectedComponents.join(',')
  ) {
    failures.push(
      `${testCase.name} contains ${result.componentTags.join(', ') || 'no'} component implementations; expected ${testCase.expectedComponents.join(', ') || 'none'}`,
    );
  }
  if (
    testCase.expectedComponentCount &&
    result.componentTags.length !== testCase.expectedComponentCount
  ) {
    failures.push(
      `${testCase.name} contains ${result.componentTags.length} registered components; expected ${testCase.expectedComponentCount}`,
    );
  }
}

for (const family of ['elements', 'react', 'svelte', 'vue']) {
  const selected = results.find(({ name }) => name === `${family}-button`);
  const complete = results.find(({ name }) => name === `${family}-all`);
  if (selected.gzipBytes >= complete.gzipBytes * 0.5) {
    failures.push(
      `${family} selected import is not meaningfully smaller than the complete bundle (${selected.gzipBytes} vs ${complete.gzipBytes} bytes gzip)`,
    );
  }
}

if (failures.length > 0) {
  throw new Error(`Tree-shaking verification failed:\n- ${failures.join('\n- ')}`);
}
