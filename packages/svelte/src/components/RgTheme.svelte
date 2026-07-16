<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgThemeElement } from '@reglow/elements/components/theme';
  import type { RgThemeProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, onThemeChange, ...props }: RgThemeProps = $props();

  defineElement({ tagName: RgThemeElement.tagName, constructor: RgThemeElement });

  const events = $derived({
    'rg-theme-change': onThemeChange,
  });
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-theme" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
