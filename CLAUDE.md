# Coach4U Project Instructions

## UI Design Rules

Follow these rules when building any user-facing interface for Coach4U.

### Visual Style
- Use a clean, modern, and professional aesthetic — think calm and trustworthy
- Primary color: deep teal (#0D6E6E). Accent color: warm gold (#D4A843). Neutral: slate gray (#4A5568)
- Background should be light (white or off-white #F7F7F7) with generous whitespace
- Use rounded corners (border-radius: 8px) on cards, buttons, and inputs
- Subtle box shadows for elevation (e.g. `0 2px 8px rgba(0,0,0,0.08)`)

### Typography
- Use a sans-serif font stack: Inter, system-ui, sans-serif
- Base font size: 16px. Line height: 1.5
- Headings should be semi-bold (600), body text regular (400)
- Limit to 2-3 font sizes per page to maintain hierarchy without clutter

### Layout
- Mobile-first responsive design — all layouts must work on 320px and up
- Use CSS Grid or Flexbox for layout — no floats or tables for positioning
- Max content width: 1200px, centered with auto margins
- Consistent spacing scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px

### Components
- Buttons: solid fill for primary actions, outline for secondary, text-only for tertiary
- Forms: clear labels above inputs, visible focus states, inline validation messages
- Cards: use for grouping related content (sessions, clients, plans)
- Navigation: sticky top nav on desktop, bottom tab bar on mobile

### Accessibility
- Minimum contrast ratio: 4.5:1 for text, 3:1 for large text and UI elements
- All interactive elements must be keyboard-navigable with visible focus indicators
- Use semantic HTML elements (nav, main, section, button) — not div for everything
- Include alt text on images, aria-labels on icon-only buttons

### UX Principles
- Prioritize clarity over cleverness — coaching clients range in tech comfort
- Show loading states and confirmations for all async actions
- Destructive actions (cancel session, delete account) require confirmation dialogs
- Empty states should include helpful guidance, not just "No data"
