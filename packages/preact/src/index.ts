import type { JSX } from 'preact';
import type {
  AccordionItemOpenChangeDetail,
  AccordionValueChangeDetail,
  AlertDismissDetail,
  DialogBeforeCloseDetail,
  DialogCloseDetail,
  DialogOpenChangeDetail,
  PaginationPageChangeDetail,
  RgAccordionElement,
  RgAccordionItemElement,
  RgAlertElement,
  RgAvatarElement,
  RgAvatarGroupElement,
  RgAvatarErrorDetail,
  RgAvatarLoadDetail,
  RgBadgeElement,
  RgBadgeRemoveDetail,
  RgBreadcrumbElement,
  RgBreadcrumbItemElement,
  RgButtonElement,
  RgButtonGroupElement,
  RgCardElement,
  RgCheckboxElement,
  RgChipElement,
  RgChipGroupElement,
  RgChipRemoveDetail,
  RgChipValueChangeDetail,
  RgComboboxElement,
  RgComboboxOpenChangeDetail,
  RgComboboxValueChangeDetail,
  RgCopyButtonElement,
  RgCopyDetail,
  RgCopyErrorDetail,
  RgDatePickerElement,
  RgDialogElement,
  RgDividerElement,
  RgDrawerElement,
  RgEmptyStateElement,
  RgFieldsetElement,
  RgFormatBytesElement,
  RgFormatDateElement,
  RgFormatNumberElement,
  RgIconButtonElement,
  RgInputElement,
  RgKbdElement,
  RgLinkElement,
  RgMenuElement,
  RgMenuItemElement,
  RgMenuOpenChangeDetail,
  RgMenuSelectDetail,
  RgMeterElement,
  RgNavigateDetail,
  RgOptionElement,
  RgPaginationElement,
  RgPopoverElement,
  RgPopoverOpenChangeDetail,
  RgPressDetail,
  RgProgressElement,
  RgProgressRingElement,
  RgRadioElement,
  RgRadioGroupElement,
  RgRatingElement,
  RgRatingValueChangeDetail,
  RgRelativeTimeElement,
  RgSegmentElement,
  RgSegmentedControlElement,
  RgSegmentedValueChangeDetail,
  RgSelectElement,
  RgSkeletonElement,
  RgSliderElement,
  RgSpinnerElement,
  RgSwitchElement,
  RgStepElement,
  RgStepIndicatorElement,
  RgTabElement,
  RgTabPanelElement,
  RgTabsElement,
  RgTextareaElement,
  RgThemeChangeDetail,
  RgThemeElement,
  RgTimelineElement,
  RgTimelineItemElement,
  RgToastElement,
  RgToastRegionElement,
  RgTooltipElement,
  TabsValueChangeDetail,
  ToastDismissDetail,
  ToastOpenChangeDetail,
  TooltipOpenChangeDetail,
} from '@reglow/elements';

type ElementOwnKey<TElement extends HTMLElement> = Exclude<keyof TElement, keyof HTMLElement>;

type IfEquals<TLeft, TRight, TWhenEqual = TLeft, TWhenDifferent = never> =
  (<TValue>() => TValue extends TLeft ? 1 : 2) extends <TValue>() => TValue extends TRight ? 1 : 2
    ? TWhenEqual
    : TWhenDifferent;

type InternalElementDataKey = 'groupDisabled' | 'grouped';

type ElementDataKey<TElement extends HTMLElement> = {
  [TKey in ElementOwnKey<TElement>]-?: TKey extends InternalElementDataKey
    ? never
    : TElement[TKey] extends (...args: never[]) => unknown
      ? never
      : IfEquals<Pick<TElement, TKey>, Readonly<Pick<TElement, TKey>>, never, TKey>;
}[ElementOwnKey<TElement>];

type ElementDataProps<TElement extends HTMLElement> = Partial<
  Pick<TElement, ElementDataKey<TElement>>
>;

export type ReglowPreactEvent<TElement extends HTMLElement, TDetail> = CustomEvent<TDetail> & {
  readonly currentTarget: TElement;
  readonly target: TElement;
};

