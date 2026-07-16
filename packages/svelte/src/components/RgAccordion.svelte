<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgAccordionElement } from '@reglow/elements/components/accordion';
  import type { RgAccordionProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    onValueChange,
    value = $bindable(''),
    ...props
  }: RgAccordionProps = $props();

  defineElement({ tagName: RgAccordionElement.tagName, constructor: RgAccordionElement });

  function handleRgValueChange(event: Event): void {
    value = (event.currentTarget as RgAccordionElement).value;
    onValueChange?.(event as Parameters<NonNullable<RgAccordionProps['onValueChange']>>[0]);
  }

  const events = $derived({
    'rg-value-change': handleRgValueChange,
  });
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-accordion" bind:element {events} {namedSlots} {attributeMap} {...props} {value}>
  {@render children?.()}
</ReglowHost>
