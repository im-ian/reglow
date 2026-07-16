<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgCardElement } from '@reglow/elements/components/card';
  import type { RgCardProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    media,
    header,
    footer,
    ...props
  }: RgCardProps = $props();

  defineElement({ tagName: RgCardElement.tagName, constructor: RgCardElement });

  const events = $derived({});
  const namedSlots = $derived({
    media: media,
    header: header,
    footer: footer,
  });
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-card" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
