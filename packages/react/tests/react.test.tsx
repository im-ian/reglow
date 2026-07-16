import { fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { componentMetadata } from '@reglow/elements';
import * as Reglow from '../src/index.js';
import {
  Avatar,
  AvatarGroup,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  ChipGroup,
  Combobox,
  CopyButton,
  DatePicker,
  DateTimePicker,
  Dialog,
  EmptyState,
  Fieldset,
  FormatBytes,
  FormatDate,
  FormatNumber,
  Input,
  Kbd,
  Menu,
  MenuItem,
  Meter,
  Pagination,
  Popover,
  ProgressRing,
  Rating,
  RelativeTime,
  Segment,
  SegmentedControl,
  Select,
  Step,
  StepIndicator,
  Timeline,
  TimelineItem,
  TimePicker,
  createReglowComponent,
  type InputProps,
  type RgButtonElement,
  type RgInputElement,
} from '../src/index.js';

afterEach(() => {
  document.body.replaceChildren();
});

describe('@reglow/react', () => {
  it('exports an adapter for every public Reglow element', () => {
    const exports = Reglow as unknown as Record<string, unknown>;
    const expectedNames = componentMetadata.map(({ className }) =>
      className.replace(/^Rg/, '').replace(/Element$/, ''),
    );

    expect(expectedNames.filter((name) => exports[name] === undefined)).toEqual([]);
  });

  it('forwards typed refs, attributes, and named slots', () => {
    const ref = createRef<RgButtonElement>();
    const { container } = render(
      <Button ref={ref} variant="soft" fullWidth start={<span data-testid="start">+</span>}>
        Create
      </Button>,
    );
    const host = container.querySelector('rg-button')!;

    expect(ref.current).toBe(host);
    expect(host.hasAttribute('full-width')).toBe(true);
    expect(host.querySelector('[slot="start"]')).not.toBeNull();
  });

  it('maps value events without owning component state', () => {
    const onValueChange = vi.fn();
    const ref = createRef<RgInputElement>();
    render(<Input ref={ref} label="Name" value="Reglow" onValueChange={onValueChange} />);
    const control = ref.current!.shadowRoot!.querySelector('input')!;

    control.value = 'Reglow UI';
    fireEvent.input(control);
    expect(ref.current!.value).toBe('Reglow UI');
    expect(onValueChange).toHaveBeenCalledOnce();
  });

  it('maps picker display and overlay options to custom-element attributes', () => {
    const { container } = render(
      <>
        <DatePicker dateFormat="long" overlayWidth="full" overlayAlign="center" />
        <TimePicker overlayWidth="full" overlayAlign="center" />
        <DateTimePicker dateFormat="iso" overlayWidth="full" overlayAlign="end" />
      </>,
    );

    const date = container.querySelector('rg-date-picker')!;
    const time = container.querySelector('rg-time-picker')!;
    const dateTime = container.querySelector('rg-date-time-picker')!;
    expect(date.getAttribute('date-format')).toBe('long');
    expect(date.getAttribute('overlay-width')).toBe('full');
    expect(date.getAttribute('overlay-align')).toBe('center');
    expect(time.getAttribute('overlay-width')).toBe('full');
    expect(time.getAttribute('overlay-align')).toBe('center');
    expect(dateTime.getAttribute('date-format')).toBe('iso');
    expect(dateTime.getAttribute('overlay-align')).toBe('end');
  });

  it('keeps native value events typed to their custom-element host', () => {
    const handler: NonNullable<InputProps['onValueChange']> = (event) => {
      const value: string = event.currentTarget.value;
      expect(value).toBe('Typed value');
    };
    const ref = createRef<RgInputElement>();
    render(<Input ref={ref} onValueChange={handler} />);
    const control = ref.current!.shadowRoot!.querySelector('input')!;

    control.value = 'Typed value';
    fireEvent.input(control);
  });

  it('maps cancelable action events', () => {
    const onPress = vi.fn((event: Event) => event.preventDefault());
    const { container } = render(<Button onPress={onPress}>Create</Button>);
    const control = container.querySelector('rg-button')!.shadowRoot!.querySelector('button')!;

    fireEvent.click(control);
    expect(onPress).toHaveBeenCalledOnce();
    expect(onPress.mock.calls[0]![0].defaultPrevented).toBe(true);
  });

  it('wraps fragment and custom-component named-slot content', () => {
    const Label = () => (
      <>
        Project <strong>name</strong>
      </>
    );
    const { container } = render(<Input label={<Label />} />);
    const label = container.querySelector('rg-input > [slot="label"]');

    expect(label?.textContent).toBe('Project name');
  });

  it('resets property-backed props when they are removed', () => {
    const { container, rerender } = render(
      <>
        <Select options={[{ value: 'private', label: 'Private' }]} />
        <Checkbox indeterminate />
      </>,
    );
    const select = container.querySelector('rg-select')!;
    const checkbox = container.querySelector('rg-checkbox')!;
    expect(select.options).toHaveLength(1);
    expect(checkbox.indeterminate).toBe(true);

    rerender(
      <>
        <Select />
        <Checkbox />
      </>,
    );
    expect(select.options).toHaveLength(0);
    expect(checkbox.indeterminate).toBe(false);
  });

  it('sets property-backed values before a custom element connects', () => {
    interface PropertyProbeElement extends HTMLElement {
      payload: object | null;
      connectedPayload: object | null;
    }

    const tagName = 'rg-react-property-probe';
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

    const Probe = createReglowComponent<PropertyProbeElement, { payload?: object }>(tagName, {
      displayName: 'PropertyProbe',
      properties: ['payload'],
      propertyDefaults: { payload: null },
    });
    const payload = { ready: true };
    const { container, rerender } = render(<Probe payload={payload} />);
    const probe = container.querySelector(tagName) as PropertyProbeElement;

    expect(probe.connectedPayload).toBe(probe.payload);
    expect(probe.payload).toStrictEqual(payload);
    rerender(<Probe />);
    expect(probe.payload).toBeNull();
  });

  it('normalizes dialog slots and custom events', () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Dialog
        title="Create workspace"
        trigger={<Button>Open</Button>}
        footer={<Button>Create</Button>}
        onOpenChange={onOpenChange}
      >
        Content
      </Dialog>,
    );
    const host = container.querySelector('rg-dialog')!;
    (host.querySelector('[slot="trigger"]') as HTMLElement).click();

    expect(onOpenChange).toHaveBeenCalledOnce();
    expect(host.querySelector('[slot="title"]')?.textContent).toBe('Create workspace');
    expect(host.querySelector('[slot="footer"]')).not.toBeNull();
  });

  it('exports the expanded component set and maps property-backed combobox options', () => {
    expect([
      Breadcrumb,
      BreadcrumbItem,
      ButtonGroup,
      Combobox,
      DatePicker,
      DateTimePicker,
      EmptyState,
      Fieldset,
      Kbd,
      Menu,
      MenuItem,
      Pagination,
      Popover,
      TimePicker,
    ]).toHaveLength(14);

    const { container } = render(
      <Combobox
        label="City"
        noResultsText="No cities"
        options={[{ value: 'seoul', label: 'Seoul' }]}
      />,
    );
    const combo = container.querySelector('rg-combobox')!;
    expect(combo.options).toEqual([
      { value: 'seoul', label: 'Seoul', disabled: false, selected: false },
    ]);
    expect(combo.getAttribute('no-results-text')).toBe('No cities');
  });

  it('exports the researched catalog batch and preserves array chip values', () => {
    expect([
      Chip,
      ChipGroup,
      CopyButton,
      ProgressRing,
      Rating,
      RelativeTime,
      Segment,
      SegmentedControl,
    ]).toHaveLength(8);

    const { container } = render(
      <ChipGroup selection="multiple" value={['design', 'engineering']} label="Filters">
        <Chip value="design">Design</Chip>
        <Chip value="engineering">Engineering</Chip>
      </ChipGroup>,
    );
    const group = container.querySelector('rg-chip-group')!;
    expect(group.value).toEqual(['design', 'engineering']);
    expect(group.querySelectorAll('rg-chip[selected]')).toHaveLength(2);
  });

  it('adapts locale helpers, meter labels, and step indicator composition', () => {
    const { container } = render(
      <>
        <FormatDate date={new Date('2026-07-15T09:17:00.000Z')} locale="en-US" timeZone="UTC" />
        <FormatNumber value={2_000} locale="en-US" type="currency" currency="USD" />
        <FormatBytes value={1_500_000} locale="en-US" />
        <Meter value={75} max={100} showValue label={<strong>Storage</strong>} />
        <StepIndicator value="delivery" label="Checkout">
          <Step value="account">Account</Step>
          <Step value="delivery" description={<span>Choose a window</span>}>
            Delivery
          </Step>
        </StepIndicator>
      </>,
    );

    expect(container.querySelector('rg-format-date')?.date).toBe('2026-07-15T09:17:00.000Z');
    expect(container.querySelector('rg-format-number')?.textContent).toBe('');
    expect(container.querySelector('rg-meter > [slot="label"]')?.textContent).toBe('Storage');
    expect(container.querySelector('rg-meter')?.hasAttribute('show-value')).toBe(true);
    expect(container.querySelector('rg-step [slot="description"]')?.textContent).toBe(
      'Choose a window',
    );
    expect(
      Array.from(container.querySelectorAll('rg-step')).map((step) => step.dataset.state),
    ).toEqual(['complete', 'current']);
    expect([FormatDate, FormatNumber, FormatBytes, Meter, StepIndicator, Step]).toHaveLength(6);
  });

  it('adapts avatar groups and timeline item slots', () => {
    const { container } = render(
      <>
        <AvatarGroup label="Reviewers" max={2} moreLabel="more reviewers" size="sm">
          <Avatar name="Mina Park" />
          <Avatar name="Alex Kim" />
          <Avatar name="Noah Lee" />
        </AvatarGroup>
        <Timeline label="Activity">
          <TimelineItem
            heading="Review completed"
            dateTime="2026-07-16T12:00:00Z"
            timestamp="12:00"
            tone="success"
            icon={<span>✓</span>}
            description={<span>Approved by Mina</span>}
          />
        </Timeline>
      </>,
    );

    expect(container.querySelector('rg-avatar-group')?.shadowRoot?.textContent).toContain('+1');
    expect(container.querySelector('rg-avatar')?.getAttribute('size')).toBe('sm');
    expect(container.querySelector('rg-timeline-item [slot="icon"]')?.textContent).toBe('✓');
    expect(container.querySelector('rg-timeline-item [slot="description"]')?.textContent).toBe(
      'Approved by Mina',
    );
    expect(container.querySelector('rg-timeline-item')?.getAttribute('datetime')).toBe(
      '2026-07-16T12:00:00Z',
    );
  });
});
