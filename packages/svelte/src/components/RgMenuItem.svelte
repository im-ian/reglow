<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgMenuItemElement } from '@reglow/elements/components/menu';
  import type { RgMenuItemProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, start, end, ...props }: RgMenuItemProps = $props();

  defineElement({ tagName: RgMenuItemElement.tagName, constructor: RgMenuItemElement });

  const events = $derived({});
  const namedSlots = $derived({
    start: start,
    end: end,
  });
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-menu-item" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
