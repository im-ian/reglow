<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgMenuElement } from '@reglow/elements/components/menu';
  import type { RgMenuProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    trigger,
    onOpenChange,
    onSelect,
    open = $bindable(false),
    ...props
  }: RgMenuProps = $props();

  defineElement({ tagName: RgMenuElement.tagName, constructor: RgMenuElement });

  function handleRgOpenChange(event: Event): void {
    open = (event.currentTarget as RgMenuElement).open;
    onOpenChange?.(event as Parameters<NonNullable<RgMenuProps['onOpenChange']>>[0]);
  }

  const events = $derived({
    'rg-open-change': handleRgOpenChange,
    'rg-select': onSelect,
  });
  const namedSlots = $derived({
    trigger: trigger,
  });
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-menu" bind:element {events} {namedSlots} {attributeMap} {...props} {open}>
  {@render children?.()}
</ReglowHost>
