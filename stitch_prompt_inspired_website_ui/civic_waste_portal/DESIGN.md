---
name: Civic Waste Portal
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f493f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f7a6e'
  outline-variant: '#becabc'
  surface-tint: '#006d30'
  primary: '#00652c'
  on-primary: '#ffffff'
  primary-container: '#15803d'
  on-primary-container: '#d3ffd5'
  inverse-primary: '#79db8d'
  secondary: '#49607c'
  on-secondary: '#ffffff'
  secondary-container: '#c7dfff'
  on-secondary-container: '#4b637e'
  tertiary: '#00625a'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d73'
  on-tertiary-container: '#c5fff5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#95f8a7'
  primary-fixed-dim: '#79db8d'
  on-primary-fixed: '#00210a'
  on-primary-fixed-variant: '#005323'
  secondary-fixed: '#d1e4ff'
  secondary-fixed-dim: '#b0c9e8'
  on-secondary-fixed: '#011d35'
  on-secondary-fixed-variant: '#314863'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  civic-navy-dark: '#0A1B2C'
  civic-navy-subtle: '#F0F4F8'
  alert-amber: '#D97706'
  alert-amber-soft: '#FEF3C7'
  status-resolved: '#15803D'
  status-resolved-soft: '#DCFCE7'
  status-progress: '#0284C7'
  status-progress-soft: '#E0F2FE'
  status-critical: '#DC2626'
  status-critical-soft: '#FEE2E2'
  surface-card: '#FFFFFF'
  surface-canvas: '#F8FAFC'
  surface-border: '#E2E8F0'
  segregation-wet: '#16A34A'
  segregation-dry: '#2563EB'
  segregation-hazardous: '#EA580C'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
  stat-counter:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system serves as an institutional yet human-centric civic technology ecosystem. It establishes transparent communication between citizens, municipal sanitation workers, and urban governance administrators. The aesthetic combines **Corporate / Modern** civic dependability with **Minimalist** clarity, eliminating bureaucratic friction through high legibility, explicit state indicators, and reassuring visual feedback.

The system targets two distinct user archetypes:
1. **Citizens & Residents:** Fast, accessible touchpoints for lodging photographic complaints (overflowing bins, irregular pickup), scheduling specialized e-waste/bulk waste disposals, and learning waste segregation protocols.
2. **Administrative & Field Supervisors:** Real-time dashboards, ward-level heatmaps, fleet tracking, and ticket escalation pipelines.

The visual language communicates authority, accountability, hygiene, and civic optimism without feeling clinical or sterile. Interface elements avoid decorative clutter to prioritize operational clarity in both blazing outdoor light on mobile devices and multi-monitor municipal command centers.

## Colors

The palette establishes an authoritative civic framework anchored by `#15803D` (Eco-Green, signifying environmental health, sanitation, and verified resolution) and `#0F2942` (Deep Civic Navy, conveying state authority, structural integrity, and governance).

### Functional Color Roles
- **Primary (`#15803D`):** Primary action buttons, positive metric tickers, completed timeline steps, and verified resolution indicators.
- **Secondary (`#0F2942`):** Primary portal navigation bar, institutional headers, high-level administrative stats, and strong typography.
- **Tertiary (`#0D9488`):** Route optimization paths, scheduled pickup badges, active filter chips, and auxiliary data metrics.
- **Neutral (`#64748B`):** Structural borders, secondary text, metadata timestamps, and resting state indicators.

### Status & Civic Segregation Tints
- **Pending/Triage:** `alert-amber` (`#D97706`) with light pill background `alert-amber-soft` (`#FEF3C7`).
- **In-Progress/En Route:** `status-progress` (`#0284C7`) with light pill background `status-progress-soft` (`#E0F2FE`).
- **Resolved/Verified:** `status-resolved` (`#15803D`) with light pill background `status-resolved-soft` (`#DCFCE7`).
- **Critical/Overdue:** `status-critical` (`#DC2626`) with light pill background `status-critical-soft` (`#FEE2E2`).
- **Waste Stream Triad:** Dedicated semantic colors for waste segregation guides: Wet (`#16A34A`), Dry (`#2563EB`), and Hazardous/Sanitary (`#EA580C`).

## Typography

The typography strategy leverages **Plus Jakarta Sans** for headlines, large stats, and section anchors, providing a modern, approachable civic demeanor. **Inter** handles all body content, form labels, data tables, and dynamic tracking feeds, offering hyper-legibility even at dense operational scales.

- **Bilingual & Script Support:** Line-heights for titles and body styles accommodate bilingual rendering (English and Hindi/Devanagari script) with a minimum 1.45× text height ratio to prevent vowel-mark clipping.
- **Metric Figures:** Numerical reporting counters use `stat-counter` styling with tabular figure alignment (`font-variant-numeric: tabular-nums`) to avoid layout jumps during real-time dashboard updates.

