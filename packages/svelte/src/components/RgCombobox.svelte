<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgComboboxElement } from '@reglow/elements/components/combobox';
  import type { RgComboboxProps } from '../component-types.js';
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
    onSelectionChange,
    value = $bindable(''),
    open = $bindable(false),
    ...props
  }: RgComboboxProps = $props();

  defineElement({ tagName: RgComboboxElement.tagName, constructor: RgComboboxElement });

  function handleChange(event: Event): void {
    value = (event.currentTarget as RgComboboxElement).value;
    onValueCommit?.(event as Parameters<NonNullable<RgComboboxProps['onValueCommit']>>[0]);
  }

  function handleRgOpenChange(event: Event): void {
    open = (event.currentTarget as RgComboboxElement).open;
    onOpenChange?.(event as Parameters<NonNullable<RgComboboxProps['onOpenChange']>>[0]);
  }

  const events = $derived({
    input: onValueChange,
    change: handleChange,
    'rg-open-change': handleRgOpenChange,
    'rg-value-change': onSelectionChange,
  });
  const namedSlots = $derived({
    label: label,
    description: description,
    error: error,
  });
  const attributeMap = {
    noResultsText: 'no-results-text',
    readOnly: 'readonly',
  } as const;
</script>

<ReglowHost
  tag="rg-combobox"
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
