# Atomic Commit Plan — `design_upgrade` Branch
> Line numbers reference **new-file (working-tree) lines** from `git diff HEAD` `@@` hunk headers.
> Multi-hunk files use `git add -p` to stage only the listed hunks.

---

## CLUSTER A — Brand Token Foundation (`styles/variables.scss`)

### A1 — `feat(tokens): replace color system with Copper-Rose brand palette (light + dark themes)`
| File | Lines (new) | Notes |
|---|---|---|
| `app/styles/variables.scss` | 1–190 (entire file) | Single hunk `@@ -1,262 +1,190 @@`; whole-file replacement → commit entirely |

---

## CLUSTER B — Root Layout (`app/root.tsx`)

Two separate `@@` hunks → 2 commits using `git add -p`.

### B1 — `feat(theme): add dynamic theme-color meta, semantic body tokens, and FOUC-prevention`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/root.tsx` | 96–124 | `@@ -96,22 +96,29 @@` — covers `useEffect` html background fix, `themeColor` const, `<html>` + `<body>` semantic classes, `<meta name="theme-color">` |

### B2 — `feat(theme): make Toaster theme-aware and apply glass-panel style`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/root.tsx` | 126–141 | `@@ -119,7 +126,16 @@` — Toaster `theme={theme}` + `toastOptions.className` |

---

## CLUSTER C — UnoCSS Config (`uno.config.ts`)

Single hunk — commit as one (transition-theme update and new shortcuts are adjacent lines).

### C1 — `feat(uno): extend transition-theme and add surface/glass/premium-button shortcuts`
| File | Lines (new) | Hunk |
|---|---|---|
| `uno.config.ts` | 116–133 | `@@ -116,9 +116,18 @@` — `transition-theme` update + `surface-0/1/2`, `glass-panel`, `glow-effect`, `premium-button`, `gradient-bg` shortcuts |

---

## CLUSTER D — Global Styles

### D1 — `feat(styles): update focus ring to Copper-Rose brand color`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/styles/index.scss` | 37–43 | `@@ -37,7 +37,7 @@` — `:focus-visible` outline from `#3b82f6` → `#E68D7B` |

### D2 — `feat(styles): add slideInRight and fadeIn keyframe animations`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/styles/animations.scss` | 60–86 | `@@ -60,3 +60,26 @@` — new `@keyframes slideInRight`, `@keyframes fadeIn`, utility classes |

### D3 — `refactor(styles): remove forced dark CodeMirror background overrides`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/styles/components/editor.scss` | 134–137 | `@@ -134,19 +134,4 @@` — deletes `!important` bg overrides on `.cm-editor`, `.cm-gutters`, `.cm-content`, `.cm-scroller` |

---

## CLUSTER E — Shared UI Primitives

### E1 — `feat(ui/button): update destructive variant to semantic danger tokens`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/ui/Button.tsx` | 8–14 | `@@ -8,7 +8,7 @@` |

### E2 — `feat(ui/checkbox): apply brand accent color to checked state`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/ui/Checkbox.tsx` | 14–23 | `@@ -14,10 +14,10 @@` |

### E3 — `feat(ui/switch): update active track to Copper-Rose brand color`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/ui/Switch.tsx` | 12–22 | `@@ -12,11 +12,11 @@` |

### E4 — `feat(ui/dialog): update dialog buttons and close button to brand tokens`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/ui/Dialog.tsx` | 24–33 | `@@ -24,10 +24,10 @@` — DialogButton secondary/danger classes |
| `app/components/ui/Dialog.tsx` | 102–108 | `@@ -102,7 +102,7 @@` — close button hover color |

### E5 — `chore(ui/update-banner): hide banner via early return while preserving all code`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/ui/UpdateBanner.tsx` | 8–17 | `@@ -8,6 +8,10 @@` — adds `return null` early exit + comment |

---

## CLUSTER F — Header

Four hunks in `Header.tsx` → 2 commits using `git add -p`.

