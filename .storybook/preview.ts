import '@fontsource-variable/manrope';
import '../packages/tokens/src/tokens.css';
import '../packages/elements/src/register.ts';
import '../stories/storybook.css';
import type { Preview } from '@storybook/web-components-vite';
import { html } from 'lit';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Reglow color theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
      },
    },
    direction: {
      description: 'Reading direction',
      defaultValue: 'ltr',
      toolbar: {
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
      },
    },
    motion: {
      description: 'Motion preference',
      defaultValue: 'full',
      toolbar: {
        icon: 'lightning',
        items: [
          { value: 'full', title: 'Full motion' },
          { value: 'reduced', title: 'Reduced motion' },
        ],
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = String(context.globals.theme ?? 'light');
      const direction = String(context.globals.direction ?? 'ltr');
      const motion = String(context.globals.motion ?? 'full');
      const layout = context.parameters['reglowLayout'] === 'full-page' ? 'full-page' : 'centered';
      document.documentElement.dir = direction;
      document.documentElement.dataset.rgTheme = theme;
      document.documentElement.dataset.rgMotion = motion;

      return html`
        <div
          class="rg-story-canvas"
          data-rg-theme=${theme}
          data-rg-motion=${motion}
          data-rg-layout=${layout}
          dir=${direction}
        >
          ${story()}
        </div>
      `;
    },
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    a11y: {
      test: 'error',
    },
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      canvas: { sourceState: 'shown' },
    },
    layout: 'fullscreen',
    options: {
      storySort: {
        order: [
          'Welcome',
          'Foundations',
          'Actions',
          'Forms',
          'Display',
          'Feedback',
          'Navigation',
          'Overlays',
          'Adapters',
        ],
      },
    },
  },
};

export default preview;
