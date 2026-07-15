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

The adapter registers Reglow elements when imported and provides typed Vue components, named
slots, emitted events, and `v-model` mappings.
