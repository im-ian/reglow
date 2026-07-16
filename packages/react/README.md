# @reglow/react

Official React 19 adapter for Reglow Custom Elements.

```tsx
import { Input } from '@reglow/react';
import '@reglow/tokens/css';

export function Example() {
  return (
    <Input label="Workspace" onValueChange={(event) => console.log(event.currentTarget.value)} />
  );
}
```

Each retained adapter export registers only its matching Reglow element. Unused React adapters and
Custom Element implementations can therefore be removed by the consumer bundler. The adapter maps
typed React props, events, refs, and named slots onto the framework-neutral `@reglow/elements`
implementation.
