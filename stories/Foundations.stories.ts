import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Foundations/System',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const colors = [
  ['Canvas', '--rg-color-canvas'],
  ['Surface', '--rg-color-surface'],
  ['Text', '--rg-color-text'],
  ['Brand', '--rg-color-brand'],
  ['Accent', '--rg-color-accent'],
  ['Success', '--rg-color-success'],
  ['Warning', '--rg-color-warning'],
  ['Danger', '--rg-color-danger'],
];

export const Tokens: Story = {
  render: () => html`
    <section class="rg-story-section">
      <p class="rg-story-eyebrow">Foundations</p>
      <h1 class="rg-story-title">A system with a pulse.</h1>
      <p class="rg-story-lead">
        Semantic tokens keep every framework on the same visual contract. Switch theme, direction,
        and motion from the toolbar to stress the system.
      </p>

      <div class="rg-token-grid">
        ${colors.map(
          ([name, token]) => html`
            <article class="rg-token-card">
              <div class="rg-token-swatch" style=${`--swatch: var(${token})`}></div>
              <strong>${name}</strong>
              <code>${token}</code>
            </article>
          `,
        )}
      </div>

      <div class="rg-story-grid">
        <article class="rg-story-panel rg-type-sample">
          <p class="rg-story-eyebrow">Typography</p>
          <div class="rg-display-sample">Soft forms.<br />Clear intent.</div>
          <p>
            Manrope’s open geometry keeps dense interfaces readable while preserving Reglow’s
            rounded, optimistic character.
          </p>
        </article>
        <article class="rg-story-panel">
          <p class="rg-story-eyebrow">Shape language</p>
          <div class="rg-radius-row">
            <span style="border-radius:var(--rg-radius-sm)">sm</span>
            <span style="border-radius:var(--rg-radius-md)">md</span>
            <span style="border-radius:var(--rg-radius-lg)">lg</span>
            <span style="border-radius:var(--rg-radius-pill)">pill</span>
          </div>
        </article>
      </div>
    </section>
  `,
};

export const ThemeBoundary: Story = {
  render: () => html`
    <div class="rg-theme-pair">
      <rg-theme mode="light">
        <div class="rg-story-panel">
          <p class="rg-story-eyebrow">Light</p>
          <h3>Warm and tactile</h3>
          <p>Cloud canvas, paper surfaces, and a crisp cobalt action color.</p>
        </div>
      </rg-theme>
      <rg-theme mode="dark">
        <div class="rg-story-panel">
          <p class="rg-story-eyebrow">Dark</p>
          <h3>Dim, not dull</h3>
          <p>Deep green-black fields preserve hue and hierarchy after dark.</p>
        </div>
      </rg-theme>
    </div>
  `,
};
