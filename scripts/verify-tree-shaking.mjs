import { gzipSync } from 'node:zlib';
import { resolve } from 'node:path';
import { build } from 'vite';

const root = resolve(import.meta.dirname, '..');

const cases = [
  {
    name: 'elements-button',
    source: `import { RgButtonElement } from '${resolve(root, 'packages/elements/dist/index.js')}'; console.log(RgButtonElement.tagName);`,
    maxGzipBytes: 8_000,
  },
  {
    name: 'elements-all',
    source: `import '${resolve(root, 'packages/elements/dist/register.js')}';`,
  },
  {
    name: 'react-button',
    source: `import { Button } from '${resolve(root, 'packages/react/dist/index.js')}'; console.log(Button.displayName);`,
    external: 'react',
    maxGzipBytes: 14_000,
  },
  {
    name: 'react-all',
    source: `import * as Reglow from '${resolve(root, 'packages/react/dist/index.js')}'; console.log(Object.keys(Reglow));`,
    external: 'react',
  },
  {
    name: 'vue-button',
    source: `import { RgButton } from '${resolve(root, 'packages/vue/dist/index.js')}'; console.log(RgButton.name);`,
    external: 'vue',
    maxGzipBytes: 16_000,
  },
  {
    name: 'vue-all',
    source: `import * as Reglow from '${resolve(root, 'packages/vue/dist/index.js')}'; console.log(Object.keys(Reglow));`,
    external: 'vue',
  },
];

async function bundle(testCase) {
  const virtualId = '\0reglow-tree-shaking-entry';
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    plugins: [
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
    includesUnusedAccordion: code.includes('rg-accordion'),
  };
}

const results = [];
for (const testCase of cases) results.push(await bundle(testCase));

console.table(
  results.map(({ name, rawBytes, gzipBytes, includesUnusedAccordion }) => ({
    name,
    rawBytes,
    gzipBytes,
    includesUnusedAccordion,
  })),
);

const failures = [];
for (const testCase of cases) {
  if (!testCase.maxGzipBytes) continue;
  const result = results.find(({ name }) => name === testCase.name);
  if (result.gzipBytes > testCase.maxGzipBytes) {
    failures.push(
      `${testCase.name} is ${result.gzipBytes} bytes gzip; expected at most ${testCase.maxGzipBytes}`,
    );
  }
  if (result.includesUnusedAccordion) {
    failures.push(`${testCase.name} contains the unused accordion implementation`);
  }
}

for (const family of ['elements', 'react', 'vue']) {
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
