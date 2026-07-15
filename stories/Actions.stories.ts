import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ArrowIcon, HeartIcon, PlusIcon, SearchIcon, SparklesIcon } from './icons.js';

interface ButtonArgs {
  label: string;
  variant: 'solid' | 'soft' | 'outline' | 'ghost';
  tone: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  loading: boolean;
}

const meta: Meta<ButtonArgs> = {
  title: 'Actions/Button',
  component: 'rg-button',
  args: {
    label: 'Create project',
    variant: 'solid',
    tone: 'brand',
    size: 'md',
    disabled: false,
    loading: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'soft', 'outline', 'ghost'] },
    tone: { control: 'select', options: ['neutral', 'brand', 'success', 'warning', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => html`
    <rg-button
      variant=${args.variant}
      tone=${args.tone}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      <span slot="start">${SparklesIcon}</span>
      ${args.label}
    </rg-button>
  `,
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => html`
    <div class="rg-story-stack">
      ${(['solid', 'soft', 'outline', 'ghost'] as const).map(
        (variant) => html`
          <div class="rg-story-row">
            ${(['brand', 'neutral', 'success', 'warning', 'danger'] as const).map(
              (tone) => html`<rg-button variant=${variant} tone=${tone}>${tone}</rg-button>`,
            )}
          </div>
        `,
      )}
    </div>
  `,
};

export const SizesAndStates: Story = {
  render: () => html`
    <div class="rg-story-stack">
      <div class="rg-story-row">
        <rg-button size="sm">Small</rg-button>
        <rg-button size="md">Medium</rg-button>
        <rg-button size="lg">Large</rg-button>
      </div>
      <div class="rg-story-row">
        <rg-button loading>Saving changes</rg-button>
        <rg-button disabled>Unavailable</rg-button>
        <rg-button variant="soft" tone="danger">${HeartIcon}<span>Favorite</span></rg-button>
      </div>
    </div>
  `,
};

export const IconButtonsAndLinks: Story = {
  render: () => html`
    <div class="rg-story-row">
      <rg-icon-button label="Add item">${PlusIcon}</rg-icon-button>
      <rg-icon-button label="Search" variant="soft">${SearchIcon}</rg-icon-button>
      <rg-icon-button label="Favorite" variant="outline" tone="danger">${HeartIcon}</rg-icon-button>
      <rg-link href="#link-example"
        >Explore components <span slot="end">${ArrowIcon}</span></rg-link
      >
    </div>
  `,
};

export const ButtonGroups: Story = {
  render: () => html`
    <div class="rg-story-stack">
      <rg-button-group label="Editor actions" attached>
        <rg-button variant="outline">Draft</rg-button>
        <rg-button variant="outline">Preview</rg-button>
        <rg-button variant="outline">Publish</rg-button>
      </rg-button-group>
      <div class="rg-story-row">
        <span>Open command palette</span><rg-kbd keys="Meta+K" label="Command K"></rg-kbd>
      </div>
    </div>
  `,
};

export const CopyButton: Story = {
  render: () => html`
    <div class="rg-story-stack">
      <code id="install-command">pnpm add @reglow/elements</code>
      <div class="rg-story-row">
        <rg-copy-button from="#install-command" copy-label="Copy install command"></rg-copy-button>
        <rg-copy-button
          value="import '@reglow/elements/register';"
          copy-label="Copy registration import"
        ></rg-copy-button>
      </div>
    </div>
  `,
};
