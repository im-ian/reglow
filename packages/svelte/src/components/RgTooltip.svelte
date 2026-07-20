<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgTooltipElement } from '@reglow/elements/components/tooltip';
  import type { RgTooltipProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    trigger,
    richContent,
    onBeforeOpen,
    onBeforeClose,
    onOpenChange,
    open = $bindable(false),
    ...props
  }: RgTooltipProps = $props();

  defineElement({ tagName: RgTooltipElement.tagName, constructor: RgTooltipElement });

  function handleRgOpenChange(event: Event): void {
    open = (event.currentTarget as RgTooltipElement).open;
    onOpenChange?.(event as Parameters<NonNullable<RgTooltipProps['onOpenChange']>>[0]);
  }

  const events = $derived({
    'rg-before-open': onBeforeOpen,
    'rg-before-close': onBeforeClose,
    'rg-open-change': handleRgOpenChange,
  });
  const namedSlots = $derived({
    trigger: trigger,
    content: richContent,
  });
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-tooltip" bind:element {events} {namedSlots} {attributeMap} {...props} {open}>
  {@render children?.()}
</ReglowHost>