### F1 — `feat(header): add logo SVG imports and theme-aware logo image`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/header/Header.tsx` | 1–18 | `@@ -1,11 +1,18 @@` — new imports (logo refs, themeStore) |

### F2 — `feat(header): apply glassmorphic bar, logo image, and brand CTA button`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/header/Header.tsx` | 25–40 | `@@ -18,16 +25,16 @@` — header bar outer container |
| `app/components/header/Header.tsx` | 42–55 | `@@ -35,18 +42,14 @@` — inner layout |
| `app/components/header/Header.tsx` | 60–84 | `@@ -57,14 +60,25 @@` — right-side actions and CTA |

### F3 — `feat(header): update active state of header icon buttons to brand color`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/header/HeaderActionButtons.client.tsx` | 73–79 | `@@ -73,7 +73,7 @@` |

---

## CLUSTER G — Sidebar

Eight hunks in `Menu.client.tsx` → 5 commits using `git add -p` at `@@` boundaries.

### G1 — `refactor(sidebar): remove ControlPanel, ThemeSwitch, SettingsButton and unused state`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/sidebar/Menu.client.tsx` | 1–8 | `@@ -1,14 +1,8 @@` — remove 6 import lines |
| `app/components/sidebar/Menu.client.tsx` | 13–19 | `@@ -19,6 +13,7 @@` — add `themeStore` import |
| `app/components/sidebar/Menu.client.tsx` | 70–77 | `@@ -75,8 +70,8 @@` — add `theme` store, remove `isSettingsOpen` state |
| `app/components/sidebar/Menu.client.tsx` | 309–314 | `@@ -314,15 +309,6 @@` — delete `handleSettingsClick/Close` handlers |

### G2 — `feat(sidebar): replace text logo with theme-aware SVG brand image`
| File | Lines (new) | Hunk (portion) |
|---|---|---|
| `app/components/sidebar/Menu.client.tsx` | 321–358 | `@@ -335,39 +321,38 @@` — logo `<img>` replacing "Devonz" text + ThemeSwitch |

### G3 — `feat(sidebar): enforce opaque bg and premium shadow on sidebar panel`
| File | Lines (new) | Hunk (portion) |
|---|---|---|
| `app/components/sidebar/Menu.client.tsx` | 321–358 | `@@ -335,39 +321,38 @@` — `style={{ backgroundColor }}` inline + `shadow-premium` class (same hunk as G2; stage together) |

> **Note:** G2 and G3 share the same `@@` hunk — commit as 1 combined: `feat(sidebar): replace text logo with brand SVG and apply solid background`

### G4 — `feat(sidebar): update "Start new chat" to premium-button and selection toggle to brand color`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/sidebar/Menu.client.tsx` | 400–407 | `@@ -415,7 +400,7 @@` — `<a href="/">` gets `premium-button` class |

### G5 — `feat(sidebar): update search focus ring to Copper-Rose brand color`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/sidebar/Menu.client.tsx` | 365–371 | `@@ -380,7 +365,7 @@` — search input `ring-[#E68D7B]/50` |

### G6 — `feat(sidebar): redesign delete and bulk-delete dialogs with theme-aware styling`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/sidebar/Menu.client.tsx` | 424–524 | `@@ -439,100 +424,101 @@` — full dialog theming with `isDark`, Copper-Rose accents, improved copy |

### G7 — `feat(sidebar): update history item hover and active state to brand tokens`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/sidebar/HistoryItem.tsx` | 71–78 | `@@ -71,8 +71,8 @@` |
| `app/components/sidebar/HistoryItem.tsx` | 92–98 | `@@ -92,7 +92,7 @@` |
| `app/components/sidebar/HistoryItem.tsx` | 103–109 | `@@ -103,7 +103,7 @@` |
| `app/components/sidebar/HistoryItem.tsx" | 149–155 | `@@ -149,7 +149,7 @@` |
| `app/components/sidebar/HistoryItem.tsx" | 180–186 | `@@ -180,7 +180,7 @@` |

---

## CLUSTER H — Chat Interface

