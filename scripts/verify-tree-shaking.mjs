import { JavaScriptTransformer } from '@angular/build/private';
import { brotliCompressSync, constants as zlibConstants, gzipSync } from 'node:zlib';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { build } from 'vite';

const root = resolve(import.meta.dirname, '..');
const packagesRoot = resolve(root, 'packages');
const consumerRoot = mkdtempSync(join(tmpdir(), 'reglow-tree-shaking-'));
const packageScope = join(consumerRoot, 'node_modules', '@reglow');
const angularFesmRoot = resolve(packagesRoot, 'angular/dist/fesm2022').replaceAll('\\', '/');

mkdirSync(packageScope, { recursive: true });
process.once('exit', () => rmSync(consumerRoot, { recursive: true, force: true }));

const packageManifests = readdirSync(packagesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const directory = resolve(packagesRoot, entry.name);
    const manifest = JSON.parse(readFileSync(resolve(directory, 'package.json'), 'utf8'));
    return { directory, manifest, name: entry.name };
  });

for (const packageEntry of packageManifests) {
  if (!existsSync(resolve(packageEntry.directory, 'dist'))) {
    throw new Error(
      `Missing ${packageEntry.manifest.name} dist. Run pnpm build before verification.`,
    );
  }

  const linkTarget =
    packageEntry.name === 'angular'
      ? resolve(packageEntry.directory, 'dist')
      : packageEntry.directory;
  symlinkSync(
    linkTarget,
    join(packageScope, packageEntry.name),
    process.platform === 'win32' ? 'junction' : 'dir',
  );
}

const customElementsManifest = JSON.parse(
  readFileSync(resolve(root, 'packages/elements/custom-elements.json'), 'utf8'),
);
const publicElementTags = customElementsManifest.modules.flatMap(
  (module) => module.declarations?.flatMap((declaration) => declaration.tagName ?? []) ?? [],
);

const selectedButtonRegistration = `
  import { defineElement } from '@reglow/elements';
  import { RgButtonElement } from '@reglow/elements/components/button';
  defineElement({ tagName: RgButtonElement.tagName, constructor: RgButtonElement });
`;

const angularValueAccessorTags = [
  'rg-input',
  'rg-textarea',
  'rg-select',
  'rg-radio-group',
  'rg-slider',
  'rg-combobox',
  'rg-date-picker',
  'rg-chip-group',
  'rg-segmented-control',
  'rg-rating',
];
const angularCheckedValueAccessorTags = ['rg-checkbox', 'rg-switch'];
const angularAllAccessorTags = publicElementTags.filter((tag) =>
  [...angularValueAccessorTags, ...angularCheckedValueAccessorTags].includes(tag),
);

