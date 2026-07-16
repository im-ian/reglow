<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgLinkElement } from '@reglow/elements/components/link';
  import type { RgLinkProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    start,
    end,
    onNavigate,
    ...props
  }: RgLinkProps = $props();

  defineElement({ tagName: RgLinkElement.tagName, constructor: RgLinkElement });

  const events = $derived({
    'rg-navigate': onNavigate,
  });
  const namedSlots = $derived({
    start: start,
    end: end,
  });
  const attributeMap = {
    hrefLang: 'hreflang',
    referrerPolicy: 'referrerpolicy',
  } as const;
</script>

<ReglowHost tag="rg-link" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
