<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgDialogElement } from '@reglow/elements/components/dialog';
  import type { RgDialogProps } from '../component-types.js';
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
  }: RgDialogProps = $props();

  defineElement({ tagName: RgDialogElement.tagName, constructor: RgDialogElement });

  function handleRgOpenChange(event: Event): void {
    open = (event.currentTarget as RgDialogElement).open;
    onOpenChange?.(event as Parameters<NonNullable<RgDialogProps['onOpenChange']>>[0]);
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

<ReglowHost tag="rg-dialog" bind:element {events} {namedSlots} {attributeMap} {...props} {open}>
  {@render children?.()}
</ReglowHost>
