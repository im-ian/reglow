# @reglow/react

Official React 19 adapter for Reglow Custom Elements.

```tsx
import { Button, Input } from '@reglow/react';
import '@reglow/tokens/css';

export function Example() {
  return (
    <Input label="Workspace" onValueChange={(event) => console.log(event.currentTarget.value)} />
  );
}
```

The adapter registers Reglow elements when imported and maps typed React props, events, refs, and
named slots onto the framework-neutral `@reglow/elements` implementation.
