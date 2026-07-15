import { render } from 'lit';
import { describe, expect, it } from 'vitest';
import {
  ArrowIcon,
  BellIcon,
  CheckIcon,
  HeartIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  TrashIcon,
} from './icons.js';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

describe('Storybook icons', () => {
  it.each([
    ['arrow', ArrowIcon],
    ['bell', BellIcon],
    ['check', CheckIcon],
    ['heart', HeartIcon],
    ['plus', PlusIcon],
    ['search', SearchIcon],
    ['sparkles', SparklesIcon],
    ['trash', TrashIcon],
  ])('renders the %s icon shapes in the SVG namespace', (_name, template) => {
    const container = document.createElement('div');
    render(template, container);

    const icon = container.querySelector('svg');
    const shapes = Array.from(icon?.querySelectorAll('circle, path') ?? []);

    expect(icon?.namespaceURI).toBe(SVG_NAMESPACE);
    expect(shapes.length).toBeGreaterThan(0);
    expect(shapes.every((shape) => shape.namespaceURI === SVG_NAMESPACE)).toBe(true);
  });
});
