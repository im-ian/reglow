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
  RgKbdElement,
  RgLinkElement,
  RgLinkSize,
  RgLinkTone,
  RgLinkVariant,
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
  RgSelectSize,
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
  SkeletonShape,
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
import type { HTMLAttributes } from 'vue';
import { createReglowPlugin, createReglowVueComponent } from './factory.js';

export type Size = RgButtonSize;
export type Tone = RgButtonTone;
export type Variant = RgButtonVariant;

export type ReglowHostEvent<TElement extends HTMLElement> = Event & {
  currentTarget: TElement;
  target: TElement;
};

export type ReglowElementEvent<TElement extends HTMLElement, TDetail> = CustomEvent<TDetail> &
  ReglowHostEvent<TElement>;

export interface ReglowHostProps extends Omit<HTMLAttributes, 'color' | 'onChange' | 'onInput'> {}

interface RgValueEventProps<TElement extends HTMLElement> {
  onValueChange?: (event: ReglowHostEvent<TElement>) => void;
  onValueCommit?: (event: ReglowHostEvent<TElement>) => void;
}

export interface RgThemeProps extends ReglowHostProps {
  mode?: RgThemeMode;
  density?: RgThemeDensity;
  motion?: RgThemeMotion;
  onThemeChange?: (event: ReglowElementEvent<RgThemeElement, RgThemeChangeDetail>) => void;
}

export interface RgButtonProps extends ReglowHostProps {
  variant?: RgButtonVariant;
  tone?: RgButtonTone;
  size?: RgButtonSize;
  type?: RgButtonType;
  name?: string;
  value?: string;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  formNoValidate?: boolean;
  pressed?: boolean | null;
  onPress?: (event: ReglowElementEvent<RgButtonElement, RgPressDetail>) => void;
}

export interface RgIconButtonProps extends Omit<RgButtonProps, 'onPress'> {
  label: string;
  onPress?: (event: ReglowElementEvent<RgIconButtonElement, RgPressDetail>) => void;
}

export interface RgLinkProps extends ReglowHostProps {
  href?: string;
  hrefLang?: string;
  target?: string;
  rel?: string;
  referrerPolicy?: string;
  type?: string;
  download?: string | boolean;
  disabled?: boolean;
  external?: boolean;
  variant?: RgLinkVariant;
  tone?: RgLinkTone;
  size?: RgLinkSize;
  onNavigate?: (event: ReglowElementEvent<RgLinkElement, RgNavigateDetail>) => void;
}

export interface RgFieldProps<TElement extends HTMLElement = HTMLElement, TValue = string | number>
  extends ReglowHostProps, RgValueEventProps<TElement> {
  modelValue?: TValue;
  value?: TValue;
  name?: string;
  label?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  size?: RgInputSize;
  'onUpdate:modelValue'?: (value: TValue) => void;
}

export interface RgInputProps extends RgFieldProps<RgInputElement> {
  type?: RgInputType;
  clearable?: boolean;
  autoComplete?: string;
  inputMode?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  onClear?: (event: ReglowElementEvent<RgInputElement, { readonly previousValue: string }>) => void;
}

export interface RgTextareaProps extends Omit<RgFieldProps<RgTextareaElement>, 'size'> {
  size?: RgTextareaSize;
  rows?: number;
  cols?: number;
  minLength?: number;
  maxLength?: number;
  resize?: RgTextareaResize;
  autoGrow?: boolean;
}

export interface RgSelectProps extends Omit<RgFieldProps<RgSelectElement>, 'size'> {
  size?: RgSelectSize;
  options?: readonly RgSelectOption[];
}

export interface RgOptionProps extends ReglowHostProps {
  value: string;
  label?: string;
  disabled?: boolean;
  selected?: boolean;
}

export interface RgCheckableProps<TElement extends HTMLElement = HTMLElement> extends Omit<
  RgFieldProps<TElement, string>,
  'modelValue' | 'onUpdate:modelValue' | 'placeholder' | 'readOnly' | 'size'
> {
  modelValue?: boolean;
  checked?: boolean;
  'onUpdate:modelValue'?: (value: boolean) => void;
}

export interface RgCheckboxProps extends RgCheckableProps<RgCheckboxElement> {
  indeterminate?: boolean;
}

export type RgSwitchProps = RgCheckableProps<RgSwitchElement>;

export interface RgRadioGroupProps extends Omit<
  RgFieldProps<RgRadioGroupElement, string>,
  'placeholder' | 'readOnly' | 'size'
> {
  orientation?: RgRadioOrientation;
}

export interface RgRadioProps extends ReglowHostProps, RgValueEventProps<RgRadioElement> {
  value: string;
  label?: string;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
}

export interface RgSliderProps extends Omit<
  RgFieldProps<RgSliderElement, number>,
  'placeholder' | 'readOnly' | 'size'
> {
  min?: number;
  max?: number;
  step?: number;
  orientation?: RgSliderOrientation;
  size?: RgSliderSize;
  showValue?: boolean;
}

export interface RgBadgeProps extends ReglowHostProps {
  tone?: RgBadgeTone;
  variant?: RgBadgeVariant;
  size?: RgBadgeSize;
  dot?: boolean;
  removable?: boolean;
  removeLabel?: string;
  onRemove?: (event: ReglowElementEvent<RgBadgeElement, RgBadgeRemoveDetail>) => void;
}

