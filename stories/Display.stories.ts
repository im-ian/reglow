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

export const AvatarGroups: Story = {
  render: () => html`
    <div class="rg-story-grid rg-card-grid">
      <rg-card variant="outlined">
        <div slot="header" class="rg-card-heading">
          <div>
            <span class="rg-story-eyebrow">Project crew</span>
            <strong>Launch team</strong>
          </div>
          <rg-badge variant="soft">5 people</rg-badge>
        </div>
        <rg-avatar-group label="Launch team" max="3" more-label="more teammates" size="lg">
          <rg-avatar name="Mina Park"></rg-avatar>
          <rg-avatar name="Alex Kim"></rg-avatar>
          <rg-avatar name="Noah Lee"></rg-avatar>
          <rg-avatar name="Sora Han"></rg-avatar>
          <rg-avatar name="Ian Cho"></rg-avatar>
        </rg-avatar-group>
        <p slot="footer" class="rg-muted">
          Three visible avatars with an accessible overflow count.
        </p>
      </rg-card>
      <rg-card variant="soft">
        <div slot="header" class="rg-card-heading">
          <div>
            <span class="rg-story-eyebrow">Compact</span>
            <strong>Online now</strong>
          </div>
          <span class="rg-inline-success">${CheckIcon} Active</span>
        </div>
        <rg-avatar-group label="Online teammates" size="sm">
          <rg-avatar name="Ari Moon"></rg-avatar>
          <rg-avatar name="Joon Seo"></rg-avatar>
          <rg-avatar name="Rina Yu"></rg-avatar>
          <rg-avatar name="Theo Lim"></rg-avatar>
        </rg-avatar-group>
        <p slot="footer" class="rg-muted">The group can also inherit one compact size.</p>
      </rg-card>
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

export const Timelines: Story = {
  render: () => html`
    <rg-card variant="outlined" class="rg-wide-demo">
      <div slot="header" class="rg-card-heading">
        <div>
          <span class="rg-story-eyebrow">Release activity</span>
          <strong>Version 1.4 timeline</strong>
        </div>
        <rg-badge tone="success" dot>On track</rg-badge>
      </div>
      <rg-timeline label="Version 1.4 release activity">
        <rg-timeline-item
          heading="Workspace created"
          description="Mina opened the release workspace and invited the core team."
          timestamp="Today · 09:40"
          datetime="2026-07-16T09:40:00+09:00"
          tone="success"
        >
          <span slot="icon">${CheckIcon}</span>
        </rg-timeline-item>
        <rg-timeline-item
          heading="Design tokens published"
          description="Color, type, and motion updates are ready for review."
          timestamp="Today · 11:15"
          datetime="2026-07-16T11:15:00+09:00"
          tone="brand"
        ></rg-timeline-item>
        <rg-timeline-item
          heading="Deployment review"
          description="Waiting for the final accessibility and bundle-size checks."
          timestamp="Today · 14:30"
          datetime="2026-07-16T14:30:00+09:00"
          tone="warning"
        ></rg-timeline-item>
      </rg-timeline>
    </rg-card>
  `,
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