export type ReglowPreactEventHandler<TElement extends HTMLElement, TDetail> = (
  event: ReglowPreactEvent<TElement, TDetail>,
) => void;

type CustomEventProp<TName extends `rg-${string}`, TElement extends HTMLElement, TDetail> = {
  [TKey in `on${TName}`]?: ReglowPreactEventHandler<TElement, TDetail>;
};

export type ReglowPreactProps<
  TElement extends HTMLElement,
  TEvents extends object = object,
  TAttributes extends object = object,
> = Omit<
  JSX.HTMLAttributes<TElement>,
  ElementOwnKey<TElement> | keyof TEvents | keyof TAttributes
> &
  ElementDataProps<TElement> &
  TEvents &
  TAttributes;

type StandardAttributes<TKey extends keyof JSX.AllHTMLAttributes> = Pick<
  JSX.AllHTMLAttributes,
  TKey
>;
type StringAttribute = JSX.Signalish<string | undefined>;
type BooleanAttribute = JSX.Signalish<boolean | undefined>;
type NumberAttribute = JSX.Signalish<number | string | undefined>;

type ButtonAttributes = StandardAttributes<'formnovalidate'>;
type LinkAttributes = StandardAttributes<'hreflang' | 'referrerpolicy' | 'type'>;
type InputAttributes = StandardAttributes<'maxlength' | 'minlength' | 'readonly'>;
type TextareaAttributes = StandardAttributes<'maxlength' | 'minlength' | 'readonly'>;
type AvatarAttributes = StandardAttributes<
  'crossorigin' | 'decoding' | 'referrerpolicy' | 'sizes' | 'srcset'
>;
type ReadonlyAttribute = StandardAttributes<'readonly'>;
type AlertAttributes = { 'dismiss-label'?: StringAttribute };
type SpinnerAttributes = { size?: JSX.Signalish<'sm' | 'md' | 'lg' | undefined> };
type SkeletonAttributes = { width?: StringAttribute; height?: StringAttribute };
type ToastRegionAttributes = { label?: StringAttribute; 'pause-on-hover'?: BooleanAttribute };
type ToastAttributes = { 'dismiss-label'?: StringAttribute };
type AccordionItemAttributes = { 'heading-level'?: NumberAttribute };
type DialogAttributes = {
  label?: StringAttribute;
  'hide-close'?: BooleanAttribute;
  'close-label'?: StringAttribute;
};

type ThemeEvents = CustomEventProp<'rg-theme-change', RgThemeElement, RgThemeChangeDetail>;
type ButtonEvents<TElement extends RgButtonElement | RgIconButtonElement> = CustomEventProp<
  'rg-press',
  TElement,
  RgPressDetail
>;
type LinkEvents = CustomEventProp<'rg-navigate', RgLinkElement, RgNavigateDetail>;
type InputEvents = CustomEventProp<'rg-clear', RgInputElement, { previousValue: string }>;
type BadgeEvents = CustomEventProp<'rg-remove', RgBadgeElement, RgBadgeRemoveDetail>;
type AvatarEvents = CustomEventProp<'rg-load', RgAvatarElement, RgAvatarLoadDetail> &
  CustomEventProp<'rg-error', RgAvatarElement, RgAvatarErrorDetail>;
type AlertEvents = CustomEventProp<'rg-dismiss', RgAlertElement, AlertDismissDetail>;
type ToastRegionEvents = CustomEventProp<
  'rg-toast-add',
  RgToastRegionElement,
  { id: string; toast: RgToastElement }
>;
type ToastEvents = CustomEventProp<'rg-open-change', RgToastElement, ToastOpenChangeDetail> &
  CustomEventProp<'rg-dismiss', RgToastElement, ToastDismissDetail>;
type TabsEvents = CustomEventProp<'rg-value-change', RgTabsElement, TabsValueChangeDetail>;
type AccordionEvents = CustomEventProp<
  'rg-value-change',
  RgAccordionElement,
  AccordionValueChangeDetail
