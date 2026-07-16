<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgStepElement } from '@reglow/elements/components/step-indicator';
  import type { RgStepProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, description, ...props }: RgStepProps = $props();

  defineElement({ tagName: RgStepElement.tagName, constructor: RgStepElement });

  const events = $derived({});
  const namedSlots = $derived({
    description: description,
  });
  const attributeMap = {
    optionalLabel: 'optional-label',
  } as const;
</script>

<ReglowHost tag="rg-step" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
