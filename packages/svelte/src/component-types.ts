import type * as AccordionTypes from '@reglow/elements/components/accordion';
import type * as AccordionItemTypes from '@reglow/elements/components/accordion';
import type * as AlertTypes from '@reglow/elements/components/alert';
import type * as AvatarTypes from '@reglow/elements/components/avatar';
import type * as AvatarGroupTypes from '@reglow/elements/components/avatar-group';
import type * as BadgeTypes from '@reglow/elements/components/badge';
import type * as BreadcrumbTypes from '@reglow/elements/components/breadcrumb';
import type * as BreadcrumbItemTypes from '@reglow/elements/components/breadcrumb';
import type * as ButtonTypes from '@reglow/elements/components/button';
import type * as ButtonGroupTypes from '@reglow/elements/components/button-group';
import type * as CardTypes from '@reglow/elements/components/card';
import type * as CheckboxTypes from '@reglow/elements/components/checkbox';
import type * as ChipTypes from '@reglow/elements/components/chip';
import type * as ChipGroupTypes from '@reglow/elements/components/chip';
import type * as ComboboxTypes from '@reglow/elements/components/combobox';
import type * as CopyButtonTypes from '@reglow/elements/components/copy-button';
import type * as DatePickerTypes from '@reglow/elements/components/date-picker';
import type * as DateTimePickerTypes from '@reglow/elements/components/date-time-picker';
import type * as DialogTypes from '@reglow/elements/components/dialog';
import type * as DividerTypes from '@reglow/elements/components/divider';
import type * as DrawerTypes from '@reglow/elements/components/dialog';
import type * as EmptyStateTypes from '@reglow/elements/components/empty-state';
import type * as FieldsetTypes from '@reglow/elements/components/fieldset';
import type * as FormatBytesTypes from '@reglow/elements/components/format-bytes';
import type * as FormatDateTypes from '@reglow/elements/components/format-date';
import type * as FormatNumberTypes from '@reglow/elements/components/format-number';
import type * as IconButtonTypes from '@reglow/elements/components/button';
import type * as InputTypes from '@reglow/elements/components/input';
import type * as KbdTypes from '@reglow/elements/components/kbd';
import type * as LinkTypes from '@reglow/elements/components/link';
import type * as MenuTypes from '@reglow/elements/components/menu';
import type * as MenuItemTypes from '@reglow/elements/components/menu';
import type * as MeterTypes from '@reglow/elements/components/meter';
import type * as OptionTypes from '@reglow/elements/components/select';
import type * as PaginationTypes from '@reglow/elements/components/pagination';
import type * as PopoverTypes from '@reglow/elements/components/popover';
import type * as ProgressTypes from '@reglow/elements/components/progress';
import type * as ProgressRingTypes from '@reglow/elements/components/progress-ring';
import type * as RadioTypes from '@reglow/elements/components/radio';
import type * as RadioGroupTypes from '@reglow/elements/components/radio';
import type * as RatingTypes from '@reglow/elements/components/rating';
import type * as RelativeTimeTypes from '@reglow/elements/components/relative-time';
import type * as SegmentTypes from '@reglow/elements/components/segmented-control';
import type * as SegmentedControlTypes from '@reglow/elements/components/segmented-control';
import type * as SelectTypes from '@reglow/elements/components/select';
import type * as SkeletonTypes from '@reglow/elements/components/skeleton';
import type * as SliderTypes from '@reglow/elements/components/slider';
import type * as SpinnerTypes from '@reglow/elements/components/progress';
import type * as StepTypes from '@reglow/elements/components/step-indicator';
import type * as StepIndicatorTypes from '@reglow/elements/components/step-indicator';
import type * as SwitchTypes from '@reglow/elements/components/switch';
import type * as TabTypes from '@reglow/elements/components/tabs';
import type * as TabPanelTypes from '@reglow/elements/components/tabs';
import type * as TabsTypes from '@reglow/elements/components/tabs';
import type * as TextareaTypes from '@reglow/elements/components/textarea';
import type * as ThemeTypes from '@reglow/elements/components/theme';
import type * as TimePickerTypes from '@reglow/elements/components/time-picker';
import type * as TimelineTypes from '@reglow/elements/components/timeline';
import type * as TimelineItemTypes from '@reglow/elements/components/timeline';
import type * as ToastTypes from '@reglow/elements/components/toast';
import type * as ToastRegionTypes from '@reglow/elements/components/toast';
import type * as TooltipTypes from '@reglow/elements/components/tooltip';
import type {
  ReglowAttributeValue,
  ReglowSlotContent,
  ReglowSvelteEventHandler,
  ReglowSvelteProps,
} from './types.js';

export type RgAccordionProps = ReglowSvelteProps<
  AccordionTypes.RgAccordionElement,
  {
    onValueChange?: ReglowSvelteEventHandler<
      AccordionTypes.RgAccordionElement,
      CustomEvent<AccordionTypes.AccordionValueChangeDetail>
    >;
  },
  {},
  {
    multiple?: ReglowAttributeValue;
    collapsible?: ReglowAttributeValue;
  }
>;

export type RgAccordionItemProps = ReglowSvelteProps<
  AccordionItemTypes.RgAccordionItemElement,
  {
    onOpenChange?: ReglowSvelteEventHandler<
      AccordionItemTypes.RgAccordionItemElement,
      CustomEvent<AccordionItemTypes.AccordionItemOpenChangeDetail>
    >;
  },
  {
    heading?: ReglowSlotContent;
  },
  {
    value?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
    headingLevel?: ReglowAttributeValue;
  }