export interface RgAvatarProps extends Omit<ReglowHostProps, 'onLoad' | 'onError'> {
  src?: string;
  srcSet?: string;
  sizes?: string;
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
  onLoad?: (event: ReglowElementEvent<RgAvatarElement, RgAvatarLoadDetail>) => void;
  onError?: (event: ReglowElementEvent<RgAvatarElement, RgAvatarErrorDetail>) => void;
}

export interface RgCardProps extends ReglowHostProps {
  variant?: RgCardVariant;
  padding?: RgCardPadding;
  radius?: RgCardRadius;
  lift?: boolean;
}

export interface RgDividerProps extends ReglowHostProps {
  orientation?: RgDividerOrientation;
  variant?: RgDividerVariant;
  spacing?: RgDividerSpacing;
  decorative?: boolean;
  inset?: boolean;
}

export interface RgAlertProps extends ReglowHostProps {
  tone?: AlertTone;
  variant?: AlertVariant;
  dismissible?: boolean;
  dismissLabel?: string;
  onDismiss?: (event: ReglowElementEvent<RgAlertElement, AlertDismissDetail>) => void;
}

export interface RgProgressProps extends ReglowHostProps {
  value?: number;
  max?: number;
  label?: string;
}

export interface RgSpinnerProps extends ReglowHostProps {
  size?: Size;
  label?: string;
}

export interface RgSkeletonProps extends ReglowHostProps {
  shape?: SkeletonShape;
  width?: string;
  height?: string;
  animated?: boolean;
}

