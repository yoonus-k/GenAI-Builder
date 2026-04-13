/**
 * Centralized env-var-based visibility controls for Settings tabs,
 * sub-tabs, and chat toolbar icons.
 *
 * Convention: each UI element maps to a `VITE_SHOW_*` env var.
 * If the var is unset or anything other than the literal string "false",
 * the element is visible (opt-out model).
 *
 * All reads happen through `import.meta.env` which Vite inlines at
 * build time, so there is zero runtime cost.
 */

import type { TabType } from '~/components/@settings/core/types';

// ── Sidebar Tabs ─────────────────────────────────────────────────────────────

/** Maps each sidebar TabType to its VITE_SHOW_TAB_* env var key. */
const TAB_ENV_MAP: Record<TabType, string> = {
  profile: 'VITE_SHOW_TAB_PROFILE',
  settings: 'VITE_SHOW_TAB_SETTINGS',
  features: 'VITE_SHOW_TAB_FEATURES',
  notifications: 'VITE_SHOW_TAB_NOTIFICATIONS',
  'cloud-providers': 'VITE_SHOW_TAB_CLOUD_PROVIDERS',
  'local-providers': 'VITE_SHOW_TAB_LOCAL_PROVIDERS',
  mcp: 'VITE_SHOW_TAB_MCP',
  'project-memory': 'VITE_SHOW_TAB_PROJECT_MEMORY',
  github: 'VITE_SHOW_TAB_GITHUB',
  gitlab: 'VITE_SHOW_TAB_GITLAB',
  netlify: 'VITE_SHOW_TAB_NETLIFY',
  vercel: 'VITE_SHOW_TAB_VERCEL',
  supabase: 'VITE_SHOW_TAB_SUPABASE',
  data: 'VITE_SHOW_TAB_DATA',
  'event-logs': 'VITE_SHOW_TAB_EVENT_LOGS',
};

/** Returns `true` if the sidebar tab should be rendered. */
export function isTabVisible(tabId: TabType): boolean {
  const envKey = TAB_ENV_MAP[tabId];

  if (!envKey) {
    return true;
  }

  return (import.meta.env[envKey] as string | undefined) !== 'false';
}

// ── Features Sub-Tabs ────────────────────────────────────────────────────────

export type FeatureSubTab = 'core' | 'beta' | 'prompts';

const FEATURE_SUB_TAB_ENV_MAP: Record<FeatureSubTab, string> = {
  core: 'VITE_SHOW_FEATURE_CORE',
  beta: 'VITE_SHOW_FEATURE_BETA',
  prompts: 'VITE_SHOW_FEATURE_PROMPTS',
};

/** Returns `true` if the Feature sub-tab should be rendered. */
export function isFeatureSubTabVisible(subTabId: string): boolean {
  const envKey = FEATURE_SUB_TAB_ENV_MAP[subTabId as FeatureSubTab];

  if (!envKey) {
    return true;
  }

  return (import.meta.env[envKey] as string | undefined) !== 'false';
}

/** Returns `true` if at least one Feature sub-tab is visible. */
export function hasAnyVisibleFeatureSubTab(): boolean {
  return Object.keys(FEATURE_SUB_TAB_ENV_MAP).some((id) => isFeatureSubTabVisible(id));
}

// ── Data Management Sub-Tabs ─────────────────────────────────────────────────

export type DataSubTab = 'chats' | 'settings' | 'api-keys' | 'data-usage';

const DATA_SUB_TAB_ENV_MAP: Record<DataSubTab, string> = {
  chats: 'VITE_SHOW_DATA_CHATS',
  settings: 'VITE_SHOW_DATA_SETTINGS',
  'api-keys': 'VITE_SHOW_DATA_API_KEYS',
  'data-usage': 'VITE_SHOW_DATA_USAGE',
};

/** Returns `true` if the Data Management sub-tab should be rendered. */
export function isDataSubTabVisible(subTabId: string): boolean {
  const envKey = DATA_SUB_TAB_ENV_MAP[subTabId as DataSubTab];

  if (!envKey) {
    return true;
  }

  return (import.meta.env[envKey] as string | undefined) !== 'false';
}

/** Returns `true` if at least one Data Management sub-tab is visible. */
export function hasAnyVisibleDataSubTab(): boolean {
  return Object.keys(DATA_SUB_TAB_ENV_MAP).some((id) => isDataSubTabVisible(id));
}

// ── Chat Toolbar Icons ───────────────────────────────────────────────────────

export type ChatToolId = 'theme-selector' | 'mcp-tools' | 'attachments' | 'enhancement' | 'speech' | 'model-selector';

const CHAT_TOOL_ENV_MAP: Record<ChatToolId, string> = {
  'theme-selector': 'VITE_SHOW_CHAT_THEME_SELECTOR',
  'mcp-tools': 'VITE_SHOW_CHAT_MCP_TOOLS',
  attachments: 'VITE_SHOW_CHAT_ATTACHMENTS',
  enhancement: 'VITE_SHOW_CHAT_ENHANCEMENT',
  speech: 'VITE_SHOW_CHAT_SPEECH',
  'model-selector': 'VITE_SHOW_CHAT_MODEL_SELECTOR',
};

/** Returns `true` if the chat toolbar icon should be rendered. */
export function isChatToolVisible(toolId: ChatToolId): boolean {
  const envKey = CHAT_TOOL_ENV_MAP[toolId];

  if (!envKey) {
    return true;
  }

  return (import.meta.env[envKey] as string | undefined) !== 'false';
}
