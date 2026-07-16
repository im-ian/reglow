import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = resolve(packageRoot, '../elements/custom-elements.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const outputDirectory = resolve(packageRoot, 'src/components');

const specialAttributeAliases = {
  autocomplete: 'autoComplete',
  crossorigin: 'crossOrigin',
  formnovalidate: 'formNoValidate',
  hreflang: 'hrefLang',
  inputmode: 'inputMode',
  maxlength: 'maxLength',
  minlength: 'minLength',
  readonly: 'readOnly',
  referrerpolicy: 'referrerPolicy',
  srcset: 'srcSet',
};

const eventAliasOverrides = {
  'rg-chip-group:rg-value-change': 'onSelectionChange',
  'rg-combobox:rg-value-change': 'onSelectionChange',
  'rg-rating:rg-value-change': 'onRatingChange',
  'rg-segmented-control:rg-value-change': 'onSelectionChange',
};

const slotAliasOverrides = {
  content: 'richContent',
  status: 'statusContent',
};

const componentModuleOverrides = {
  'rg-accordion-item': 'accordion',
  'rg-breadcrumb-item': 'breadcrumb',
  'rg-chip-group': 'chip',
  'rg-drawer': 'dialog',
  'rg-icon-button': 'button',
  'rg-menu-item': 'menu',
  'rg-option': 'select',
  'rg-radio-group': 'radio',
  'rg-segment': 'segmented-control',
  'rg-spinner': 'progress',
  'rg-step': 'step-indicator',
  'rg-tab': 'tabs',
  'rg-tab-panel': 'tabs',
  'rg-timeline-item': 'timeline',
  'rg-toast-region': 'toast',
};

const models = {
  'rg-accordion': [{ property: 'value', event: 'rg-value-change', fallback: "''" }],
  'rg-accordion-item': [{ property: 'open', event: 'rg-open-change', fallback: 'false' }],
  'rg-checkbox': [{ property: 'checked', event: 'change', fallback: 'false' }],
  'rg-chip-group': [{ property: 'value', event: 'rg-value-change', fallback: "''" }],
  'rg-combobox': [
    { property: 'value', event: 'change', fallback: "''" },
    { property: 'open', event: 'rg-open-change', fallback: 'false' },
  ],
  'rg-date-picker': [{ property: 'value', event: 'input', fallback: "''" }],
  'rg-dialog': [{ property: 'open', event: 'rg-open-change', fallback: 'false' }],
  'rg-drawer': [{ property: 'open', event: 'rg-open-change', fallback: 'false' }],
  'rg-input': [{ property: 'value', event: 'input', fallback: "''" }],
  'rg-menu': [{ property: 'open', event: 'rg-open-change', fallback: 'false' }],
  'rg-pagination': [{ property: 'page', event: 'rg-page-change', fallback: '1' }],
  'rg-popover': [{ property: 'open', event: 'rg-open-change', fallback: 'false' }],
  'rg-radio-group': [{ property: 'value', event: 'change', fallback: "''" }],
  'rg-rating': [{ property: 'value', event: 'input', fallback: '0' }],
  'rg-segmented-control': [{ property: 'value', event: 'rg-value-change', fallback: "''" }],
  'rg-select': [{ property: 'value', event: 'change', fallback: "''" }],
  'rg-slider': [{ property: 'value', event: 'input', fallback: '0' }],
  'rg-switch': [{ property: 'checked', event: 'change', fallback: 'false' }],
  'rg-tabs': [{ property: 'value', event: 'rg-value-change', fallback: "''" }],
  'rg-textarea': [{ property: 'value', event: 'input', fallback: "''" }],
  'rg-toast': [{ property: 'open', event: 'rg-open-change', fallback: 'false' }],
  'rg-tooltip': [{ property: 'open', event: 'rg-open-change', fallback: 'false' }],
};

function camelCase(value) {
  return value.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
}

function attributeAlias(name) {
  if (name.startsWith('aria-')) return name;
  return specialAttributeAliases[name] ?? camelCase(name);
}

function eventAlias(tag, name) {
  const override = eventAliasOverrides[`${tag}:${name}`];
  if (override) return override;
  if (name === 'input') return 'onValueChange';
  if (name === 'change') return 'onValueCommit';
  return `on${name
    .replace(/^rg-/, '')
    .split('-')
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join('')}`;
}

function slotAlias(name) {
  return slotAliasOverrides[name] ?? camelCase(name);
}

function qualifyEventType(type, namespace) {
  return type.replace(/\b([A-Z][A-Za-z0-9_]*)\b/g, (identifier) => {
    if (['AbortSignal', 'CustomEvent', 'Event', 'EventTarget', 'MouseEvent'].includes(identifier)) {
      return identifier;
    }
    return `${namespace}.${identifier}`;
  });
}

const components = manifest.modules.flatMap((module) =>
  (module.declarations ?? [])
    .filter((declaration) => declaration.customElement && declaration.tagName)
    .map((declaration) => {
      const moduleName =
        componentModuleOverrides[declaration.tagName] ?? declaration.tagName.replace(/^rg-/, '');
      const exportName = declaration.name.replace(/Element$/, '');
      const namespace = `${exportName.replace(/^Rg/, '')}Types`;
      const slots = (declaration.slots ?? [])
        .map(({ name }) => name)
        .filter(Boolean)
        .map((name) => ({ name, prop: slotAlias(name) }));
      const events = (declaration.events ?? []).map((event) => ({
        name: event.name,
        prop: eventAlias(declaration.tagName, event.name),
        type: event.type?.text ?? 'Event',
      }));
      const componentModels = models[declaration.tagName] ?? [];
      const slotProps = new Set(slots.map(({ prop }) => prop));
      const modelProps = new Set(componentModels.map(({ property }) => property));
      const attributes = (declaration.attributes ?? [])
        .map(({ name }) => ({ name, prop: attributeAlias(name) }))
        .filter(({ prop }) => !slotProps.has(prop) && !modelProps.has(prop));

      return {
        tag: declaration.tagName,
        className: declaration.name,
        exportName,
        namespace,
        module: `@reglow/elements/components/${moduleName}`,
        attributes,
        events,
        slots,
        models: componentModels,
      };
    }),
);

components.sort((left, right) => left.tag.localeCompare(right.tag));

function componentTypesSource() {
  const imports = components
    .map(({ module, namespace }) => `import type * as ${namespace} from '${module}';`)
    .join('\n');
  const definitions = components
    .map((component) => {
      const events = component.events
        .map(
          ({ prop, type }) =>
            `    ${prop}?: ReglowSvelteEventHandler<${component.namespace}.${component.className}, ${qualifyEventType(type, component.namespace)}>;`,
        )
        .join('\n');
      const slots = component.slots
        .map(({ prop }) => `    ${prop}?: ReglowSlotContent;`)
        .join('\n');
      const attributes = component.attributes
        .map(({ prop }) => `    ${JSON.stringify(prop)}?: ReglowAttributeValue;`)
        .join('\n');

      return `export type ${component.exportName}Props = ReglowSvelteProps<
  ${component.namespace}.${component.className},
  {\n${events}\n  },
  {\n${slots}\n  },
  {\n${attributes}\n  }
>;`;
    })
    .join('\n\n');

  return `${imports}
import type {
  ReglowAttributeValue,
  ReglowSlotContent,
  ReglowSvelteEventHandler,
  ReglowSvelteProps,
} from './types.js';

${definitions}
`;
}

function wrapperSource(component) {
  const destructured = [
    'element = $bindable(null)',
    'children',
    ...component.slots.map(({ prop }) => prop),
    ...component.events.map(({ prop }) => prop),
    ...component.models.map(({ property, fallback }) => `${property} = $bindable(${fallback})`),
    '...props',
  ];
  const modelByEvent = new Map(component.models.map((model) => [model.event, model]));
  const handlers = component.events
    .map((event) => {
      const model = modelByEvent.get(event.name);
      if (!model) return '';
      const handlerName = `handle${event.name
        .split('-')
        .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
        .join('')}`;
      return `  function ${handlerName}(event: Event): void {
    ${model.property} = (event.currentTarget as ${component.className}).${model.property};
    ${event.prop}?.(event as Parameters<NonNullable<${component.exportName}Props['${event.prop}']>>[0]);
  }`;
    })
    .filter(Boolean)
    .join('\n\n');
  const eventEntries = component.events
    .map((event) => {
      const model = modelByEvent.get(event.name);
      const value = model
        ? `handle${event.name
            .split('-')
            .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
            .join('')}`
        : event.prop;
      return `    '${event.name}': ${value},`;
    })
    .join('\n');
  const slotEntries = component.slots.map(({ name, prop }) => `    '${name}': ${prop},`).join('\n');
  const attributeEntries = component.attributes
    .filter(({ name, prop }) => name !== prop)
    .map(({ name, prop }) => `    ${JSON.stringify(prop)}: '${name}',`)
    .join('\n');
  const modelProps = component.models
    .map(({ property }) => `  ${property}={${property}}`)
    .join('\n');

  return `<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { ${component.className} } from '${component.module}';
  import type { ${component.exportName}Props } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    ${destructured.join(',\n    ')}
  }: ${component.exportName}Props = $props();

  defineElement({ tagName: ${component.className}.tagName, constructor: ${component.className} });

${handlers}

  const events = $derived({
${eventEntries}
  });
  const namedSlots = $derived({
${slotEntries}
  });
  const attributeMap = {
${attributeEntries}
  } as const;
</script>

<ReglowHost
  tag="${component.tag}"
  bind:element
  {events}
  {namedSlots}
  {attributeMap}
  {...props}
${modelProps}
>
  {@render children?.()}
</ReglowHost>
`;
}

function indexSource() {
  const values = components
    .map(
      ({ exportName }) =>
        `export { default as ${exportName} } from './components/${exportName}.svelte';`,
    )
    .join('\n');
  const types = components.map(({ exportName }) => `${exportName}Props`).join(',\n  ');
  return `${values}

export type {
  ${types},
} from './component-types.js';
export type {
  ReglowAttributeValue,
  ReglowHostEvent,
  ReglowSlotContent,
  ReglowSvelteEventHandler,
  ReglowSvelteProps,
} from './types.js';
`;
}

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });
for (const component of components) {
  writeFileSync(
    resolve(outputDirectory, `${component.exportName}.svelte`),
    wrapperSource(component),
  );
}
writeFileSync(resolve(packageRoot, 'src/component-types.ts'), componentTypesSource());
writeFileSync(resolve(packageRoot, 'src/index.ts'), indexSource());

console.log(`Generated ${components.length} Svelte wrappers.`);
