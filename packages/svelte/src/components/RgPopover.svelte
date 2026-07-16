<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgPopoverElement } from '@reglow/elements/components/popover';
  import type { RgPopoverProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    trigger,
    onOpenChange,
    open = $bindable(false),
    ...props
  }: RgPopoverProps = $props();

  defineElement({ tagName: RgPopoverElement.tagName, constructor: RgPopoverElement });

  function handleRgOpenChange(event: Event): void {
    open = (event.currentTarget as RgPopoverElement).open;
    onOpenChange?.(event as Parameters<NonNullable<RgPopoverProps['onOpenChange']>>[0]);
  }

  const events = $derived({
    'rg-open-change': handleRgOpenChange,
  });
  const namedSlots = $derived({
    trigger: trigger,
  });
  const attributeMap = {
    matchTriggerWidth: 'match-trigger-width',
  } as const;
</script>

<ReglowHost tag="rg-popover" bind:element {events} {namedSlots} {attributeMap} {...props} {open}>
  {@render children?.()}
</ReglowHost>