>;

export type RgAlertProps = ReglowSvelteProps<
  AlertTypes.RgAlertElement,
  {
    onDismiss?: ReglowSvelteEventHandler<
      AlertTypes.RgAlertElement,
      CustomEvent<AlertTypes.AlertDismissDetail>
    >;
  },
  {
    icon?: ReglowSlotContent;
    title?: ReglowSlotContent;
    actions?: ReglowSlotContent;
  },
  {
    tone?: ReglowAttributeValue;
    variant?: ReglowAttributeValue;
    dismissible?: ReglowAttributeValue;
    dismissLabel?: ReglowAttributeValue;
  }
>;

export type RgAvatarProps = ReglowSvelteProps<
  AvatarTypes.RgAvatarElement,
  {
    onLoad?: ReglowSvelteEventHandler<
      AvatarTypes.RgAvatarElement,
      CustomEvent<AvatarTypes.RgAvatarLoadDetail>
    >;
    onError?: ReglowSvelteEventHandler<
      AvatarTypes.RgAvatarElement,
      CustomEvent<AvatarTypes.RgAvatarErrorDetail>
    >;
  },
  {
    fallback?: ReglowSlotContent;
    statusContent?: ReglowSlotContent;
  },
  {
    alt?: ReglowAttributeValue;
    crossOrigin?: ReglowAttributeValue;
    decoding?: ReglowAttributeValue;
    initials?: ReglowAttributeValue;
    loading?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    referrerPolicy?: ReglowAttributeValue;
    shape?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
    sizes?: ReglowAttributeValue;
    src?: ReglowAttributeValue;
    srcSet?: ReglowAttributeValue;
    status?: ReglowAttributeValue;
    statusLabel?: ReglowAttributeValue;
  }
>;

export type RgAvatarGroupProps = ReglowSvelteProps<
  AvatarGroupTypes.RgAvatarGroupElement,
  {},
  {},
  {
    label?: ReglowAttributeValue;
    max?: ReglowAttributeValue;
    moreLabel?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
  }
>;

export type RgBadgeProps = ReglowSvelteProps<
  BadgeTypes.RgBadgeElement,
  {
    onRemove?: ReglowSvelteEventHandler<
      BadgeTypes.RgBadgeElement,
      CustomEvent<BadgeTypes.RgBadgeRemoveDetail>
    >;
  },
  {
    start?: ReglowSlotContent;
    end?: ReglowSlotContent;
  },
  {
    tone?: ReglowAttributeValue;
    variant?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
    dot?: ReglowAttributeValue;
    removable?: ReglowAttributeValue;
    removeLabel?: ReglowAttributeValue;
  }
>;

export type RgBreadcrumbProps = ReglowSvelteProps<
  BreadcrumbTypes.RgBreadcrumbElement,
  {},
  {},
  {
    label?: ReglowAttributeValue;
  }
>;

export type RgBreadcrumbItemProps = ReglowSvelteProps<
  BreadcrumbItemTypes.RgBreadcrumbItemElement,
  {},
  {},
  {
    current?: ReglowAttributeValue;
    href?: ReglowAttributeValue;
    target?: ReglowAttributeValue;
    rel?: ReglowAttributeValue;
  }
>;

export type RgButtonProps = ReglowSvelteProps<
  ButtonTypes.RgButtonElement,
  {
    onPress?: ReglowSvelteEventHandler<
      ButtonTypes.RgButtonElement,
      CustomEvent<ButtonTypes.RgPressDetail>
    >;
  },
  {
    start?: ReglowSlotContent;
    end?: ReglowSlotContent;
  },
  {
    'aria-describedby'?: ReglowAttributeValue;
    'aria-label'?: ReglowAttributeValue;
    'aria-labelledby'?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
    fullWidth?: ReglowAttributeValue;
    formNoValidate?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    loading?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    pressed?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
    title?: ReglowAttributeValue;
    tone?: ReglowAttributeValue;
    type?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
    variant?: ReglowAttributeValue;
  }
>;

export type RgButtonGroupProps = ReglowSvelteProps<
  ButtonGroupTypes.RgButtonGroupElement,
  {},
  {},
  {
    attached?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    orientation?: ReglowAttributeValue;
  }
>;

export type RgCardProps = ReglowSvelteProps<
  CardTypes.RgCardElement,
  {},
  {
    media?: ReglowSlotContent;
    header?: ReglowSlotContent;
    footer?: ReglowSlotContent;
  },
  {
    'aria-describedby'?: ReglowAttributeValue;
    'aria-label'?: ReglowAttributeValue;
    'aria-labelledby'?: ReglowAttributeValue;
    variant?: ReglowAttributeValue;
    padding?: ReglowAttributeValue;
    radius?: ReglowAttributeValue;
    lift?: ReglowAttributeValue;
  }
>;

export type RgCheckboxProps = ReglowSvelteProps<
  CheckboxTypes.RgCheckboxElement,
  {
    onValueChange?: ReglowSvelteEventHandler<CheckboxTypes.RgCheckboxElement, Event>;
    onValueCommit?: ReglowSvelteEventHandler<CheckboxTypes.RgCheckboxElement, Event>;
  },
  {
    label?: ReglowSlotContent;
    description?: ReglowSlotContent;
    error?: ReglowSlotContent;
  },
  {
    disabled?: ReglowAttributeValue;
    indeterminate?: ReglowAttributeValue;
    invalid?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    required?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
  }
>;

