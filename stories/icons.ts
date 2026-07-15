import { html, svg, type TemplateResult } from 'lit';

const icon = (paths: TemplateResult): TemplateResult => html`
  <svg
    aria-hidden="true"
    focusable="false"
    width="1em"
    height="1em"
    style="display: block; flex: none"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    ${paths}
  </svg>
`;

export const SparklesIcon = icon(svg`
  <path
    d="m12 3-1.2 3.1a4 4 0 0 1-2.3 2.3L5.4 9.6l3.1 1.2a4 4 0 0 1 2.3 2.3L12 16.2l1.2-3.1a4 4 0 0 1 2.3-2.3l3.1-1.2-3.1-1.2a4 4 0 0 1-2.3-2.3L12 3Z"
  />
  <path
    d="m5 16-.6 1.5a2 2 0 0 1-1.1 1.1l-1.5.6 1.5.6a2 2 0 0 1 1.1 1.1L5 22.4l.6-1.5a2 2 0 0 1 1.1-1.1l1.5-.6-1.5-.6a2 2 0 0 1-1.1-1.1L5 16Z"
  />
`);

export const ArrowIcon = icon(svg`<path d="M5 12h14" /><path d="m13 6 6 6-6 6" />`);
export const PlusIcon = icon(svg`<path d="M12 5v14M5 12h14" />`);
export const HeartIcon = icon(
  svg`<path
    d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5a5.5 5.5 0 0 0 1.1-8.9Z"
  />`,
);
export const SearchIcon = icon(svg`<circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />`);
export const BellIcon = icon(
  svg`<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" />`,
);
export const CheckIcon = icon(svg`<path d="m5 12 4 4L19 6" />`);
export const TrashIcon = icon(svg`<path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 11v5m4-5v5" />`);