>;
type AccordionItemEvents = CustomEventProp<
  'rg-open-change',
  RgAccordionItemElement,
  AccordionItemOpenChangeDetail
>;
type DialogEvents<TElement extends RgDialogElement | RgDrawerElement> = CustomEventProp<
  'rg-before-close',
  TElement,
  DialogBeforeCloseDetail
> &
  CustomEventProp<'rg-open-change', TElement, DialogOpenChangeDetail> &
  CustomEventProp<'rg-close', TElement, DialogCloseDetail>;
type TooltipEvents = CustomEventProp<'rg-open-change', RgTooltipElement, TooltipOpenChangeDetail>;
type ComboboxEvents = CustomEventProp<
  'rg-open-change',
  RgComboboxElement,
  RgComboboxOpenChangeDetail
> &
  CustomEventProp<'rg-value-change', RgComboboxElement, RgComboboxValueChangeDetail>;
type PaginationEvents = CustomEventProp<
  'rg-page-change',
  RgPaginationElement,
  PaginationPageChangeDetail
>;
type PopoverEvents = CustomEventProp<'rg-open-change', RgPopoverElement, RgPopoverOpenChangeDetail>;
type MenuEvents = CustomEventProp<'rg-open-change', RgMenuElement, RgMenuOpenChangeDetail> &
  CustomEventProp<'rg-select', RgMenuElement, RgMenuSelectDetail>;
type CopyButtonEvents = CustomEventProp<'rg-copy', RgCopyButtonElement, RgCopyDetail> &
  CustomEventProp<'rg-error', RgCopyButtonElement, RgCopyErrorDetail>;
type ChipGroupEvents = CustomEventProp<
  'rg-value-change',
  RgChipGroupElement,
  RgChipValueChangeDetail
>;
type ChipEvents = CustomEventProp<'rg-remove', RgChipElement, RgChipRemoveDetail>;
type SegmentedControlEvents = CustomEventProp<
  'rg-value-change',
  RgSegmentedControlElement,
  RgSegmentedValueChangeDetail
>;
type RatingEvents = CustomEventProp<'rg-value-change', RgRatingElement, RgRatingValueChangeDetail>;