export type RgChipProps = ReglowSvelteProps<
  ChipTypes.RgChipElement,
  {
    onRemove?: ReglowSvelteEventHandler<
      ChipTypes.RgChipElement,
      CustomEvent<ChipTypes.RgChipRemoveDetail>
    >;
  },
  {
    start?: ReglowSlotContent;
    end?: ReglowSlotContent;
  },
  {
    'aria-label'?: ReglowAttributeValue;
    'aria-labelledby'?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
    removable?: ReglowAttributeValue;
    removeLabel?: ReglowAttributeValue;
    selected?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
  }
>;

export type RgChipGroupProps = ReglowSvelteProps<
  ChipGroupTypes.RgChipGroupElement,
  {
    onValueChange?: ReglowSvelteEventHandler<ChipGroupTypes.RgChipGroupElement, Event>;
    onValueCommit?: ReglowSvelteEventHandler<ChipGroupTypes.RgChipGroupElement, Event>;
    onSelectionChange?: ReglowSvelteEventHandler<
      ChipGroupTypes.RgChipGroupElement,
      CustomEvent<ChipGroupTypes.RgChipValueChangeDetail>
    >;
  },
  {},
  {
    disabled?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    required?: ReglowAttributeValue;
    selection?: ReglowAttributeValue;
  }
>;

export type RgComboboxProps = ReglowSvelteProps<
  ComboboxTypes.RgComboboxElement,
  {
    onValueChange?: ReglowSvelteEventHandler<ComboboxTypes.RgComboboxElement, Event>;
    onValueCommit?: ReglowSvelteEventHandler<ComboboxTypes.RgComboboxElement, Event>;
    onBeforeOpen?: ReglowSvelteEventHandler<
      ComboboxTypes.RgComboboxElement,
      CustomEvent<ComboboxTypes.RgComboboxOpenChangeDetail>
    >;
    onBeforeClose?: ReglowSvelteEventHandler<
      ComboboxTypes.RgComboboxElement,
      CustomEvent<ComboboxTypes.RgComboboxOpenChangeDetail>
    >;
    onOpenChange?: ReglowSvelteEventHandler<
      ComboboxTypes.RgComboboxElement,
      CustomEvent<ComboboxTypes.RgComboboxOpenChangeDetail>
    >;
    onSelectionChange?: ReglowSvelteEventHandler<
      ComboboxTypes.RgComboboxElement,
      CustomEvent<ComboboxTypes.RgComboboxValueChangeDetail>
    >;
  },
  {
    label?: ReglowSlotContent;
    description?: ReglowSlotContent;
    error?: ReglowSlotContent;
  },
  {
    disabled?: ReglowAttributeValue;
    filter?: ReglowAttributeValue;
    invalid?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    noResultsText?: ReglowAttributeValue;
    placeholder?: ReglowAttributeValue;
    readOnly?: ReglowAttributeValue;
    required?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
  }
>;

export type RgCopyButtonProps = ReglowSvelteProps<
  CopyButtonTypes.RgCopyButtonElement,
  {
    onCopy?: ReglowSvelteEventHandler<
      CopyButtonTypes.RgCopyButtonElement,
      CustomEvent<CopyButtonTypes.RgCopyDetail>
    >;
    onError?: ReglowSvelteEventHandler<
      CopyButtonTypes.RgCopyButtonElement,
      CustomEvent<CopyButtonTypes.RgCopyErrorDetail>
    >;
  },
  {
    copyIcon?: ReglowSlotContent;
    successIcon?: ReglowSlotContent;
    errorIcon?: ReglowSlotContent;
  },
  {
    copyLabel?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
    errorLabel?: ReglowAttributeValue;
    feedbackDuration?: ReglowAttributeValue;
    from?: ReglowAttributeValue;
    successLabel?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
  }
>;

export type RgDatePickerProps = ReglowSvelteProps<
  DatePickerTypes.RgDatePickerElement,
  {
    onValueChange?: ReglowSvelteEventHandler<DatePickerTypes.RgDatePickerElement, Event>;
    onValueCommit?: ReglowSvelteEventHandler<DatePickerTypes.RgDatePickerElement, Event>;
    onBeforeOpen?: ReglowSvelteEventHandler<
      DatePickerTypes.RgDatePickerElement,
      CustomEvent<DatePickerTypes.RgDatePickerOpenChangeDetail>
    >;
    onBeforeClose?: ReglowSvelteEventHandler<
      DatePickerTypes.RgDatePickerElement,
      CustomEvent<DatePickerTypes.RgDatePickerOpenChangeDetail>
    >;
    onOpenChange?: ReglowSvelteEventHandler<
      DatePickerTypes.RgDatePickerElement,
      CustomEvent<DatePickerTypes.RgDatePickerOpenChangeDetail>
    >;
  },
  {
    label?: ReglowSlotContent;
    description?: ReglowSlotContent;
    error?: ReglowSlotContent;
  },
  {
    dateFormat?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
    invalid?: ReglowAttributeValue;
    locale?: ReglowAttributeValue;
    max?: ReglowAttributeValue;
    min?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    overlayAlign?: ReglowAttributeValue;
    overlayWidth?: ReglowAttributeValue;
    picker?: ReglowAttributeValue;
    readOnly?: ReglowAttributeValue;
    required?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
    step?: ReglowAttributeValue;
  }
>;