const cases = [
  {
    name: 'tokens-palette',
    packageName: '@reglow/tokens',
    source: `import { reglowPalette } from '@reglow/tokens'; console.log(reglowPalette.cobalt);`,
    maxRawBytes: 250,
    maxGzipBytes: 250,
    maxBrotliBytes: 200,
    expectedCssAssets: 0,
  },
  {
    name: 'tokens-all',
    packageName: '@reglow/tokens',
    source: `import * as Tokens from '@reglow/tokens'; console.log(Object.keys(Tokens));`,
    maxRawBytes: 1_000,
    maxGzipBytes: 600,
    maxBrotliBytes: 550,
    expectedCssAssets: 0,
  },
  {
    name: 'tokens-css',
    packageName: '@reglow/tokens',
    source: `import '@reglow/tokens/css';`,
    maxRawBytes: 6_000,
    maxGzipBytes: 1_600,
    maxBrotliBytes: 1_400,
    expectedCssAssets: 1,
  },
  {
    name: 'elements-button',
    packageName: '@reglow/elements',
    source: selectedButtonRegistration,
    maxRawBytes: 25_000,
    maxGzipBytes: 8_000,
    maxBrotliBytes: 7_000,
    expectedComponents: ['rg-button'],
  },
  {
    name: 'elements-all',
    packageName: '@reglow/elements',
    source: `import '@reglow/elements/register';`,
    maxRawBytes: 300_000,
    maxGzipBytes: 58_000,
    maxBrotliBytes: 42_000,
    expectedComponentCount: publicElementTags.length,
  },
  {
    name: 'preact-types',
    packageName: '@reglow/preact',
    source: `import '@reglow/preact'; console.log('typed');`,
    externals: ['preact'],
    maxRawBytes: 100,
    maxGzipBytes: 200,
    maxBrotliBytes: 200,
    expectedComponents: [],
  },
  {
    name: 'preact-button',
    packageName: '@reglow/preact',
    source: `import '@reglow/preact'; ${selectedButtonRegistration}`,
    externals: ['preact'],
    maxRawBytes: 25_000,
    maxGzipBytes: 8_000,
    maxBrotliBytes: 7_000,
    expectedComponents: ['rg-button'],
  },
  {
    name: 'preact-all',
    packageName: '@reglow/preact',
    source: `import '@reglow/preact'; import '@reglow/elements/register';`,
    externals: ['preact'],
    maxRawBytes: 300_000,
    maxGzipBytes: 58_000,
    maxBrotliBytes: 42_000,
    expectedComponentCount: publicElementTags.length,
  },
  {
    name: 'react-button',
    packageName: '@reglow/react',
    source: `import { Button } from '@reglow/react'; console.log(Button.displayName);`,
    externals: ['react'],
    maxRawBytes: 27_000,
    maxGzipBytes: 9_000,
    maxBrotliBytes: 8_000,
    expectedComponents: ['rg-button'],
  },
  {
    name: 'react-all',
    packageName: '@reglow/react',
    source: `import * as Reglow from '@reglow/react'; console.log(Object.keys(Reglow));`,
    externals: ['react'],
    maxRawBytes: 310_000,
    maxGzipBytes: 61_000,
    maxBrotliBytes: 45_000,
    expectedComponentCount: publicElementTags.length,
  },
  {
    name: 'svelte-button',
    packageName: '@reglow/svelte',
    source: `import { RgButton } from '@reglow/svelte'; console.log(RgButton);`,
    externals: ['svelte'],
    maxRawBytes: 28_000,
    maxGzipBytes: 9_000,
    maxBrotliBytes: 8_000,
    expectedComponents: ['rg-button'],
  },
  {
    name: 'svelte-all',
    packageName: '@reglow/svelte',
    source: `import * as Reglow from '@reglow/svelte'; console.log(Object.keys(Reglow));`,
    externals: ['svelte'],
    maxRawBytes: 340_000,
    maxGzipBytes: 63_000,
    maxBrotliBytes: 46_000,
    expectedComponentCount: publicElementTags.length,
  },
  {
    name: 'vue-button',
    packageName: '@reglow/vue',
    source: `import { RgButton } from '@reglow/vue'; console.log(RgButton.name);`,
    externals: ['vue'],
    maxRawBytes: 28_000,
    maxGzipBytes: 9_000,
    maxBrotliBytes: 8_000,
    expectedComponents: ['rg-button'],
  },
  {
    name: 'vue-all',
    packageName: '@reglow/vue',
    source: `import * as Reglow from '@reglow/vue'; console.log(Object.keys(Reglow));`,
    externals: ['vue'],
    maxRawBytes: 320_000,
    maxGzipBytes: 63_000,
    maxBrotliBytes: 46_000,
    expectedComponentCount: publicElementTags.length,
  },
  {
    name: 'angular-value',
    packageName: '@reglow/angular',
    source: `import { ReglowValueAccessor } from '@reglow/angular'; console.log(ReglowValueAccessor);`,
    externals: ['@angular/core', '@angular/forms'],
    maxRawBytes: 2_500,
    maxGzipBytes: 1_200,
    maxBrotliBytes: 1_000,
    expectedComponents: angularValueAccessorTags,
  },
  {
    name: 'angular-checked',
    packageName: '@reglow/angular',
    source: `import { ReglowCheckedValueAccessor } from '@reglow/angular'; console.log(ReglowCheckedValueAccessor);`,
    externals: ['@angular/core', '@angular/forms'],
    maxRawBytes: 1_500,
    maxGzipBytes: 1_000,
    maxBrotliBytes: 900,
    expectedComponents: angularCheckedValueAccessorTags,
  },
  {
    name: 'angular-all',
    packageName: '@reglow/angular',
    source: `import * as Reglow from '@reglow/angular'; console.log(Object.keys(Reglow));`,
    externals: ['@angular/core', '@angular/forms'],
    maxRawBytes: 4_000,
    maxGzipBytes: 1_500,
    maxBrotliBytes: 1_300,
    expectedComponents: angularAllAccessorTags,
  },
];

