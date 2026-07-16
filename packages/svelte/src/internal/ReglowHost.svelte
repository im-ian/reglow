<script lang="ts" generics="TElement extends HTMLElement">
  import type { Snippet } from 'svelte';
  import type { ReglowSlotContent } from '../types.js';

  type EventHandlers = Readonly<Record<string, unknown>>;

  let {
    tag,
    element = $bindable(null),
    events = {},
    namedSlots = {},
    attributeMap = {},
    children,
    ...props
  }: {
    tag: `rg-${string}`;
    element?: TElement | null;
    events?: EventHandlers;
    namedSlots?: Readonly<Record<string, ReglowSlotContent | null | undefined>>;
    attributeMap?: Readonly<Record<string, string>>;
    children?: Snippet;
    [name: string]: unknown;
  } = $props();

  const forwarded = $derived.by(() => {
    const result: Record<string, unknown> = { ...props };
    Object.entries(attributeMap).forEach(([property, attribute]) => {
      if (!(property in result)) return;
      result[attribute] = result[property];
      delete result[property];
    });
    return result;
  });

  function listen(node: HTMLElement, handlers: EventHandlers) {
    let cleanups: Array<() => void> = [];

    function bind(next: EventHandlers): void {
      cleanups.forEach((cleanup) => cleanup());
      cleanups = [];
      Object.entries(next).forEach(([name, handler]) => {
        if (typeof handler !== 'function') return;
        const listener = handler as EventListener;
        node.addEventListener(name, listener);
        cleanups.push(() => node.removeEventListener(name, listener));
      });
    }

    bind(handlers);
    return {
      update: bind,
      destroy: () => cleanups.forEach((cleanup) => cleanup()),
    };
  }
</script>

<svelte:element this={tag} bind:this={element} {...forwarded} use:listen={events}>
  {@render children?.()}
  {#each Object.entries(namedSlots) as [slot, content] (slot)}
    {#if typeof content === 'function'}
      <span {slot} style="display: contents">{@render content()}</span>
    {:else if content !== null && content !== undefined}
      <span {slot} style="display: contents">{content}</span>
    {/if}
  {/each}
</svelte:element>
