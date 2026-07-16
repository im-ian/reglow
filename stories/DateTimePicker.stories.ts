import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Forms/Date Time Picker',
  component: 'rg-date-time-picker',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-date-time-picker
        name="launch-time"
        label="Launch date and time"
        description="Date and time stay visible in one coordinated panel."
        value="2026-07-15T09:30"
      ></rg-date-time-picker>
    </div>
  `,
};

export const DisplayFormats: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-date-time-picker
        label="Long date"
        date-format="long"
        locale="en-US"
        value="2026-07-15T09:30"
      ></rg-date-time-picker>
      <rg-date-time-picker
        label="ISO date"
        date-format="iso"
        value="2026-07-15T09:30"
      ></rg-date-time-picker>
    </div>
  `,
};

export const RestrictedRange: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-date-time-picker
        label="Booking window"
        description="The first day starts at 09:30 and the final day ends at 17:00."
        min="2026-07-15T09:30"
        max="2026-07-16T17:00"
        value="2026-07-15T09:30"
        open
      ></rg-date-time-picker>
    </div>
  `,
};

export const FullWidthOverlay: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-date-time-picker
        label="Full-width date and time"
        description="The layout stays side by side when space allows and stacks inside narrower inputs."
        date-format="iso"
        overlay-width="full"
        value="2026-07-15T09:30"
        open
      ></rg-date-time-picker>
    </div>
  `,
};

export const CenteredOverlay: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-date-time-picker
        label="Centered date and time"
        description="overlay-align=center anchors the unified panel to the input center."
        overlay-align="center"
        value="2026-07-15T09:30"
        open
      ></rg-date-time-picker>
    </div>
  `,
};