### H1 — `feat(chat/send-button): rebrand with gradient, new position, and paper-plane icon`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/chat/SendButton.client.tsx` | 1–5 | `@@ -1,4 +1,5 @@` — add `cn` import |
| `app/components/chat/SendButton.client.tsx` | 16–30 | `@@ -15,11 +16,15 @@` — button class, `rounded-xl`, gradient, scale animation |
| `app/components/chat/SendButton.client.tsx` | 35–42 | `@@ -30,8 +35,8 @@` — icon swap `arrow-right` → `paper-plane-right-bold` |

### H2 — `feat(chat/speech): update speech button to transparent with brand active color`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/chat/SpeechRecognition.tsx` | 17–24 | `@@ -17,7 +17,8 @@` |

### H3 — `feat(chat/agent-toggle): apply light-mode aware popover and active item styling`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/chat/AgentToggle.tsx` | 34–45 | `@@ -34,14 +34,12 @@` — popover bg |
| `app/components/chat/AgentToggle.tsx" | 47–64 | `@@ -49,19 +47,18 @@` — active/inactive item classes |
| `app/components/chat/AgentToggle.tsx" | 71–77 | `@@ -74,7 +71,7 @@` — Popover.Arrow fill |

### H4 — `feat(chat/mode-selector): apply themed popover and active mode indicator`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/chat/ChatModeSelector.tsx` | 50–63 | `@@ -50,14 +50,14 @@` — trigger button active class |
| `app/components/chat/ChatModeSelector.tsx" | 65–82 | `@@ -65,19 +65,18 @@` — dropdown panel bg/border |
| `app/components/chat/ChatModeSelector.tsx" | 89–95 | `@@ -90,7 +89,7 @@` — Popover.Arrow fill |

### H5 — `feat(chat/git-clone): remove purple glow, use ghost variant and semantic border`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/chat/GitCloneButton.tsx` | 171–187 | `@@ -171,18 +171,17 @@` |

### H6 — `feat(chat/left-panel): rebrand action buttons to premium rounded-full style`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/chat/LeftActionPanel.tsx` | 60–91 | `@@ -60,25 +60,32 @@` — ghost button full restyle |
| `app/components/chat/LeftActionPanel.tsx" | 101–107 | `@@ -94,7 +101,7 @@` |
| `app/components/chat/LeftActionPanel.tsx" | 109–115 | `@@ -102,7 +109,7 @@` |
| `app/components/chat/LeftActionPanel.tsx" | 117–132 | `@@ -110,16 +117,16 @@` — primary gradient button |

### H7 — `feat(chat/base): apply gradient-bg and import TemplateSection`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/chat/BaseChat.tsx` | 14–15 | `@@ -14,6 +14,7 @@` — import |
| `app/components/chat/BaseChat.tsx" | 198–199 | `@@ -197,6 +198,7 @@` — add `gradient-bg` class |

### H8 — `feat(chat/base): redesign empty-state layout, scroll-to-bottom, and input area`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/chat/BaseChat.tsx` | 551–557 | `@@ -549,7 +551,7 @@` |
| `app/components/chat/BaseChat.tsx" | 574–615 | `@@ -572,18 +574,42 @@` |
| `app/components/chat/BaseChat.tsx" | 684–690 | `@@ -658,7 +684,7 @@` |
| `app/components/chat/BaseChat.tsx" | 740–770 | `@@ -714,12 +740,31 @@` |
| `app/components/chat/BaseChat.tsx" | 777–803 | `@@ -732,18 +777,27 @@` |
| `app/components/chat/BaseChat.tsx" | 811–831 | `@@ -757,16 +811,21 @@` — ScrollToBottom |

### H9 — `feat(chat/base): update SCSS gradient background variable`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/chat/BaseChat.module.scss` | 33–39 | `@@ -33,7 +33,7 @@` |

