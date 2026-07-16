<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgRadioElement } from '@reglow/elements/components/radio';
  import type { RgRadioProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    description,
    onValueChange,
    onValueCommit,
    ...props
  }: RgRadioProps = $props();

  defineElement({ tagName: RgRadioElement.tagName, constructor: RgRadioElement });

  const events = $derived({
    input: onValueChange,
    change: onValueCommit,
  });
  const namedSlots = $derived({
    description: description,
  });
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-radio" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
