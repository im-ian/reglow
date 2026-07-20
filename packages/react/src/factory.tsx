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
  controlled?: Readonly<Record<string, readonly string[]>>;
  properties?: readonly string[];
  propertyDefaults?: Readonly<Record<string, unknown>>;
  slots?: Readonly<Record<string, string>>;
}

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function syncControlledProperties(
  element: HTMLElement,
  values: Readonly<Record<string, unknown>>,
): void {
  const propertyTarget = element as unknown as Record<string, unknown>;
  Object.entries(values).forEach(([property, value]) => {
    if (!Object.is(propertyTarget[property], value)) propertyTarget[property] = value;
  });
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

  const controlledProperties = Object.keys(config.controlled ?? {});
  const controlledEvents = new Set(Object.values(config.controlled ?? {}).flat());

  const Component = forwardRef<TElement, TProps>((typedProps, forwardedRef) => {
    const props = typedProps as UnknownProps;
    const localRef = useRef<TElement | null>(null);
    const committedControlledValues = useRef<Readonly<Record<string, unknown>>>({});
    const eventHandlers = Object.entries(config.events ?? {}).map(([propName]) => props[propName]);
    const propertyValues = (config.properties ?? []).map(
      (property) => props[property] ?? config.propertyDefaults?.[property],
    );

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

      const values = Object.fromEntries(
        controlledProperties.flatMap((property) =>
          Object.prototype.hasOwnProperty.call(props, property) && props[property] !== undefined
            ? [[property, props[property]]]
            : [],
        ),
      );
      committedControlledValues.current = values;
      syncControlledProperties(element, values);
    });

    useClientLayoutEffect(() => {
      const element = localRef.current;
      if (!element) return;

      const restore = () => {
        queueMicrotask(() => {
          if (localRef.current !== element) return;
          syncControlledProperties(element, committedControlledValues.current);
        });
      };
      controlledEvents.forEach((eventName) => element.addEventListener(eventName, restore));

      return () => {
        controlledEvents.forEach((eventName) => element.removeEventListener(eventName, restore));
      };
    }, []);

    useEffect(() => {
      const element = localRef.current;
      if (!element) return;

      const cleanups: Array<() => void> = [];
      Object.entries(config.events ?? {}).forEach(([propName, eventName]) => {
        const handler = props[propName];
        if (typeof handler !== 'function') return;
        const listener = (event: Event) => (handler as (event: Event) => void)(event);
        element.addEventListener(eventName, listener);
        cleanups.push(() => element.removeEventListener(eventName, listener));
      });

      return () => cleanups.forEach((cleanup) => cleanup());
      // Event callbacks intentionally control listener replacement.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, eventHandlers);

    useEffect(() => {
      const element = localRef.current;
      if (!element) return;
      const propertyTarget = element as unknown as Record<string, unknown>;
      (config.properties ?? []).forEach((property) => {
        propertyTarget[property] =
          property in props ? props[property] : config.propertyDefaults?.[property];
      });
      // Property values intentionally control assignment.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, propertyValues);

    const domProps: UnknownProps = {};
    const eventPropNames = new Set(Object.keys(config.events ?? {}));
    const propertyNames = new Set(config.properties ?? []);
    const slotPropNames = new Set(Object.keys(config.slots ?? {}));
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
