<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgRatingElement } from '@reglow/elements/components/rating';
  import type { RgRatingProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    onValueChange,
    onValueCommit,
    onRatingChange,
    value = $bindable(0),
    ...props
  }: RgRatingProps = $props();

  defineElement({ tagName: RgRatingElement.tagName, constructor: RgRatingElement });

  function handleInput(event: Event): void {
    value = (event.currentTarget as RgRatingElement).value;
    onValueChange?.(event as Parameters<NonNullable<RgRatingProps['onValueChange']>>[0]);
  }

  const events = $derived({
    input: handleInput,
    change: onValueCommit,
    'rg-value-change': onRatingChange,
  });
  const namedSlots = $derived({});
  const attributeMap = {
    readOnly: 'readonly',
  } as const;
</script>

<ReglowHost tag="rg-rating" bind:element {events} {namedSlots} {attributeMap} {...props} {value}>
  {@render children?.()}
</ReglowHost>
