import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { BellIcon, CheckIcon, SparklesIcon } from './icons.js';

const meta: Meta = {
  title: 'Feedback/Status',
  component: 'rg-alert',
};

export default meta;
type Story = StoryObj;

export const Alerts: Story = {
  render: () => html`
    <div class="rg-story-stack rg-wide-demo">
      <rg-alert tone="brand" dismissible>
        <span slot="title">A calmer notification system</span>
        Non-essential updates are now grouped into a daily digest.
      </rg-alert>
      <rg-alert tone="success">
        <span slot="icon">${CheckIcon}</span>
        <span slot="title">Everything is synced</span>
        Your workspace is available on all connected devices.
      </rg-alert>
      <rg-alert tone="warning" variant="outline">
        <span slot="title">Two teammates need access</span>
        Review permissions before publishing this project.
        <rg-button slot="actions" size="sm" variant="soft" tone="warning">Review</rg-button>
      </rg-alert>
      <rg-alert tone="danger">
        <span slot="title">Payment method expired</span>
        Add a valid card to keep scheduled automations running.
      </rg-alert>
    </div>
  `,
};

export const ProgressAndLoading: Story = {
  render: () => html`
    <div class="rg-story-stack rg-wide-demo">
      <rg-progress label="Uploading assets" value="68" max="100"></rg-progress>
      <rg-progress label="Preparing workspace"></rg-progress>
      <div class="rg-story-row">
        <rg-progress-ring label="Profile completion" value="76" show-value></rg-progress-ring>
        <rg-progress-ring label="Preparing preview"></rg-progress-ring>
        <rg-spinner size="sm" label="Loading"></rg-spinner>
        <rg-spinner size="md"></rg-spinner>
        <rg-spinner size="lg"></rg-spinner>
      </div>
    </div>
  `,
};

export const Skeletons: Story = {
  render: () => html`
    <rg-card variant="outlined">
      <div class="rg-skeleton-profile">
        <rg-skeleton shape="circle" width="3.25rem" height="3.25rem" animated></rg-skeleton>
        <div>
          <rg-skeleton shape="text" width="10rem" animated></rg-skeleton>
          <rg-skeleton shape="text" width="15rem" animated></rg-skeleton>
        </div>
      </div>
      <rg-skeleton shape="rect" height="8rem" animated></rg-skeleton>
    </rg-card>
  `,
};

export const Toasts: Story = {
  render: () => html`
    <div class="rg-toast-preview">
      <div class="rg-toast-preview-copy">
        <span>Live region</span>
        <strong
          >Helpful updates,<br />
          kept out of the way.</strong
        >
        <p>Toasts stack at the selected logical corner and pause while you interact.</p>
      </div>
      <rg-toast-region position="bottom-end" label="Toast examples">
        <rg-toast open tone="success" duration="0" dismissible>
          <span slot="icon">${SparklesIcon}</span>
          <span slot="title">Project created</span>
          “Soft launch” is ready for its first task.
          <rg-button slot="action" size="sm" variant="ghost">Open</rg-button>
        </rg-toast>
        <rg-toast open tone="neutral" duration="0" dismissible>
          <span slot="icon">${BellIcon}</span>
          <span slot="title">Quiet mode is on</span>
          We’ll hold notifications until 9:00 AM.
        </rg-toast>
      </rg-toast-region>
    </div>
  `,
};