### H10 — `feat(chat/chatbox): fix input container radius and apply glow effect`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/chat/ChatBox.tsx` | 82–90 | `@@ -82,6 +82,9 @@` — outer container |
| `app/components/chat/ChatBox.tsx" | 94–104 | `@@ -91,15 +94,11 @@` — inner panel `rounded-2xl` |
| `app/components/chat/ChatBox.tsx" | 181–198 | `@@ -182,14 +181,18 @@` — icons/tooltips |
| `app/components/chat/ChatBox.tsx" | 279–294 | `@@ -276,16 +279,16 @@` |
| `app/components/chat/ChatBox.tsx" | 301–410 | `@@ -298,109 +301,110 @@` — toolbar buttons |

---

## CLUSTER I — Message Rendering

### I1 — `feat(chat/user-message): rebrand user bubble to Copper-Rose gradient`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/chat/UserMessage.tsx` | 85–127 | `@@ -85,46 +85,43 @@` |

### I2 — `feat(chat/assistant-message): update thinking block and action colors to brand tokens`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/chat/AssistantMessage.tsx` | 14–15 | `@@ -14,6 +14,8 @@` — import |
| `app/components/chat/AssistantMessage.tsx" | 32–50 | `@@ -30,19 +32,19 @@` — ThinkingBlock border/bg |
| `app/components/chat/AssistantMessage.tsx" | 172–173 | `@@ -170,6 +172,7 @@` |
| `app/components/chat/AssistantMessage.tsx" | 202–215 | `@@ -199,12 +202,14 @@` |

### I3 — `feat(chat/code-block): apply semantic background tokens to code blocks`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/chat/CodeBlock.tsx` | 1–6 | `@@ -1,4 +1,6 @@` — imports |
| `app/components/chat/CodeBlock.tsx" | 18–26 | `@@ -16,7 +18,9 @@` — bg/text props |

### I4 — `feat(chat/artifact-utils): remap file type icon colors to brand palette`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/chat/artifact-utils.ts` | 187–218 | `@@ -187,34 +187,32 @@` |

### I5 — `feat(chat/artifact): update artifact panel header and action colors to brand tokens`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/chat/Artifact.tsx` | 2–8 | `@@ -2,6 +2,7 @@` — import |
| `app/components/chat/Artifact.tsx" | 145–151 | `@@ -144,7 +145,7 @@` |
| `app/components/chat/Artifact.tsx" | 212–219 | `@@ -211,6 +212,8 @@` |
| `app/components/chat/Artifact.tsx" | 230–236 | `@@ -227,7 +230,7 @@` |
| `app/components/chat/Artifact.tsx" | 374–384 | `@@ -371,11 +374,11 @@` |
| `app/components/chat/Artifact.tsx" | 412–419 | `@@ -409,8 +412,8 @@` |
| `app/components/chat/Artifact.tsx" | 468–474 | `@@ -465,7 +468,7 @@` |

---

## CLUSTER J — Templates

### J1 — `feat(templates/section): redesign "Templates" vertical label to centered gradient divider`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/chat/TemplateSection.tsx` | 103–133 | `@@ -85,10 +103,31 @@` — only this hunk (label redesign) |