export type RgDateTimePickerProps = ReglowSvelteProps<
  DateTimePickerTypes.RgDateTimePickerElement,
  {
    onValueChange?: ReglowSvelteEventHandler<DateTimePickerTypes.RgDateTimePickerElement, Event>;
    onValueCommit?: ReglowSvelteEventHandler<DateTimePickerTypes.RgDateTimePickerElement, Event>;
    onBeforeOpen?: ReglowSvelteEventHandler<
      DateTimePickerTypes.RgDateTimePickerElement,
      CustomEvent<DateTimePickerTypes.RgDateTimePickerOpenChangeDetail>
    >;
    onBeforeClose?: ReglowSvelteEventHandler<
      DateTimePickerTypes.RgDateTimePickerElement,
      CustomEvent<DateTimePickerTypes.RgDateTimePickerOpenChangeDetail>
    >;
    onOpenChange?: ReglowSvelteEventHandler<
      DateTimePickerTypes.RgDateTimePickerElement,
      CustomEvent<DateTimePickerTypes.RgDateTimePickerOpenChangeDetail>
    >;
  },
  {
    label?: ReglowSlotContent;
    description?: ReglowSlotContent;
    error?: ReglowSlotContent;
  },
  {
    dateFormat?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
    invalid?: ReglowAttributeValue;
    locale?: ReglowAttributeValue;
    max?: ReglowAttributeValue;
    min?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    overlayAlign?: ReglowAttributeValue;
    overlayWidth?: ReglowAttributeValue;
    readOnly?: ReglowAttributeValue;
    required?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
    step?: ReglowAttributeValue;
  }
>;

export type RgDialogProps = ReglowSvelteProps<
  DialogTypes.RgDialogElement,
  {
    onBeforeOpen?: ReglowSvelteEventHandler<
      DialogTypes.RgDialogElement,
      CustomEvent<DialogTypes.DialogBeforeOpenDetail>
    >;
    onBeforeClose?: ReglowSvelteEventHandler<
      DialogTypes.RgDialogElement,
      CustomEvent<DialogTypes.DialogBeforeCloseDetail>
    >;
    onOpenChange?: ReglowSvelteEventHandler<
      DialogTypes.RgDialogElement,
      CustomEvent<DialogTypes.DialogOpenChangeDetail>
    >;
    onClose?: ReglowSvelteEventHandler<
      DialogTypes.RgDialogElement,
      CustomEvent<DialogTypes.DialogCloseDetail>
    >;
  },
  {
    trigger?: ReglowSlotContent;
    title?: ReglowSlotContent;
    close?: ReglowSlotContent;
    footer?: ReglowSlotContent;
  },
  {
    size?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    escapeKeyAction?: ReglowAttributeValue;
    backdropAction?: ReglowAttributeValue;
    hideClose?: ReglowAttributeValue;
    closeLabel?: ReglowAttributeValue;
  }
>;

export type RgDividerProps = ReglowSvelteProps<
  DividerTypes.RgDividerElement,
  {},
  {},
  {
    'aria-label'?: ReglowAttributeValue;
    'aria-labelledby'?: ReglowAttributeValue;
    decorative?: ReglowAttributeValue;
    inset?: ReglowAttributeValue;
    orientation?: ReglowAttributeValue;
    spacing?: ReglowAttributeValue;
    variant?: ReglowAttributeValue;
  }
>;

export type RgDrawerProps = ReglowSvelteProps<
  DrawerTypes.RgDrawerElement,
  {
    onBeforeOpen?: ReglowSvelteEventHandler<
      DrawerTypes.RgDrawerElement,
      CustomEvent<DrawerTypes.DialogBeforeOpenDetail>
    >;
    onBeforeClose?: ReglowSvelteEventHandler<
      DrawerTypes.RgDrawerElement,
      CustomEvent<DrawerTypes.DialogBeforeCloseDetail>
    >;
    onOpenChange?: ReglowSvelteEventHandler<
      DrawerTypes.RgDrawerElement,
      CustomEvent<DrawerTypes.DialogOpenChangeDetail>
    >;
    onClose?: ReglowSvelteEventHandler<
      DrawerTypes.RgDrawerElement,
      CustomEvent<DrawerTypes.DialogCloseDetail>
    >;
  },
  {
    trigger?: ReglowSlotContent;
    title?: ReglowSlotContent;
    close?: ReglowSlotContent;
    footer?: ReglowSlotContent;
  },
  {
    size?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    escapeKeyAction?: ReglowAttributeValue;
    backdropAction?: ReglowAttributeValue;
    hideClose?: ReglowAttributeValue;
    closeLabel?: ReglowAttributeValue;
    placement?: ReglowAttributeValue;
  }
>;

export type RgEmptyStateProps = ReglowSvelteProps<
  EmptyStateTypes.RgEmptyStateElement,
  {},
  {
    icon?: ReglowSlotContent;
    title?: ReglowSlotContent;
    actions?: ReglowSlotContent;
  },
  {
    description?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
    tone?: ReglowAttributeValue;
  }
>;

export type RgFieldsetProps = ReglowSvelteProps<
  FieldsetTypes.RgFieldsetElement,
  {},
  {
    legend?: ReglowSlotContent;
    description?: ReglowSlotContent;
    error?: ReglowSlotContent;
  },
  {
    disabled?: ReglowAttributeValue;
    invalid?: ReglowAttributeValue;
  }
>;

export type RgFormatBytesProps = ReglowSvelteProps<
  FormatBytesTypes.RgFormatBytesElement,
  {},
  {},
  {
    display?: ReglowAttributeValue;
    lang?: ReglowAttributeValue;
    locale?: ReglowAttributeValue;
    unit?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
  }
>;

