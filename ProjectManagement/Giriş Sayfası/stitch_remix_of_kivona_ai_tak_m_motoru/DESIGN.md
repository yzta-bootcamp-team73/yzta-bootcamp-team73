---
name: Luminous Enterprise
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#424656'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737687'
  outline-variant: '#c3c6d8'
  surface-tint: '#0052dd'
  primary: '#004ccd'
  on-primary: '#ffffff'
  primary-container: '#0f62fe'
  on-primary-container: '#f3f3ff'
  inverse-primary: '#b4c5ff'
  secondary: '#5e5d66'
  on-secondary: '#ffffff'
  secondary-container: '#e1dee9'
  on-secondary-container: '#62626a'
  tertiary: '#304db9'
  on-tertiary: '#ffffff'
  tertiary-container: '#4b67d3'
  on-tertiary-container: '#f3f3ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174c'
  on-primary-fixed-variant: '#003da9'
  secondary-fixed: '#e4e1eb'
  secondary-fixed-dim: '#c7c5cf'
  on-secondary-fixed: '#1b1b22'
  on-secondary-fixed-variant: '#46464e'
  tertiary-fixed: '#dde1ff'
  tertiary-fixed-dim: '#b8c4ff'
  on-tertiary-fixed: '#001453'
  on-tertiary-fixed-variant: '#1a3ca8'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system is engineered for a hackathon matching platform that bridges the gap between high-level corporate professionalism and the energetic, fast-paced world of tech startups. The visual language is "Luminous Enterprise"—a style characterized by clinical precision, high-key lighting, and a sense of infinite digital space.

The aesthetic prioritizes clarity and focus to reduce cognitive load during the high-stress environment of team formation and project submission. It utilizes a refined **Modern Corporate** approach with subtle hints of **Minimalism**. By leaning on pure white surfaces and purposeful "Electric Blue" accents, the UI evokes a feeling of reliability, innovation, and technical excellence.

## Colors
The palette is rooted in a high-contrast, light-first philosophy to ensure maximum readability and a clean "engineering" atmosphere.

- **Primary (#0F62FE):** An authoritative Electric Blue used for primary actions, active states, and brand-critical elements.
- **Secondary (#6F6E77):** A neutral slate gray for supporting text and non-essential icons.
- **Surface & Background:** The UI utilizes a tiered white system. Pure `#FFFFFF` is reserved for elevated cards and inputs, while `#F8FAFC` provides a soft, structural background for the application canvas.
- **Borders (#E2E8F0):** Soft, low-contrast gray borders define boundaries without fracturing the visual flow of the page.

## Typography
This design system employs **IBM Plex Sans** exclusively to maintain a cohesive, systematic, and developer-friendly appearance. It is a typeface that balances humanistic curves with industrial rectangularity.

- **Headlines:** Use Medium (500) or SemiBold (600) weights. Tighter letter-spacing is applied to larger sizes to maintain a compact, "designed" feel.
- **Body:** Regular (400) weight is standard for all long-form text to ensure comfort.
- **Labels:** Used for metadata, tags, and small captions. These often utilize a slightly heavier weight (500-600) to remain legible at smaller scales.

## Layout & Spacing
The layout follows a strict 8px grid system to ensure mathematical harmony across all components.

- **Grid:** A 12-column fluid grid for desktop with 24px gutters. On mobile, this collapses to a 4-column grid with 16px margins.
- **Spacing Rhythm:** Content blocks are typically separated by `lg` (48px) units, while internal component elements use `xs` to `sm` (4px-12px).
- **Container:** Max-width for desktop content is capped at 1280px to prevent excessive line lengths and maintain focus.

## Elevation & Depth
Depth is signaled through a combination of tonal layering and soft, ambient shadows. In this light-themed system, shadows are never pure black; they are tinted with the primary blue or neutral slate to feel integrated with the "Luminous" theme.

- **Level 0 (Base):** `#F8FAFC` background.
- **Level 1 (Cards):** `#FFFFFF` surface with a 1px border of `#E2E8F0`. No shadow.
- **Level 2 (Interactive):** Surfaces that gain focus or hover states receive a subtle shadow: `0px 4px 12px rgba(15, 98, 254, 0.08)`.
- **Level 3 (Overlay):** Modals and dropdowns use a more pronounced shadow: `0px 12px 32px rgba(0, 0, 0, 0.05)`.

## Shapes
The shape language is "Soft-Tech." It avoids the extreme playfulness of fully rounded pills while shunning the harshness of sharp corners.

- **Standard (8px):** Buttons, input fields, and small cards.
- **Large (16px):** Main content containers and featured sections.
- **XL (24px):** Used sparingly for unique decorative elements or large hero callouts.

## Components

- **Buttons:** Primary buttons use the Electric Blue background with white text. They should have a subtle 1px inset top border for a "tactile" but flat look. Secondary buttons use a transparent background with a 1px `#E2E8F0` border.
- **Inputs:** Fields must use the white surface. On focus, the border transitions from gray to the primary Electric Blue with a 2px outer "halo" of 10% opacity blue.
- **Chips/Tags:** Used for "Coding Languages" or "Hackathon Themes." These should have a light background (`rgba(15, 98, 254, 0.05)`) and Primary Blue text for high contrast without the weight of a solid block.
- **Cards:** White backgrounds, 1px border, and 12px corner radius. Grouping of information within cards should rely on the `label-sm` typography for headers.
- **Lists:** Clean rows separated by 1px `#E2E8F0` dividers. Interactive list items should have a hover state of `#F8FAFC`.
- **Matching Indicators:** Custom component—a progress ring or "Match %" badge using the primary color to indicate synergy between participants.