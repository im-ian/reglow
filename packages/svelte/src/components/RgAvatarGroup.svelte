<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgAvatarGroupElement } from '@reglow/elements/components/avatar-group';
  import type { RgAvatarGroupProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgAvatarGroupProps = $props();

  defineElement({ tagName: RgAvatarGroupElement.tagName, constructor: RgAvatarGroupElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {
    moreLabel: 'more-label',
  } as const;
</script>

<ReglowHost tag="rg-avatar-group" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
