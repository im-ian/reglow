import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ArrowIcon, BellIcon, CheckIcon, PlusIcon, SparklesIcon } from './icons.js';

const meta: Meta = {
  title: 'Welcome/Reglow',
  parameters: {
    layout: 'fullscreen',
    reglowLayout: 'full-page',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

export const DesignSystem: Story = {
  render: () => html`
    <main class="rg-showcase">
      <section class="rg-showcase-hero">
        <div class="rg-showcase-copy">
          <rg-badge tone="brand" variant="soft"
            ><span slot="start">${SparklesIcon}</span>v1 · Multi-framework</rg-badge
          >
          <h1>Interfaces that<br /><em>move with you.</em></h1>
          <p>
            Reglow is a zero-dependency Web Component system with official React and Vue adapters.
            Soft geometry, crisp intent, and motion that rewards every action.
          </p>
          <div class="rg-story-row">
            <rg-button size="lg"><span slot="start">${PlusIcon}</span>Start building</rg-button>
            <rg-link href="#system-preview"
              >Explore the system <span slot="end">${ArrowIcon}</span></rg-link
            >
          </div>
          <div class="rg-showcase-proof">
            <span>${CheckIcon} 60 custom elements</span>
            <span>${CheckIcon} React 19</span>
            <span>${CheckIcon} Vue 3</span>
          </div>
        </div>

        <div class="rg-showcase-orbit" aria-hidden="true">
          <span class="rg-orbit rg-orbit-a"></span>
          <span class="rg-orbit rg-orbit-b"></span>
          <span class="rg-orbit-core">R</span>
          <span class="rg-orbit-chip rg-chip-a">CSS vars</span>
          <span class="rg-orbit-chip rg-chip-b">Shadow DOM</span>
          <span class="rg-orbit-chip rg-chip-c">A11y</span>
        </div>
      </section>

      <section id="system-preview" class="rg-showcase-product">
        <header class="rg-product-header">
          <div class="rg-product-brand"><span>r</span> reglow</div>
          <div class="rg-product-actions">
            <rg-icon-button label="Notifications" variant="ghost">${BellIcon}</rg-icon-button>
            <rg-avatar name="Mina Park" size="sm"
              ><i slot="status" class="rg-status-dot"></i
            ></rg-avatar>
          </div>
        </header>

        <div class="rg-product-layout">
          <aside class="rg-product-sidebar">
            <p class="rg-story-eyebrow">Workspace</p>
            <button class="is-active">Overview</button>
            <button>Projects <rg-badge size="sm">12</rg-badge></button>
            <button>Activity</button>
            <button>Team</button>
          </aside>

          <div class="rg-product-main">
            <div class="rg-product-titlebar">
              <div>
                <p class="rg-story-eyebrow">Wednesday, July 15</p>
                <h2>Good afternoon, Mina.</h2>
              </div>
              <rg-button><span slot="start">${PlusIcon}</span>New project</rg-button>
            </div>

            <div class="rg-metric-grid">
              <rg-card variant="soft"
                ><small>Focus score</small><strong>86</strong
                ><rg-progress value="86" max="100" label="Focus score"></rg-progress
              ></rg-card>
              <rg-card variant="outlined"
                ><small>Tasks shipped</small><strong>24</strong
                ><span class="rg-positive">+18% this week</span></rg-card
              >
              <rg-card variant="outlined"
                ><small>Review time</small><strong>3.4h</strong
                ><span class="rg-muted">Down from 5.1h</span></rg-card
              >
            </div>

            <div class="rg-product-grid">
              <rg-card variant="elevated" class="rg-focus-card">
                <div slot="header" class="rg-card-heading">
                  <div>
                    <p class="rg-story-eyebrow">Today</p>
                    <h3>Keep the momentum</h3>
                  </div>
                  <rg-badge tone="success" dot>On track</rg-badge>
                </div>
                <div class="rg-task-list">
                  <label
                    ><rg-checkbox label="Audit component states" checked></rg-checkbox
                    ><span><s>Audit component states</s><small>Design system</small></span
                    ><rg-avatar name="Mina Park" size="sm"></rg-avatar
                  ></label>
                  <label
                    ><rg-checkbox label="Review Vue adapter API"></rg-checkbox
                    ><span>Review Vue adapter API<small>Engineering</small></span
                    ><rg-avatar name="Alex Kim" size="sm"></rg-avatar
                  ></label>
                  <label
                    ><rg-checkbox label="Record motion principles"></rg-checkbox
                    ><span>Record motion principles<small>Documentation</small></span
                    ><rg-avatar name="Reglow" size="sm"></rg-avatar
                  ></label>
                </div>
              </rg-card>

              <rg-card variant="outlined">
                <div slot="header">
                  <p class="rg-story-eyebrow">Pulse</p>
                  <h3>Team energy</h3>
                </div>
                <div class="rg-pulse-chart" role="img" aria-label="Team energy trend">
                  ${[46, 58, 51, 72, 65, 82, 76, 91, 84, 96].map(
                    (value, index) =>
                      html`<i style=${`--h:${value}%;--delay:${index * 35}ms`}></i>`,
                  )}
                </div>
                <p class="rg-muted">Deep work is up 14% after quiet mode launched.</p>
              </rg-card>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
};
