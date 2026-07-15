import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { HeartIcon, PlusIcon, TrashIcon } from './icons.js';

const meta: Meta = {
  title: 'Overlays/Dialogs',
  component: 'rg-dialog',
};

export default meta;
type Story = StoryObj;

export const Dialog: Story = {
  render: () => html`
    <rg-dialog size="md">
      <rg-button slot="trigger"><span slot="start">${PlusIcon}</span>Create workspace</rg-button>
      <span slot="title">Create a new workspace</span>
      <div class="rg-form-demo">
        <rg-input label="Workspace name" placeholder="e.g. North star" required></rg-input>
        <rg-select label="Visibility" value="private">
          <rg-option value="private">Private</rg-option>
          <rg-option value="team">Everyone in my team</rg-option>
        </rg-select>
      </div>
      <div slot="footer" class="rg-dialog-actions">
        <rg-button variant="ghost" data-rg-close>Cancel</rg-button>
        <rg-button>Create workspace</rg-button>
      </div>
    </rg-dialog>
  `,
};

export const Drawer: Story = {
  render: () => html`
    <rg-drawer placement="end">
      <rg-button slot="trigger" variant="soft">Open activity</rg-button>
      <span slot="title">Recent activity</span>
      <div class="rg-activity-list">
        <p>
          <rg-avatar name="Mina Park" size="sm"></rg-avatar
          ><span><strong>Mina</strong> completed Brand review<small>8 minutes ago</small></span>
        </p>
        <p>
          <rg-avatar name="Alex Kim" size="sm"></rg-avatar
          ><span><strong>Alex</strong> added 4 notes<small>32 minutes ago</small></span>
        </p>
        <p>
          <rg-avatar name="Reglow Bot" size="sm"></rg-avatar
          ><span><strong>Reglow</strong> synced the release<small>1 hour ago</small></span>
        </p>
      </div>
    </rg-drawer>
  `,
};

export const DestructiveConfirmation: Story = {
  render: () => html`
    <rg-dialog size="sm">
      <rg-button slot="trigger" variant="soft" tone="danger"
        ><span slot="start">${TrashIcon}</span>Delete project</rg-button
      >
      <span slot="title">Delete “Soft launch”?</span>
      This removes the project and its 18 tasks for everyone. This action cannot be undone.
      <div slot="footer" class="rg-dialog-actions">
        <rg-button variant="ghost" data-rg-close>Keep project</rg-button>
        <rg-button tone="danger">Delete permanently</rg-button>
      </div>
    </rg-dialog>
  `,
};

export const Tooltips: Story = {
  render: () => html`
    <div class="rg-story-row">
      <rg-tooltip content="Add a new item" placement="top">
        <rg-icon-button slot="trigger" label="Add item">${PlusIcon}</rg-icon-button>
      </rg-tooltip>
      <rg-tooltip content="Save to favorites" placement="end">
        <rg-icon-button slot="trigger" label="Favorite" variant="soft">${HeartIcon}</rg-icon-button>
      </rg-tooltip>
    </div>
  `,
};

export const PopoversAndMenus: Story = {
  render: () => html`
    <div class="rg-story-row">
      <rg-popover label="Project details">
        <rg-button slot="trigger" variant="soft">Project details</rg-button>
        <div style="max-width: 18rem">
          <strong>Soft launch</strong>
          <p>8 teammates · Updated 12 minutes ago</p>
          <rg-link href="#project">Open project</rg-link>
        </div>
      </rg-popover>

      <rg-menu label="Project actions">
        <rg-button slot="trigger" variant="outline">More actions</rg-button>
        <rg-menu-item value="duplicate"
          ><span slot="start">${PlusIcon}</span>Duplicate</rg-menu-item
        >
        <rg-menu-item value="favorite"><span slot="start">${HeartIcon}</span>Favorite</rg-menu-item>
        <rg-menu-item value="delete"><span slot="start">${TrashIcon}</span>Delete</rg-menu-item>
      </rg-menu>
    </div>
  `,
};
