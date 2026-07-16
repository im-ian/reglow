# Lit

Lit templates interoperate directly with Reglow Custom Elements. Use normal attributes for strings,
Lit property expressions for structured values, boolean attribute expressions for flags, and
declarative event listeners for Reglow events.

## Install

```sh
pnpm add lit @reglow/elements @reglow/tokens
```

Register the full catalog once at the browser entry point:

```ts
import '@reglow/elements/register';
import '@reglow/tokens/css';
```

## Template bindings

```ts
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { RgPressDetail, RgSelectElement, RgSelectOption } from '@reglow/elements';
import '@reglow/elements/register';
import '@reglow/tokens/css';

@customElement('workspace-form')
export class WorkspaceForm extends LitElement {
  @state() private region = '';

  private readonly regions: readonly RgSelectOption[] = [
    { value: 'seoul', label: 'Seoul' },
    { value: 'london', label: 'London' },
  ];

  private handleRegionInput(event: Event) {
    this.region = (event.currentTarget as RgSelectElement).value;
  }

  private handleCreate(event: CustomEvent<RgPressDetail>) {
    console.log({ region: this.region, pressed: event.detail.pressed });
  }

  protected render() {
    return html`
      <rg-select
        label="Region"
        .options=${this.regions}
        .value=${this.region}
        @input=${this.handleRegionInput}
      ></rg-select>

      <rg-button
        variant="solid"
        tone="brand"
        ?disabled=${!this.region}
        @rg-press=${this.handleCreate}
      >
        <span slot="start" aria-hidden="true">+</span>
        Create workspace
      </rg-button>
    `;
  }
}
```

The binding forms have distinct jobs:

- `label="Region"` sets a string attribute.
- `.options=${options}` and `.value=${value}` assign DOM properties. Use property expressions for
  arrays, objects, and live element state.
- `?disabled=${condition}` adds or removes a boolean attribute.
- `@input=${listener}` handles a native event re-emitted by the control.
- `@rg-press=${listener}` handles a typed Reglow `CustomEvent`.
- `slot="start"` uses the element's standard named slot.

Reglow events bubble and are composed, so a Lit parent can listen at the element boundary even when
the original interaction happens inside Reglow's shadow root.

## Register only selected elements

The full registration entry intentionally includes every element. Applications that need the
narrowest bundle can register the constructors retained by their Lit templates:

```ts
import { defineElement } from '@reglow/elements';
import { RgButtonElement } from '@reglow/elements/components/button';
import { RgSelectElement } from '@reglow/elements/components/select';

defineElement({ tagName: RgButtonElement.tagName, constructor: RgButtonElement });
defineElement({ tagName: RgSelectElement.tagName, constructor: RgSelectElement });
```

Register related tags too when they appear in light DOM. For example, a declarative
`<rg-option>` needs `RgOptionElement`; assigning `RgSelectElement.options` does not.

See Lit's official [expression documentation][lit-expressions] for attribute, property, boolean,
and event bindings.

[lit-expressions]: https://lit.dev/docs/templates/expressions/
