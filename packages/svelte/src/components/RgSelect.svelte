<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgSelectElement } from '@reglow/elements/components/select';
  import type { RgSelectProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    label,
    description,
    error,
    onValueChange,
    onValueCommit,
    value = $bindable(''),
    ...props
  }: RgSelectProps = $props();

  defineElement({ tagName: RgSelectElement.tagName, constructor: RgSelectElement });

  function handleChange(event: Event): void {
    value = (event.currentTarget as RgSelectElement).value;
    onValueCommit?.(event as Parameters<NonNullable<RgSelectProps['onValueCommit']>>[0]);
  }

  const events = $derived({
    input: onValueChange,
    change: handleChange,
  });
  const namedSlots = $derived({
    label: label,
    description: description,
    error: error,
  });
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-select" bind:element {events} {namedSlots} {attributeMap} {...props} {value}>
  {@render children?.()}
</ReglowHost>
