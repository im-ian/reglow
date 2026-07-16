<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgTextareaElement } from '@reglow/elements/components/textarea';
  import type { RgTextareaProps } from '../component-types.js';
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
  }: RgTextareaProps = $props();

  defineElement({ tagName: RgTextareaElement.tagName, constructor: RgTextareaElement });

  function handleInput(event: Event): void {
    value = (event.currentTarget as RgTextareaElement).value;
    onValueChange?.(event as Parameters<NonNullable<RgTextareaProps['onValueChange']>>[0]);
  }

  const events = $derived({
    input: handleInput,
    change: onValueCommit,
  });
  const namedSlots = $derived({
    label: label,
    description: description,
    error: error,
  });
  const attributeMap = {
    autoGrow: 'auto-grow',
    maxLength: 'maxlength',
    minLength: 'minlength',
    readOnly: 'readonly',
  } as const;
</script>

<ReglowHost tag="rg-textarea" bind:element {events} {namedSlots} {attributeMap} {...props} {value}>
  {@render children?.()}
</ReglowHost>
