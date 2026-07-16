<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgPaginationElement } from '@reglow/elements/components/pagination';
  import type { RgPaginationProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    onPageChange,
    page = $bindable(1),
    ...props
  }: RgPaginationProps = $props();

  defineElement({ tagName: RgPaginationElement.tagName, constructor: RgPaginationElement });

  function handleRgPageChange(event: Event): void {
    page = (event.currentTarget as RgPaginationElement).page;
    onPageChange?.(event as Parameters<NonNullable<RgPaginationProps['onPageChange']>>[0]);
  }

  const events = $derived({
    'rg-page-change': handleRgPageChange,
  });
  const namedSlots = $derived({});
  const attributeMap = {
    boundaryCount: 'boundary-count',
    nextLabel: 'next-label',
    pageCount: 'page-count',
    previousLabel: 'previous-label',
    siblingCount: 'sibling-count',
  } as const;
</script>

<ReglowHost tag="rg-pagination" bind:element {events} {namedSlots} {attributeMap} {...props} {page}>
  {@render children?.()}
</ReglowHost>