export type RgFormatDateProps = ReglowSvelteProps<
  FormatDateTypes.RgFormatDateElement,
  {},
  {},
  {
    date?: ReglowAttributeValue;
    day?: ReglowAttributeValue;
    era?: ReglowAttributeValue;
    hour?: ReglowAttributeValue;
    hourFormat?: ReglowAttributeValue;
    lang?: ReglowAttributeValue;
    locale?: ReglowAttributeValue;
    minute?: ReglowAttributeValue;
    month?: ReglowAttributeValue;
    second?: ReglowAttributeValue;
    timeZone?: ReglowAttributeValue;
    timeZoneName?: ReglowAttributeValue;
    weekday?: ReglowAttributeValue;
    year?: ReglowAttributeValue;
  }
>;

export type RgFormatNumberProps = ReglowSvelteProps<
  FormatNumberTypes.RgFormatNumberElement,
  {},
  {},
  {
    currency?: ReglowAttributeValue;
    currencyDisplay?: ReglowAttributeValue;
    lang?: ReglowAttributeValue;
    locale?: ReglowAttributeValue;
    maximumFractionDigits?: ReglowAttributeValue;
    maximumSignificantDigits?: ReglowAttributeValue;
    minimumFractionDigits?: ReglowAttributeValue;
    minimumIntegerDigits?: ReglowAttributeValue;
    minimumSignificantDigits?: ReglowAttributeValue;
    type?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
    withoutGrouping?: ReglowAttributeValue;
  }
>;

export type RgIconButtonProps = ReglowSvelteProps<
  IconButtonTypes.RgIconButtonElement,
  {
    onPress?: ReglowSvelteEventHandler<
      IconButtonTypes.RgIconButtonElement,
      CustomEvent<IconButtonTypes.RgPressDetail>
    >;
  },
  {
    start?: ReglowSlotContent;
    end?: ReglowSlotContent;
  },
  {
    'aria-describedby'?: ReglowAttributeValue;
    'aria-label'?: ReglowAttributeValue;
    'aria-labelledby'?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
    fullWidth?: ReglowAttributeValue;
    formNoValidate?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    loading?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    pressed?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
    title?: ReglowAttributeValue;
    tone?: ReglowAttributeValue;
    type?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
    variant?: ReglowAttributeValue;
  }
>;

export type RgInputProps = ReglowSvelteProps<
  InputTypes.RgInputElement,
  {
    onValueChange?: ReglowSvelteEventHandler<InputTypes.RgInputElement, Event>;
    onValueCommit?: ReglowSvelteEventHandler<InputTypes.RgInputElement, Event>;
    onClear?: ReglowSvelteEventHandler<
      InputTypes.RgInputElement,
      CustomEvent<{ previousValue: string }>
    >;
  },
  {
    label?: ReglowSlotContent;
    start?: ReglowSlotContent;
    end?: ReglowSlotContent;
    description?: ReglowSlotContent;
    error?: ReglowSlotContent;
  },
  {
    autoComplete?: ReglowAttributeValue;
    clearable?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
    inputMode?: ReglowAttributeValue;
    invalid?: ReglowAttributeValue;
    max?: ReglowAttributeValue;
    maxLength?: ReglowAttributeValue;
    min?: ReglowAttributeValue;
    minLength?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    pattern?: ReglowAttributeValue;
    placeholder?: ReglowAttributeValue;
    readOnly?: ReglowAttributeValue;
    required?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
    step?: ReglowAttributeValue;
    type?: ReglowAttributeValue;
  }
>;

export type RgKbdProps = ReglowSvelteProps<
  KbdTypes.RgKbdElement,
  {},
  {},
  {
    keys?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    separator?: ReglowAttributeValue;
  }
>;

export type RgLinkProps = ReglowSvelteProps<
  LinkTypes.RgLinkElement,
  {
    onNavigate?: ReglowSvelteEventHandler<
      LinkTypes.RgLinkElement,
      CustomEvent<LinkTypes.RgNavigateDetail>
    >;
  },
  {
    start?: ReglowSlotContent;
    end?: ReglowSlotContent;
  },
  {
    'aria-current'?: ReglowAttributeValue;
    'aria-describedby'?: ReglowAttributeValue;
    'aria-label'?: ReglowAttributeValue;
    'aria-labelledby'?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
    download?: ReglowAttributeValue;
    external?: ReglowAttributeValue;
    href?: ReglowAttributeValue;
    hrefLang?: ReglowAttributeValue;
    referrerPolicy?: ReglowAttributeValue;
    rel?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
    target?: ReglowAttributeValue;
    title?: ReglowAttributeValue;
    tone?: ReglowAttributeValue;
    type?: ReglowAttributeValue;
    variant?: ReglowAttributeValue;
  }
>;

export type RgMenuProps = ReglowSvelteProps<
  MenuTypes.RgMenuElement,
  {
    onBeforeOpen?: ReglowSvelteEventHandler<
      MenuTypes.RgMenuElement,
      CustomEvent<MenuTypes.RgMenuOpenChangeDetail>
    >;
    onBeforeClose?: ReglowSvelteEventHandler<
      MenuTypes.RgMenuElement,
      CustomEvent<MenuTypes.RgMenuOpenChangeDetail>
    >;
    onOpenChange?: ReglowSvelteEventHandler<
      MenuTypes.RgMenuElement,
      CustomEvent<MenuTypes.RgMenuOpenChangeDetail>
    >;
    onSelect?: ReglowSvelteEventHandler<
      MenuTypes.RgMenuElement,
      CustomEvent<MenuTypes.RgMenuSelectDetail>
    >;
  },
  {
    trigger?: ReglowSlotContent;
  },
  {
    disabled?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    placement?: ReglowAttributeValue;
  }
