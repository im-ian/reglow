<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgAvatarElement } from '@reglow/elements/components/avatar';
  import type { RgAvatarProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    fallback,
    statusContent,
    onLoad,
    onError,
    ...props
  }: RgAvatarProps = $props();

  defineElement({ tagName: RgAvatarElement.tagName, constructor: RgAvatarElement });

  const events = $derived({
    'rg-load': onLoad,
    'rg-error': onError,
  });
  const namedSlots = $derived({
    fallback: fallback,
    status: statusContent,
  });
  const attributeMap = {
    crossOrigin: 'crossorigin',
    referrerPolicy: 'referrerpolicy',
    srcSet: 'srcset',
    statusLabel: 'status-label',
  } as const;
</script>

<ReglowHost tag="rg-avatar" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
