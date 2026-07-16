<script lang="ts">
  import { RgInput } from '../../src/index.js';

  let value = $state('Reglow');
  let eventValue = $state('');
</script>

<RgInput
  bind:value
  autoComplete="name"
  label="Name"
  onValueChange={(event) => (eventValue = event.currentTarget.value)}
/>
<output data-testid="bound">{value}</output>
<output data-testid="event">{eventValue}</output>