## Layout & Spacing

The layout operates on a standard 8pt spatial grid with an adaptable structural configuration:

- **Desktop (1024px+):** 12-column responsive fluid grid with 32px (`margin`) outer boundaries and 20px (`gutter`) inner margins. Standard civic utility layout features a persistent 280px operational sidebar and dynamic main content viewport.
- **Tablet (768px - 1023px):** 8-column layout with 24px margins and 16px gutters. Administrative toolbars collapse into segmented dropdown rows.
- **Mobile (<768px):** 4-column layout with 16px (`margin-mobile`) side gutters. Navigation moves to a persistent bottom application bar for field reporting accessibility.
- **Vertical Rhythm:** Content cards maintain consistent internal padding of `space-md` (16px) on mobile and `space-lg` (24px) on desktop to preserve whitespace while sustaining data density.

## Elevation & Depth

To maintain high visual contrast in field conditions and high-speed portal scanning, this design system minimizes heavy dark shadows in favor of **Tonal Layers** accented by crisp, low-contrast structural outlines (`#E2E8F0`).

- **Level 0 (Base Canvas):** Tinted soft surface (`#F8FAFC`). No elevation or border.
- **Level 1 (Card & Module Containers):** White surface (`#FFFFFF`) with a 1px solid border in `#E2E8F0`. Layered with a subtle ambient shadow: `0 1px 3px rgba(15, 41, 66, 0.05)`.
- **Level 2 (Interactive Floating Elements, Dropdowns, Datepickers):** Pure white background, `1px solid #CBD5E1`, with shadow: `0 4px 12px rgba(15, 41, 66, 0.08)`.
- **Level 3 (Emergency Banners & Citizen Modals):** White background with `0 12px 32px rgba(15, 41, 66, 0.14)`, establishing strict focal isolation above dashboard feeds.

## Shapes

The design system employs a **Rounded** shape geometry (`roundedness: 2`), balancing institutional structure with approachable public convenience:

- **Input Fields & Action Buttons:** Configured with 8px (`0.5rem`) corner radiuses, giving a clean, dependable feel for routine form filing.
- **Cards, Panels & Modal Containers:** 16px (`1rem`) border radius, framing information sets into clear, digestable blocks.
- **Status Pills, Badges & Chips:** Completely rounded pill-shape (`9999px`) to distinguish categorical tags from interactive buttons.
- **Data Visualizations & Progress Bars:** 8px track curves for bar charts, vehicle fill capacities, and complaint step milestones.

## Components

### Buttons
- **Primary Civic Button:** Solid `#15803D` background, white label, 8px radius, 44px minimum height for field accessibility. Hover: `#166534`. Active state compresses slightly (`scale: 0.98`).
- **Secondary Action Button:** `#0F2942` solid or ghost outline (`1.5px solid #0F2942`), 8px radius.
- **File Complaint Floating Trigger:** Fixed mobile action trigger using primary emerald green with a bold camera/report icon and subtle elevation.

### Status Badges & Civic Tags
- Built using pill radiuses (`rounded-full`) with a 1px border matched to the tint:
  - **Pending:** Amber border and text (`#D97706`), background `#FEF3C7`.
  - **Assigned / In Progress:** Blue border and text (`#0284C7`), background `#E0F2FE`.
  - **Resolved / Cleaned:** Emerald border and text (`#15803D`), background `#DCFCE7`.
  - **Urgent / Hotspot:** Red border and text (`#DC2626`), background `#FEE2E2`.

### Complaint & Issue Cards
- Structured white surface container with 16px border-radius and 1px border `#E2E8F0`.
- Top row: Ticket ID (`#64748B`), Ward location badge, and Status Badge.
- Center section: Thumbnail of uploaded geotagged photo, issue title, and relative time (`2 hours ago`).
- Bottom row: Assigned sanitation vehicle/contractor and timeline progress bar.

### Metric KPI Tiles
- Crisp rectangular blocks featuring a prominent upper stat counter (e.g., "94.2%"), secondary label (`Resolved in 24h`), and an inline directional trend badge (e.g., "+3.4% this week").

### Input Fields & Upload Drops
- **Text & Geolocation Selectors:** 44px height, `#FFFFFF` fill, 1px `#CBD5E1` border, 8px radius. Focus states receive a clean 2px `#15803D` glow ring.
- **Civic Media Capture Box:** Dashed 2px `#94A3B8` border on a `#F8FAFC` background, featuring quick-action icon buttons for "Take Photo" and "Pin on Map".

### Waste Awareness Segregation Cards
- Visual 3-part card layout for Wet (Green), Dry (Blue), and Hazardous/Domestic (Orange) waste with iconography, dos and don'ts, and direct collection schedule tags.