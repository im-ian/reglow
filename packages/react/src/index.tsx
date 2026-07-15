import '@reglow/elements/register';
import type {
  AccordionItemOpenChangeDetail,
  AccordionValueChangeDetail,
  AlertDismissDetail,
  AlertTone,
  AlertVariant,
  DialogBeforeCloseDetail,
  DialogCloseDetail,
  DialogDismissAction,
  DialogOpenChangeDetail,
  DialogSize,
  DrawerPlacement,
  PaginationPageChangeDetail,
  RgAccordionElement,
  RgAccordionItemElement,
  RgAlertElement,
  RgAvatarErrorDetail,
  RgAvatarElement,
  RgAvatarLoadDetail,
  RgAvatarLoading,
  RgAvatarShape,
  RgAvatarSize,
  RgAvatarStatus,
  RgBadgeRemoveDetail,
  RgBadgeElement,
  RgBadgeSize,
  RgBadgeTone,
  RgBadgeVariant,
  RgBreadcrumbElement,
  RgBreadcrumbItemElement,
  RgButtonElement,
  RgButtonGroupElement,
  RgButtonGroupOrientation,
  RgButtonSize,
  RgButtonTone,
  RgButtonType,
  RgButtonVariant,
  RgCardElement,
  RgCardPadding,
  RgCardRadius,
  RgCardVariant,
  RgCheckboxElement,
  RgChipElement,
  RgChipGroupElement,
  RgChipRemoveDetail,
  RgChipSelection,
  RgChipSize,
  RgChipValueChangeDetail,
  RgComboboxElement,
  RgComboboxFilter,
  RgComboboxOpenChangeDetail,
  RgComboboxSize,
  RgComboboxValueChangeDetail,
  RgCopyButtonElement,
  RgCopyDetail,
  RgCopyErrorDetail,
  RgDatePickerElement,
  RgDatePickerSize,
  RgDialogElement,
  RgDividerElement,
  RgDividerOrientation,
  RgDividerSpacing,
  RgDividerVariant,
  RgDrawerElement,
  RgEmptyStateElement,
  RgEmptyStateSize,
  RgEmptyStateTone,
  RgFieldsetElement,
  RgIconButtonElement,
  RgInputElement,
  RgInputSize,
  RgInputType,
  RgLinkElement,
  RgLinkSize,
  RgLinkTone,
  RgLinkVariant,
  RgKbdElement,
  RgMenuElement,
  RgMenuItemElement,
  RgMenuOpenChangeDetail,
  RgMenuSelectDetail,
  RgNavigateDetail,
  RgOptionElement,
  RgPaginationElement,
  RgPopoverElement,
  RgPopoverOpenChangeDetail,
  RgPopoverPlacement,
  RgPopoverTrigger,
  RgPressDetail,
  RgProgressElement,
  RgProgressRingElement,
  RgProgressRingSize,
  RgRadioElement,
  RgRadioGroupElement,
  RgRadioOrientation,
  RgRatingElement,
  RgRatingSize,
  RgRatingValueChangeDetail,
  RgRelativeTimeElement,
  RgRelativeTimeFormat,
  RgRelativeTimeNumeric,
  RgSegmentElement,
  RgSegmentedControlElement,
  RgSegmentedControlOrientation,
  RgSegmentedControlSize,
  RgSegmentedValueChangeDetail,
  RgSelectElement,
  RgSelectOption,
  RgSkeletonElement,
  RgSliderElement,
  RgSliderOrientation,
  RgSliderSize,
  RgSpinnerElement,
  RgSwitchElement,
  RgTabElement,
  RgTabPanelElement,
  RgTabsElement,
  RgTextareaElement,
  RgTextareaResize,
  RgTextareaSize,
  RgThemeChangeDetail,
  RgThemeDensity,
  RgThemeElement,
  RgThemeMode,
  RgThemeMotion,
  RgToastElement,
  RgToastRegionElement,
  RgTooltipElement,
  TabsActivation,
  TabsOrientation,
  TabsValueChangeDetail,
  ToastDismissDetail,
  ToastOpenChangeDetail,
  ToastPosition,
  ToastTone,
  TooltipOpenChangeDetail,
  TooltipPlacement,
} from '@reglow/elements';
import type { HTMLAttributes, ReactNode } from 'react';
import { createReglowComponent } from './factory.js';

export type Size = RgButtonSize;
export type Tone = RgButtonTone;
export type Variant = RgButtonVariant;

