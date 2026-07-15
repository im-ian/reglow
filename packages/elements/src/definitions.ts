import { RgAccordionElement, RgAccordionItemElement } from './components/accordion.js';
import { RgAlertElement } from './components/alert.js';
import { RgAvatarElement } from './components/avatar.js';
import { RgBadgeElement } from './components/badge.js';
import { RgBreadcrumbElement, RgBreadcrumbItemElement } from './components/breadcrumb.js';
import { RgButtonElement, RgIconButtonElement } from './components/button.js';
import { RgButtonGroupElement } from './components/button-group.js';
import { RgCardElement } from './components/card.js';
import { RgCheckboxElement } from './components/checkbox.js';
import { RgChipElement, RgChipGroupElement } from './components/chip.js';
import { RgComboboxElement } from './components/combobox.js';
import { RgCopyButtonElement } from './components/copy-button.js';
import { RgDatePickerElement } from './components/date-picker.js';
import { RgDialogElement, RgDrawerElement } from './components/dialog.js';
import { RgDividerElement } from './components/divider.js';
import { RgEmptyStateElement } from './components/empty-state.js';
import { RgFieldsetElement } from './components/fieldset.js';
import { RgInputElement } from './components/input.js';
import { RgKbdElement } from './components/kbd.js';
import { RgLinkElement } from './components/link.js';
import { RgMenuElement, RgMenuItemElement } from './components/menu.js';
import { RgPaginationElement } from './components/pagination.js';
import { RgPopoverElement } from './components/popover.js';
import { RgProgressElement, RgSpinnerElement } from './components/progress.js';
import { RgProgressRingElement } from './components/progress-ring.js';
import { RgRadioElement, RgRadioGroupElement } from './components/radio.js';
import { RgRatingElement } from './components/rating.js';
import { RgRelativeTimeElement } from './components/relative-time.js';
import { RgSegmentElement, RgSegmentedControlElement } from './components/segmented-control.js';
import { RgOptionElement, RgSelectElement } from './components/select.js';
import { RgSkeletonElement } from './components/skeleton.js';
import { RgSliderElement } from './components/slider.js';
import { RgSwitchElement } from './components/switch.js';
import { RgTabElement, RgTabPanelElement, RgTabsElement } from './components/tabs.js';
import { RgTextareaElement } from './components/textarea.js';
import { RgThemeElement } from './components/theme.js';
import { RgToastElement, RgToastRegionElement } from './components/toast.js';
import { RgTooltipElement } from './components/tooltip.js';
import type { ReglowElementDefinition } from './core/define.js';

export const reglowElementDefinitions = [
  RgThemeElement,
  RgButtonElement,
  RgIconButtonElement,
  RgButtonGroupElement,
  RgCopyButtonElement,
  RgLinkElement,
  RgInputElement,
  RgTextareaElement,
  RgSelectElement,
  RgOptionElement,
  RgComboboxElement,
  RgDatePickerElement,
  RgCheckboxElement,
  RgSwitchElement,
  RgRadioGroupElement,
  RgRadioElement,
  RgSliderElement,
  RgRatingElement,
  RgChipGroupElement,
  RgChipElement,
  RgSegmentedControlElement,
  RgSegmentElement,
  RgBadgeElement,
  RgAvatarElement,
  RgCardElement,
  RgDividerElement,
  RgKbdElement,
  RgRelativeTimeElement,
  RgFieldsetElement,
  RgEmptyStateElement,
  RgAlertElement,
  RgProgressElement,
  RgProgressRingElement,
  RgSpinnerElement,
  RgSkeletonElement,
  RgToastRegionElement,
  RgToastElement,
  RgTabsElement,
  RgTabElement,
  RgTabPanelElement,
  RgAccordionElement,
  RgAccordionItemElement,
  RgBreadcrumbElement,
  RgBreadcrumbItemElement,
  RgPaginationElement,
  RgDialogElement,
  RgDrawerElement,
  RgTooltipElement,
  RgPopoverElement,
  RgMenuElement,
  RgMenuItemElement,
].map((constructor) => ({
  tagName: constructor.tagName,
  constructor,
})) as readonly ReglowElementDefinition[];

export interface ReglowHTMLElementTagNameMap {
  'rg-theme': RgThemeElement;
  'rg-button': RgButtonElement;
  'rg-icon-button': RgIconButtonElement;
  'rg-button-group': RgButtonGroupElement;
  'rg-copy-button': RgCopyButtonElement;
  'rg-link': RgLinkElement;
  'rg-input': RgInputElement;
  'rg-textarea': RgTextareaElement;
  'rg-select': RgSelectElement;
  'rg-option': RgOptionElement;
  'rg-combobox': RgComboboxElement;
  'rg-date-picker': RgDatePickerElement;
  'rg-checkbox': RgCheckboxElement;
  'rg-switch': RgSwitchElement;
  'rg-radio-group': RgRadioGroupElement;
  'rg-radio': RgRadioElement;
  'rg-slider': RgSliderElement;
  'rg-rating': RgRatingElement;
  'rg-chip-group': RgChipGroupElement;
  'rg-chip': RgChipElement;
  'rg-segmented-control': RgSegmentedControlElement;
  'rg-segment': RgSegmentElement;
  'rg-badge': RgBadgeElement;
  'rg-avatar': RgAvatarElement;
  'rg-card': RgCardElement;
  'rg-divider': RgDividerElement;
  'rg-kbd': RgKbdElement;
  'rg-relative-time': RgRelativeTimeElement;
  'rg-fieldset': RgFieldsetElement;
  'rg-empty-state': RgEmptyStateElement;
  'rg-alert': RgAlertElement;
  'rg-progress': RgProgressElement;
  'rg-progress-ring': RgProgressRingElement;
  'rg-spinner': RgSpinnerElement;
  'rg-skeleton': RgSkeletonElement;
  'rg-toast-region': RgToastRegionElement;
  'rg-toast': RgToastElement;
  'rg-tabs': RgTabsElement;
  'rg-tab': RgTabElement;
  'rg-tab-panel': RgTabPanelElement;
  'rg-accordion': RgAccordionElement;
  'rg-accordion-item': RgAccordionItemElement;
  'rg-breadcrumb': RgBreadcrumbElement;
  'rg-breadcrumb-item': RgBreadcrumbItemElement;
  'rg-pagination': RgPaginationElement;
  'rg-dialog': RgDialogElement;
  'rg-drawer': RgDrawerElement;
  'rg-tooltip': RgTooltipElement;
  'rg-popover': RgPopoverElement;
  'rg-menu': RgMenuElement;
  'rg-menu-item': RgMenuItemElement;
}

export type ReglowElementTagName = keyof ReglowHTMLElementTagNameMap;

export const reglowElementTags = reglowElementDefinitions.map(
  ({ tagName }) => tagName,
) as ReglowElementTagName[];

declare global {
  interface HTMLElementTagNameMap extends ReglowHTMLElementTagNameMap {}
}
