import { mount } from '@vue/test-utils';
import { Fragment, h } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  RgAvatar,
  RgAvatarGroup,
  RgBreadcrumb,
  RgBreadcrumbItem,
  RgButton,
  RgButtonGroup,
  RgCard,
  RgCheckbox,
  RgChip,
  RgChipGroup,
  RgCombobox,
  RgCopyButton,
  RgDatePicker,
  RgDialog,
  RgDivider,
  RgEmptyState,
  RgFieldset,
  RgFormatBytes,
  RgFormatDate,
  RgFormatNumber,
  RgInput,
  RgKbd,
  RgLink,
  RgMenu,
  RgMenuItem,
  RgMeter,
  RgPagination,
  RgPopover,
  RgProgressRing,
  RgRating,
  RgRelativeTime,
  RgSegment,
  RgSegmentedControl,
  RgSlider,
  RgStep,
  RgStepIndicator,
  RgTimeline,
  RgTimelineItem,
  RgTextarea,
  RgTheme,
  RgToastRegion,
  ReglowPlugin,
  createReglowVueComponent,
} from '../src/index.js';
import type {
  RgAvatarElement,
  RgButtonElement,
  RgCheckboxElement,
  RgDialogElement,
  RgInputElement,
  RgLinkElement,
  RgSliderElement,
  RgTextareaElement,
  RgToastRegionElement,
} from '@reglow/elements';

afterEach(() => {
  document.body.replaceChildren();
});