export type ReglowHostEvent<TElement extends HTMLElement> = Event & {
  currentTarget: TElement;
  target: TElement;
};

export type ReglowElementEvent<TElement extends HTMLElement, TDetail> = CustomEvent<TDetail> &
  ReglowHostEvent<TElement>;

export interface ReglowHostProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'color' | 'onChange' | 'onInput' | 'title'
> {
  children?: ReactNode;
  className?: string;
}

export interface ThemeProps extends ReglowHostProps {
  mode?: RgThemeMode;
  density?: RgThemeDensity;
  motion?: RgThemeMotion;
  onThemeChange?: (event: ReglowElementEvent<RgThemeElement, RgThemeChangeDetail>) => void;
}

export interface ButtonProps extends ReglowHostProps {
  variant?: RgButtonVariant;
  tone?: RgButtonTone;
  size?: RgButtonSize;
  type?: RgButtonType;
  name?: string;
  value?: string;
  label?: string;
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  formNoValidate?: boolean;
  pressed?: boolean | null;
  start?: ReactNode;
  end?: ReactNode;
  onPress?: (event: ReglowElementEvent<RgButtonElement, RgPressDetail>) => void;
}

export interface IconButtonProps extends Omit<ButtonProps, 'start' | 'end' | 'onPress'> {
  label: string;
  onPress?: (event: ReglowElementEvent<RgIconButtonElement, RgPressDetail>) => void;
}

export interface LinkProps extends ReglowHostProps {
  href?: string;
  target?: string;
  rel?: string;
  hrefLang?: string;
  referrerPolicy?: string;
  type?: string;
  title?: string;
  download?: string | boolean;
  disabled?: boolean;
  external?: boolean;
  variant?: RgLinkVariant;
  tone?: RgLinkTone;
  size?: RgLinkSize;
  start?: ReactNode;
  end?: ReactNode;
  onNavigate?: (event: ReglowElementEvent<RgLinkElement, RgNavigateDetail>) => void;
}

interface FieldProps<TElement extends HTMLElement> extends ReglowHostProps {
  name?: string;
  value?: string | number;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  size?: RgInputSize;
  onValueChange?: (event: ReglowHostEvent<TElement>) => void;
  onValueCommit?: (event: ReglowHostEvent<TElement>) => void;
}

export interface InputProps extends FieldProps<RgInputElement> {
  type?: RgInputType;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLElement>['inputMode'];
  min?: string | number;
  max?: string | number;
  step?: string | number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  clearable?: boolean;
  start?: ReactNode;
  end?: ReactNode;
  onClear?: (event: ReglowElementEvent<RgInputElement, { readonly previousValue: string }>) => void;
}

export interface TextareaProps extends Omit<FieldProps<RgTextareaElement>, 'size'> {
  size?: RgTextareaSize;
  rows?: number;
  cols?: number;
  minLength?: number;
  maxLength?: number;
  resize?: RgTextareaResize;
  autoGrow?: boolean;
}

export type SelectOption = RgSelectOption;

export interface SelectProps extends FieldProps<RgSelectElement> {
  options?: readonly SelectOption[];
}

export interface OptionProps extends ReglowHostProps {
  value: string;
  label?: string;
  disabled?: boolean;
  selected?: boolean;
}

export interface CheckableProps<TElement extends HTMLElement = HTMLElement> extends Omit<
  FieldProps<TElement>,
  'value' | 'size' | 'readOnly'
> {
  value?: string;
  checked?: boolean;
}

export interface CheckboxProps extends CheckableProps<RgCheckboxElement> {
  indeterminate?: boolean;
}

export type SwitchProps = CheckableProps<RgSwitchElement>;

export interface RadioGroupProps extends Omit<
  FieldProps<RgRadioGroupElement>,
  'size' | 'readOnly'
> {
  orientation?: RgRadioOrientation;
}

export interface RadioProps extends ReglowHostProps {
  value: string;
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  description?: ReactNode;
}

export interface SliderProps extends Omit<
  FieldProps<RgSliderElement>,
  'value' | 'size' | 'readOnly'
> {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  orientation?: RgSliderOrientation;
  size?: RgSliderSize;
  showValue?: boolean;
}

export interface BadgeProps extends ReglowHostProps {
  tone?: RgBadgeTone;
  variant?: RgBadgeVariant;
  size?: RgBadgeSize;
  dot?: boolean;
  removable?: boolean;
  removeLabel?: string;
  start?: ReactNode;
  end?: ReactNode;
  onRemove?: (event: ReglowElementEvent<RgBadgeElement, RgBadgeRemoveDetail>) => void;
}

