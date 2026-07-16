<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgAlertElement } from '@reglow/elements/components/alert';
  import type { RgAlertProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    icon,
    title,
    actions,
    onDismiss,
    ...props
  }: RgAlertProps = $props();

  defineElement({ tagName: RgAlertElement.tagName, constructor: RgAlertElement });

  const events = $derived({
    'rg-dismiss': onDismiss,
  });
  const namedSlots = $derived({
    icon: icon,
    title: title,
    actions: actions,
  });
  const attributeMap = {
    dismissLabel: 'dismiss-label',
  } as const;
</script>

<ReglowHost tag="rg-alert" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
