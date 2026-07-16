<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgAccordionItemElement } from '@reglow/elements/components/accordion';
  import type { RgAccordionItemProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    heading,
    onOpenChange,
    open = $bindable(false),
    ...props
  }: RgAccordionItemProps = $props();

  defineElement({ tagName: RgAccordionItemElement.tagName, constructor: RgAccordionItemElement });

  function handleRgOpenChange(event: Event): void {
    open = (event.currentTarget as RgAccordionItemElement).open;
    onOpenChange?.(event as Parameters<NonNullable<RgAccordionItemProps['onOpenChange']>>[0]);
  }

  const events = $derived({
    'rg-open-change': handleRgOpenChange,
  });
  const namedSlots = $derived({
    heading: heading,
  });
  const attributeMap = {
    headingLevel: 'heading-level',
  } as const;
</script>

<ReglowHost
  tag="rg-accordion-item"
  bind:element
  {events}
  {namedSlots}
  {attributeMap}
  {...props}
  {open}
>
  {@render children?.()}
</ReglowHost>
