import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Reglow',
    brandUrl: '/',
    brandTarget: '_self',
    colorPrimary: '#5367f8',
    colorSecondary: '#ff745b',
    appBg: '#f0f2ec',
    appContentBg: '#ffffff',
    appBorderColor: '#dce2da',
    appBorderRadius: 12,
    fontBase: '"Manrope Variable", sans-serif',
    fontCode: '"SFMono-Regular", Consolas, monospace',
    textColor: '#17201b',
    textMutedColor: '#657068',
    barTextColor: '#657068',
    barSelectedColor: '#5367f8',
    inputBg: '#ffffff',
    inputBorder: '#dce2da',
    inputBorderRadius: 10,
  }),
});
