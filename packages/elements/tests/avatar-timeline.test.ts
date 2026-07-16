import { afterEach, describe, expect, it } from 'vitest';
import { reglowElementTags } from '../src/definitions.js';
import { RgAvatarGroupElement, RgTimelineItemElement } from '../src/index.js';
import '../src/register.js';

afterEach(() => {
  document.body.replaceChildren();
});

describe('avatar group', () => {
  it('groups avatars and summarizes items beyond the visible maximum', () => {
    const group = document.createElement('rg-avatar-group') as HTMLElement & {
      max: number;
    };
    group.setAttribute('label', 'Project collaborators');
    group.setAttribute('more-label', 'more collaborators');
    group.max = 3;
    group.innerHTML = `
      <rg-avatar name="Mina Park"></rg-avatar>
      <rg-avatar name="Alex Kim"></rg-avatar>
      <rg-avatar name="Noah Lee"></rg-avatar>
      <rg-avatar name="Sora Han"></rg-avatar>
      <rg-avatar name="Jules Moon"></rg-avatar>
    `;
    document.body.append(group);

    const avatars = Array.from(group.querySelectorAll('rg-avatar'));
    const base = group.shadowRoot!.querySelector('[part~="base"]')!;
    const overflow = group.shadowRoot!.querySelector<HTMLElement>('[part="overflow"]')!;

    expect(base.getAttribute('role')).toBe('group');
    expect(base.getAttribute('aria-label')).toBe('Project collaborators');
    expect(avatars.map((avatar) => avatar.hasAttribute('data-rg-overflow-hidden'))).toEqual([
      false,
      false,
      false,
      true,
      true,
    ]);
    expect(avatars.slice(3).every((avatar) => avatar.getAttribute('aria-hidden') === 'true')).toBe(
      true,
    );
    expect(overflow.textContent).toBe('+2');
    expect(overflow.getAttribute('aria-label')).toBe('2 more collaborators');
  });

  it('reacts to max and size changes without hiding avatars when max is zero', () => {
    const group = document.createElement('rg-avatar-group') as HTMLElement & {
      max: number;
      size: string;
    };
    group.innerHTML = `
      <rg-avatar name="One"></rg-avatar>
      <rg-avatar name="Two"></rg-avatar>
      <rg-avatar name="Three"></rg-avatar>
    `;
    document.body.append(group);

    group.max = 2;
    group.size = 'sm';

    const avatars = Array.from(group.querySelectorAll('rg-avatar'));
    expect(avatars.map((avatar) => avatar.getAttribute('size'))).toEqual(['sm', 'sm', 'sm']);
    expect(avatars[2]!.hasAttribute('data-rg-overflow-hidden')).toBe(true);

    group.max = 0;
    expect(avatars.every((avatar) => !avatar.hasAttribute('data-rg-overflow-hidden'))).toBe(true);
    expect(group.shadowRoot!.querySelector<HTMLElement>('[part="overflow"]')!.hidden).toBe(true);
  });
});

describe('timeline', () => {
  it('presents chronological entries as a named list with native time semantics', () => {
    const timeline = document.createElement('rg-timeline');
    timeline.setAttribute('label', 'Order history');
    timeline.innerHTML = `
      <rg-timeline-item
        heading="Order placed"
        description="The order was received"
        timestamp="Jul 16, 10:30"
        datetime="2026-07-16T10:30:00+09:00"
        tone="success"
      ></rg-timeline-item>
      <rg-timeline-item timestamp="Jul 16, 11:10">Payment captured</rg-timeline-item>
    `;
    document.body.append(timeline);

    const list = timeline.shadowRoot!.querySelector('ol')!;
    const items = Array.from(timeline.querySelectorAll('rg-timeline-item'));
    const firstTime = items[0]!.shadowRoot!.querySelector('time')!;

    expect(list.getAttribute('aria-label')).toBe('Order history');
    expect(items.map((item) => item.getAttribute('role'))).toEqual(['listitem', 'listitem']);
    expect(items.map((item) => item.hasAttribute('data-last'))).toEqual([false, true]);
    expect(firstTime.dateTime).toBe('2026-07-16T10:30:00+09:00');
    expect(firstTime.textContent).toBe('Jul 16, 10:30');
    expect(items[0]!.shadowRoot!.querySelector('[part="title"]')!.textContent).toBe('Order placed');
    expect(items[0]!.shadowRoot!.querySelector('[part="description"]')!.textContent).toBe(
      'The order was received',
    );
  });

  it('renders attribute content when a detached parent synchronizes formatted markup', () => {
    const timeline = document.createElement('rg-timeline') as HTMLElement & {
      connectedCallback(): void;
    };
    timeline.innerHTML = `
      <rg-timeline-item
        heading="Created"
        description="Workspace ready"
        timestamp="Today, 09:40"
        datetime="2026-07-16T09:40:00+09:00"
      >
      </rg-timeline-item>
    `;

    expect(() => timeline.connectedCallback()).not.toThrow();
    const item = timeline.querySelector('rg-timeline-item')!;
    expect(item.shadowRoot).not.toBeNull();
    expect(item.shadowRoot!.querySelector('[part="title"]')!.textContent!.trim()).toBe('Created');
    expect(item.shadowRoot!.querySelector('[part="description"]')!.textContent!.trim()).toBe(
      'Workspace ready',
    );
    expect(item.shadowRoot!.querySelector('time')!.textContent!.trim()).toBe('Today, 09:40');
  });
});

it('registers the avatar group and timeline family', () => {
  expect(reglowElementTags).toEqual(
    expect.arrayContaining(['rg-avatar-group', 'rg-timeline', 'rg-timeline-item']),
  );
});

it('does not paint surface-colored outer rings around grouped avatars or timeline markers', () => {
  expect(RgAvatarGroupElement.styles).not.toContain(
    'border: 2px solid var(--_rg-surface);',
  );
  expect(RgTimelineItemElement.styles).not.toContain(
    'box-shadow: 0 0 0 2px var(--_rg-surface);',
  );
});
