import type { InteractionStateDescriptor } from './reglow-element.js';

export type ReglowElementConstructor = CustomElementConstructor & {
  readonly tagName: `rg-${string}`;
  readonly interactionState?: InteractionStateDescriptor;
};

export interface ReglowElementDefinition {
  readonly tagName: `rg-${string}`;
  readonly constructor: ReglowElementConstructor;
}

export function defineElement(definition: ReglowElementDefinition): void {
  if (typeof customElements === 'undefined') return;
  if (!customElements.get(definition.tagName)) {
    customElements.define(definition.tagName, definition.constructor);
  }
}

export function defineElements(definitions: readonly ReglowElementDefinition[]): void {
  definitions.forEach(defineElement);
}
