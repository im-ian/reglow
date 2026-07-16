<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgButtonElement } from '@reglow/elements/components/button';
  import type { RgButtonProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    start,
    end,
    onPress,
    ...props
  }: RgButtonProps = $props();

  defineElement({ tagName: RgButtonElement.tagName, constructor: RgButtonElement });

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

<ReglowHost tag="rg-button" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