const ratios = [
  { selected: 'tokens-palette', complete: 'tokens-all', max: 0.5 },
  { selected: 'elements-button', complete: 'elements-all', max: 0.5 },
  { selected: 'preact-button', complete: 'preact-all', max: 0.5 },
  { selected: 'react-button', complete: 'react-all', max: 0.5 },
  { selected: 'svelte-button', complete: 'svelte-all', max: 0.5 },
  { selected: 'vue-button', complete: 'vue-all', max: 0.5 },
  { selected: 'angular-value', complete: 'angular-all', max: 0.85 },
  { selected: 'angular-checked', complete: 'angular-all', max: 0.85 },
];

const angularTransformer = new JavaScriptTransformer(
  { sourcemap: false, advancedOptimizations: true },
  1,
);

const angularLinkerPlugin = {
  name: 'reglow-angular-linker',
  enforce: 'pre',
  async transform(code, id) {
    const normalizedId = id.split('?')[0].replaceAll('\\', '/');
    if (!normalizedId.startsWith(angularFesmRoot) || !normalizedId.endsWith('.mjs'))
      return undefined;

    const transformed = await angularTransformer.transformData(normalizedId, code, false, false);
    return { code: Buffer.from(transformed).toString('utf8'), map: null };
  },
};

function isExternal(id, externals = []) {
  return externals.some((dependency) => id === dependency || id.startsWith(`${dependency}/`));
}

function payloadForOutput(entry) {
  if (entry.type === 'chunk') return Buffer.from(entry.code);
  if (typeof entry.source === 'string') return Buffer.from(entry.source);
  return Buffer.from(entry.source);
}

function compressedSize(payload, algorithm) {
  if (payload.byteLength === 0) return 0;
  if (algorithm === 'gzip') return gzipSync(payload, { level: 9 }).byteLength;
  return brotliCompressSync(payload, {
    params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 },
  }).byteLength;
}

async function bundle(testCase) {
  const virtualId = '\0reglow-tree-shaking-entry';
  const result = await build({
    configFile: false,
    root: consumerRoot,
    logLevel: 'silent',
    plugins: [
      angularLinkerPlugin,
      svelte({
        configFile: resolve(root, 'packages/svelte/svelte.config.js'),
      }),
      {
        name: 'reglow-tree-shaking-entry',
        resolveId(id) {
          if (id === 'reglow-tree-shaking-entry') return virtualId;
          return undefined;
        },
        load(id) {
          if (id === virtualId) return testCase.source;
          return undefined;
        },
      },
    ],
    build: {
      write: false,
      minify: 'oxc',
      rollupOptions: {
        input: 'reglow-tree-shaking-entry',
        external: (id) => isExternal(id, testCase.externals),
      },
    },
  });
  const outputs = Array.isArray(result) ? result.flatMap((entry) => entry.output) : result.output;
  const payloads = outputs.map(payloadForOutput).filter((payload) => payload.byteLength > 0);
  const code = outputs
    .filter((entry) => entry.type === 'chunk')
    .map((entry) => entry.code)
    .join('\n');
  const cssAssets = outputs.filter(
    (entry) =>
      entry.type === 'asset' &&
      entry.fileName.endsWith('.css') &&
      payloadForOutput(entry).byteLength > 0,
  );

  return {
    name: testCase.name,
    rawBytes: payloads.reduce((total, payload) => total + payload.byteLength, 0),
    gzipBytes: payloads.reduce((total, payload) => total + compressedSize(payload, 'gzip'), 0),
    brotliBytes: payloads.reduce((total, payload) => total + compressedSize(payload, 'brotli'), 0),
    cssBytes: cssAssets.reduce((total, entry) => total + payloadForOutput(entry).byteLength, 0),
    cssAssetCount: cssAssets.length,
    code,
    componentTags: publicElementTags.filter(
      (tag) =>
        code.includes(`"${tag}"`) || code.includes(`'${tag}'`) || code.includes(`\`${tag}\``),
    ),
  };
}

