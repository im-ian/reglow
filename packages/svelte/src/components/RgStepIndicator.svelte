<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgStepIndicatorElement } from '@reglow/elements/components/step-indicator';
  import type { RgStepIndicatorProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgStepIndicatorProps = $props();

  defineElement({ tagName: RgStepIndicatorElement.tagName, constructor: RgStepIndicatorElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {
    completeLabel: 'complete-label',
    currentLabel: 'current-label',
    upcomingLabel: 'upcoming-label',
  } as const;
</script>

<ReglowHost tag="rg-step-indicator" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
