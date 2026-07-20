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

## Controlled state

Supplying an interaction-state prop such as `value`, `checked`, `selected`, or `page` makes that
property controlled. Reglow reasserts supplied Custom Element properties after every React commit
and rolls back rejected interactions even when the parent renders the same prop value. Omit the prop
to let the element own its state.

Controlled overlays use cancelable request events so rejected interactions never briefly mutate the
native overlay or move focus:

```tsx
import { Dialog } from '@reglow/react';
import { useState } from 'react';

export function ControlledDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      trigger={<button>Open</button>}
      onBeforeOpen={() => setOpen(true)}
      onBeforeClose={() => setOpen(false)}
      onOpenChange={(event) => console.log('committed', event.detail.open)}
    >
      Content
    </Dialog>
  );
}
```

When `open` is supplied, the adapter prevents `rg-before-open` and `rg-before-close`; the parent
accepts a request by committing the next prop value in the matching callback. `onOpenChange` is a
post-change notification for state committed by an uncontrolled element, not the controlled request
callback. Direct prop commits intentionally emit no request or `onOpenChange` event. A native dialog
can still emit `onClose` when its committed `open={false}` state finishes closing; the matching
`onBeforeClose` event carries the original interaction reason.
