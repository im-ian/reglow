<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgCheckboxElement } from '@reglow/elements/components/checkbox';
  import type { RgCheckboxProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    label,
    description,
    error,
    onValueChange,
    onValueCommit,
    checked = $bindable(false),
    ...props
  }: RgCheckboxProps = $props();

  defineElement({ tagName: RgCheckboxElement.tagName, constructor: RgCheckboxElement });

  function handleChange(event: Event): void {
    checked = (event.currentTarget as RgCheckboxElement).checked;
    onValueCommit?.(event as Parameters<NonNullable<RgCheckboxProps['onValueCommit']>>[0]);
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

<ReglowHost
  tag="rg-checkbox"
  bind:element
  {events}
  {namedSlots}
  {attributeMap}
  {...props}
  {checked}
>
  {@render children?.()}
</ReglowHost>
