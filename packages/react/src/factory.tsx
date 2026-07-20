import {
  cloneElement,
  createElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ForwardRefExoticComponent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefAttributes,
} from 'react';
import { defineElement, type ReglowElementConstructor } from '@reglow/elements';

type UnknownProps = Record<string, unknown> & { children?: ReactNode };

interface AdapterConfig {
  displayName: string;
  events?: Readonly<Record<string, string>>;
  attributes?: Readonly<Record<string, string>>;
  properties?: readonly string[];
  propertyDefaults?: Readonly<Record<string, unknown>>;
  slots?: Readonly<Record<string, string>>;
}

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function syncElementProperties(
  element: HTMLElement,
  values: Readonly<Record<string, unknown>>,
): void {
  const propertyTarget = element as unknown as Record<string, unknown>;
  Object.entries(values).forEach(([property, value]) => {
    propertyTarget[property] = value;
  });
}

function isCustomElementProperty(element: HTMLElement, property: string): boolean {
  if (Object.prototype.hasOwnProperty.call(element, property)) return true;

  let prototype = Object.getPrototypeOf(element) as object | null;
  while (prototype && prototype !== HTMLElement.prototype) {
    if (Object.getOwnPropertyDescriptor(prototype, property)) return true;
    prototype = Object.getPrototypeOf(prototype) as object | null;
  }
  return false;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

function toSlot(slot: string, value: ReactNode): ReactNode {
  if (value === null || value === undefined || value === false) return null;
  if (isValidElement(value) && typeof value.type === 'string') {
    return cloneElement(value as ReactElement<{ slot?: string }>, { slot });
  }
  return createElement('span', { slot, style: { display: 'contents' } }, value);
}

export function createReglowComponent<TElement extends HTMLElement, TProps extends object>(
  tagName: `rg-${string}`,
  config: AdapterConfig,
  elementConstructor?: ReglowElementConstructor,
): ForwardRefExoticComponent<TProps & RefAttributes<TElement>> {
  if (elementConstructor) defineElement({ tagName, constructor: elementConstructor });

  const interactionState = elementConstructor?.interactionState ?? {};
  const interactionPropertiesByEvent = new Map<string, string[]>();
  Object.entries(interactionState).forEach(([property, descriptor]) => {
    descriptor.events.forEach((eventName) => {
      const properties = interactionPropertiesByEvent.get(eventName) ?? [];
      properties.push(property);
      interactionPropertiesByEvent.set(eventName, properties);
    });
  });
  const eventPropNames = new Set(Object.keys(config.events ?? {}));
  const propertyNames = new Set(config.properties ?? []);
  const slotPropNames = new Set(Object.keys(config.slots ?? {}));

  const Component = forwardRef<TElement, TProps>((typedProps, forwardedRef) => {
    const props = typedProps as UnknownProps;
    const localRef = useRef<TElement | null>(null);
    const committedInteractionValues = useRef<Readonly<Record<string, unknown>>>({});
    const configuredPropertyPresence = useRef<Readonly<Record<string, boolean>>>({});
    const eventHandlers = Object.entries(config.events ?? {}).map(([propName]) => props[propName]);

    const setRef = useCallback(
      (node: TElement | null) => {
        localRef.current = node;
        assignRef(forwardedRef, node);
      },
      [forwardedRef],
    );

    useClientLayoutEffect(() => {
      const element = localRef.current;
      if (!element) return;

      const values: Record<string, unknown> = {};
      Object.entries(props).forEach(([property, value]) => {
        if (
          property !== 'children' &&
          !eventPropNames.has(property) &&
          !propertyNames.has(property) &&
          !slotPropNames.has(property) &&
          value !== undefined &&
          isCustomElementProperty(element, property)
        ) {
          values[property] = value;
        }
      });
      const nextConfiguredPropertyPresence: Record<string, boolean> = {};
      (config.properties ?? []).forEach((property) => {
        const supplied =
          Object.prototype.hasOwnProperty.call(props, property) && props[property] !== undefined;
        nextConfiguredPropertyPresence[property] = supplied;
        if (supplied) values[property] = props[property];
        else if (configuredPropertyPresence.current[property]) {
          values[property] = config.propertyDefaults?.[property];
        }
      });
      syncElementProperties(element, values);
      configuredPropertyPresence.current = nextConfiguredPropertyPresence;

      committedInteractionValues.current = Object.fromEntries(
        Object.keys(interactionState).flatMap((property) =>
          Object.prototype.hasOwnProperty.call(props, property) && props[property] != null
            ? [[property, props[property]]]
            : [],
        ),
      );
    });

    useClientLayoutEffect(() => {
      const element = localRef.current;
      if (!element) return;

      const cleanups: Array<() => void> = [];
      interactionPropertiesByEvent.forEach((properties, eventName) => {
        const listener = (event: Event) => {
          const committedValues = committedInteractionValues.current;
          const controlledProperties = properties.filter((property) =>
            Object.prototype.hasOwnProperty.call(committedValues, property),
          );
          if (controlledProperties.length === 0) return;

          if (
            event.target === element &&
            controlledProperties.some(
              (property) => interactionState[property]?.strategy === 'prevent',
            )
          ) {
            event.preventDefault();
          }
          if (
            controlledProperties.some(
              (property) => interactionState[property]?.strategy === 'restore',
            )
          ) {
            queueMicrotask(() => {
              if (localRef.current !== element) return;
              syncElementProperties(element, committedInteractionValues.current);
            });
          }
        };
        element.addEventListener(eventName, listener);
        cleanups.push(() => element.removeEventListener(eventName, listener));
      });

      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    }, []);

    useClientLayoutEffect(() => {
      const element = localRef.current;
      if (!element) return;

      const cleanups: Array<() => void> = [];
      Object.entries(config.events ?? {}).forEach(([propName, eventName]) => {
        const handler = props[propName];
        if (typeof handler !== 'function') return;
        const listener = (event: Event) => {
          if (eventName.startsWith('rg-') && event.target !== element) return;
          (handler as (event: Event) => void)(event);
        };
        element.addEventListener(eventName, listener);
        cleanups.push(() => element.removeEventListener(eventName, listener));
      });

      return () => cleanups.forEach((cleanup) => cleanup());
      // Event callbacks intentionally control listener replacement.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, eventHandlers);

    const domProps: UnknownProps = {};
    const mappedAttributes = config.attributes ?? {};

    Object.entries(props).forEach(([name, value]) => {
      if (name === 'children' || eventPropNames.has(name) || slotPropNames.has(name)) {
        return;
      }
      if (propertyNames.has(name)) {
        domProps[name] = value;
        return;
      }
      const targetName = mappedAttributes[name] ?? name;
      if (value === false || value === null || value === undefined) return;
      domProps[targetName] = value;
    });

    const slotChildren = Object.entries(config.slots ?? {}).map(([propName, slot]) =>
      toSlot(slot, props[propName] as ReactNode),
    );

    return createElement(tagName, { ...domProps, ref: setRef }, props.children, ...slotChildren);
  });

  Component.displayName = config.displayName;
  return Component as ForwardRefExoticComponent<TProps & RefAttributes<TElement>>;
}
