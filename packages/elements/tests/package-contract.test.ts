import { describe, expect, expectTypeOf, it } from 'vitest';
import customElementsManifest from '../custom-elements.json';
import * as publicApi from '../src/index.js';
import type {
  AccordionItemOpenChangeDetail,
  AccordionValueChangeDetail,
  AlertDismissDetail,
  AlertTone,
  AlertVariant,
  ComponentEventMetadata,
  ComponentMetadata,
  DialogBeforeCloseDetail,
  DialogCloseDetail,
  DialogCloseReason,
  DialogDismissAction,
  DialogOpenChangeDetail,
  DialogSize,
  DrawerPlacement,
  ReglowElementConstructor,
  ReglowElementDefinition,
  ReglowElementTagName,
  ReglowHTMLElementTagNameMap,
  RgAvatarErrorDetail,
  RgAvatarLoadDetail,
  RgAvatarLoading,
  RgAvatarShape,
  RgAvatarSize,
  RgAvatarStatus,
  RgBadgeRemoveDetail,
  RgBadgeSize,
  RgBadgeTone,
  RgBadgeVariant,
  RgButtonSize,
  RgButtonTone,
  RgButtonType,
  RgButtonVariant,
  RgCardPadding,
  RgCardRadius,
  RgCardVariant,
  RgDividerOrientation,
  RgDividerSpacing,
  RgDividerVariant,
  RgInputSize,
  RgInputType,
  RgLinkSize,
  RgLinkTone,
  RgLinkVariant,
  RgNavigateDetail,
  RgPressDetail,
  RgRadioOrientation,
  RgResolvedThemeMode,
  RgResolvedThemeMotion,
  RgSelectOption,
  RgSelectSize,
  RgSliderOrientation,
  RgSliderSize,
  RgTextareaResize,
  RgTextareaSize,
  RgThemeChangeDetail,
  RgThemeDensity,
  RgThemeMode,
  RgThemeMotion,
  SkeletonShape,
  TabsActivation,
  TabsOrientation,
  TabsValueChangeDetail,
  ToastCloseReason,
  ToastDismissDetail,
  ToastOpenChangeDetail,
  ToastOptions,
  ToastPosition,
  ToastTone,
  TooltipOpenChangeDetail,
  TooltipOpenReason,
  TooltipPlacement,
} from '../src/index.js';

type PublicTypeContract = readonly [
  ReglowElementConstructor,
  ReglowElementDefinition,
  ReglowElementTagName,
  ReglowHTMLElementTagNameMap,
  ComponentEventMetadata,
  ComponentMetadata,
  AccordionItemOpenChangeDetail,
  AccordionValueChangeDetail,
  AlertDismissDetail,
  AlertTone,
  AlertVariant,
  DialogBeforeCloseDetail,
  DialogCloseDetail,
  DialogCloseReason,
  DialogDismissAction,
  DialogOpenChangeDetail,
  DialogSize,
  DrawerPlacement,
  RgAvatarErrorDetail,
  RgAvatarLoadDetail,
  RgAvatarLoading,
  RgAvatarShape,
  RgAvatarSize,
  RgAvatarStatus,
  RgBadgeRemoveDetail,
  RgBadgeSize,
  RgBadgeTone,
  RgBadgeVariant,
  RgButtonSize,
  RgButtonTone,
  RgButtonType,
  RgButtonVariant,
  RgCardPadding,
  RgCardRadius,
  RgCardVariant,
  RgDividerOrientation,
  RgDividerSpacing,
  RgDividerVariant,
  RgInputSize,
  RgInputType,
  RgLinkSize,
  RgLinkTone,
  RgLinkVariant,
  RgNavigateDetail,
  RgPressDetail,
  RgRadioOrientation,
  RgResolvedThemeMode,
  RgResolvedThemeMotion,
  RgSelectOption,
  RgSelectSize,
  RgSliderOrientation,
  RgSliderSize,
  RgTextareaResize,
  RgTextareaSize,
  RgThemeChangeDetail,
  RgThemeDensity,
  RgThemeMode,
  RgThemeMotion,
  SkeletonShape,
  TabsActivation,
  TabsOrientation,
  TabsValueChangeDetail,
  ToastCloseReason,
  ToastDismissDetail,
  ToastOpenChangeDetail,
  ToastOptions,
  ToastPosition,
  ToastTone,
  TooltipOpenChangeDetail,
  TooltipOpenReason,
  TooltipPlacement,
];

describe('published package contract', () => {
  it('exports every registered class from the package root', () => {
    for (const metadata of publicApi.componentMetadata) {
      const definition = publicApi.reglowElementDefinitions.find(
        ({ tagName }) => tagName === metadata.tag,
      );
      expect(definition?.constructor).toBe(publicApi[metadata.className]);
    }
  });

  it('ships a CEM declaration and registration export for every element', () => {
    expect(customElementsManifest.schemaVersion).toBe('2.1.0');
    const declarationModule = customElementsManifest.modules.find(
      ({ path }) => path === 'dist/index.js',
    );
    const registrationModule = customElementsManifest.modules.find(
      ({ path }) => path === 'dist/register.js',
    );

    expect(declarationModule?.declarations?.map(({ tagName }) => tagName)).toEqual(
      publicApi.componentMetadata.map(({ tag }) => tag),
    );
    expect(registrationModule?.exports?.map(({ name }) => name)).toEqual(
      publicApi.componentMetadata.map(({ tag }) => tag),
    );
  });

  it('augments document.createElement with concrete Reglow element types', () => {
    expectTypeOf(document.createElement('rg-button')).toEqualTypeOf<publicApi.RgButtonElement>();
    expectTypeOf(document.createElement('rg-input')).toEqualTypeOf<publicApi.RgInputElement>();
    expectTypeOf(document.createElement('rg-dialog')).toEqualTypeOf<publicApi.RgDialogElement>();
    expectTypeOf<PublicTypeContract>().toMatchTypeOf<readonly unknown[]>();
  });
});
