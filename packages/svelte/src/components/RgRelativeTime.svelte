<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgRelativeTimeElement } from '@reglow/elements/components/relative-time';
  import type { RgRelativeTimeProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgRelativeTimeProps = $props();

  defineElement({ tagName: RgRelativeTimeElement.tagName, constructor: RgRelativeTimeElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-relative-time" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
