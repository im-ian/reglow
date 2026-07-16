<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgFieldsetElement } from '@reglow/elements/components/fieldset';
  import type { RgFieldsetProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    legend,
    description,
    error,
    ...props
  }: RgFieldsetProps = $props();

  defineElement({ tagName: RgFieldsetElement.tagName, constructor: RgFieldsetElement });

  const events = $derived({});
  const namedSlots = $derived({
    legend: legend,
    description: description,
    error: error,
  });
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-fieldset" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
