<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgSliderElement } from '@reglow/elements/components/slider';
  import type { RgSliderProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    label,
    description,
    error,
    onValueChange,
    onValueCommit,
    value = $bindable(0),
    ...props
  }: RgSliderProps = $props();

  defineElement({ tagName: RgSliderElement.tagName, constructor: RgSliderElement });

  function handleInput(event: Event): void {
    value = (event.currentTarget as RgSliderElement).value;
    onValueChange?.(event as Parameters<NonNullable<RgSliderProps['onValueChange']>>[0]);
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
    showValue: 'show-value',
  } as const;
</script>

<ReglowHost tag="rg-slider" bind:element {events} {namedSlots} {attributeMap} {...props} {value}>
  {@render children?.()}
</ReglowHost>
