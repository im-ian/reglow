<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgInputElement } from '@reglow/elements/components/input';
  import type { RgInputProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    label,
    start,
    end,
    description,
    error,
    onValueChange,
    onValueCommit,
    onClear,
    value = $bindable(''),
    ...props
  }: RgInputProps = $props();

  defineElement({ tagName: RgInputElement.tagName, constructor: RgInputElement });

  function handleInput(event: Event): void {
    value = (event.currentTarget as RgInputElement).value;
    onValueChange?.(event as Parameters<NonNullable<RgInputProps['onValueChange']>>[0]);
  }

  const events = $derived({
    input: handleInput,
    change: onValueCommit,
    'rg-clear': onClear,
  });
  const namedSlots = $derived({
    label: label,
    start: start,
    end: end,
    description: description,
    error: error,
  });
  const attributeMap = {
    autoComplete: 'autocomplete',
    inputMode: 'inputmode',
    maxLength: 'maxlength',
    minLength: 'minlength',
    readOnly: 'readonly',
  } as const;
</script>

<ReglowHost tag="rg-input" bind:element {events} {namedSlots} {attributeMap} {...props} {value}>
  {@render children?.()}
</ReglowHost>
