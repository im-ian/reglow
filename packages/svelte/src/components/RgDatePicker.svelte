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
    value = $bindable(''),
    ...props
  }: RgDatePickerProps = $props();

  defineElement({ tagName: RgDatePickerElement.tagName, constructor: RgDatePickerElement });

  function handleInput(event: Event): void {
    value = (event.currentTarget as RgDatePickerElement).value;
    onValueChange?.(event as Parameters<NonNullable<RgDatePickerProps['onValueChange']>>[0]);
  }

  const events = $derived({
    input: handleInput,
    change: onValueCommit,
  });
  const namedSlots = $derived({
    label: label,
    description: description,
    error: error,
  });
  const attributeMap = {
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
>
  {@render children?.()}
</ReglowHost>