>;

export type RgMenuItemProps = ReglowSvelteProps<
  MenuItemTypes.RgMenuItemElement,
  {},
  {
    start?: ReglowSlotContent;
    end?: ReglowSlotContent;
  },
  {
    disabled?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
  }
>;

export type RgMeterProps = ReglowSvelteProps<
  MeterTypes.RgMeterElement,
  {},
  {
    label?: ReglowSlotContent;
  },
  {
    'aria-label'?: ReglowAttributeValue;
    high?: ReglowAttributeValue;
    low?: ReglowAttributeValue;
    max?: ReglowAttributeValue;
    min?: ReglowAttributeValue;
    optimum?: ReglowAttributeValue;
    showValue?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
    tone?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
    valueText?: ReglowAttributeValue;
  }
>;

export type RgOptionProps = ReglowSvelteProps<
  OptionTypes.RgOptionElement,
  {},
  {},
  {
    value?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
    selected?: ReglowAttributeValue;
  }
>;

export type RgPaginationProps = ReglowSvelteProps<
  PaginationTypes.RgPaginationElement,
  {
    onPageChange?: ReglowSvelteEventHandler<
      PaginationTypes.RgPaginationElement,
      CustomEvent<PaginationTypes.PaginationPageChangeDetail>
    >;
  },
  {},
  {
    boundaryCount?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    nextLabel?: ReglowAttributeValue;
    pageCount?: ReglowAttributeValue;
    previousLabel?: ReglowAttributeValue;
    siblingCount?: ReglowAttributeValue;
  }
>;

export type RgPopoverProps = ReglowSvelteProps<
  PopoverTypes.RgPopoverElement,
  {
    onBeforeOpen?: ReglowSvelteEventHandler<
      PopoverTypes.RgPopoverElement,
      CustomEvent<PopoverTypes.RgPopoverOpenChangeDetail>
    >;
    onBeforeClose?: ReglowSvelteEventHandler<
      PopoverTypes.RgPopoverElement,
      CustomEvent<PopoverTypes.RgPopoverOpenChangeDetail>
    >;
    onOpenChange?: ReglowSvelteEventHandler<
      PopoverTypes.RgPopoverElement,
      CustomEvent<PopoverTypes.RgPopoverOpenChangeDetail>
    >;
  },
  {
    trigger?: ReglowSlotContent;
  },
  {
    disabled?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    matchTriggerWidth?: ReglowAttributeValue;
    placement?: ReglowAttributeValue;
  }
>;

export type RgProgressProps = ReglowSvelteProps<
  ProgressTypes.RgProgressElement,
  {},
  {
    label?: ReglowSlotContent;
  },
  {
    'aria-label'?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
    max?: ReglowAttributeValue;
  }
>;

export type RgProgressRingProps = ReglowSvelteProps<
  ProgressRingTypes.RgProgressRingElement,
  {},
  {},
  {
    'aria-label'?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    max?: ReglowAttributeValue;
    showValue?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
  }
>;

export type RgRadioProps = ReglowSvelteProps<
  RadioTypes.RgRadioElement,
  {
    onValueChange?: ReglowSvelteEventHandler<RadioTypes.RgRadioElement, Event>;
    onValueCommit?: ReglowSvelteEventHandler<RadioTypes.RgRadioElement, Event>;
  },
  {
    description?: ReglowSlotContent;
  },
  {
    value?: ReglowAttributeValue;
    checked?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
  }
>;

export type RgRadioGroupProps = ReglowSvelteProps<
  RadioGroupTypes.RgRadioGroupElement,
  {
    onValueChange?: ReglowSvelteEventHandler<RadioGroupTypes.RgRadioGroupElement, Event>;
    onValueCommit?: ReglowSvelteEventHandler<RadioGroupTypes.RgRadioGroupElement, Event>;
  },
  {
    label?: ReglowSlotContent;
    description?: ReglowSlotContent;
    error?: ReglowSlotContent;
  },
  {
    disabled?: ReglowAttributeValue;
    invalid?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    orientation?: ReglowAttributeValue;
    required?: ReglowAttributeValue;
  }
>;

export type RgRatingProps = ReglowSvelteProps<
  RatingTypes.RgRatingElement,
  {
    onValueChange?: ReglowSvelteEventHandler<RatingTypes.RgRatingElement, Event>;
    onValueCommit?: ReglowSvelteEventHandler<RatingTypes.RgRatingElement, Event>;
    onRatingChange?: ReglowSvelteEventHandler<
      RatingTypes.RgRatingElement,
      CustomEvent<RatingTypes.RgRatingValueChangeDetail>
    >;
  },
  {},
  {
    description?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
    error?: ReglowAttributeValue;
    invalid?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    max?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    readOnly?: ReglowAttributeValue;
    required?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
  }
>;

export type RgRelativeTimeProps = ReglowSvelteProps<
  RelativeTimeTypes.RgRelativeTimeElement,
  {},
  {},
  {
    date?: ReglowAttributeValue;
    format?: ReglowAttributeValue;
    lang?: ReglowAttributeValue;
    locale?: ReglowAttributeValue;
    numeric?: ReglowAttributeValue;
    sync?: ReglowAttributeValue;
  }
>;

export type RgSegmentProps = ReglowSvelteProps<
  SegmentTypes.RgSegmentElement,
  {},
  {},
  {
    disabled?: ReglowAttributeValue;
    selected?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
  }
