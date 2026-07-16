<script lang="ts">
  import type { RgSelectOption } from '@reglow/elements/components/select';
  import { RgSelect } from '../../src/index.js';

  const options = [
    { value: 'alpha', label: 'Alpha' },
    { value: 'beta', label: 'Beta', disabled: true },
  ] satisfies readonly RgSelectOption[];
</script>

<RgSelect {options} label="Team" />
