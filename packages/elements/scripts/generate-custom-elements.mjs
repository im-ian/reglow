import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as elements from '../dist/index.js';

const { componentMetadata, reglowElementDefinitions } = elements;

function unique(values) {
  return [...new Set(values)];
}

function sorted(values) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function parseSlots(template) {
  return unique(
    [...String(template).matchAll(/<slot\b([^>]*)>/gu)].map((match) => {
      const name = match[1].match(/\bname=["']([^"']+)["']/u)?.[1];
      return name ?? 'default';
    }),
  );
}

function parseParts(template) {
  return unique(
    [...String(template).matchAll(/\bpart=["']([^"']+)["']/gu)].flatMap((match) =>
      match[1].trim().split(/\s+/u),
    ),
  );
}

function assertUnique(values, label) {
  if (unique(values).length !== values.length) {
    throw new Error(`${label} contains duplicates: ${values.join(', ')}`);
  }
}

function assertSameSet(actual, expected, label) {
  const normalizedActual = sorted(actual);
  const normalizedExpected = sorted(expected);
  if (JSON.stringify(normalizedActual) !== JSON.stringify(normalizedExpected)) {
    throw new Error(
      `${label} mismatch. Metadata: [${normalizedExpected.join(', ')}]; implementation: [${normalizedActual.join(', ')}]`,
    );
  }
}

function attributeToProperty(attribute) {
  return attribute.replace(/-([a-z])/gu, (_match, letter) => letter.toUpperCase());
}

function hasProperty(constructor, property) {
  let prototype = constructor.prototype;
  while (prototype) {
    if (Object.getOwnPropertyDescriptor(prototype, property)) return true;
    prototype = Object.getPrototypeOf(prototype);
  }
  return false;
}

assertUnique(
  componentMetadata.map(({ tag }) => tag),
  'Component tags',
);
assertUnique(
  componentMetadata.map(({ className }) => className),
  'Component class names',
);

const metadataByTag = new Map(componentMetadata.map((component) => [component.tag, component]));
assertSameSet(
  reglowElementDefinitions.map(({ tagName }) => tagName),
  metadataByTag.keys(),
  'Registered elements',
);

for (const { tagName, constructor } of reglowElementDefinitions) {
  const metadata = metadataByTag.get(tagName);
  if (!metadata) throw new Error(`Missing metadata for ${tagName}`);
  if (elements[metadata.className] !== constructor) {
    throw new Error(`${tagName} does not resolve to the exported ${metadata.className} class`);
  }

  assertUnique(metadata.attributes, `${tagName} attributes`);
  assertUnique(metadata.slots ?? [], `${tagName} slots`);
  assertUnique(metadata.parts ?? [], `${tagName} parts`);
  assertUnique(
    (metadata.events ?? []).map(({ name }) => name),
    `${tagName} events`,
  );

  const observedAttributes = constructor.observedAttributes ?? [];
  const missingObservedAttributes = observedAttributes.filter(
    (attribute) => !metadata.attributes.includes(attribute),
  );
  if (missingObservedAttributes.length > 0) {
    throw new Error(
      `${tagName} metadata is missing observed attributes: ${missingObservedAttributes.join(', ')}`,
    );
  }

  const undocumentedAttributeProperties = metadata.attributes.filter(
    (attribute) =>
      !observedAttributes.includes(attribute) &&
      !hasProperty(constructor, attributeToProperty(attribute)),
  );
  if (undocumentedAttributeProperties.length > 0) {
    throw new Error(
      `${tagName} metadata attributes have no observed attribute or public property: ${undocumentedAttributeProperties.join(', ')}`,
    );
  }

  assertSameSet(parseSlots(constructor.template), metadata.slots ?? [], `${tagName} slots`);
  assertSameSet(parseParts(constructor.template), metadata.parts ?? [], `${tagName} CSS parts`);
}

const declarations = componentMetadata.map((component) => ({
  kind: 'class',
  name: component.className,
  summary: component.summary,
  customElement: true,
  tagName: component.tag,
  attributes: component.attributes.map((name) => ({ name })),
  events: component.events?.map(({ name, type }) => ({ name, type: { text: type } })),
  slots: component.slots?.map((name) => ({ name: name === 'default' ? '' : name })),
  cssParts: component.parts?.map((name) => ({ name })),
}));

const manifest = {
  schemaVersion: '2.1.0',
  readme: 'README.md',
  modules: [
    {
      kind: 'javascript-module',
      path: 'dist/index.js',
      declarations,
      exports: componentMetadata.map(({ className }) => ({
        kind: 'js',
        name: className,
        declaration: { name: className },
      })),
    },
    {
      kind: 'javascript-module',
      path: 'dist/register.js',
      exports: componentMetadata.map(({ tag, className }) => ({
        kind: 'custom-element-definition',
        name: tag,
        declaration: { name: className, module: 'dist/index.js' },
      })),
    },
  ],
};

const outputPath = fileURLToPath(new URL('../custom-elements.json', import.meta.url));
await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Generated ${componentMetadata.length} component declarations in custom-elements.json`);