### J2 — `feat(templates/section): rebrand badge colors, category labels, and card hover`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/chat/TemplateSection.tsx` | 1–6 | `@@ -1,5 +1,6 @@` — add `Link` import |
| `app/components/chat/TemplateSection.tsx" | 11–20 | `@@ -10,6 +11,10 @@` — badge color entries |
| `app/components/chat/TemplateSection.tsx" | 24–33 | `@@ -19,6 +24,10 @@` — CATEGORY_LABELS entries |
| `app/components/chat/TemplateSection.tsx" | 37–57 | `@@ -28,13 +37,21 @@` — getCategoryBadge |
| `app/components/chat/TemplateSection.tsx" | 72–89 | `@@ -55,17 +72,18 @@` — component props |
| `app/components/chat/TemplateSection.tsx" | 136–150 | `@@ -97,11 +136,15 @@` |
| `app/components/chat/TemplateSection.tsx" | 156–169 | `@@ -113,12 +156,14 @@` |
| `app/components/chat/TemplateSection.tsx" | 172–178 | `@@ -127,7 +172,7 @@` |
| `app/components/chat/TemplateSection.tsx" | 188–201 | `@@ -143,12 +188,14 @@` |
| `app/components/chat/TemplateSection.tsx" | 204–217 | `@@ -157,15 +204,14 @@` |
| `app/components/chat/TemplateSection.tsx" | 219–244 | `@@ -173,17 +219,26 @@` |
| `app/components/chat/TemplateSection.tsx" | 248–277 | `@@ -193,31 +248,30 @@` |

### J3 — `feat(templates/preview-modal): apply brand colors to modal header and CTA button`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/templates/TemplatePreviewModal.tsx` | 153–168 | `@@ -153,16 +153,16 @@` |
| `app/components/templates/TemplatePreviewModal.tsx" | 171–182 | `@@ -171,12 +171,12 @@` |
| `app/components/templates/TemplatePreviewModal.tsx" | 194–205 | `@@ -194,12 +194,12 @@` |
| `app/components/templates/TemplatePreviewModal.tsx" | 218–259 | `@@ -218,50 +218,42 @@` |
| `app/components/templates/TemplatePreviewModal.tsx" | 263–269 | `@@ -271,7 +263,7 @@` |
| `app/components/templates/TemplatePreviewModal.tsx" | 271–277 | `@@ -279,7 +271,7 @@` |

---

## CLUSTER K — Settings Tabs

### K1 — `feat(settings/providers/cloud): update "Get API key" link to visible brand color`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/@settings/tabs/providers/cloud/CloudProviderCard.tsx` | 222–228 | `@@ -222,7 +222,7 @@` |
| `app/components/@settings/tabs/providers/cloud/CloudProviderCard.tsx" | 247–253 | `@@ -247,7 +247,7 @@` |

### K2 — `feat(settings/providers/local): migrate LocalProvidersTab to semantic tokens`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/@settings/tabs/providers/local/LocalProvidersTab.tsx` | 320–337 | `@@ -320,22 +320,18 @@` |

### K3 — `feat(settings/providers/local): migrate ProviderCard to semantic tokens`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/@settings/tabs/providers/local/ProviderCard.tsx` | 41–50 | `@@ -41,8 +41,10 @@` |
| `app/components/@settings/tabs/providers/local/ProviderCard.tsx" | 54–82 | `@@ -52,30 +54,29 @@` |
| `app/components/@settings/tabs/providers/local/ProviderCard.tsx" | 85–94 | `@@ -84,11 +85,10 @@` |
| `app/components/@settings/tabs/providers/local/ProviderCard.tsx" | 113–119 | `@@ -113,7 +113,7 @@` |

### K4 — `fix(settings/supabase): correct syntax error in return array`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/@settings/tabs/supabase/SupabaseTab.tsx` | 978–986 | `@@ -978,9 +978,9 @@` |

### K5 — `feat(settings/supabase): migrate styling and fix "Get your token" link visibility`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/@settings/tabs/supabase/SupabaseTab.tsx` | 683–689 | `@@ -683,7 +683,7 @@` |
| `app/components/@settings/tabs/supabase/SupabaseTab.tsx" | 760–766 | `@@ -760,7 +760,7 @@` — link color fix |
| `app/components/@settings/tabs/supabase/SupabaseTab.tsx" | 774–780 | `@@ -774,7 +774,7 @@` |
| `app/components/@settings/tabs/supabase/SupabaseTab.tsx" | 798–808 | `@@ -798,11 +798,11 @@` |
| `app/components/@settings/tabs/supabase/SupabaseTab.tsx" | 1002–1018 | `@@ -1002,17 +1002,17 @@` |

