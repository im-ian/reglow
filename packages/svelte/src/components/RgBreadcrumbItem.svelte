<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgBreadcrumbItemElement } from '@reglow/elements/components/breadcrumb';
  import type { RgBreadcrumbItemProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgBreadcrumbItemProps = $props();

  defineElement({ tagName: RgBreadcrumbItemElement.tagName, constructor: RgBreadcrumbItemElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-breadcrumb-item" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
