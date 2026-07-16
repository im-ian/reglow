<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgSegmentedControlElement } from '@reglow/elements/components/segmented-control';
  import type { RgSegmentedControlProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    onValueChange,
    onValueCommit,
    onSelectionChange,
    value = $bindable(''),
    ...props
  }: RgSegmentedControlProps = $props();

  defineElement({
    tagName: RgSegmentedControlElement.tagName,
    constructor: RgSegmentedControlElement,
  });

  function handleRgValueChange(event: Event): void {
    value = (event.currentTarget as RgSegmentedControlElement).value;
    onSelectionChange?.(
      event as Parameters<NonNullable<RgSegmentedControlProps['onSelectionChange']>>[0],
    );
  }

  const events = $derived({
    input: onValueChange,
    change: onValueCommit,
    'rg-value-change': handleRgValueChange,
  });
  const namedSlots = $derived({});
  const attributeMap = {
    fullWidth: 'full-width',
  } as const;
</script>

<ReglowHost
  tag="rg-segmented-control"
  bind:element
  {events}
  {namedSlots}
  {attributeMap}
  {...props}
  {value}
>
  {@render children?.()}
</ReglowHost>
