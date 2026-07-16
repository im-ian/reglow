import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Forms/Date Picker',
  component: 'rg-date-picker',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Native: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-date-picker
        name="launch-date"
        label="Launch date"
        description="Native remains the default picker presentation."
        min="2026-01-01"
        value="2026-07-15"
        required
      ></rg-date-picker>
    </div>
  `,
};

export const Custom: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-date-picker
        name="custom-date"
        label="Custom date"
        description="Use picker=custom for the Reglow calendar interface."
        picker="custom"
        value="2026-07-15"
      ></rg-date-picker>
    </div>
  `,
};

export const DisplayFormats: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-date-picker
        label="Short"
        picker="custom"
        date-format="short"
        locale="en-US"
        value="2026-07-15"
      ></rg-date-picker>
      <rg-date-picker
        label="Medium (default)"
        picker="custom"
        date-format="medium"
        locale="en-US"
        value="2026-07-15"
      ></rg-date-picker>
      <rg-date-picker
        label="Long"
        picker="custom"
        date-format="long"
        locale="en-US"
        value="2026-07-15"
      ></rg-date-picker>
      <rg-date-picker
        label="Full"
        picker="custom"
        date-format="full"
        locale="en-US"
        value="2026-07-15"
      ></rg-date-picker>
      <rg-date-picker
        label="ISO"
        picker="custom"
        date-format="iso"
        value="2026-07-15"
      ></rg-date-picker>
    </div>
  `,
};

export const RestrictedRange: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-date-picker
        label="Campaign window"
        description="Only dates from July 10 through July 20 can be selected."
        picker="custom"
        min="2026-07-10"
        max="2026-07-20"
        value="2026-07-15"
        open
      ></rg-date-picker>
    </div>
  `,
};

export const FullWidthOverlay: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-date-picker
        label="Full-width calendar"
        description="overlay-width=full matches the input width."
        picker="custom"
        overlay-width="full"
        value="2026-07-15"
        open
      ></rg-date-picker>
    </div>
  `,
};

export const CenteredOverlay: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-date-picker
        label="Centered calendar"
        description="overlay-align=center anchors the panel to the input center."
        picker="custom"
        overlay-align="center"
        value="2026-07-15"
        open
      ></rg-date-picker>
    </div>
  `,
};
