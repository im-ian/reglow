import {
  Comment,
  Fragment,
  Text,
  cloneVNode,
  defineComponent,
  h,
  isVNode,
  onBeforeUnmount,
  onMounted,
  ref,
  watchEffect,
  type App,
  type Component,
  type DefineComponent,
  type VNode,
} from 'vue';
import { defineElement, type ReglowElementConstructor } from '@reglow/elements';

interface ModelConfig {
  property: string;
  event: string;
}

export interface VueAdapterConfig {
  displayName: string;
  props?: readonly string[];
  events?: Readonly<Record<string, string>>;
  attributes?: Readonly<Record<string, string>>;
  properties?: readonly string[];
  slots?: readonly string[] | Readonly<Record<string, string>>;
  booleanProps?: readonly string[];
  booleanOrStringProps?: readonly string[];
  numberProps?: readonly string[];
  model?: ModelConfig;
  propertyDefaults?: Readonly<Record<string, unknown>>;
}

function slotted(nodes: unknown, slot: string): VNode[] {
  if (nodes == null || nodes === false || nodes === true) return [];
  if (Array.isArray(nodes)) return nodes.flatMap((node) => slotted(node, slot));

  if (!isVNode(nodes)) {
    return [h('span', { slot, style: { display: 'contents' } }, String(nodes))];
  }

  if (nodes.type === Comment) return [];
  if (nodes.type === Fragment) return slotted(nodes.children, slot);
  if (nodes.type === Text) {
    return [h('span', { slot, style: { display: 'contents' } }, String(nodes.children ?? ''))];
  }

  if (typeof nodes.type === 'string') return [cloneVNode(nodes, { slot })];

  return [h('span', { slot, style: { display: 'contents' } }, [nodes])];
}

function normalizeNumber(value: unknown): unknown {
  if (typeof value !== 'string' || value.trim() === '') return value;
  const number = Number(value);
  return Number.isFinite(number) ? number : value;
}

export function createReglowVueComponent<TElement extends HTMLElement, TProps extends object>(
  tagName: `rg-${string}`,
  config: VueAdapterConfig,
  elementConstructor?: ReglowElementConstructor,
): DefineComponent<TProps> {
  if (elementConstructor) defineElement({ tagName, constructor: elementConstructor });

  const booleanProps = new Set(config.booleanProps ?? []);
  const booleanOrStringProps = new Set(config.booleanOrStringProps ?? []);
  const numberProps = new Set(config.numberProps ?? []);
  const runtimeProps = Object.fromEntries(
    [...(config.props ?? []), ...(config.model ? ['modelValue'] : [])].map((name) => {
      if (booleanProps.has(name)) {
        return [name, { type: Boolean, default: undefined }];
      }
      if (booleanOrStringProps.has(name)) {
        return [name, { type: [Boolean, String], default: undefined }];
      }
      if (numberProps.has(name)) {
        return [name, { type: [Number, String], default: undefined }];
      }
      return [name, null];
    }),
  );
  const eventNames = [...new Set(Object.values(config.events ?? {}))];
  if (config.model) eventNames.push('update:modelValue');

  const component = defineComponent({
    name: config.displayName,
    inheritAttrs: false,
    props: runtimeProps,
    emits: eventNames,
    setup(rawProps, { attrs, slots, emit, expose }) {
      const props = rawProps as unknown as Record<string, unknown>;
      const element = ref<TElement | null>(null);
      const cleanups: Array<() => void> = [];

      expose({ element });

      onMounted(() => {
        const target = element.value;
        if (!target) return;

        Object.entries(config.events ?? {}).forEach(([domEvent, vueEvent]) => {
          const listener = (event: Event) => emit(vueEvent, event);
          target.addEventListener(domEvent, listener);
          cleanups.push(() => target.removeEventListener(domEvent, listener));
        });

        if (config.model) {
          const listener = () => {
            const modelTarget = target as TElement & Record<string, unknown>;
            emit('update:modelValue', modelTarget[config.model!.property]);
          };
          target.addEventListener(config.model.event, listener);
          cleanups.push(() => target.removeEventListener(config.model!.event, listener));
        }
      });

      onBeforeUnmount(() => cleanups.forEach((cleanup) => cleanup()));

      watchEffect(() => {
        const target = element.value;
        if (!target) return;
        const propertyTarget = target as unknown as Record<string, unknown>;

        (config.properties ?? []).forEach((property) => {
          propertyTarget[property] =
            props[property] === undefined ? config.propertyDefaults?.[property] : props[property];
        });

        if (config.model && props.modelValue !== undefined) {
          propertyTarget[config.model.property] = props.modelValue;
        }
      });

      return () => {
        const domProps: Record<string, unknown> = { ...attrs, ref: element };
        const propertyNames = new Set(config.properties ?? []);
        const mappedAttributes = config.attributes ?? {};

        Object.entries(props).forEach(([name, value]) => {
          if (name === 'modelValue') return;
          if (propertyNames.has(name)) {
            if (value !== undefined) {
              domProps[name] = numberProps.has(name) ? normalizeNumber(value) : value;
            }
            return;
          }
          if (value === false || value == null) return;
          domProps[mappedAttributes[name] ?? name] = numberProps.has(name)
            ? normalizeNumber(value)
            : value;
        });

        if (config.model && props.modelValue !== undefined) {
          domProps[config.model.property] = numberProps.has('modelValue')
            ? normalizeNumber(props.modelValue)
            : props.modelValue;
        }

        const children: VNode[] = [...(slots.default?.() ?? [])];
        const slotEntries = Array.isArray(config.slots)
          ? config.slots.map((slot) => [slot, slot] as const)
          : Object.entries(config.slots ?? {});
        slotEntries.forEach(([vueSlot, nativeSlot]) => {
          children.push(...slotted(slots[vueSlot]?.(), nativeSlot));
        });

        return h(tagName, domProps, children);
      };
    },
  });

  return component as unknown as DefineComponent<TProps>;
}

export function createReglowPlugin(components: Readonly<Record<string, Component>>) {
  return {
    install(app: App): void {
      Object.entries(components).forEach(([name, component]) => app.component(name, component));
    },
  };
}
