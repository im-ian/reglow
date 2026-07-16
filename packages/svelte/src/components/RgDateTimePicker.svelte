<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgDateTimePickerElement } from '@reglow/elements/components/date-time-picker';
  import type { RgDateTimePickerProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    label,
    description,
    error,
    onValueChange,
    onValueCommit,
    onOpenChange,
    value = $bindable(''),
    open = $bindable(false),
    ...props
  }: RgDateTimePickerProps = $props();

  defineElement({ tagName: RgDateTimePickerElement.tagName, constructor: RgDateTimePickerElement });

  function handleInput(event: Event): void {
    value = (event.currentTarget as RgDateTimePickerElement).value;
    onValueChange?.(event as Parameters<NonNullable<RgDateTimePickerProps['onValueChange']>>[0]);
  }

  function handleRgOpenChange(event: Event): void {
    open = (event.currentTarget as RgDateTimePickerElement).open;
    onOpenChange?.(event as Parameters<NonNullable<RgDateTimePickerProps['onOpenChange']>>[0]);
  }

  const events = $derived({
    input: handleInput,
    change: onValueCommit,
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
  tag="rg-date-time-picker"
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
