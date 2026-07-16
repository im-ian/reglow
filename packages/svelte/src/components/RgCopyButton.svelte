<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgCopyButtonElement } from '@reglow/elements/components/copy-button';
  import type { RgCopyButtonProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    copyIcon,
    successIcon,
    errorIcon,
    onCopy,
    onError,
    ...props
  }: RgCopyButtonProps = $props();

  defineElement({ tagName: RgCopyButtonElement.tagName, constructor: RgCopyButtonElement });

  const events = $derived({
    'rg-copy': onCopy,
    'rg-error': onError,
  });
  const namedSlots = $derived({
    'copy-icon': copyIcon,
    'success-icon': successIcon,
    'error-icon': errorIcon,
  });
  const attributeMap = {
    copyLabel: 'copy-label',
    errorLabel: 'error-label',
    feedbackDuration: 'feedback-duration',
    successLabel: 'success-label',
  } as const;
</script>

<ReglowHost tag="rg-copy-button" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
