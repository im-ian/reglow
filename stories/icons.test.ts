import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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
const PUBLISHED_PACKAGES = ['elements', 'react', 'tokens', 'vue'];
const readManifest = (...pathSegments: string[]) =>
  JSON.parse(readFileSync(resolve(...pathSegments), 'utf8')) as Record<
    string,
    Record<string, string> | undefined
  >;

describe('Storybook icons', () => {
  it.each([
    ['arrow-right', ArrowIcon],
    ['bell', BellIcon],
    ['check', CheckIcon],
    ['heart', HeartIcon],
    ['plus', PlusIcon],
    ['search', SearchIcon],
    ['sparkles', SparklesIcon],
    ['trash-2', TrashIcon],
  ])('renders the Lucide %s icon in the SVG namespace', (name, template) => {
    const container = document.createElement('div');
    render(template, container);

    const wrapper = container.querySelector('.rg-story-icon');
    const icon = container.querySelector('svg');
    const shapes = Array.from(icon?.querySelectorAll('circle, line, path, polyline, rect') ?? []);

    expect(wrapper?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.namespaceURI).toBe(SVG_NAMESPACE);
    expect(icon?.classList.contains('lucide')).toBe(true);
    expect(icon?.classList.contains(`lucide-${name}`)).toBe(true);
    expect(shapes.length).toBeGreaterThan(0);
    expect(shapes.every((shape) => shape.namespaceURI === SVG_NAMESPACE)).toBe(true);
  });

  it('keeps Lucide out of published package dependency contracts', () => {
    const workspaceManifest = readManifest('package.json');

    expect(workspaceManifest['devDependencies']).toHaveProperty('lucide-static');
    expect(workspaceManifest['dependencies'] ?? {}).not.toHaveProperty('lucide-static');

    for (const packageName of PUBLISHED_PACKAGES) {
      const manifest = readManifest('packages', packageName, 'package.json');
      const consumerDependencies = {
        ...manifest['dependencies'],
        ...manifest['optionalDependencies'],
        ...manifest['peerDependencies'],
      };

      expect(consumerDependencies).not.toHaveProperty('lucide-static');
    }
  });
});
