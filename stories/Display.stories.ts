import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { CheckIcon, SparklesIcon } from './icons.js';

const meta: Meta = {
  title: 'Display/Surfaces',
  component: 'rg-card',
};

export default meta;
type Story = StoryObj;

export const Badges: Story = {
  render: () => html`
    <div class="rg-story-stack">
      <div class="rg-story-row">
        <rg-badge tone="brand">In progress</rg-badge>
        <rg-badge tone="success" dot>Healthy</rg-badge>
        <rg-badge tone="warning" variant="outline">Needs review</rg-badge>
        <rg-badge tone="danger" removable>Blocked</rg-badge>
      </div>
      <div class="rg-story-row">
        <rg-badge size="sm" variant="soft">Small</rg-badge>
        <rg-badge size="md" variant="soft">Medium</rg-badge>
        <rg-badge size="lg" variant="soft"
          ><span slot="start">${SparklesIcon}</span>Featured</rg-badge
        >
      </div>
    </div>
  `,
};

export const Avatars: Story = {
  render: () => html`
    <div class="rg-story-row">
      <rg-avatar name="Mina Park" size="sm"></rg-avatar>
      <rg-avatar name="Alex Kim" size="md"
        ><span slot="status" class="rg-status-dot"></span
      ></rg-avatar>
      <rg-avatar name="Reglow Studio" size="lg" shape="rounded"></rg-avatar>
      <rg-avatar name="Future Person" size="xl"></rg-avatar>
    </div>
  `,
};

export const Cards: Story = {
  render: () => html`
    <div class="rg-story-grid rg-card-grid">
      ${(['elevated', 'outlined', 'soft'] as const).map(
        (variant) => html`
          <rg-card variant=${variant}>
            <div slot="header" class="rg-card-heading">
              <rg-avatar name="Reglow" size="sm"></rg-avatar>
              <div><strong>${variant}</strong><small>Surface recipe</small></div>
            </div>
            <p>Cards carry hierarchy through shape, border, and light—not decoration alone.</p>
            <div slot="footer" class="rg-story-row">
              <span class="rg-inline-success">${CheckIcon} Ready</span>
              <rg-link href="#details">Details</rg-link>
            </div>
          </rg-card>
        `,
      )}
    </div>
  `,
};

export const Dividers: Story = {
  render: () => html`
    <rg-card variant="outlined">
      <strong slot="header">Release notes</strong>
      <p>Improved keyboard navigation and focus restoration.</p>
      <rg-divider>Version 0.1</rg-divider>
      <p>Added the first React and Vue adapters.</p>
    </rg-card>
  `,
};

export const EmptyStates: Story = {
  render: () => html`
    <rg-empty-state
      title="No projects yet"
      description="Create your first project and invite the team when you are ready."
      tone="brand"
      class="rg-wide-demo"
    >
      <span slot="icon">${SparklesIcon}</span>
      <div slot="actions" class="rg-story-row">
        <rg-button>Create project</rg-button>
        <rg-button variant="ghost">Browse templates</rg-button>
      </div>
    </rg-empty-state>
  `,
};

export const RelativeTimes: Story = {
  render: () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    return html`
      <div class="rg-story-row">
        <rg-badge variant="outline">
          Updated&nbsp;<rg-relative-time date=${twoHoursAgo} numeric="auto"></rg-relative-time>
        </rg-badge>
        <rg-badge variant="outline">
          Review&nbsp;<rg-relative-time date=${tomorrow} numeric="auto" sync></rg-relative-time>
        </rg-badge>
      </div>
    `;
  },
};

export const LocaleFormatting: Story = {
  render: () => html`
    <div class="rg-story-grid rg-card-grid">
      <rg-card variant="outlined">
        <span slot="header" class="rg-story-eyebrow">Absolute date</span>
        <strong
          ><rg-format-date
            date="2026-07-15T09:17:00.000Z"
            locale="en-US"
            time-zone="UTC"
            weekday="long"
            month="long"
            day="numeric"
            year="numeric"
          ></rg-format-date
        ></strong>
      </rg-card>
      <rg-card variant="outlined">
        <span slot="header" class="rg-story-eyebrow">Localized amount</span>
        <strong
          ><rg-format-number
            value="2840.5"
            type="currency"
            currency="USD"
            locale="en-US"
            minimum-fraction-digits="2"
          ></rg-format-number
        ></strong>
      </rg-card>
      <rg-card variant="outlined">
        <span slot="header" class="rg-story-eyebrow">Transfer size</span>
        <strong><rg-format-bytes value="18432000" locale="en-US"></rg-format-bytes></strong>
      </rg-card>
    </div>
  `,
};
