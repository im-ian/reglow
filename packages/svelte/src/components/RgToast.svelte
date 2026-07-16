<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgToastElement } from '@reglow/elements/components/toast';
  import type { RgToastProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    icon,
    title,
    action,
    onOpenChange,
    onDismiss,
    open = $bindable(false),
    ...props
  }: RgToastProps = $props();

  defineElement({ tagName: RgToastElement.tagName, constructor: RgToastElement });

  function handleRgOpenChange(event: Event): void {
    open = (event.currentTarget as RgToastElement).open;
    onOpenChange?.(event as Parameters<NonNullable<RgToastProps['onOpenChange']>>[0]);
  }

  const events = $derived({
    'rg-open-change': handleRgOpenChange,
    'rg-dismiss': onDismiss,
  });
  const namedSlots = $derived({
    icon: icon,
    title: title,
    action: action,
  });
  const attributeMap = {
    dismissLabel: 'dismiss-label',
  } as const;
</script>

<ReglowHost tag="rg-toast" bind:element {events} {namedSlots} {attributeMap} {...props} {open}>
  {@render children?.()}
</ReglowHost>
