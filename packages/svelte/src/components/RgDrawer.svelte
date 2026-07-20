<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgDrawerElement } from '@reglow/elements/components/dialog';
  import type { RgDrawerProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    trigger,
    title,
    close,
    footer,
    onBeforeOpen,
    onBeforeClose,
    onOpenChange,
    onClose,
    open = $bindable(false),
    ...props
  }: RgDrawerProps = $props();

  defineElement({ tagName: RgDrawerElement.tagName, constructor: RgDrawerElement });

  function handleRgOpenChange(event: Event): void {
    open = (event.currentTarget as RgDrawerElement).open;
    onOpenChange?.(event as Parameters<NonNullable<RgDrawerProps['onOpenChange']>>[0]);
  }

  const events = $derived({
    'rg-before-open': onBeforeOpen,
    'rg-before-close': onBeforeClose,
    'rg-open-change': handleRgOpenChange,
    'rg-close': onClose,
  });
  const namedSlots = $derived({
    trigger: trigger,
    title: title,
    close: close,
    footer: footer,
  });
  const attributeMap = {
    escapeKeyAction: 'escape-key-action',
    backdropAction: 'backdrop-action',
    hideClose: 'hide-close',
    closeLabel: 'close-label',
  } as const;
</script>

<ReglowHost tag="rg-drawer" bind:element {events} {namedSlots} {attributeMap} {...props} {open}>
  {@render children?.()}
</ReglowHost>