>;

export type RgSegmentedControlProps = ReglowSvelteProps<
  SegmentedControlTypes.RgSegmentedControlElement,
  {
    onValueChange?: ReglowSvelteEventHandler<
      SegmentedControlTypes.RgSegmentedControlElement,
      Event
    >;
    onValueCommit?: ReglowSvelteEventHandler<
      SegmentedControlTypes.RgSegmentedControlElement,
      Event
    >;
    onSelectionChange?: ReglowSvelteEventHandler<
      SegmentedControlTypes.RgSegmentedControlElement,
      CustomEvent<SegmentedControlTypes.RgSegmentedValueChangeDetail>
    >;
  },
  {},
  {
    disabled?: ReglowAttributeValue;
    fullWidth?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    orientation?: ReglowAttributeValue;
    required?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
  }
>;

export type RgSelectProps = ReglowSvelteProps<
  SelectTypes.RgSelectElement,
  {
    onValueChange?: ReglowSvelteEventHandler<SelectTypes.RgSelectElement, Event>;
    onValueCommit?: ReglowSvelteEventHandler<SelectTypes.RgSelectElement, Event>;
  },
  {
    label?: ReglowSlotContent;
    description?: ReglowSlotContent;
    error?: ReglowSlotContent;
  },
  {
    disabled?: ReglowAttributeValue;
    invalid?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    placeholder?: ReglowAttributeValue;
    required?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
  }
>;

export type RgSkeletonProps = ReglowSvelteProps<
  SkeletonTypes.RgSkeletonElement,
  {},
  {},
  {
    shape?: ReglowAttributeValue;
    width?: ReglowAttributeValue;
    height?: ReglowAttributeValue;
    animated?: ReglowAttributeValue;
  }
>;

export type RgSliderProps = ReglowSvelteProps<
  SliderTypes.RgSliderElement,
  {
    onValueChange?: ReglowSvelteEventHandler<SliderTypes.RgSliderElement, Event>;
    onValueCommit?: ReglowSvelteEventHandler<SliderTypes.RgSliderElement, Event>;
  },
  {
    label?: ReglowSlotContent;
    description?: ReglowSlotContent;
    error?: ReglowSlotContent;
  },
  {
    disabled?: ReglowAttributeValue;
    invalid?: ReglowAttributeValue;
    max?: ReglowAttributeValue;
    min?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    orientation?: ReglowAttributeValue;
    required?: ReglowAttributeValue;
    showValue?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
    step?: ReglowAttributeValue;
  }
>;

export type RgSpinnerProps = ReglowSvelteProps<
  SpinnerTypes.RgSpinnerElement,
  {},
  {},
  {
    size?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
  }
>;

export type RgStepProps = ReglowSvelteProps<
  StepTypes.RgStepElement,
  {},
  {
    description?: ReglowSlotContent;
  },
  {
    label?: ReglowAttributeValue;
    optional?: ReglowAttributeValue;
    optionalLabel?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
  }
>;

export type RgStepIndicatorProps = ReglowSvelteProps<
  StepIndicatorTypes.RgStepIndicatorElement,
  {},
  {},
  {
    completeLabel?: ReglowAttributeValue;
    currentLabel?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    orientation?: ReglowAttributeValue;
    upcomingLabel?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
  }
>;

export type RgSwitchProps = ReglowSvelteProps<
  SwitchTypes.RgSwitchElement,
  {
    onValueChange?: ReglowSvelteEventHandler<SwitchTypes.RgSwitchElement, Event>;
    onValueCommit?: ReglowSvelteEventHandler<SwitchTypes.RgSwitchElement, Event>;
  },
  {
    label?: ReglowSlotContent;
    description?: ReglowSlotContent;
    error?: ReglowSlotContent;
  },
  {
    disabled?: ReglowAttributeValue;
    invalid?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    required?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
  }
>;

export type RgTabProps = ReglowSvelteProps<
  TabTypes.RgTabElement,
  {},
  {},
  {
    'aria-label'?: ReglowAttributeValue;
    'aria-labelledby'?: ReglowAttributeValue;
    value?: ReglowAttributeValue;
    selected?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
  }
>;

export type RgTabPanelProps = ReglowSvelteProps<
  TabPanelTypes.RgTabPanelElement,
  {},
  {},
  {
    value?: ReglowAttributeValue;
    active?: ReglowAttributeValue;
  }
>;

export type RgTabsProps = ReglowSvelteProps<
  TabsTypes.RgTabsElement,
  {
    onValueChange?: ReglowSvelteEventHandler<
      TabsTypes.RgTabsElement,
      CustomEvent<TabsTypes.TabsValueChangeDetail>
    >;
  },
  {
    tab?: ReglowSlotContent;
  },
  {
    orientation?: ReglowAttributeValue;
    activation?: ReglowAttributeValue;
    loop?: ReglowAttributeValue;
  }
>;

export type RgTextareaProps = ReglowSvelteProps<
  TextareaTypes.RgTextareaElement,
  {
    onValueChange?: ReglowSvelteEventHandler<TextareaTypes.RgTextareaElement, Event>;
    onValueCommit?: ReglowSvelteEventHandler<TextareaTypes.RgTextareaElement, Event>;
  },
  {
    label?: ReglowSlotContent;
    description?: ReglowSlotContent;
    error?: ReglowSlotContent;
  },
  {
    autoGrow?: ReglowAttributeValue;
    cols?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
    invalid?: ReglowAttributeValue;
    maxLength?: ReglowAttributeValue;
    minLength?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    placeholder?: ReglowAttributeValue;
    readOnly?: ReglowAttributeValue;
    required?: ReglowAttributeValue;
    resize?: ReglowAttributeValue;
    rows?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
  }