export interface RgToastRegionProps extends ReglowHostProps {
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

export interface RgToastProps extends ReglowHostProps {
  open?: boolean;
  duration?: number;
  tone?: ToastTone;
  dismissible?: boolean;
  dismissLabel?: string;
  onOpenChange?: (event: ReglowElementEvent<RgToastElement, ToastOpenChangeDetail>) => void;
  onDismiss?: (event: ReglowElementEvent<RgToastElement, ToastDismissDetail>) => void;
}

export interface RgTabsProps extends ReglowHostProps {
  modelValue?: string;
  value?: string;
  orientation?: TabsOrientation;
  activation?: TabsActivation;
  loop?: boolean;
  'onUpdate:modelValue'?: (value: string) => void;
  onValueChange?: (event: ReglowElementEvent<RgTabsElement, TabsValueChangeDetail>) => void;
}

export interface RgTabProps extends ReglowHostProps {
  value: string;
  disabled?: boolean;
}

export interface RgTabPanelProps extends ReglowHostProps {
  value: string;
}

export interface RgAccordionProps extends ReglowHostProps {
  modelValue?: string | string[];
  value?: string | string[];
  multiple?: boolean;
  collapsible?: boolean;
  'onUpdate:modelValue'?: (value: string | string[]) => void;
  onValueChange?: (
    event: ReglowElementEvent<RgAccordionElement, AccordionValueChangeDetail>,
  ) => void;
}

export interface RgAccordionItemProps extends ReglowHostProps {
  value: string;
  open?: boolean;
  disabled?: boolean;
  headingLevel?: number;
  onOpenChange?: (
    event: ReglowElementEvent<RgAccordionItemElement, AccordionItemOpenChangeDetail>,
  ) => void;
}

export interface RgDialogProps extends Omit<ReglowHostProps, 'onClose'> {
  modelValue?: boolean;
  open?: boolean;
  size?: DialogSize;
  label?: string;
  escapeKeyAction?: DialogDismissAction;
  backdropAction?: DialogDismissAction;
  hideClose?: boolean;
  closeLabel?: string;
  initialFocus?: HTMLElement | null;
  'onUpdate:modelValue'?: (value: boolean) => void;
  onBeforeClose?: (event: ReglowElementEvent<RgDialogElement, DialogBeforeCloseDetail>) => void;
  onOpenChange?: (event: ReglowElementEvent<RgDialogElement, DialogOpenChangeDetail>) => void;
  onClose?: (event: ReglowElementEvent<RgDialogElement, DialogCloseDetail>) => void;
}

export interface RgDrawerProps extends Omit<
  RgDialogProps,
  'onBeforeClose' | 'onOpenChange' | 'onClose'
> {
  placement?: DrawerPlacement;
  onBeforeClose?: (event: ReglowElementEvent<RgDrawerElement, DialogBeforeCloseDetail>) => void;
  onOpenChange?: (event: ReglowElementEvent<RgDrawerElement, DialogOpenChangeDetail>) => void;
  onClose?: (event: ReglowElementEvent<RgDrawerElement, DialogCloseDetail>) => void;
}

export interface RgTooltipProps extends ReglowHostProps {
  content: string;
  open?: boolean;
  placement?: TooltipPlacement;
  delay?: number;
  disabled?: boolean;
  onOpenChange?: (event: ReglowElementEvent<RgTooltipElement, TooltipOpenChangeDetail>) => void;
}

export interface RgButtonGroupProps extends ReglowHostProps {
  label?: string;
  orientation?: RgButtonGroupOrientation;
  attached?: boolean;
}

export interface RgComboboxProps extends Omit<RgFieldProps<RgComboboxElement>, 'size'> {
  size?: RgComboboxSize;
  filter?: RgComboboxFilter;
  noResultsText?: string;
  open?: boolean;
  options?: readonly RgSelectOption[];
  onOpenChange?: (event: ReglowElementEvent<RgComboboxElement, RgComboboxOpenChangeDetail>) => void;
  onSelectionChange?: (
    event: ReglowElementEvent<RgComboboxElement, RgComboboxValueChangeDetail>,
  ) => void;
}

export interface RgDatePickerProps extends Omit<
  RgFieldProps<RgDatePickerElement>,
  'placeholder' | 'size'
> {
  size?: RgDatePickerSize;
  min?: string;
  max?: string;
  step?: number;
}

export interface RgKbdProps extends ReglowHostProps {
  keys?: string;
  label?: string;
  separator?: string;
}

export interface RgFieldsetProps extends ReglowHostProps {
  legend?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  invalid?: boolean;
}

export interface RgEmptyStateProps extends ReglowHostProps {
  title?: string;
  description?: string;
  size?: RgEmptyStateSize;
  tone?: RgEmptyStateTone;
}

export interface RgBreadcrumbProps extends ReglowHostProps {
  label?: string;
}

export interface RgBreadcrumbItemProps extends ReglowHostProps {
  href?: string;
  target?: string;
  rel?: string;
  current?: boolean;
}

export interface RgPaginationProps extends ReglowHostProps {
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

export interface RgPopoverProps extends ReglowHostProps {
  open?: boolean;
  placement?: RgPopoverPlacement;
  triggerMode?: RgPopoverTrigger;
  disabled?: boolean;
  label?: string;
  matchTriggerWidth?: boolean;
  onOpenChange?: (event: ReglowElementEvent<RgPopoverElement, RgPopoverOpenChangeDetail>) => void;
}

export interface RgMenuProps extends Omit<ReglowHostProps, 'onSelect'> {
  open?: boolean;
  placement?: RgPopoverPlacement;
  disabled?: boolean;
  label?: string;
  onOpenChange?: (event: ReglowElementEvent<RgMenuElement, RgMenuOpenChangeDetail>) => void;
  onSelect?: (event: ReglowElementEvent<RgMenuElement, RgMenuSelectDetail>) => void;
}

export interface RgMenuItemProps extends ReglowHostProps {
  value: string;
  disabled?: boolean;
}

export interface RgCopyButtonProps extends Omit<ReglowHostProps, 'onCopy' | 'onError'> {
  value?: string;
  from?: string;
  disabled?: boolean;
  copyLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  feedbackDuration?: number;
  onCopy?: (event: ReglowElementEvent<RgCopyButtonElement, RgCopyDetail>) => void;
  onError?: (event: ReglowElementEvent<RgCopyButtonElement, RgCopyErrorDetail>) => void;
}

export interface RgChipGroupProps extends ReglowHostProps, RgValueEventProps<RgChipGroupElement> {
  modelValue?: string | string[];
  value?: string | string[];
  selection?: RgChipSelection;
  label?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  'onUpdate:modelValue'?: (value: string | string[]) => void;
  onSelectionChange?: (
    event: ReglowElementEvent<RgChipGroupElement, RgChipValueChangeDetail>,
  ) => void;
}

export interface RgChipProps extends ReglowHostProps {
  value: string;
  selected?: boolean;
  disabled?: boolean;
  removable?: boolean;
  removeLabel?: string;
  size?: RgChipSize;
  onRemove?: (event: ReglowElementEvent<RgChipElement, RgChipRemoveDetail>) => void;
}

export interface RgSegmentedControlProps
  extends ReglowHostProps, RgValueEventProps<RgSegmentedControlElement> {
  modelValue?: string;
  value?: string;
  label?: string;
  name?: string;
  orientation?: RgSegmentedControlOrientation;
  size?: RgSegmentedControlSize;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  'onUpdate:modelValue'?: (value: string) => void;
  onSelectionChange?: (
    event: ReglowElementEvent<RgSegmentedControlElement, RgSegmentedValueChangeDetail>,
  ) => void;
}

export interface RgSegmentProps extends ReglowHostProps {
  value: string;
  selected?: boolean;
  disabled?: boolean;
}

export interface RgProgressRingProps extends ReglowHostProps {
  value?: number | null;
  max?: number;
  label?: string;
  size?: RgProgressRingSize;
  showValue?: boolean;
}

export interface RgRatingProps extends ReglowHostProps, RgValueEventProps<RgRatingElement> {
  modelValue?: number;
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
  'onUpdate:modelValue'?: (value: number) => void;
  onRatingChange?: (event: ReglowElementEvent<RgRatingElement, RgRatingValueChangeDetail>) => void;
}

export interface RgRelativeTimeProps extends ReglowHostProps {
  date: string | Date;
  locale?: string;
  format?: RgRelativeTimeFormat;
  numeric?: RgRelativeTimeNumeric;
  sync?: boolean;
}

const fieldProps = [
  'value',
  'name',
  'label',
  'description',
  'error',
  'placeholder',
  'required',
  'disabled',
  'readOnly',
  'invalid',
  'size',
] as const;
const fieldBooleanProps = ['required', 'disabled', 'readOnly', 'invalid'] as const;
const fieldAttributes = { readOnly: 'readonly' } as const;
const fieldEvents = { input: 'value-change', change: 'value-commit' } as const;
const fieldSlots = ['label', 'description', 'error'] as const;

export const RgTheme = createReglowVueComponent<RgThemeElement, RgThemeProps>('rg-theme', {
  displayName: 'RgTheme',
  props: ['mode', 'density', 'motion'],
  events: { 'rg-theme-change': 'theme-change' },
});
export const RgButton = createReglowVueComponent<RgButtonElement, RgButtonProps>('rg-button', {
  displayName: 'RgButton',
  props: [
    'variant',
    'tone',
    'size',
    'type',
    'name',
    'value',
    'label',
    'disabled',
    'loading',
    'fullWidth',
    'formNoValidate',
    'pressed',
  ],
  events: { 'rg-press': 'press' },
  booleanProps: ['disabled', 'loading', 'fullWidth', 'formNoValidate', 'pressed'],
  attributes: { fullWidth: 'full-width', formNoValidate: 'formnovalidate' },
  properties: ['pressed'],
  propertyDefaults: { pressed: null },
  slots: ['start', 'end'],
});
export const RgIconButton = createReglowVueComponent<RgIconButtonElement, RgIconButtonProps>(
  'rg-icon-button',
  {
    displayName: 'RgIconButton',
    props: [
      'label',
      'variant',
      'tone',
      'size',
      'type',
      'name',
      'value',
      'disabled',
      'loading',
      'fullWidth',
      'formNoValidate',
      'pressed',
    ],
    events: { 'rg-press': 'press' },
    booleanProps: ['disabled', 'loading', 'fullWidth', 'formNoValidate', 'pressed'],
    attributes: { fullWidth: 'full-width', formNoValidate: 'formnovalidate' },
    properties: ['pressed'],
    propertyDefaults: { pressed: null },
  },
);
export const RgLink = createReglowVueComponent<RgLinkElement, RgLinkProps>('rg-link', {
  displayName: 'RgLink',
  props: [
    'href',
    'hrefLang',
    'target',
    'rel',
    'referrerPolicy',
    'type',
    'download',
    'disabled',
    'external',
    'variant',
    'tone',
    'size',
  ],
  events: { 'rg-navigate': 'navigate' },
  booleanProps: ['disabled', 'external'],
  booleanOrStringProps: ['download'],
  attributes: { hrefLang: 'hreflang', referrerPolicy: 'referrerpolicy' },
  slots: ['start', 'end'],
});
export const RgInput = createReglowVueComponent<RgInputElement, RgInputProps>('rg-input', {
  displayName: 'RgInput',
  props: [
    ...fieldProps,
    'type',
    'clearable',
    'autoComplete',
    'inputMode',
    'min',
    'max',
    'step',
    'minLength',
    'maxLength',
    'pattern',
  ],
  events: { ...fieldEvents, 'rg-clear': 'clear' },
  booleanProps: [...fieldBooleanProps, 'clearable'],
  numberProps: ['min', 'max', 'step', 'minLength', 'maxLength'],
  attributes: {
    ...fieldAttributes,
    autoComplete: 'autocomplete',
    inputMode: 'inputmode',
    minLength: 'minlength',
    maxLength: 'maxlength',
  },
  slots: [...fieldSlots, 'start', 'end'],
  model: { property: 'value', event: 'input' },
});
export const RgTextarea = createReglowVueComponent<RgTextareaElement, RgTextareaProps>(
  'rg-textarea',
  {
    displayName: 'RgTextarea',
    props: [...fieldProps, 'rows', 'cols', 'minLength', 'maxLength', 'resize', 'autoGrow'],
    events: fieldEvents,
    booleanProps: [...fieldBooleanProps, 'autoGrow'],
    numberProps: ['rows', 'cols', 'minLength', 'maxLength'],
    attributes: {
      ...fieldAttributes,
      autoGrow: 'auto-grow',
      minLength: 'minlength',
      maxLength: 'maxlength',
    },
    slots: fieldSlots,
    model: { property: 'value', event: 'input' },
  },
);
export const RgSelect = createReglowVueComponent<RgSelectElement, RgSelectProps>('rg-select', {
  displayName: 'RgSelect',
  props: [...fieldProps.filter((prop) => prop !== 'readOnly'), 'options'],
  events: fieldEvents,
  booleanProps: ['required', 'disabled', 'invalid'],
  properties: ['options'],
  propertyDefaults: { options: null },
  slots: fieldSlots,
  model: { property: 'value', event: 'change' },
});
export const RgOption = createReglowVueComponent<RgOptionElement, RgOptionProps>('rg-option', {
  displayName: 'RgOption',
  props: ['value', 'label', 'disabled', 'selected'],
  booleanProps: ['disabled', 'selected'],
});
export const RgCheckbox = createReglowVueComponent<RgCheckboxElement, RgCheckboxProps>(
  'rg-checkbox',
  {
    displayName: 'RgCheckbox',
    props: [
      'value',
      'name',
      'label',
      'description',
      'error',
      'required',
      'disabled',
      'invalid',
      'checked',
      'indeterminate',
    ],
    events: fieldEvents,
    booleanProps: ['modelValue', 'required', 'disabled', 'invalid', 'checked', 'indeterminate'],
    properties: ['indeterminate'],
    propertyDefaults: { indeterminate: false },
    slots: fieldSlots,
    model: { property: 'checked', event: 'change' },
  },
);
export const RgSwitch = createReglowVueComponent<RgSwitchElement, RgSwitchProps>('rg-switch', {
  displayName: 'RgSwitch',
  props: [
    'value',
    'name',
    'label',
    'description',
    'error',
    'required',
    'disabled',
    'invalid',
    'checked',
  ],
  events: fieldEvents,
  booleanProps: ['modelValue', 'required', 'disabled', 'invalid', 'checked'],
  slots: fieldSlots,
  model: { property: 'checked', event: 'change' },
});
export const RgRadioGroup = createReglowVueComponent<RgRadioGroupElement, RgRadioGroupProps>(
  'rg-radio-group',
  {
    displayName: 'RgRadioGroup',
    props: [
      'value',
      'name',
      'label',
      'description',
      'error',
      'required',
      'disabled',
      'invalid',
      'orientation',
    ],
    events: fieldEvents,
    booleanProps: ['required', 'disabled', 'invalid'],
    slots: fieldSlots,
    model: { property: 'value', event: 'change' },
  },
);
export const RgRadio = createReglowVueComponent<RgRadioElement, RgRadioProps>('rg-radio', {
  displayName: 'RgRadio',
  props: ['value', 'label', 'description', 'checked', 'disabled'],
  events: fieldEvents,
  booleanProps: ['checked', 'disabled'],
  slots: ['description'],
});
export const RgSlider = createReglowVueComponent<RgSliderElement, RgSliderProps>('rg-slider', {
  displayName: 'RgSlider',
  props: [
    'value',
    'name',
    'label',
    'description',
    'error',
    'required',
    'disabled',
    'invalid',
    'orientation',
    'size',
    'min',
    'max',
    'step',
    'showValue',
  ],
  events: fieldEvents,
  booleanProps: ['required', 'disabled', 'invalid', 'showValue'],
  numberProps: ['modelValue', 'value', 'min', 'max', 'step'],
  attributes: { showValue: 'show-value' },
  slots: fieldSlots,
  model: { property: 'value', event: 'input' },
});
export const RgBadge = createReglowVueComponent<RgBadgeElement, RgBadgeProps>('rg-badge', {
  displayName: 'RgBadge',
  props: ['tone', 'variant', 'size', 'dot', 'removable', 'removeLabel'],
  events: { 'rg-remove': 'remove' },
  booleanProps: ['dot', 'removable'],
  attributes: { removeLabel: 'remove-label' },
  slots: ['start', 'end'],
});
export const RgAvatar = createReglowVueComponent<RgAvatarElement, RgAvatarProps>('rg-avatar', {
  displayName: 'RgAvatar',
  props: [
    'src',
    'srcSet',
    'sizes',
    'alt',
    'name',
    'initials',
    'size',
    'shape',
    'status',
    'statusLabel',
    'loading',
    'crossOrigin',
    'decoding',
    'referrerPolicy',
  ],
  events: { 'rg-load': 'load', 'rg-error': 'error' },
  attributes: {
    srcSet: 'srcset',
    statusLabel: 'status-label',
    crossOrigin: 'crossorigin',
    referrerPolicy: 'referrerpolicy',
  },
  slots: { fallback: 'fallback', statusContent: 'status' },
});
export const RgCard = createReglowVueComponent<RgCardElement, RgCardProps>('rg-card', {
  displayName: 'RgCard',
  props: ['variant', 'padding', 'radius', 'lift'],
  booleanProps: ['lift'],
  slots: ['media', 'header', 'footer'],
});
export const RgDivider = createReglowVueComponent<RgDividerElement, RgDividerProps>('rg-divider', {
  displayName: 'RgDivider',
  props: ['orientation', 'variant', 'spacing', 'decorative', 'inset'],
  booleanProps: ['decorative', 'inset'],
});
export const RgAlert = createReglowVueComponent<RgAlertElement, RgAlertProps>('rg-alert', {
  displayName: 'RgAlert',
  props: ['tone', 'variant', 'dismissible', 'dismissLabel'],
  events: { 'rg-dismiss': 'dismiss' },
  booleanProps: ['dismissible'],
  attributes: { dismissLabel: 'dismiss-label' },
  slots: ['icon', 'title', 'actions'],
});
export const RgProgress = createReglowVueComponent<RgProgressElement, RgProgressProps>(
  'rg-progress',
  {
    displayName: 'RgProgress',
    props: ['value', 'max', 'label'],
    numberProps: ['value', 'max'],
    slots: ['label'],
  },
);
export const RgSpinner = createReglowVueComponent<RgSpinnerElement, RgSpinnerProps>('rg-spinner', {
  displayName: 'RgSpinner',
  props: ['size', 'label'],
});
export const RgSkeleton = createReglowVueComponent<RgSkeletonElement, RgSkeletonProps>(
  'rg-skeleton',
  {
    displayName: 'RgSkeleton',
    props: ['shape', 'width', 'height', 'animated'],
    booleanProps: ['animated'],
  },
);
export const RgToastRegion = createReglowVueComponent<RgToastRegionElement, RgToastRegionProps>(
  'rg-toast-region',
  {
    displayName: 'RgToastRegion',
    props: ['position', 'maxVisible', 'label', 'pauseOnHover'],
    events: { 'rg-toast-add': 'toast-add' },
    booleanProps: ['pauseOnHover'],
    numberProps: ['maxVisible'],
    attributes: { maxVisible: 'max-visible', pauseOnHover: 'pause-on-hover' },
  },
);
export const RgToast = createReglowVueComponent<RgToastElement, RgToastProps>('rg-toast', {
  displayName: 'RgToast',
  props: ['open', 'duration', 'tone', 'dismissible', 'dismissLabel'],
  events: { 'rg-open-change': 'open-change', 'rg-dismiss': 'dismiss' },
  booleanProps: ['open', 'dismissible'],
  numberProps: ['duration'],
  attributes: { dismissLabel: 'dismiss-label' },
  slots: ['icon', 'title', 'action'],
});
export const RgTabs = createReglowVueComponent<RgTabsElement, RgTabsProps>('rg-tabs', {
  displayName: 'RgTabs',
  props: ['value', 'orientation', 'activation', 'loop'],
  events: { 'rg-value-change': 'value-change' },
  booleanProps: ['loop'],
  slots: ['tab'],
  model: { property: 'value', event: 'rg-value-change' },
});
export const RgTab = createReglowVueComponent<RgTabElement, RgTabProps>('rg-tab', {
  displayName: 'RgTab',
  props: ['value', 'disabled'],
  booleanProps: ['disabled'],
});
export const RgTabPanel = createReglowVueComponent<RgTabPanelElement, RgTabPanelProps>(
  'rg-tab-panel',
  {
    displayName: 'RgTabPanel',
    props: ['value'],
  },
);
export const RgAccordion = createReglowVueComponent<RgAccordionElement, RgAccordionProps>(
  'rg-accordion',
  {
    displayName: 'RgAccordion',
    props: ['value', 'multiple', 'collapsible'],
    events: { 'rg-value-change': 'value-change' },
    booleanProps: ['multiple', 'collapsible'],
    properties: ['value'],
    propertyDefaults: { value: '' },
    model: { property: 'value', event: 'rg-value-change' },
  },
);
export const RgAccordionItem = createReglowVueComponent<
  RgAccordionItemElement,
  RgAccordionItemProps
>('rg-accordion-item', {
  displayName: 'RgAccordionItem',
  props: ['value', 'open', 'disabled', 'headingLevel'],
  events: { 'rg-open-change': 'open-change' },
  booleanProps: ['open', 'disabled'],
  numberProps: ['headingLevel'],
  attributes: { headingLevel: 'heading-level' },
  slots: ['heading'],
});
export const RgDialog = createReglowVueComponent<RgDialogElement, RgDialogProps>('rg-dialog', {
  displayName: 'RgDialog',
  props: [
    'open',
    'size',
    'label',
    'escapeKeyAction',
    'backdropAction',
    'hideClose',
    'closeLabel',
    'initialFocus',
  ],
  events: {
    'rg-before-close': 'before-close',
    'rg-open-change': 'open-change',
    'rg-close': 'close',
  },
  booleanProps: ['modelValue', 'open', 'hideClose'],
  attributes: {
    escapeKeyAction: 'escape-key-action',
    backdropAction: 'backdrop-action',
    hideClose: 'hide-close',
    closeLabel: 'close-label',
  },
  properties: ['initialFocus'],
  propertyDefaults: { initialFocus: null },
  slots: ['trigger', 'title', 'footer', 'close'],
  model: { property: 'open', event: 'rg-open-change' },
});
export const RgDrawer = createReglowVueComponent<RgDrawerElement, RgDrawerProps>('rg-drawer', {
  displayName: 'RgDrawer',
  props: [
    'open',
    'size',
    'label',
    'escapeKeyAction',
    'backdropAction',
    'hideClose',
    'closeLabel',
    'placement',
    'initialFocus',
  ],
  events: {
    'rg-before-close': 'before-close',
    'rg-open-change': 'open-change',
    'rg-close': 'close',
  },
  booleanProps: ['modelValue', 'open', 'hideClose'],
  attributes: {
    escapeKeyAction: 'escape-key-action',
    backdropAction: 'backdrop-action',
    hideClose: 'hide-close',
    closeLabel: 'close-label',
  },
  properties: ['initialFocus'],
  propertyDefaults: { initialFocus: null },
  slots: ['trigger', 'title', 'footer', 'close'],
  model: { property: 'open', event: 'rg-open-change' },
});
export const RgTooltip = createReglowVueComponent<RgTooltipElement, RgTooltipProps>('rg-tooltip', {
  displayName: 'RgTooltip',
  props: ['content', 'open', 'placement', 'delay', 'disabled'],
  events: { 'rg-open-change': 'open-change' },
  booleanProps: ['open', 'disabled'],
  numberProps: ['delay'],
  slots: { trigger: 'trigger', richContent: 'content' },
});
export const RgButtonGroup = createReglowVueComponent<RgButtonGroupElement, RgButtonGroupProps>(
  'rg-button-group',
  {
    displayName: 'RgButtonGroup',
    props: ['label', 'orientation', 'attached'],
    booleanProps: ['attached'],
  },
);
export const RgCombobox = createReglowVueComponent<RgComboboxElement, RgComboboxProps>(
  'rg-combobox',
  {
    displayName: 'RgCombobox',
    props: [...fieldProps, 'filter', 'noResultsText', 'open', 'options'],
    events: {
      ...fieldEvents,
      'rg-open-change': 'open-change',
      'rg-value-change': 'selection-change',
    },
    booleanProps: [...fieldBooleanProps, 'open'],
    attributes: { ...fieldAttributes, noResultsText: 'no-results-text' },
    properties: ['options'],
    propertyDefaults: { options: null },
    slots: fieldSlots,
    model: { property: 'value', event: 'change' },
  },
);
export const RgDatePicker = createReglowVueComponent<RgDatePickerElement, RgDatePickerProps>(
  'rg-date-picker',
  {
    displayName: 'RgDatePicker',
    props: [...fieldProps.filter((prop) => prop !== 'placeholder'), 'min', 'max', 'step'],
    events: fieldEvents,
    booleanProps: fieldBooleanProps,
    numberProps: ['step'],
    attributes: fieldAttributes,
    slots: fieldSlots,
    model: { property: 'value', event: 'input' },
  },
);
export const RgKbd = createReglowVueComponent<RgKbdElement, RgKbdProps>('rg-kbd', {
  displayName: 'RgKbd',
  props: ['keys', 'label', 'separator'],
});
export const RgFieldset = createReglowVueComponent<RgFieldsetElement, RgFieldsetProps>(
  'rg-fieldset',
  {
    displayName: 'RgFieldset',
    props: ['legend', 'description', 'error', 'disabled', 'invalid'],
    booleanProps: ['disabled', 'invalid'],
    slots: ['legend', 'description', 'error'],
  },
);
export const RgEmptyState = createReglowVueComponent<RgEmptyStateElement, RgEmptyStateProps>(
  'rg-empty-state',
  {
    displayName: 'RgEmptyState',
    props: ['title', 'description', 'size', 'tone'],
    slots: ['icon', 'title', 'actions'],
  },
);
export const RgBreadcrumb = createReglowVueComponent<RgBreadcrumbElement, RgBreadcrumbProps>(
  'rg-breadcrumb',
  { displayName: 'RgBreadcrumb', props: ['label'] },
);
export const RgBreadcrumbItem = createReglowVueComponent<
  RgBreadcrumbItemElement,
  RgBreadcrumbItemProps
>('rg-breadcrumb-item', {
  displayName: 'RgBreadcrumbItem',
  props: ['href', 'target', 'rel', 'current'],
  booleanProps: ['current'],
});
export const RgPagination = createReglowVueComponent<RgPaginationElement, RgPaginationProps>(
  'rg-pagination',
  {
    displayName: 'RgPagination',
    props: [
      'page',
      'pageCount',
      'siblingCount',
      'boundaryCount',
      'disabled',
      'label',
      'previousLabel',
      'nextLabel',
    ],
    events: { 'rg-page-change': 'page-change' },
    booleanProps: ['disabled'],
    numberProps: ['page', 'pageCount', 'siblingCount', 'boundaryCount'],
    attributes: {
      pageCount: 'page-count',
      siblingCount: 'sibling-count',
      boundaryCount: 'boundary-count',
      previousLabel: 'previous-label',
      nextLabel: 'next-label',
    },
  },
);
export const RgPopover = createReglowVueComponent<RgPopoverElement, RgPopoverProps>('rg-popover', {
  displayName: 'RgPopover',
  props: ['open', 'placement', 'triggerMode', 'disabled', 'label', 'matchTriggerWidth'],
  events: { 'rg-open-change': 'open-change' },
  booleanProps: ['open', 'disabled', 'matchTriggerWidth'],
  attributes: { triggerMode: 'trigger', matchTriggerWidth: 'match-trigger-width' },
  slots: ['trigger'],
});
export const RgMenu = createReglowVueComponent<RgMenuElement, RgMenuProps>('rg-menu', {
  displayName: 'RgMenu',
  props: ['open', 'placement', 'disabled', 'label'],
  events: { 'rg-open-change': 'open-change', 'rg-select': 'select' },
  booleanProps: ['open', 'disabled'],
  slots: ['trigger'],
});
export const RgMenuItem = createReglowVueComponent<RgMenuItemElement, RgMenuItemProps>(
  'rg-menu-item',
  {
    displayName: 'RgMenuItem',
    props: ['value', 'disabled'],
    booleanProps: ['disabled'],
    slots: ['start', 'end'],
  },
);
export const RgCopyButton = createReglowVueComponent<RgCopyButtonElement, RgCopyButtonProps>(
  'rg-copy-button',
  {
    displayName: 'RgCopyButton',
    props: [
      'value',
      'from',
      'disabled',
      'copyLabel',
      'successLabel',
      'errorLabel',
      'feedbackDuration',
    ],
    events: { 'rg-copy': 'copy', 'rg-error': 'error' },
    booleanProps: ['disabled'],
    numberProps: ['feedbackDuration'],
    attributes: {
      copyLabel: 'copy-label',
      successLabel: 'success-label',
      errorLabel: 'error-label',
      feedbackDuration: 'feedback-duration',
    },
    slots: ['copy-icon', 'success-icon', 'error-icon'],
  },
);
export const RgChipGroup = createReglowVueComponent<RgChipGroupElement, RgChipGroupProps>(
  'rg-chip-group',
  {
    displayName: 'RgChipGroup',
    props: ['value', 'selection', 'label', 'name', 'required', 'disabled'],
    events: {
      input: 'value-change',
      change: 'value-commit',
      'rg-value-change': 'selection-change',
    },
    booleanProps: ['required', 'disabled'],
    properties: ['value'],
    propertyDefaults: { value: '' },
    model: { property: 'value', event: 'rg-value-change' },
  },
);
export const RgChip = createReglowVueComponent<RgChipElement, RgChipProps>('rg-chip', {
  displayName: 'RgChip',
  props: ['value', 'selected', 'disabled', 'removable', 'removeLabel', 'size'],
  events: { 'rg-remove': 'remove' },
  booleanProps: ['selected', 'disabled', 'removable'],
  attributes: { removeLabel: 'remove-label' },
  slots: ['start', 'end'],
});
export const RgSegmentedControl = createReglowVueComponent<
  RgSegmentedControlElement,
  RgSegmentedControlProps
>('rg-segmented-control', {
  displayName: 'RgSegmentedControl',
  props: ['value', 'label', 'name', 'orientation', 'size', 'required', 'disabled', 'fullWidth'],
  events: {
    input: 'value-change',
    change: 'value-commit',
    'rg-value-change': 'selection-change',
  },
  booleanProps: ['required', 'disabled', 'fullWidth'],
  attributes: { fullWidth: 'full-width' },
  model: { property: 'value', event: 'rg-value-change' },
});
export const RgSegment = createReglowVueComponent<RgSegmentElement, RgSegmentProps>('rg-segment', {
  displayName: 'RgSegment',
  props: ['value', 'selected', 'disabled'],
  booleanProps: ['selected', 'disabled'],
});
export const RgProgressRing = createReglowVueComponent<RgProgressRingElement, RgProgressRingProps>(
  'rg-progress-ring',
  {
    displayName: 'RgProgressRing',
    props: ['value', 'max', 'label', 'size', 'showValue'],
    booleanProps: ['showValue'],
    numberProps: ['value', 'max'],
    attributes: { showValue: 'show-value' },
    properties: ['value'],
    propertyDefaults: { value: null },
  },
);
export const RgRating = createReglowVueComponent<RgRatingElement, RgRatingProps>('rg-rating', {
  displayName: 'RgRating',
  props: [
    'value',
    'max',
    'name',
    'label',
    'description',
    'error',
    'size',
    'required',
    'disabled',
    'readOnly',
    'invalid',
  ],
  events: {
    input: 'value-change',
    change: 'value-commit',
    'rg-value-change': 'rating-change',
  },
  booleanProps: ['required', 'disabled', 'readOnly', 'invalid'],
  numberProps: ['modelValue', 'value', 'max'],
  attributes: { readOnly: 'readonly' },
  model: { property: 'value', event: 'input' },
});
export const RgRelativeTime = createReglowVueComponent<RgRelativeTimeElement, RgRelativeTimeProps>(
  'rg-relative-time',
  {
    displayName: 'RgRelativeTime',
    props: ['date', 'locale', 'format', 'numeric', 'sync'],
    booleanProps: ['sync'],
    properties: ['date'],
    propertyDefaults: { date: '' },
  },
);

export const ReglowPlugin = createReglowPlugin({
  RgTheme,
  RgButton,
  RgIconButton,
  RgLink,
  RgInput,
  RgTextarea,
  RgSelect,
  RgOption,
  RgCheckbox,
  RgSwitch,
  RgRadioGroup,
  RgRadio,
  RgSlider,
  RgBadge,
  RgAvatar,
  RgCard,
  RgDivider,
  RgAlert,
  RgProgress,
  RgSpinner,
  RgSkeleton,
  RgToastRegion,
  RgToast,
  RgTabs,
  RgTab,
  RgTabPanel,
  RgAccordion,
  RgAccordionItem,
  RgDialog,
  RgDrawer,
  RgTooltip,
  RgButtonGroup,
  RgCombobox,
  RgDatePicker,
  RgKbd,
  RgFieldset,
  RgEmptyState,
  RgBreadcrumb,
  RgBreadcrumbItem,
  RgPagination,
  RgPopover,
  RgMenu,
  RgMenuItem,
  RgCopyButton,
  RgChipGroup,
  RgChip,
  RgSegmentedControl,
  RgSegment,
  RgProgressRing,
  RgRating,
  RgRelativeTime,
});

declare module 'vue' {
  export interface GlobalComponents {
    RgTheme: typeof RgTheme;
    RgButton: typeof RgButton;
    RgIconButton: typeof RgIconButton;
    RgLink: typeof RgLink;
    RgInput: typeof RgInput;
    RgTextarea: typeof RgTextarea;
    RgSelect: typeof RgSelect;
    RgOption: typeof RgOption;
    RgCheckbox: typeof RgCheckbox;
    RgSwitch: typeof RgSwitch;
    RgRadioGroup: typeof RgRadioGroup;
    RgRadio: typeof RgRadio;
    RgSlider: typeof RgSlider;
    RgBadge: typeof RgBadge;
    RgAvatar: typeof RgAvatar;
    RgCard: typeof RgCard;
    RgDivider: typeof RgDivider;
    RgAlert: typeof RgAlert;
    RgProgress: typeof RgProgress;
    RgSpinner: typeof RgSpinner;
    RgSkeleton: typeof RgSkeleton;
    RgToastRegion: typeof RgToastRegion;
    RgToast: typeof RgToast;
    RgTabs: typeof RgTabs;
    RgTab: typeof RgTab;
    RgTabPanel: typeof RgTabPanel;
    RgAccordion: typeof RgAccordion;
    RgAccordionItem: typeof RgAccordionItem;
    RgDialog: typeof RgDialog;
    RgDrawer: typeof RgDrawer;
    RgTooltip: typeof RgTooltip;
    RgButtonGroup: typeof RgButtonGroup;
    RgCombobox: typeof RgCombobox;
    RgDatePicker: typeof RgDatePicker;
    RgKbd: typeof RgKbd;
    RgFieldset: typeof RgFieldset;
    RgEmptyState: typeof RgEmptyState;
    RgBreadcrumb: typeof RgBreadcrumb;
    RgBreadcrumbItem: typeof RgBreadcrumbItem;
    RgPagination: typeof RgPagination;
    RgPopover: typeof RgPopover;
    RgMenu: typeof RgMenu;
    RgMenuItem: typeof RgMenuItem;
    RgCopyButton: typeof RgCopyButton;
    RgChipGroup: typeof RgChipGroup;
    RgChip: typeof RgChip;
    RgSegmentedControl: typeof RgSegmentedControl;
    RgSegment: typeof RgSegment;
    RgProgressRing: typeof RgProgressRing;
    RgRating: typeof RgRating;
    RgRelativeTime: typeof RgRelativeTime;
  }
}

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

export { createReglowVueComponent } from './factory.js';