export interface AvatarProps extends Omit<ReglowHostProps, 'onLoad' | 'onError'> {
  src?: string;
  alt?: string;
  name?: string;
  initials?: string;
  size?: RgAvatarSize;
  shape?: RgAvatarShape;
  status?: RgAvatarStatus;
  statusLabel?: string;
  loading?: RgAvatarLoading;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  decoding?: 'async' | 'auto' | 'sync';
  referrerPolicy?: string;
  sizes?: string;
  srcSet?: string;
  fallback?: ReactNode;
  statusContent?: ReactNode;
  onLoad?: (event: ReglowElementEvent<RgAvatarElement, RgAvatarLoadDetail>) => void;
  onError?: (event: ReglowElementEvent<RgAvatarElement, RgAvatarErrorDetail>) => void;
}

export interface CardProps extends ReglowHostProps {
  variant?: RgCardVariant;
  padding?: RgCardPadding;
  radius?: RgCardRadius;
  lift?: boolean;
  media?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export interface DividerProps extends ReglowHostProps {
  orientation?: RgDividerOrientation;
  variant?: RgDividerVariant;
  spacing?: RgDividerSpacing;
  decorative?: boolean;
  inset?: boolean;
}

export interface AlertProps extends ReglowHostProps {
  tone?: AlertTone;
  variant?: AlertVariant;
  dismissible?: boolean;
  dismissLabel?: string;
  icon?: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  onDismiss?: (event: ReglowElementEvent<RgAlertElement, AlertDismissDetail>) => void;
}

export interface ProgressProps extends ReglowHostProps {
  value?: number;
  max?: number;
  label?: ReactNode;
}

export interface SpinnerProps extends ReglowHostProps {
  size?: Size;
  label?: string;
}

export interface SkeletonProps extends ReglowHostProps {
  shape?: 'text' | 'rect' | 'circle';
  width?: string;
  height?: string;
  animated?: boolean;
}

export interface ToastRegionProps extends ReglowHostProps {
  position?: ToastPosition;
  maxVisible?: number;
  label?: string;
  pauseOnHover?: boolean;
  onToastAdd?: (
    event: ReglowElementEvent<
      RgToastRegionElement,
      { readonly id: string; readonly toast: RgToastElement }
    >,
  ) => void;
}

export interface ToastProps extends ReglowHostProps {
  open?: boolean;
  duration?: number;
  tone?: ToastTone;
  dismissible?: boolean;
  dismissLabel?: string;
  icon?: ReactNode;
  title?: ReactNode;
  action?: ReactNode;
  onOpenChange?: (event: ReglowElementEvent<RgToastElement, ToastOpenChangeDetail>) => void;
  onDismiss?: (event: ReglowElementEvent<RgToastElement, ToastDismissDetail>) => void;
}

export interface TabsProps extends ReglowHostProps {
  value?: string;
  orientation?: TabsOrientation;
  activation?: TabsActivation;
  loop?: boolean;
  onValueChange?: (event: ReglowElementEvent<RgTabsElement, TabsValueChangeDetail>) => void;
}

export interface TabProps extends ReglowHostProps {
  value: string;
  disabled?: boolean;
}

export interface TabPanelProps extends ReglowHostProps {
  value: string;
}

export interface AccordionProps extends ReglowHostProps {
  multiple?: boolean;
  collapsible?: boolean;
  value?: string | string[];
  onValueChange?: (
    event: ReglowElementEvent<RgAccordionElement, AccordionValueChangeDetail>,
  ) => void;
}

export interface AccordionItemProps extends ReglowHostProps {
  value: string;
  open?: boolean;
  disabled?: boolean;
  headingLevel?: number;
  heading?: ReactNode;
  onOpenChange?: (
    event: ReglowElementEvent<RgAccordionItemElement, AccordionItemOpenChangeDetail>,
  ) => void;
}

export interface DialogProps<
  TElement extends RgDialogElement = RgDialogElement,
> extends ReglowHostProps {
  open?: boolean;
  size?: DialogSize;
  label?: string;
  escapeKeyAction?: DialogDismissAction;
  backdropAction?: DialogDismissAction;
  hideClose?: boolean;
  closeLabel?: string;
  initialFocus?: HTMLElement | null;
  trigger?: ReactNode;
  title?: ReactNode;
  footer?: ReactNode;
  close?: ReactNode;
  onBeforeClose?: (event: ReglowElementEvent<TElement, DialogBeforeCloseDetail>) => void;
  onOpenChange?: (event: ReglowElementEvent<TElement, DialogOpenChangeDetail>) => void;
  onClose?: (event: ReglowElementEvent<TElement, DialogCloseDetail>) => void;
}

export interface DrawerProps extends DialogProps<RgDrawerElement> {
  placement?: DrawerPlacement;
}

export interface TooltipProps extends ReglowHostProps {
  content: string;
  open?: boolean;
  placement?: TooltipPlacement;
  delay?: number;
  disabled?: boolean;
  trigger?: ReactNode;
  richContent?: ReactNode;
  onOpenChange?: (event: ReglowElementEvent<RgTooltipElement, TooltipOpenChangeDetail>) => void;
}

export interface ButtonGroupProps extends ReglowHostProps {
  label?: string;
  orientation?: RgButtonGroupOrientation;
  attached?: boolean;
}

export interface ComboboxProps extends Omit<FieldProps<RgComboboxElement>, 'size'> {
  size?: RgComboboxSize;
  filter?: RgComboboxFilter;
  noResultsText?: string;
  open?: boolean;
  options?: readonly SelectOption[];
  onOpenChange?: (event: ReglowElementEvent<RgComboboxElement, RgComboboxOpenChangeDetail>) => void;
  onSelectionChange?: (
    event: ReglowElementEvent<RgComboboxElement, RgComboboxValueChangeDetail>,
  ) => void;
}

export interface DatePickerProps extends Omit<
  FieldProps<RgDatePickerElement>,
  'placeholder' | 'size'
> {
  size?: RgDatePickerSize;
  min?: string;
  max?: string;
  step?: number;
}

export interface KbdProps extends ReglowHostProps {
  keys?: string;
  label?: string;
  separator?: string;
}

export interface FieldsetProps extends ReglowHostProps {
  legend?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  invalid?: boolean;
}

export interface EmptyStateProps extends ReglowHostProps {
  title?: ReactNode;
  description?: string;
  size?: RgEmptyStateSize;
  tone?: RgEmptyStateTone;
  icon?: ReactNode;
  actions?: ReactNode;
}

export interface BreadcrumbProps extends ReglowHostProps {
  label?: string;
}

export interface BreadcrumbItemProps extends ReglowHostProps {
  href?: string;
  target?: string;
  rel?: string;
  current?: boolean;
}

export interface PaginationProps extends ReglowHostProps {
  page?: number;
  pageCount?: number;
  siblingCount?: number;
  boundaryCount?: number;
  disabled?: boolean;
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
  onPageChange?: (
    event: ReglowElementEvent<RgPaginationElement, PaginationPageChangeDetail>,
  ) => void;
}

export interface PopoverProps extends ReglowHostProps {
  open?: boolean;
  placement?: RgPopoverPlacement;
  triggerMode?: RgPopoverTrigger;
  disabled?: boolean;
  label?: string;
  matchTriggerWidth?: boolean;
  trigger?: ReactNode;
  onOpenChange?: (event: ReglowElementEvent<RgPopoverElement, RgPopoverOpenChangeDetail>) => void;
}

export interface MenuProps extends Omit<ReglowHostProps, 'onSelect'> {
  open?: boolean;
  placement?: RgPopoverPlacement;
  disabled?: boolean;
  label?: string;
  trigger?: ReactNode;
  onOpenChange?: (event: ReglowElementEvent<RgMenuElement, RgMenuOpenChangeDetail>) => void;
  onSelect?: (event: ReglowElementEvent<RgMenuElement, RgMenuSelectDetail>) => void;
}

export interface MenuItemProps extends ReglowHostProps {
  value: string;
  disabled?: boolean;
  start?: ReactNode;
  end?: ReactNode;
}

export interface CopyButtonProps extends Omit<ReglowHostProps, 'onCopy' | 'onError'> {
  value?: string;
  from?: string;
  disabled?: boolean;
  copyLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  feedbackDuration?: number;
  copyIcon?: ReactNode;
  successIcon?: ReactNode;
  errorIcon?: ReactNode;
  onCopy?: (event: ReglowElementEvent<RgCopyButtonElement, RgCopyDetail>) => void;
  onError?: (event: ReglowElementEvent<RgCopyButtonElement, RgCopyErrorDetail>) => void;
}

export interface ChipGroupProps extends ReglowHostProps {
  value?: string | string[];
  selection?: RgChipSelection;
  label?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  onValueChange?: (event: ReglowHostEvent<RgChipGroupElement>) => void;
  onValueCommit?: (event: ReglowHostEvent<RgChipGroupElement>) => void;
  onSelectionChange?: (
    event: ReglowElementEvent<RgChipGroupElement, RgChipValueChangeDetail>,
  ) => void;
}

export interface ChipProps extends ReglowHostProps {
  value: string;
  selected?: boolean;
  disabled?: boolean;
  removable?: boolean;
  removeLabel?: string;
  size?: RgChipSize;
  start?: ReactNode;
  end?: ReactNode;
  onRemove?: (event: ReglowElementEvent<RgChipElement, RgChipRemoveDetail>) => void;
}

export interface SegmentedControlProps extends ReglowHostProps {
  value?: string;
  label?: string;
  name?: string;
  orientation?: RgSegmentedControlOrientation;
  size?: RgSegmentedControlSize;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onValueChange?: (event: ReglowHostEvent<RgSegmentedControlElement>) => void;
  onValueCommit?: (event: ReglowHostEvent<RgSegmentedControlElement>) => void;
  onSelectionChange?: (
    event: ReglowElementEvent<RgSegmentedControlElement, RgSegmentedValueChangeDetail>,
  ) => void;
}

export interface SegmentProps extends ReglowHostProps {
  value: string;
  selected?: boolean;
  disabled?: boolean;
}

export interface ProgressRingProps extends ReglowHostProps {
  value?: number | null;
  max?: number;
  label?: string;
  size?: RgProgressRingSize;
  showValue?: boolean;
}

export interface RatingProps extends ReglowHostProps {
  value?: number;
  max?: number;
  name?: string;
  label?: string;
  description?: string;
  error?: string;
  size?: RgRatingSize;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  onValueChange?: (event: ReglowHostEvent<RgRatingElement>) => void;
  onValueCommit?: (event: ReglowHostEvent<RgRatingElement>) => void;
  onRatingChange?: (event: ReglowElementEvent<RgRatingElement, RgRatingValueChangeDetail>) => void;
}

export interface RelativeTimeProps extends ReglowHostProps {
  date: string | Date;
  locale?: string;
  format?: RgRelativeTimeFormat;
  numeric?: RgRelativeTimeNumeric;
  sync?: boolean;
}

const fieldSlots = { label: 'label', description: 'description', error: 'error' } as const;
const valueEvents = { onValueChange: 'input', onValueCommit: 'change' } as const;

export const Theme = createReglowComponent<RgThemeElement, ThemeProps>('rg-theme', {
  displayName: 'Theme',
  events: { onThemeChange: 'rg-theme-change' },
});
export const Button = createReglowComponent<RgButtonElement, ButtonProps>('rg-button', {
  displayName: 'Button',
  events: { onPress: 'rg-press' },
  attributes: { fullWidth: 'full-width', formNoValidate: 'formnovalidate' },
  properties: ['pressed'],
  propertyDefaults: { pressed: null },
  slots: { start: 'start', end: 'end' },
});
export const IconButton = createReglowComponent<RgIconButtonElement, IconButtonProps>(
  'rg-icon-button',
  {
    displayName: 'IconButton',
    events: { onPress: 'rg-press' },
    attributes: { fullWidth: 'full-width', formNoValidate: 'formnovalidate' },
    properties: ['pressed'],
    propertyDefaults: { pressed: null },
  },
);
export const Link = createReglowComponent<RgLinkElement, LinkProps>('rg-link', {
  displayName: 'Link',
  events: { onNavigate: 'rg-navigate' },
  attributes: { hrefLang: 'hreflang', referrerPolicy: 'referrerpolicy' },
  slots: { start: 'start', end: 'end' },
});
export const Input = createReglowComponent<RgInputElement, InputProps>('rg-input', {
  displayName: 'Input',
  events: { ...valueEvents, onClear: 'rg-clear' },
  attributes: {
    autoComplete: 'autocomplete',
    inputMode: 'inputmode',
    minLength: 'minlength',
    maxLength: 'maxlength',
    readOnly: 'readonly',
  },
  slots: { ...fieldSlots, start: 'start', end: 'end' },
});
export const Textarea = createReglowComponent<RgTextareaElement, TextareaProps>('rg-textarea', {
  displayName: 'Textarea',
  events: valueEvents,
  attributes: {
    autoGrow: 'auto-grow',
    minLength: 'minlength',
    maxLength: 'maxlength',
    readOnly: 'readonly',
  },
  slots: fieldSlots,
});
export const Select = createReglowComponent<RgSelectElement, SelectProps>('rg-select', {
  displayName: 'Select',
  events: valueEvents,
  properties: ['options'],
  propertyDefaults: { options: null },
  slots: fieldSlots,
});
export const Option = createReglowComponent<RgOptionElement, OptionProps>('rg-option', {
  displayName: 'Option',
});
export const Checkbox = createReglowComponent<RgCheckboxElement, CheckboxProps>('rg-checkbox', {
  displayName: 'Checkbox',
  events: valueEvents,
  properties: ['indeterminate'],
  slots: fieldSlots,
  propertyDefaults: { indeterminate: false },
});
export const Switch = createReglowComponent<RgSwitchElement, SwitchProps>('rg-switch', {
  displayName: 'Switch',
  events: valueEvents,
  slots: fieldSlots,
});
export const RadioGroup = createReglowComponent<RgRadioGroupElement, RadioGroupProps>(
  'rg-radio-group',
  {
    displayName: 'RadioGroup',
    events: valueEvents,
    slots: fieldSlots,
  },
);
export const Radio = createReglowComponent<RgRadioElement, RadioProps>('rg-radio', {
  displayName: 'Radio',
  slots: { description: 'description' },
});
export const Slider = createReglowComponent<RgSliderElement, SliderProps>('rg-slider', {
  displayName: 'Slider',
  events: valueEvents,
  attributes: { showValue: 'show-value' },
  slots: fieldSlots,
});
export const Badge = createReglowComponent<RgBadgeElement, BadgeProps>('rg-badge', {
  displayName: 'Badge',
  events: { onRemove: 'rg-remove' },
  slots: { start: 'start', end: 'end' },
});
export const Avatar = createReglowComponent<RgAvatarElement, AvatarProps>('rg-avatar', {
  displayName: 'Avatar',
  events: { onLoad: 'rg-load', onError: 'rg-error' },
  attributes: {
    crossOrigin: 'crossorigin',
    referrerPolicy: 'referrerpolicy',
    srcSet: 'srcset',
    statusLabel: 'status-label',
  },
  slots: { fallback: 'fallback', statusContent: 'status' },
});
export const Card = createReglowComponent<RgCardElement, CardProps>('rg-card', {
  displayName: 'Card',
  slots: { media: 'media', header: 'header', footer: 'footer' },
});
export const Divider = createReglowComponent<RgDividerElement, DividerProps>('rg-divider', {
  displayName: 'Divider',
});
export const Alert = createReglowComponent<RgAlertElement, AlertProps>('rg-alert', {
  displayName: 'Alert',
  events: { onDismiss: 'rg-dismiss' },
  attributes: { dismissLabel: 'dismiss-label' },
  slots: { icon: 'icon', title: 'title', actions: 'actions' },
});
export const Progress = createReglowComponent<RgProgressElement, ProgressProps>('rg-progress', {
  displayName: 'Progress',
  slots: { label: 'label' },
});
export const Spinner = createReglowComponent<RgSpinnerElement, SpinnerProps>('rg-spinner', {
  displayName: 'Spinner',
});
export const Skeleton = createReglowComponent<RgSkeletonElement, SkeletonProps>('rg-skeleton', {
  displayName: 'Skeleton',
});
export const ToastRegion = createReglowComponent<RgToastRegionElement, ToastRegionProps>(
  'rg-toast-region',
  {
    displayName: 'ToastRegion',
    events: { onToastAdd: 'rg-toast-add' },
    attributes: { maxVisible: 'max-visible', pauseOnHover: 'pause-on-hover' },
  },
);
export const Toast = createReglowComponent<RgToastElement, ToastProps>('rg-toast', {
  displayName: 'Toast',
  events: { onOpenChange: 'rg-open-change', onDismiss: 'rg-dismiss' },
  attributes: { dismissLabel: 'dismiss-label' },
  slots: { icon: 'icon', title: 'title', action: 'action' },
});
export const Tabs = createReglowComponent<RgTabsElement, TabsProps>('rg-tabs', {
  displayName: 'Tabs',
  events: { onValueChange: 'rg-value-change' },
});
export const Tab = createReglowComponent<RgTabElement, TabProps>('rg-tab', { displayName: 'Tab' });
export const TabPanel = createReglowComponent<RgTabPanelElement, TabPanelProps>('rg-tab-panel', {
  displayName: 'TabPanel',
});
export const Accordion = createReglowComponent<RgAccordionElement, AccordionProps>('rg-accordion', {
  displayName: 'Accordion',
  events: { onValueChange: 'rg-value-change' },
  properties: ['value'],
  propertyDefaults: { value: '' },
});
export const AccordionItem = createReglowComponent<RgAccordionItemElement, AccordionItemProps>(
  'rg-accordion-item',
  {
    displayName: 'AccordionItem',
    events: { onOpenChange: 'rg-open-change' },
    attributes: { headingLevel: 'heading-level' },
    slots: { heading: 'heading' },
  },
);
export const Dialog = createReglowComponent<RgDialogElement, DialogProps>('rg-dialog', {
  displayName: 'Dialog',
  events: { onBeforeClose: 'rg-before-close', onOpenChange: 'rg-open-change', onClose: 'rg-close' },
  attributes: {
    escapeKeyAction: 'escape-key-action',
    backdropAction: 'backdrop-action',
    hideClose: 'hide-close',
    closeLabel: 'close-label',
  },
  properties: ['initialFocus'],
  propertyDefaults: { initialFocus: null },
  slots: { trigger: 'trigger', title: 'title', footer: 'footer', close: 'close' },
});
export const Drawer = createReglowComponent<RgDrawerElement, DrawerProps>('rg-drawer', {
  displayName: 'Drawer',
  events: { onBeforeClose: 'rg-before-close', onOpenChange: 'rg-open-change', onClose: 'rg-close' },
  attributes: {
    escapeKeyAction: 'escape-key-action',
    backdropAction: 'backdrop-action',
    hideClose: 'hide-close',
    closeLabel: 'close-label',
  },
  properties: ['initialFocus'],
  propertyDefaults: { initialFocus: null },
  slots: { trigger: 'trigger', title: 'title', footer: 'footer', close: 'close' },
});
export const Tooltip = createReglowComponent<RgTooltipElement, TooltipProps>('rg-tooltip', {
  displayName: 'Tooltip',
  events: { onOpenChange: 'rg-open-change' },
  slots: { trigger: 'trigger', richContent: 'content' },
});
export const ButtonGroup = createReglowComponent<RgButtonGroupElement, ButtonGroupProps>(
  'rg-button-group',
  { displayName: 'ButtonGroup' },
);
export const Combobox = createReglowComponent<RgComboboxElement, ComboboxProps>('rg-combobox', {
  displayName: 'Combobox',
  events: {
    ...valueEvents,
    onOpenChange: 'rg-open-change',
    onSelectionChange: 'rg-value-change',
  },
  attributes: { noResultsText: 'no-results-text', readOnly: 'readonly' },
  properties: ['options'],
  propertyDefaults: { options: null },
  slots: fieldSlots,
});
export const DatePicker = createReglowComponent<RgDatePickerElement, DatePickerProps>(
  'rg-date-picker',
  {
    displayName: 'DatePicker',
    events: valueEvents,
    attributes: { readOnly: 'readonly' },
    slots: fieldSlots,
  },
);
export const Kbd = createReglowComponent<RgKbdElement, KbdProps>('rg-kbd', {
  displayName: 'Kbd',
});
export const Fieldset = createReglowComponent<RgFieldsetElement, FieldsetProps>('rg-fieldset', {
  displayName: 'Fieldset',
  slots: { legend: 'legend', description: 'description', error: 'error' },
});
export const EmptyState = createReglowComponent<RgEmptyStateElement, EmptyStateProps>(
  'rg-empty-state',
  {
    displayName: 'EmptyState',
    slots: { icon: 'icon', title: 'title', actions: 'actions' },
  },
);
export const Breadcrumb = createReglowComponent<RgBreadcrumbElement, BreadcrumbProps>(
  'rg-breadcrumb',
  { displayName: 'Breadcrumb' },
);
export const BreadcrumbItem = createReglowComponent<RgBreadcrumbItemElement, BreadcrumbItemProps>(
  'rg-breadcrumb-item',
  { displayName: 'BreadcrumbItem' },
);
export const Pagination = createReglowComponent<RgPaginationElement, PaginationProps>(
  'rg-pagination',
  {
    displayName: 'Pagination',
    events: { onPageChange: 'rg-page-change' },
    attributes: {
      pageCount: 'page-count',
      siblingCount: 'sibling-count',
      boundaryCount: 'boundary-count',
      previousLabel: 'previous-label',
      nextLabel: 'next-label',
    },
  },
);
export const Popover = createReglowComponent<RgPopoverElement, PopoverProps>('rg-popover', {
  displayName: 'Popover',
  events: { onOpenChange: 'rg-open-change' },
  attributes: { triggerMode: 'trigger', matchTriggerWidth: 'match-trigger-width' },
  slots: { trigger: 'trigger' },
});
export const Menu = createReglowComponent<RgMenuElement, MenuProps>('rg-menu', {
  displayName: 'Menu',
  events: { onOpenChange: 'rg-open-change', onSelect: 'rg-select' },
  slots: { trigger: 'trigger' },
});
export const MenuItem = createReglowComponent<RgMenuItemElement, MenuItemProps>('rg-menu-item', {
  displayName: 'MenuItem',
  slots: { start: 'start', end: 'end' },
});
export const CopyButton = createReglowComponent<RgCopyButtonElement, CopyButtonProps>(
  'rg-copy-button',
  {
    displayName: 'CopyButton',
    events: { onCopy: 'rg-copy', onError: 'rg-error' },
    attributes: {
      copyLabel: 'copy-label',
      successLabel: 'success-label',
      errorLabel: 'error-label',
      feedbackDuration: 'feedback-duration',
    },
    slots: { copyIcon: 'copy-icon', successIcon: 'success-icon', errorIcon: 'error-icon' },
  },
);
export const ChipGroup = createReglowComponent<RgChipGroupElement, ChipGroupProps>(
  'rg-chip-group',
  {
    displayName: 'ChipGroup',
    events: {
      ...valueEvents,
      onSelectionChange: 'rg-value-change',
    },
    properties: ['value'],
    propertyDefaults: { value: '' },
  },
);
export const Chip = createReglowComponent<RgChipElement, ChipProps>('rg-chip', {
  displayName: 'Chip',
  events: { onRemove: 'rg-remove' },
  attributes: { removeLabel: 'remove-label' },
  slots: { start: 'start', end: 'end' },
});
export const SegmentedControl = createReglowComponent<
  RgSegmentedControlElement,
  SegmentedControlProps
>('rg-segmented-control', {
  displayName: 'SegmentedControl',
  events: { ...valueEvents, onSelectionChange: 'rg-value-change' },
  attributes: { fullWidth: 'full-width' },
});
export const Segment = createReglowComponent<RgSegmentElement, SegmentProps>('rg-segment', {
  displayName: 'Segment',
});
export const ProgressRing = createReglowComponent<RgProgressRingElement, ProgressRingProps>(
  'rg-progress-ring',
  {
    displayName: 'ProgressRing',
    attributes: { showValue: 'show-value' },
    properties: ['value'],
    propertyDefaults: { value: null },
  },
);
export const Rating = createReglowComponent<RgRatingElement, RatingProps>('rg-rating', {
  displayName: 'Rating',
  events: { ...valueEvents, onRatingChange: 'rg-value-change' },
  attributes: { readOnly: 'readonly' },
});
export const RelativeTime = createReglowComponent<RgRelativeTimeElement, RelativeTimeProps>(
  'rg-relative-time',
  {
    displayName: 'RelativeTime',
    properties: ['date'],
    propertyDefaults: { date: '' },
  },
);

export type {
  RgAccordionElement,
  RgAccordionItemElement,
  RgAlertElement,
  RgAvatarElement,
  RgBadgeElement,
  RgBreadcrumbElement,
  RgBreadcrumbItemElement,
  RgButtonElement,
  RgButtonGroupElement,
  RgCardElement,
  RgCheckboxElement,
  RgChipElement,
  RgChipGroupElement,
  RgComboboxElement,
  RgCopyButtonElement,
  RgDatePickerElement,
  RgDialogElement,
  RgDividerElement,
  RgDrawerElement,
  RgEmptyStateElement,
  RgFieldsetElement,
  RgIconButtonElement,
  RgInputElement,
  RgKbdElement,
  RgLinkElement,
  RgMenuElement,
  RgMenuItemElement,
  RgOptionElement,
  RgPaginationElement,
  RgPopoverElement,
  RgProgressElement,
  RgProgressRingElement,
  RgRadioElement,
  RgRadioGroupElement,
  RgRatingElement,
  RgRelativeTimeElement,
  RgSegmentElement,
  RgSegmentedControlElement,
  RgSelectElement,
  RgSkeletonElement,
  RgSliderElement,
  RgSpinnerElement,
  RgSwitchElement,
  RgTabElement,
  RgTabPanelElement,
  RgTabsElement,
  RgTextareaElement,
  RgThemeElement,
  RgToastElement,
  RgToastRegionElement,
  RgTooltipElement,
};

export { createReglowComponent } from './factory.js';
