import { ArrowRight, Bell, Check, Heart, Plus, Search, Sparkles, Trash2 } from 'lucide-static';
import { html, type TemplateResult } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

const icon = (source: string): TemplateResult => html`
  <span class="rg-story-icon" aria-hidden="true">${unsafeSVG(source)}</span>
`;

export const SparklesIcon = icon(Sparkles);
export const ArrowIcon = icon(ArrowRight);
export const PlusIcon = icon(Plus);
export const HeartIcon = icon(Heart);
export const SearchIcon = icon(Search);
export const BellIcon = icon(Bell);
export const CheckIcon = icon(Check);
export const TrashIcon = icon(Trash2);
