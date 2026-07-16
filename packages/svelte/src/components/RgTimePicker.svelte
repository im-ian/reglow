<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgTimePickerElement } from '@reglow/elements/components/time-picker';
  import type { RgTimePickerProps } from '../component-types.js';
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
  }: RgTimePickerProps = $props();

  defineElement({ tagName: RgTimePickerElement.tagName, constructor: RgTimePickerElement });

  function handleInput(event: Event): void {
    value = (event.currentTarget as RgTimePickerElement).value;
    onValueChange?.(event as Parameters<NonNullable<RgTimePickerProps['onValueChange']>>[0]);
  }

  function handleRgOpenChange(event: Event): void {
    open = (event.currentTarget as RgTimePickerElement).open;
    onOpenChange?.(event as Parameters<NonNullable<RgTimePickerProps['onOpenChange']>>[0]);
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
    overlayAlign: 'overlay-align',
    overlayWidth: 'overlay-width',
    readOnly: 'readonly',
  } as const;
</script>

<ReglowHost
  tag="rg-time-picker"
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
