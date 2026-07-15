# Reglow v1 plan

## Product direction

Reglow should feel like a tactile tool: calm at rest, unmistakably responsive during action. The
visual language uses warm neutral surfaces, selective cobalt and coral accents, rounded controls,
and a consistent compress-and-rebound interaction. Motion reinforces hierarchy and state changes;
it is not ambient decoration.

## v1 delivery phases

1. **Platform contract**
   - pnpm workspace with tokens, elements, React, and Vue packages
   - SSR-safe module imports and explicit, idempotent Custom Element registration
   - attribute/property, event, slot, part, and theme contracts
2. **Foundations**
   - semantic light, dark, and system tokens
   - reduced-motion behavior, focus treatment, radii, elevation, and typography
   - shared Custom Element and form-associated base classes
3. **Component core**
   - actions, form controls, display surfaces, feedback, disclosure, and native overlays
   - keyboard behavior, focus restoration, form participation, and composed events
4. **Official adapters**
   - React 19 typed refs, named slots, and idiomatic event props
   - Vue 3 named slots, emits, global plugin, and `v-model`
5. **Documentation**
   - canonical Web Components Storybook
   - token, theme, variants, sizes, states, composition, dark, RTL, and reduced-motion examples
   - HTML, React, and Vue usage guidance
6. **Release gates**
   - TypeScript declarations for every package
   - unit and adapter tests
   - production package builds with no unexpected runtime imports
   - static Storybook build and browser-level visual/accessibility review

## v1 support policy

- Core: current evergreen Chromium, Firefox, and Safari
- Official adapters: React 19+, Vue 3.3+
- Direct integration: vanilla HTML, Svelte, Angular, Solid, Astro, and other Custom Element hosts
- Accessibility target: native semantics first, visible focus, WCAG AA color contrast, full keyboard
  use, composed accessible events, and reduced motion

## Deliberate follow-ups

- Declarative Shadow DOM server renderer and hydration-preserving SSR helpers
- Data Grid, Tree View, and File Upload as domain packages rather than core primitives
- Multiselect after token focus, listbox multi-selection, and form serialization contracts are designed
- Color Picker, Carousel, Split Panel, and calendar/time controls after their pointer, localization,
  and advanced accessibility behaviors have dedicated interaction specifications
- Optional adapter generation from the public Custom Elements Manifest
