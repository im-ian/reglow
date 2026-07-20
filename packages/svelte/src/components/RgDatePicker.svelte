<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgDatePickerElement } from '@reglow/elements/components/date-picker';
  import type { RgDatePickerProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    label,
    description,
    error,
    onValueChange,
    onValueCommit,
    onBeforeOpen,
    onBeforeClose,
    onOpenChange,
    value = $bindable(''),
    open = $bindable(false),
    ...props
  }: RgDatePickerProps = $props();

  defineElement({ tagName: RgDatePickerElement.tagName, constructor: RgDatePickerElement });

  function handleInput(event: Event): void {
    value = (event.currentTarget as RgDatePickerElement).value;
    onValueChange?.(event as Parameters<NonNullable<RgDatePickerProps['onValueChange']>>[0]);
  }

  function handleRgOpenChange(event: Event): void {
    open = (event.currentTarget as RgDatePickerElement).open;
    onOpenChange?.(event as Parameters<NonNullable<RgDatePickerProps['onOpenChange']>>[0]);
  }

  const events = $derived({
    input: handleInput,
    change: onValueCommit,
    'rg-before-open': onBeforeOpen,
    'rg-before-close': onBeforeClose,
    'rg-open-change': handleRgOpenChange,
  });
  const namedSlots = $derived({
    label: label,
    description: description,
    error: error,
  });
  const attributeMap = {
    dateFormat: 'date-format',
    overlayAlign: 'overlay-align',
    overlayWidth: 'overlay-width',
    readOnly: 'readonly',
  } as const;
</script>

<ReglowHost
  tag="rg-date-picker"
  bind:element
  {events}
  {namedSlots}
  {attributeMap}
  {...props}
  {value}
  {open}
>
  {@render children?.()}
</ReglowHost>