### K6 — `feat(settings/github): fix "Get your token" link visibility in light mode`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/@settings/tabs/github/components/GitHubAuthDialog.tsx` | 121–127 | `@@ -121,7 +121,7 @@` |
| `app/components/@settings/tabs/github/components/GitHubConnection.tsx" | 136–142 | `@@ -136,7 +136,7 @@` |
| `app/components/@settings/tabs/github/components/GitHubConnection.tsx" | 164–170 | `@@ -164,7 +164,7 @@` |
| `app/components/@settings/tabs/github/components/GitHubConnection.tsx" | 189–196 | `@@ -189,8 +189,8 @@` |

### K7 — `feat(settings/gitlab): fix "Get your token" link visibility and migrate colors`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/@settings/tabs/gitlab/components/GitLabConnection.tsx` | 145–151 | `@@ -145,7 +145,7 @@` |
| `app/components/@settings/tabs/gitlab/components/GitLabConnection.tsx" | 170–177 | `@@ -170,8 +170,8 @@` |
| `app/components/@settings/tabs/gitlab/components/GitLabConnection.tsx" | 207–214 | `@@ -207,8 +207,8 @@` |

### K8 — `feat(settings/netlify): fix token link visibility and migrate colors`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/@settings/tabs/netlify/NetlifyTab.tsx` | 784–792 | `@@ -784,9 +784,9 @@` |
| `app/components/@settings/tabs/netlify/NetlifyTab.tsx" | 1348–1354 | `@@ -1348,7 +1348,7 @@` |
| `app/components/@settings/tabs/netlify/NetlifyTab.tsx" | 1363–1369 | `@@ -1363,7 +1363,7 @@` |
| `app/components/@settings/tabs/netlify/NetlifyTab.tsx" | 1389–1396 | `@@ -1389,8 +1389,8 @@` |

### K9 — `feat(settings/vercel): fix token link visibility and migrate colors`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/@settings/tabs/vercel/VercelTab.tsx` | 522–528 | `@@ -522,7 +522,7 @@` |
| `app/components/@settings/tabs/vercel/VercelTab.tsx" | 536–542 | `@@ -536,7 +536,7 @@` |
| `app/components/@settings/tabs/vercel/VercelTab.tsx" | 562–569 | `@@ -562,8 +562,8 @@` |

### K10 — `feat(settings/mcp): update MCP status badge colors to semantic tokens`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/@settings/tabs/mcp/McpStatusBadge.tsx` | 6–15 | `@@ -6,10 +6,10 @@` |

### K11 — `feat(settings/features): update FeatureCard and feature list to semantic tokens`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/@settings/tabs/features/FeaturesTab.tsx` | 66–77 | `@@ -66,10 +66,12 @@` |
| `app/components/@settings/tabs/features/FeaturesTab.tsx" | 435–446 | `@@ -433,13 +435,12 @@` |

### K12 — `feat(settings/notifications): migrate notification badge colors to semantic tokens`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/@settings/tabs/notifications/NotificationsTab.tsx` | 113–120 | `@@ -113,8 +113,8 @@` |
| `app/components/@settings/tabs/notifications/NotificationsTab.tsx" | 159–172 | `@@ -159,14 +159,14 @@` |

### K13 — `feat(settings/data): migrate DataTab action buttons and badge colors`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/@settings/tabs/data/DataTab.tsx` | 244–255 | `@@ -244,13 +244,12 @@` |
| `app/components/@settings/tabs/data/DataTab.tsx" | 311–317 | `@@ -312,7 +311,7 @@` |
| `app/components/@settings/tabs/data/DataTab.tsx" | 322–331 | `@@ -323,10 +322,10 @@` |
| `app/components/@settings/tabs/data/DataTab.tsx" | 386–395 | `@@ -387,10 +386,10 @@` |
| `app/components/@settings/tabs/data/DataTab.tsx" | 423–432 | `@@ -424,10 +423,10 @@` |
| `app/components/@settings/tabs/data/DataTab.tsx" | 461–473 | `@@ -462,13 +461,13 @@` |
| `app/components/@settings/tabs/data/DataTab.tsx" | 505–519 | `@@ -506,15 +505,15 @@` |
| `app/components/@settings/tabs/data/DataTab.tsx" | 547–556 | `@@ -548,10 +547,10 @@` |
| `app/components/@settings/tabs/data/DataTab.tsx" | 584–593 | `@@ -585,10 +584,10 @@` |
| `app/components/@settings/tabs/data/DataTab.tsx" | 622–634 | `@@ -623,13 +622,13 @@` |
| `app/components/@settings/tabs/data/DataTab.tsx" | 663–672 | `@@ -664,10 +663,10 @@` |
| `app/components/@settings/tabs/data/DataTab.tsx" | 706–715 | `@@ -707,10 +706,10 @@` |
| `app/components/@settings/tabs/data/DataTab.tsx" | 800–811 | `@@ -801,12 +800,12 @@` |
| `app/components/@settings/tabs/data/DataTab.tsx" | 842–848 | `@@ -843,7 +842,7 @@` |
| `app/components/@settings/tabs/data/DataTab.tsx" | 882–888 | `@@ -883,7 +882,7 @@` |

