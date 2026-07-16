<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgBreadcrumbElement } from '@reglow/elements/components/breadcrumb';
  import type { RgBreadcrumbProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgBreadcrumbProps = $props();

  defineElement({ tagName: RgBreadcrumbElement.tagName, constructor: RgBreadcrumbElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-breadcrumb" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
