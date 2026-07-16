import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { SearchIcon } from './icons.js';

const meta: Meta = {
  title: 'Forms/Controls',
  component: 'rg-input',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const TextFields: Story = {
  render: () => html`
    <form class="rg-form-demo" @submit=${(event: Event) => event.preventDefault()}>
      <rg-input
        name="search"
        label="Search workspace"
        description="Search by project, teammate, or keyword."
        placeholder="Try “launch plan”"
        clearable
      >
        <span slot="start">${SearchIcon}</span>
      </rg-input>
      <rg-input
        name="email"
        type="email"
        label="Email address"
        value="hello@reglow.dev"
        required
      ></rg-input>
      <rg-input
        label="Project slug"
        value="soft-kinetic"
        error="That slug is already in motion. Try another."
        invalid
      ></rg-input>
      <rg-textarea
        name="brief"
        label="Project brief"
        description="A sentence or two is plenty."
        placeholder="What are you making?"
        rows="4"
        auto-grow
      ></rg-textarea>
      <rg-button type="submit">Continue</rg-button>
    </form>
  `,
};

export const ChoiceControls: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-checkbox label="Send a weekly progress digest" checked></rg-checkbox>
      <rg-checkbox
        label="Include archived projects"
        description="You can change this later."
      ></rg-checkbox>
      <rg-switch label="Quiet mode" description="Pause non-essential notifications."></rg-switch>

      <rg-radio-group name="plan" value="studio" label="Choose a workspace plan">
        <rg-radio value="solo">Solo</rg-radio>
        <rg-radio value="studio">Studio</rg-radio>
        <rg-radio value="company">Company</rg-radio>
      </rg-radio-group>
    </div>
  `,
};

export const SelectAndSlider: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-select
        name="timezone"
        label="Timezone"
        value="seoul"
        description="Used for schedules and summaries."
      >
        <rg-option value="seoul" selected>Seoul · GMT+9</rg-option>
        <rg-option value="london">London · GMT+1</rg-option>
        <rg-option value="new-york">New York · GMT-4</rg-option>
      </rg-select>
      <rg-slider
        name="focus"
        label="Focus intensity"
        value="68"
        min="0"
        max="100"
        show-value
      ></rg-slider>
    </div>
  `,
};

export const DisabledAndReadonly: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-input label="Readonly value" value="RG-1042" readonly></rg-input>
      <rg-input label="Disabled value" value="Unavailable" disabled></rg-input>
      <rg-switch label="Managed by your organization" checked disabled></rg-switch>
      <rg-slider label="Locked range" value="40" disabled show-value></rg-slider>
    </div>
  `,
};

export const Combobox: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-combobox
        name="city"
        label="City"
        placeholder="Search cities"
        description="Type to filter, then use the arrow keys to choose."
      >
        <rg-option value="seoul">Seoul</rg-option>
        <rg-option value="london">London</rg-option>
        <rg-option value="new-york">New York</rg-option>
        <rg-option value="tokyo">Tokyo</rg-option>
      </rg-combobox>
    </div>
  `,
};

export const Fieldsets: Story = {
  render: () => html`
    <rg-fieldset
      legend="Notification preferences"
      description="Choose which updates should reach your inbox."
      class="rg-wide-demo"
    >
      <rg-checkbox label="Weekly progress digest" checked></rg-checkbox>
      <rg-checkbox label="Mentions and assignments" checked></rg-checkbox>
      <rg-checkbox label="Product announcements"></rg-checkbox>
    </rg-fieldset>
  `,
};

export const ChipsSegmentsAndRating: Story = {
  render: () => html`
    <div class="rg-form-demo">
      <rg-chip-group selection="multiple" label="Project filters" name="filters">
        <rg-chip value="design" selected removable>Design</rg-chip>
        <rg-chip value="engineering">Engineering</rg-chip>
        <rg-chip value="research">Research</rg-chip>
        <rg-chip value="archived" disabled>Archived</rg-chip>
      </rg-chip-group>

      <rg-segmented-control label="Calendar view" value="week" name="view" full-width>
        <rg-segment value="day">Day</rg-segment>
        <rg-segment value="week">Week</rg-segment>
        <rg-segment value="month">Month</rg-segment>
      </rg-segmented-control>

      <rg-rating
        name="experience"
        label="How was your experience?"
        description="Use the arrow keys to adjust your rating."
        value="4"
        required
      ></rg-rating>
    </div>
  `,
};