const failures = [];
const publishedPackages = packageManifests.filter(({ manifest }) => manifest.private !== true);
for (const { manifest } of publishedPackages) {
  if (!cases.some((testCase) => testCase.packageName === manifest.name)) {
    failures.push(`${manifest.name} has no consumer bundle case`);
  }
}

for (const packageName of ['@reglow/preact', '@reglow/angular']) {
  const manifest = publishedPackages.find((entry) => entry.manifest.name === packageName)?.manifest;
  if (manifest?.dependencies?.['@reglow/elements']) {
    failures.push(`${packageName} must not install its type/host contract as a runtime dependency`);
  }
  if (!manifest?.peerDependencies?.['@reglow/elements']) {
    failures.push(`${packageName} must declare @reglow/elements as a peer dependency`);
  }
}

const results = [];
try {
  for (const testCase of cases) results.push(await bundle(testCase));
} finally {
  await angularTransformer.close();
}

console.table(
  results.map(({ name, rawBytes, gzipBytes, brotliBytes, cssBytes, componentTags }) => ({
    name,
    rawBytes,
    gzipBytes,
    brotliBytes,
    cssBytes,
    componentCount: componentTags.length,
    components:
      componentTags.length <= 3 ? componentTags.join(', ') : `all ${componentTags.length}`,
  })),
);

for (const testCase of cases) {
  const result = results.find(({ name }) => name === testCase.name);
  if (result.rawBytes > testCase.maxRawBytes) {
    failures.push(
      `${testCase.name} is ${result.rawBytes} bytes raw; expected at most ${testCase.maxRawBytes}`,
    );
  }
  if (result.gzipBytes > testCase.maxGzipBytes) {
    failures.push(
      `${testCase.name} is ${result.gzipBytes} bytes gzip; expected at most ${testCase.maxGzipBytes}`,
    );
  }
  if (result.brotliBytes > testCase.maxBrotliBytes) {
    failures.push(
      `${testCase.name} is ${result.brotliBytes} bytes brotli; expected at most ${testCase.maxBrotliBytes}`,
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
  if (
    testCase.expectedCssAssets !== undefined &&
    result.cssAssetCount !== testCase.expectedCssAssets
  ) {
    failures.push(
      `${testCase.name} emits ${result.cssAssetCount} CSS assets; expected ${testCase.expectedCssAssets}`,
    );
  }
  for (const marker of testCase.expectedContains ?? []) {
    if (!result.code.includes(marker)) failures.push(`${testCase.name} is missing ${marker}`);
  }
  for (const marker of testCase.expectedExcludes ?? []) {
    if (result.code.includes(marker))
      failures.push(`${testCase.name} unexpectedly contains ${marker}`);
  }
}

for (const ratio of ratios) {
  const selected = results.find(({ name }) => name === ratio.selected);
  const complete = results.find(({ name }) => name === ratio.complete);
  for (const [metric, label] of [
    ['rawBytes', 'raw'],
    ['gzipBytes', 'gzip'],
    ['brotliBytes', 'brotli'],
  ]) {
    if (selected[metric] >= complete[metric] * ratio.max) {
      failures.push(
        `${ratio.selected} is not meaningfully smaller than ${ratio.complete} (${selected[metric]} vs ${complete[metric]} bytes ${label})`,
      );
    }
  }
}

if (failures.length > 0) {
  throw new Error(`Tree-shaking verification failed:\n- ${failures.join('\n- ')}`);
}
