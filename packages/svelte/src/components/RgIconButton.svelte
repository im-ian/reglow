<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgIconButtonElement } from '@reglow/elements/components/button';
  import type { RgIconButtonProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    start,
    end,
    onPress,
    ...props
  }: RgIconButtonProps = $props();

  defineElement({ tagName: RgIconButtonElement.tagName, constructor: RgIconButtonElement });

  const events = $derived({
    'rg-press': onPress,
  });
  const namedSlots = $derived({
    start: start,
    end: end,
  });
  const attributeMap = {
    fullWidth: 'full-width',
    formNoValidate: 'formnovalidate',
  } as const;
</script>

<ReglowHost tag="rg-icon-button" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
