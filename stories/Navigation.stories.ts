import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Navigation/Disclosure',
  component: 'rg-tabs',
};

export default meta;
type Story = StoryObj;

export const Tabs: Story = {
  render: () => html`
    <rg-tabs value="overview" class="rg-wide-demo">
      <rg-tab value="overview">Overview</rg-tab>
      <rg-tab value="activity">Activity</rg-tab>
      <rg-tab value="settings">Settings</rg-tab>
      <rg-tab value="locked" disabled>Locked</rg-tab>

      <rg-tab-panel value="overview">
        <div class="rg-tab-content">
          <p class="rg-story-eyebrow">Overview</p>
          <h3>Your team is moving smoothly.</h3>
          <p>12 tasks completed this week with an average review time of 3.4 hours.</p>
        </div>
      </rg-tab-panel>
      <rg-tab-panel value="activity">
        <div class="rg-tab-content">
          <h3>Recent activity</h3>
          <p>Three teammates added notes today.</p>
        </div>
      </rg-tab-panel>
      <rg-tab-panel value="settings">
        <div class="rg-tab-content">
          <h3>Workspace settings</h3>
          <p>Control access, defaults, and notifications.</p>
        </div>
      </rg-tab-panel>
      <rg-tab-panel value="locked"><p>Unavailable.</p></rg-tab-panel>
    </rg-tabs>
  `,
};

export const VerticalTabs: Story = {
  render: () => html`
    <rg-tabs value="profile" orientation="vertical" class="rg-wide-demo">
      <rg-tab value="profile">Profile</rg-tab>
      <rg-tab value="security">Security</rg-tab>
      <rg-tab value="billing">Billing</rg-tab>
      <rg-tab-panel value="profile"
        ><div class="rg-tab-content">
          <h3>Profile</h3>
          <p>Personal details and preferences.</p>
        </div></rg-tab-panel
      >
      <rg-tab-panel value="security"
        ><div class="rg-tab-content">
          <h3>Security</h3>
          <p>Passkeys and connected devices.</p>
        </div></rg-tab-panel
      >
      <rg-tab-panel value="billing"
        ><div class="rg-tab-content">
          <h3>Billing</h3>
          <p>Plans, invoices, and tax details.</p>
        </div></rg-tab-panel
      >
    </rg-tabs>
  `,
};

export const Accordion: Story = {
  render: () => html`
    <rg-accordion class="rg-wide-demo" collapsible>
      <rg-accordion-item value="frameworks" open>
        <span slot="heading">Which frameworks are supported?</span>
        The core is a standards-based Custom Element library. React 19 and Vue 3 adapters are
        official in v1; Svelte, Angular, and vanilla JavaScript can consume the elements directly.
      </rg-accordion-item>
      <rg-accordion-item value="styles">
        <span slot="heading">How do I customize components?</span>
        Override semantic CSS variables on any theme boundary, then use documented ::part hooks for
        focused, component-level adjustments.
      </rg-accordion-item>
      <rg-accordion-item value="motion">
        <span slot="heading">Can motion be reduced?</span>
        Yes. Reglow respects the system preference and also exposes an explicit motion context.
      </rg-accordion-item>
    </rg-accordion>
  `,
};

export const BreadcrumbsAndPagination: Story = {
  render: () => html`
    <div class="rg-story-stack rg-wide-demo">
      <rg-breadcrumb label="Project path">
        <rg-breadcrumb-item href="#workspaces">Workspaces</rg-breadcrumb-item>
        <rg-breadcrumb-item href="#reglow">Reglow</rg-breadcrumb-item>
        <rg-breadcrumb-item current>Components</rg-breadcrumb-item>
      </rg-breadcrumb>
      <rg-pagination page="4" page-count="12" label="Component pages"></rg-pagination>
    </div>
  `,
};

export const StepIndicators: Story = {
  render: () => html`
    <div class="rg-story-stack rg-wide-demo">
      <rg-step-indicator value="delivery" label="Checkout progress">
        <rg-step value="account">Account</rg-step>
        <rg-step value="delivery" description="Choose a delivery window">Delivery</rg-step>
        <rg-step value="review">Review</rg-step>
        <rg-step value="payment" optional>Payment</rg-step>
      </rg-step-indicator>
      <rg-step-indicator value="security" label="Account setup" orientation="vertical">
        <rg-step value="profile" description="Basic account information">Profile</rg-step>
        <rg-step value="security" description="Passkey and recovery options">Security</rg-step>
        <rg-step value="confirm" description="Review your choices">Confirm</rg-step>
      </rg-step-indicator>
    </div>
  `,
};