describe('@reglow/vue', () => {
  it('passes props and named slots to the custom element', () => {
    const wrapper = mount(RgButton, {
      attachTo: document.body,
      props: { variant: 'soft', fullWidth: true },
      slots: { default: 'Create', start: '<span>+</span>' },
    });
    const host = wrapper.element as HTMLElement;

    expect(host.localName).toBe('rg-button');
    expect(host.getAttribute('variant')).toBe('soft');
    expect(host.hasAttribute('full-width')).toBe(true);
    expect(host.querySelector('[slot="start"]')).not.toBeNull();
  });

  it('casts bare boolean props before forwarding them to custom elements', () => {
    const wrapper = mount({
      components: { RgCheckbox, RgInput },
      template: '<div><RgCheckbox checked /><RgInput disabled /></div>',
    });

    const checkbox = wrapper.element.querySelector('rg-checkbox') as RgCheckboxElement;
    const input = wrapper.element.querySelector('rg-input') as RgInputElement;

    expect(checkbox.checked).toBe(true);
    expect(input.disabled).toBe(true);
  });

  it('casts static number props before forwarding them to custom elements', () => {
    const wrapper = mount({
      components: { RgSlider, RgTextarea },
      template: '<div><RgSlider min="10" max="80" step="5" /><RgTextarea rows="7" /></div>',
    });

    const slider = wrapper.element.querySelector('rg-slider') as RgSliderElement;
    const textarea = wrapper.element.querySelector('rg-textarea') as RgTextareaElement;

    expect([slider.min, slider.max, slider.step]).toEqual([10, 80, 5]);
    expect(textarea.rows).toBe(7);
  });

  it('wraps plain text so it can participate in a named native slot', () => {
    const wrapper = mount(RgInput, {
      slots: { label: 'Project name' },
    });
    const host = wrapper.element as RgInputElement;

    expect(host.querySelector('[slot="label"]')?.textContent).toBe('Project name');
  });

  it('flattens fragment content into assignable named-slot children', () => {
    const wrapper = mount(RgInput, {
      slots: {
        label: () => h(Fragment, null, [h('strong', 'Project'), ' name']),
      },
    });
    const host = wrapper.element as RgInputElement;
    const assigned = Array.from(host.querySelectorAll('[slot="label"]'));

    expect(assigned.map((node) => node.textContent).join('')).toBe('Project name');
    expect(assigned).toHaveLength(2);
  });

  it('emits update:modelValue from the live element property', async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(RgInput, {
      attachTo: document.body,
      props: { modelValue: 'Reglow', label: 'Name', 'onUpdate:modelValue': onUpdate },
    });
    const host = wrapper.element as RgInputElement;
    const control = host.shadowRoot!.querySelector('input')!;

    control.value = 'Reglow UI';
    control.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    await wrapper.vm.$nextTick();
    expect(onUpdate).toHaveBeenCalledWith('Reglow UI');
  });

  it('maps the official action, avatar, and toast events', () => {
    const onPress = vi.fn();
    const onNavigate = vi.fn();
    const onLoad = vi.fn();
    const onError = vi.fn();
    const onToastAdd = vi.fn();
    const wrappers = [
      mount(RgButton, { props: { onPress } }),
      mount(RgLink, { props: { onNavigate } }),
      mount(RgAvatar, { props: { onLoad, onError } }),
      mount(RgToastRegion, { props: { onToastAdd } }),
    ];

    const button = wrappers[0]!.element as RgButtonElement;
    const link = wrappers[1]!.element as RgLinkElement;
    const avatar = wrappers[2]!.element as RgAvatarElement;
    const region = wrappers[3]!.element as RgToastRegionElement;

    button.dispatchEvent(new CustomEvent('rg-press', { detail: { source: 'pointer' } }));
    link.dispatchEvent(new CustomEvent('rg-navigate', { detail: { href: '/docs' } }));
    avatar.dispatchEvent(new CustomEvent('rg-load', { detail: { src: '/avatar.png' } }));
    avatar.dispatchEvent(new CustomEvent('rg-error', { detail: { src: '/avatar.png' } }));
    region.dispatchEvent(new CustomEvent('rg-toast-add', { detail: { id: 'toast-1' } }));

    expect(onPress).toHaveBeenCalledWith(expect.objectContaining({ type: 'rg-press' }));
    expect(onNavigate).toHaveBeenCalledWith(expect.objectContaining({ type: 'rg-navigate' }));
    expect(onLoad).toHaveBeenCalledWith(expect.objectContaining({ type: 'rg-load' }));
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ type: 'rg-error' }));
    expect(onToastAdd).toHaveBeenCalledWith(expect.objectContaining({ type: 'rg-toast-add' }));
  });

  it('forwards the expanded v1 props and disambiguates the avatar status slot', () => {
    const button = mount(RgButton, {
      props: {
        name: 'intent',
        value: 'save',
        pressed: false,
        formNoValidate: true,
      },
    }).element as RgButtonElement;
    const link = mount(RgLink, {
      props: { variant: 'standalone', external: true, download: 'guide.pdf' },
    }).element as RgLinkElement;
    const avatar = mount(RgAvatar, {
      props: { status: 'online', statusLabel: 'Available' },
      slots: { statusContent: 'Custom presence' },
    }).element as RgAvatarElement;
    const card = mount(RgCard, {
      props: { radius: 'xl', lift: true },
      slots: { media: '<img alt="" />' },
    }).element as HTMLElement;
    const divider = mount(RgDivider, {
      props: { variant: 'brand', spacing: 'lg', decorative: true },
    }).element as HTMLElement;

    expect(button.name).toBe('intent');
    expect(button.value).toBe('save');
    expect(button.pressed).toBe(false);
    expect(button.formNoValidate).toBe(true);
    expect(link.variant).toBe('standalone');
    expect(link.external).toBe(true);
    expect(link.download).toBe('guide.pdf');
    expect(avatar.status).toBe('online');
    expect(avatar.querySelector('[slot="status"]')?.textContent).toBe('Custom presence');
    expect(card.getAttribute('radius')).toBe('xl');
    expect(card.hasAttribute('lift')).toBe(true);
    expect(card.querySelector('[slot="media"]')).not.toBeNull();
    expect(divider.getAttribute('variant')).toBe('brand');
    expect(divider.getAttribute('spacing')).toBe('lg');
    expect(divider.hasAttribute('decorative')).toBe(true);
  });

  it('maps dialog dismissal props and restores property defaults when props are removed', async () => {
    const focusTarget = document.createElement('button');
    const wrapper = mount(RgDialog, {
      props: {
        initialFocus: focusTarget,
        escapeKeyAction: 'none',
        backdropAction: 'none',
        hideClose: true,
        closeLabel: 'Dismiss',
      },
    });
    const dialog = wrapper.element as RgDialogElement;

    expect(dialog.initialFocus).toBe(focusTarget);
    expect(dialog.getAttribute('escape-key-action')).toBe('none');
    expect(dialog.getAttribute('backdrop-action')).toBe('none');
    expect(dialog.hasAttribute('hide-close')).toBe(true);
    expect(dialog.getAttribute('close-label')).toBe('Dismiss');

    await wrapper.setProps({ initialFocus: undefined });
    expect(dialog.initialFocus).toBeNull();
  });

  it('sets property-backed values before a custom element connects', async () => {
    interface PropertyProbeElement extends HTMLElement {
      payload: object | null;
      connectedPayload: object | null;
    }

    const tagName = 'rg-vue-property-probe';
    if (!customElements.get(tagName)) {
      customElements.define(
        tagName,
        class extends HTMLElement {
          payload: object | null = null;
          connectedPayload: object | null = null;

          connectedCallback(): void {
            this.connectedPayload = this.payload;
          }
        },
      );
    }

    const Probe = createReglowVueComponent<PropertyProbeElement, { payload?: object }>(tagName, {
      displayName: 'PropertyProbe',
      props: ['payload'],
      properties: ['payload'],
      propertyDefaults: { payload: null },
    });
    const payload = { ready: true };
    const wrapper = mount(Probe, { attachTo: document.body, props: { payload } });
    const probe = wrapper.element as PropertyProbeElement;

    expect(probe.connectedPayload).toBe(probe.payload);
    expect(probe.payload).toStrictEqual(payload);

    await wrapper.setProps({ payload: undefined });
    expect(probe.payload).toBeNull();
  });

  it('installs all official adapter components', () => {
    const component = vi.fn();
    ReglowPlugin.install({ component } as never);
    expect(component).toHaveBeenCalledWith('RgTheme', RgTheme);
    expect(component.mock.calls.length).toBe(60);
    expect([
      RgBreadcrumb,
      RgBreadcrumbItem,
      RgButtonGroup,
      RgCombobox,
      RgDatePicker,
      RgEmptyState,
      RgFieldset,
      RgKbd,
      RgMenu,
      RgMenuItem,
      RgPagination,
      RgPopover,
    ]).toHaveLength(12);
  });

  it('installs the researched catalog batch and forwards array chip models', () => {
    expect([
      RgChip,
      RgChipGroup,
      RgCopyButton,
      RgProgressRing,
      RgRating,
      RgRelativeTime,
      RgSegment,
      RgSegmentedControl,
    ]).toHaveLength(8);

    const wrapper = mount(RgChipGroup, {
      attachTo: document.body,
      props: { selection: 'multiple', modelValue: ['design', 'engineering'] },
      slots: {
        default: () => [
          h(RgChip, { value: 'design' }, () => 'Design'),
          h(RgChip, { value: 'engineering' }, () => 'Engineering'),
        ],
      },
    });
    const group = wrapper.element as HTMLElement & { value: string | string[] };
    expect(group.value).toEqual(['design', 'engineering']);
    expect(group.querySelectorAll('rg-chip[selected]')).toHaveLength(2);
  });

  it('forwards expanded combobox props and options', () => {
    const combo = mount(RgCombobox, {
      props: {
        label: 'City',
        noResultsText: 'No cities',
        options: [{ value: 'seoul', label: 'Seoul' }],
      },
    }).element as HTMLElement & { options: unknown };

    expect(combo.options).toEqual([
      { value: 'seoul', label: 'Seoul', disabled: false, selected: false },
    ]);
    expect(combo.getAttribute('no-results-text')).toBe('No cities');
  });

  it('adapts locale helpers, meter labels, and step indicator composition', () => {
    const formatted = mount(RgFormatNumber, {
      attachTo: document.body,
      props: { value: 2_000, locale: 'en-US', type: 'currency', currency: 'USD' },
    }).element as HTMLElement;
    const meter = mount(RgMeter, {
      attachTo: document.body,
      props: { value: 75, max: 100, showValue: true },
      slots: { label: '<strong>Storage</strong>' },
    }).element as HTMLElement;
    const steps = mount(RgStepIndicator, {
      attachTo: document.body,
      props: { value: 'delivery', label: 'Checkout' },
      slots: {
        default: () => [
          h(RgStep, { value: 'account' }, () => 'Account'),
          h(RgStep, { value: 'delivery' }, () => 'Delivery'),
        ],
      },
    }).element as HTMLElement;

    expect(formatted.shadowRoot?.querySelector('[part~="base"]')?.textContent).toBe('$2,000.00');
    expect(meter.querySelector('[slot="label"]')?.textContent).toBe('Storage');
    expect(meter.hasAttribute('show-value')).toBe(true);
    expect(Array.from(steps.querySelectorAll('rg-step')).map((step) => step.dataset.state)).toEqual(
      ['complete', 'current'],
    );
    expect([
      RgFormatDate,
      RgFormatNumber,
      RgFormatBytes,
      RgMeter,
      RgStepIndicator,
      RgStep,
    ]).toHaveLength(6);
  });

  it('adapts avatar groups and timeline item slots', () => {
    const group = mount(RgAvatarGroup, {
      attachTo: document.body,
      props: { label: 'Reviewers', max: 2, moreLabel: 'more reviewers', size: 'sm' },
      slots: {
        default: () => [
          h(RgAvatar, { name: 'Mina Park' }),
          h(RgAvatar, { name: 'Alex Kim' }),
          h(RgAvatar, { name: 'Noah Lee' }),
        ],
      },
    }).element as HTMLElement;
    const timeline = mount(RgTimeline, {
      attachTo: document.body,
      props: { label: 'Activity' },
      slots: {
        default: () =>
          h(
            RgTimelineItem,
            {
              heading: 'Review completed',
              dateTime: '2026-07-16T12:00:00Z',
              timestamp: '12:00',
              tone: 'success',
            },
            {
              icon: () => '✓',
              description: () => 'Approved by Mina',
            },
          ),
      },
    }).element as HTMLElement;

    expect(group.shadowRoot?.textContent).toContain('+1');
    expect(group.querySelector('rg-avatar')?.getAttribute('size')).toBe('sm');
    expect(timeline.querySelector('rg-timeline-item [slot="icon"]')?.textContent).toBe('✓');
    expect(timeline.querySelector('rg-timeline-item [slot="description"]')?.textContent).toBe(
      'Approved by Mina',
    );
  });
});