export interface ReglowPreactIntrinsicElements {
  'rg-theme': ReglowPreactProps<RgThemeElement, ThemeEvents>;
  'rg-button': ReglowPreactProps<RgButtonElement, ButtonEvents<RgButtonElement>, ButtonAttributes>;
  'rg-icon-button': ReglowPreactProps<
    RgIconButtonElement,
    ButtonEvents<RgIconButtonElement>,
    ButtonAttributes
  >;
  'rg-button-group': ReglowPreactProps<RgButtonGroupElement>;
  'rg-copy-button': ReglowPreactProps<RgCopyButtonElement, CopyButtonEvents>;
  'rg-link': ReglowPreactProps<RgLinkElement, LinkEvents, LinkAttributes>;
  'rg-input': ReglowPreactProps<RgInputElement, InputEvents, InputAttributes>;
  'rg-textarea': ReglowPreactProps<RgTextareaElement, object, TextareaAttributes>;
  'rg-select': ReglowPreactProps<RgSelectElement>;
  'rg-option': ReglowPreactProps<RgOptionElement>;
  'rg-combobox': ReglowPreactProps<RgComboboxElement, ComboboxEvents, ReadonlyAttribute>;
  'rg-date-picker': ReglowPreactProps<RgDatePickerElement, object, ReadonlyAttribute>;
  'rg-checkbox': ReglowPreactProps<RgCheckboxElement>;
  'rg-switch': ReglowPreactProps<RgSwitchElement>;
  'rg-radio-group': ReglowPreactProps<RgRadioGroupElement>;
  'rg-radio': ReglowPreactProps<RgRadioElement>;
  'rg-slider': ReglowPreactProps<RgSliderElement>;
  'rg-rating': ReglowPreactProps<RgRatingElement, RatingEvents, ReadonlyAttribute>;
  'rg-chip-group': ReglowPreactProps<RgChipGroupElement, ChipGroupEvents>;
  'rg-chip': ReglowPreactProps<RgChipElement, ChipEvents>;
  'rg-segmented-control': ReglowPreactProps<RgSegmentedControlElement, SegmentedControlEvents>;
  'rg-segment': ReglowPreactProps<RgSegmentElement>;
  'rg-badge': ReglowPreactProps<RgBadgeElement, BadgeEvents>;
  'rg-avatar': ReglowPreactProps<RgAvatarElement, AvatarEvents, AvatarAttributes>;
  'rg-avatar-group': ReglowPreactProps<RgAvatarGroupElement>;
  'rg-card': ReglowPreactProps<RgCardElement>;
  'rg-divider': ReglowPreactProps<RgDividerElement>;
  'rg-kbd': ReglowPreactProps<RgKbdElement>;
  'rg-relative-time': ReglowPreactProps<RgRelativeTimeElement>;
  'rg-format-date': ReglowPreactProps<RgFormatDateElement>;
  'rg-format-number': ReglowPreactProps<RgFormatNumberElement>;
  'rg-format-bytes': ReglowPreactProps<RgFormatBytesElement>;
  'rg-fieldset': ReglowPreactProps<RgFieldsetElement>;
  'rg-empty-state': ReglowPreactProps<RgEmptyStateElement>;
  'rg-alert': ReglowPreactProps<RgAlertElement, AlertEvents, AlertAttributes>;
  'rg-progress': ReglowPreactProps<RgProgressElement>;
  'rg-meter': ReglowPreactProps<RgMeterElement>;
  'rg-progress-ring': ReglowPreactProps<RgProgressRingElement>;
  'rg-spinner': ReglowPreactProps<RgSpinnerElement, object, SpinnerAttributes>;
  'rg-skeleton': ReglowPreactProps<RgSkeletonElement, object, SkeletonAttributes>;
  'rg-toast-region': ReglowPreactProps<
    RgToastRegionElement,
    ToastRegionEvents,
    ToastRegionAttributes
  >;
  'rg-toast': ReglowPreactProps<RgToastElement, ToastEvents, ToastAttributes>;
  'rg-tabs': ReglowPreactProps<RgTabsElement, TabsEvents>;
  'rg-tab': ReglowPreactProps<RgTabElement>;
  'rg-tab-panel': ReglowPreactProps<RgTabPanelElement>;
  'rg-accordion': ReglowPreactProps<RgAccordionElement, AccordionEvents>;
  'rg-accordion-item': ReglowPreactProps<
    RgAccordionItemElement,
    AccordionItemEvents,
    AccordionItemAttributes
  >;
  'rg-breadcrumb': ReglowPreactProps<RgBreadcrumbElement>;
  'rg-breadcrumb-item': ReglowPreactProps<RgBreadcrumbItemElement>;
  'rg-pagination': ReglowPreactProps<RgPaginationElement, PaginationEvents>;
  'rg-step-indicator': ReglowPreactProps<RgStepIndicatorElement>;
  'rg-step': ReglowPreactProps<RgStepElement>;
  'rg-timeline': ReglowPreactProps<RgTimelineElement>;
  'rg-timeline-item': ReglowPreactProps<RgTimelineItemElement>;
  'rg-dialog': ReglowPreactProps<RgDialogElement, DialogEvents<RgDialogElement>, DialogAttributes>;
  'rg-drawer': ReglowPreactProps<RgDrawerElement, DialogEvents<RgDrawerElement>, DialogAttributes>;
  'rg-tooltip': ReglowPreactProps<RgTooltipElement, TooltipEvents>;
  'rg-popover': ReglowPreactProps<RgPopoverElement, PopoverEvents>;
  'rg-menu': ReglowPreactProps<RgMenuElement, MenuEvents>;
  'rg-menu-item': ReglowPreactProps<RgMenuItemElement>;
}

declare module 'preact' {
  namespace JSX {
    interface IntrinsicElements extends ReglowPreactIntrinsicElements {}
  }
}
