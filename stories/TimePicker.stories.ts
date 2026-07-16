import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Forms/Time Picker',
  component: 'rg-time-picker',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-time-picker
        name="start-time"
        label="Start time"
        description="Choose AM or PM, then an hour and minute. The active pill animates between options."
        value="09:30"
      ></rg-time-picker>
    </div>
  `,
};

export const RestrictedRange: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-time-picker
        label="Office hours"
        description="Only times from 09:30 through 17:15 can be selected."
        min="09:30"
        max="17:15"
        value="09:30"
        open
      ></rg-time-picker>
    </div>
  `,
};

export const FullWidthOverlay: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-time-picker
        label="Full-width time picker"
        description="overlay-width=full matches the input width."
        overlay-width="full"
        value="09:30"
        open
      ></rg-time-picker>
    </div>
  `,
};

export const CenteredOverlay: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-time-picker
        label="Centered time picker"
        description="overlay-align=center anchors the panel to the input center."
        overlay-align="center"
        value="09:30"
        open
      ></rg-time-picker>
    </div>
  `,
};
