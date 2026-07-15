# @reglow/vue

Official Vue 3 adapter for Reglow Custom Elements.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { RgInput } from '@reglow/vue';
import '@reglow/tokens/css';

const value = ref('');
</script>

<template><RgInput v-model="value" label="Workspace" /></template>
```

Each retained adapter export registers only its matching Reglow element. Unused Vue adapters and
Custom Element implementations can therefore be removed by the consumer bundler. The adapter
provides typed Vue components, named slots, emitted events, and `v-model` mappings.
