<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgRadioGroupElement } from '@reglow/elements/components/radio';
  import type { RgRadioGroupProps } from '../component-types.js';
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
  }: RgRadioGroupProps = $props();

  defineElement({ tagName: RgRadioGroupElement.tagName, constructor: RgRadioGroupElement });

  function handleChange(event: Event): void {
    value = (event.currentTarget as RgRadioGroupElement).value;
    onValueCommit?.(event as Parameters<NonNullable<RgRadioGroupProps['onValueCommit']>>[0]);
  }

  const events = $derived({
    input: onValueChange,
    change: handleChange,
  });
  const namedSlots = $derived({
    label: label,
    description: description,
    error: error,
  });
  const attributeMap = {} as const;
</script>

<ReglowHost
  tag="rg-radio-group"
  bind:element
  {events}
  {namedSlots}
  {attributeMap}
  {...props}
  {value}
>
  {@render children?.()}
</ReglowHost>
