<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgProgressElement } from '@reglow/elements/components/progress';
  import type { RgProgressProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, label, ...props }: RgProgressProps = $props();

  defineElement({ tagName: RgProgressElement.tagName, constructor: RgProgressElement });

  const events = $derived({});
  const namedSlots = $derived({
    label: label,
  });
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-progress" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