>;

export type RgThemeProps = ReglowSvelteProps<
  ThemeTypes.RgThemeElement,
  {
    onThemeChange?: ReglowSvelteEventHandler<
      ThemeTypes.RgThemeElement,
      CustomEvent<ThemeTypes.RgThemeChangeDetail>
    >;
  },
  {},
  {
    mode?: ReglowAttributeValue;
    density?: ReglowAttributeValue;
    motion?: ReglowAttributeValue;
  }
>;

export type RgTimePickerProps = ReglowSvelteProps<
  TimePickerTypes.RgTimePickerElement,
  {
    onValueChange?: ReglowSvelteEventHandler<TimePickerTypes.RgTimePickerElement, Event>;
    onValueCommit?: ReglowSvelteEventHandler<TimePickerTypes.RgTimePickerElement, Event>;
    onBeforeOpen?: ReglowSvelteEventHandler<
      TimePickerTypes.RgTimePickerElement,
      CustomEvent<TimePickerTypes.RgTimePickerOpenChangeDetail>
    >;
    onBeforeClose?: ReglowSvelteEventHandler<
      TimePickerTypes.RgTimePickerElement,
      CustomEvent<TimePickerTypes.RgTimePickerOpenChangeDetail>
    >;
    onOpenChange?: ReglowSvelteEventHandler<
      TimePickerTypes.RgTimePickerElement,
      CustomEvent<TimePickerTypes.RgTimePickerOpenChangeDetail>
    >;
  },
  {
    label?: ReglowSlotContent;
    description?: ReglowSlotContent;
    error?: ReglowSlotContent;
  },
  {
    disabled?: ReglowAttributeValue;
    invalid?: ReglowAttributeValue;
    max?: ReglowAttributeValue;
    min?: ReglowAttributeValue;
    name?: ReglowAttributeValue;
    overlayAlign?: ReglowAttributeValue;
    overlayWidth?: ReglowAttributeValue;
    readOnly?: ReglowAttributeValue;
    required?: ReglowAttributeValue;
    size?: ReglowAttributeValue;
    step?: ReglowAttributeValue;
  }
>;

export type RgTimelineProps = ReglowSvelteProps<
  TimelineTypes.RgTimelineElement,
  {},
  {},
  {
    label?: ReglowAttributeValue;
  }
>;

export type RgTimelineItemProps = ReglowSvelteProps<
  TimelineItemTypes.RgTimelineItemElement,
  {},
  {
    icon?: ReglowSlotContent;
    time?: ReglowSlotContent;
    description?: ReglowSlotContent;
  },
  {
    datetime?: ReglowAttributeValue;
    heading?: ReglowAttributeValue;
    timestamp?: ReglowAttributeValue;
    tone?: ReglowAttributeValue;
  }
>;

export type RgToastProps = ReglowSvelteProps<
  ToastTypes.RgToastElement,
  {
    onBeforeClose?: ReglowSvelteEventHandler<
      ToastTypes.RgToastElement,
      CustomEvent<ToastTypes.ToastOpenChangeDetail>
    >;
    onOpenChange?: ReglowSvelteEventHandler<
      ToastTypes.RgToastElement,
      CustomEvent<ToastTypes.ToastOpenChangeDetail>
    >;
    onDismiss?: ReglowSvelteEventHandler<
      ToastTypes.RgToastElement,
      CustomEvent<ToastTypes.ToastDismissDetail>
    >;
  },
  {
    icon?: ReglowSlotContent;
    title?: ReglowSlotContent;
    action?: ReglowSlotContent;
  },
  {
    tone?: ReglowAttributeValue;
    duration?: ReglowAttributeValue;
    dismissible?: ReglowAttributeValue;
    dismissLabel?: ReglowAttributeValue;
  }
>;

export type RgToastRegionProps = ReglowSvelteProps<
  ToastRegionTypes.RgToastRegionElement,
  {
    onToastAdd?: ReglowSvelteEventHandler<
      ToastRegionTypes.RgToastRegionElement,
      CustomEvent<{ id: string; toast: ToastRegionTypes.RgToastElement }>
    >;
  },
  {},
  {
    position?: ReglowAttributeValue;
    maxVisible?: ReglowAttributeValue;
    label?: ReglowAttributeValue;
    pauseOnHover?: ReglowAttributeValue;
  }
>;

export type RgTooltipProps = ReglowSvelteProps<
  TooltipTypes.RgTooltipElement,
  {
    onBeforeOpen?: ReglowSvelteEventHandler<
      TooltipTypes.RgTooltipElement,
      CustomEvent<TooltipTypes.TooltipOpenChangeDetail>
    >;
    onBeforeClose?: ReglowSvelteEventHandler<
      TooltipTypes.RgTooltipElement,
      CustomEvent<TooltipTypes.TooltipOpenChangeDetail>
    >;
    onOpenChange?: ReglowSvelteEventHandler<
      TooltipTypes.RgTooltipElement,
      CustomEvent<TooltipTypes.TooltipOpenChangeDetail>
    >;
  },
  {
    trigger?: ReglowSlotContent;
    richContent?: ReglowSlotContent;
  },
  {
    content?: ReglowAttributeValue;
    placement?: ReglowAttributeValue;
    delay?: ReglowAttributeValue;
    disabled?: ReglowAttributeValue;
  }
>;