### K14 — `feat(settings/data): migrate DataVisualization chart colors to brand palette`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/@settings/tabs/data/DataVisualization.tsx` | 109–133 | `@@ -109,29 +109,25 @@` |
| `app/components/@settings/tabs/data/DataVisualization.tsx" | 329–335 | `@@ -333,7 +329,7 @@` |
| `app/components/@settings/tabs/data/DataVisualization.tsx" | 337–343 | `@@ -341,7 +337,7 @@` |
| `app/components/@settings/tabs/data/DataVisualization.tsx" | 345–351 | `@@ -349,7 +345,7 @@` |

### K15 — `feat(settings/event-logs): migrate log level badge and filter colors to semantic tokens`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/@settings/tabs/event-logs/EventLogsTab.tsx` | 23–29 | `@@ -23,7 +23,7 @@` |
| `app/components/@settings/tabs/event-logs/EventLogsTab.tsx" | 95–103 | `@@ -95,9 +95,9 @@` |
| `app/components/@settings/tabs/event-logs/EventLogsTab.tsx" | 126–134 | `@@ -126,9 +126,9 @@` |
| `app/components/@settings/tabs/event-logs/EventLogsTab.tsx" | 174–180 | `@@ -174,7 +174,7 @@` |
| `app/components/@settings/tabs/event-logs/EventLogsTab.tsx" | 546–552 | `@@ -546,7 +546,7 @@` |
| `app/components/@settings/tabs/event-logs/EventLogsTab.tsx" | 601–613 | `@@ -601,13 +601,13 @@` |
| `app/components/@settings/tabs/event-logs/EventLogsTab.tsx" | 670–676 | `@@ -670,7 +670,7 @@` |

### K16 — `feat(settings/profile): update avatar accent color to Copper-Rose`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/@settings/tabs/profile/ProfileTab.tsx` | 84–90 | `@@ -84,7 +84,7 @@` |

### K17 — `feat(settings/project-memory): update memory card accent color to brand token`
| File | Lines (new) | Hunk |
|---|---|---|
| `app/components/@settings/tabs/project-memory/ProjectMemoryTab.tsx` | 266–272 | `@@ -266,7 +266,7 @@` |

---

## CLUSTER L — Workbench

