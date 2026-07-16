<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgFormatBytesElement } from '@reglow/elements/components/format-bytes';
  import type { RgFormatBytesProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgFormatBytesProps = $props();

  defineElement({ tagName: RgFormatBytesElement.tagName, constructor: RgFormatBytesElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-format-bytes" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
