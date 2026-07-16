import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

type IfEquals<TLeft, TRight, TWhenEqual = TLeft, TWhenDifferent = never> =
  (<T>() => T extends TLeft ? 1 : 2) extends <T>() => T extends TRight ? 1 : 2
    ? TWhenEqual
    : TWhenDifferent;

type ElementOwnKey<TElement extends HTMLElement> = Exclude<keyof TElement, keyof HTMLElement>;

type ElementWritableDataKey<TElement extends HTMLElement> = {
  [TKey in ElementOwnKey<TElement>]: TElement[TKey] extends (...args: never[]) => unknown
    ? never
    : IfEquals<Pick<TElement, TKey>, Readonly<Pick<TElement, TKey>>, never, TKey>;
}[ElementOwnKey<TElement>];

type ElementDataProps<TElement extends HTMLElement> = Partial<
  Pick<TElement, Exclude<ElementWritableDataKey<TElement>, 'groupDisabled' | 'grouped'>>
>;

type ElementHostProps<TElement extends HTMLElement> = Omit<
  HTMLAttributes<TElement>,
  keyof ElementDataProps<TElement> | 'children'
> &
  ElementDataProps<TElement>;

export type ReglowSlotContent = Snippet | string | number;
export type ReglowAttributeValue = string | number | boolean | null | undefined;

export type ReglowHostEvent<TElement extends HTMLElement, TEvent extends Event = Event> = TEvent & {
  readonly currentTarget: TElement;
  readonly target: EventTarget | null;
};

export type ReglowSvelteEventHandler<TElement extends HTMLElement, TEvent extends Event = Event> = (
  event: ReglowHostEvent<TElement, TEvent>,
) => void;

export type ReglowSvelteProps<
  TElement extends HTMLElement,
  TEvents extends object = object,
  TSlots extends object = object,
  TAttributes extends object = object,
> = Omit<ElementHostProps<TElement>, keyof TEvents | keyof TSlots> &
  TEvents &
  TSlots &
  TAttributes & {
    children?: Snippet;
    element?: TElement | null;
  };