### L1 — `feat(workbench/diff): migrate diff line colors and modal colors to semantic tokens`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/workbench/DiffPreviewModal.tsx` | 125–135 | `@@ -125,11 +125,11 @@` |
| `app/components/workbench/DiffPreviewModal.tsx" | 170–178 | `@@ -170,9 +170,9 @@` |
| `app/components/workbench/DiffPreviewModal.tsx" | 181–189 | `@@ -181,9 +181,9 @@` |
| `app/components/workbench/DiffPreviewModal.tsx" | 269–276 | `@@ -269,8 +269,8 @@` |
| `app/components/workbench/DiffPreviewModal.tsx" | 603–609 | `@@ -603,7 +603,7 @@` |
| `app/components/workbench/DiffPreviewModal.tsx" | 611–617 | `@@ -611,7 +611,7 @@` |

### L2 — `feat(workbench/staged): migrate StagedChangesPanel action buttons to semantic tokens`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/workbench/StagedChangesPanel.tsx` | 110–120 | `@@ -110,11 +110,11 @@` |
| `app/components/workbench/StagedChangesPanel.tsx" | 204–210 | `@@ -204,7 +204,7 @@` |
| `app/components/workbench/StagedChangesPanel.tsx" | 214–220 | `@@ -214,7 +214,7 @@` |
| `app/components/workbench/StagedChangesPanel.tsx" | 629–635 | `@@ -629,7 +629,7 @@` |
| `app/components/workbench/StagedChangesPanel.tsx" | 637–655 | `@@ -637,19 +637,19 @@` |
| `app/components/workbench/StagedChangesPanel.tsx" | 681–687 | `@@ -681,7 +681,7 @@` |
| `app/components/workbench/StagedChangesPanel.tsx" | 690–696 | `@@ -690,7 +690,7 @@` |
| `app/components/workbench/StagedChangesPanel.tsx" | 699–705 | `@@ -699,7 +699,7 @@` |
| `app/components/workbench/StagedChangesPanel.tsx" | 724–730 | `@@ -724,7 +724,7 @@` |
| `app/components/workbench/StagedChangesPanel.tsx" | 741–753 | `@@ -741,13 +741,13 @@` |
| `app/components/workbench/StagedChangesPanel.tsx" | 769–775 | `@@ -769,7 +769,7 @@` |
| `app/components/workbench/StagedChangesPanel.tsx" | 781–787 | `@@ -781,7 +781,7 @@` |
| `app/components/workbench/StagedChangesPanel.tsx" | 791–797 | `@@ -791,7 +791,7 @@` |

### L3 — `feat(workbench/terminal): update terminal tab active indicator to brand color`
| File | Lines (new) | Hunks |
|---|---|---|
| `app/components/workbench/terminal/TerminalTabs.tsx` | 207–213 | `@@ -207,7 +207,7 @@` |
| `app/components/workbench/terminal/TerminalTabs.tsx" | 225–231 | `@@ -225,7 +225,7 @@` |
| `app/components/workbench/terminal/TerminalTabs.tsx" | 278–284 | `@@ -278,7 +278,7 @@` |

---

## CLUSTER M — Assets & Tooling

### M1 — `feat(assets): add brand logo SVGs for light mode, dark mode, and standalone`
| Files | Notes |
|---|---|
| `public/logo/Logo_Light_Text.svg` | new untracked |
| `public/logo/Logo_Dark_Text.svg` | new untracked |
| `public/Light.svg` | new untracked |

### M2 — `feat(assets): add design reference files`
| Files | Notes |
|---|---|
| `public/design/` (all contents) | new untracked directory |

### M3 — `chore(scripts): add screenshot generation config`
| File | Lines (new) | Hunk |
|---|---|---|
| `scripts/generate-screenshots.mjs` | full file (2-line addition) | Entire diff |

---

## Summary

| Cluster | Commits | Files touched |
|---|---|---|
| A — Tokens | 1 | 1 |
| B — Root Layout | 2 | 1 |
| C — UnoCSS | 1 | 1 |
| D — Global Styles | 3 | 3 |
| E — UI Primitives | 5 | 5 |
| F — Header | 3 | 2 |
| G — Sidebar | 7 | 2 |
| H — Chat Interface | 10 | 8 |
| I — Message Rendering | 5 | 5 |
| J — Templates | 3 | 2 |
| K — Settings Tabs | 17 | 17 |
| L — Workbench | 3 | 3 |
| M — Assets & Tooling | 3 | 4+ |
| **Total** | **~43** | **52** |

> [!IMPORTANT]
> Commits B1/B2, F1/F2, G1–G6, and J1/J2 require `git add -p` to stage only their listed hunks from files that contain multiple unrelated `@@` blocks.
> All other commits can use `git add <file>` directly.
