import { Suspense, useState, lazy } from 'react';
import { useStore } from '@nanostores/react';
import { chatStore } from '~/lib/stores/chat';
import { sidebarStore } from '~/lib/stores/sidebar';
import { planStore } from '~/lib/stores/plan';
import { cn } from '~/utils/cn';
import { PanelErrorBoundary } from '~/components/ui/PanelErrorBoundary';
import { clientLazy } from '~/utils/react';
import { ThemeSwitch } from '~/components/ui/ThemeSwitch';
import { SettingsButton } from '~/components/ui/SettingsButton';

const ControlPanel = lazy(() =>
  import('~/components/@settings/core/ControlPanel').then((m) => ({ default: m.ControlPanel })),
);

const ChatDescription = clientLazy(() =>
  import('~/lib/persistence/ChatDescription.client').then((m) => ({ default: m.ChatDescription })),
);
const HeaderActionButtons = clientLazy(() =>
  import('./HeaderActionButtons.client').then((m) => ({ default: m.HeaderActionButtons })),
);

export function Header() {
  const chat = useStore(chatStore);
  const sidebarOpen = useStore(sidebarStore.open);
  const plan = useStore(planStore);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header
      className={cn(
        'flex items-center px-6 h-[var(--header-height)] flex-shrink-0 bg-transparent border-none transition-theme',
      )}
    >
      <PanelErrorBoundary panelName="header">
        <div className="flex items-center gap-3 z-logo text-devonz-elements-textPrimary cursor-pointer translate-y-[1px]">
          {!sidebarOpen && (
            <button
              type="button"
              aria-label="Open sidebar"
              className="flex items-center justify-center bg-transparent border-none p-1 cursor-pointer"
              onClick={() => sidebarStore.toggle()}
            >
              <div className="i-ph:sidebar-simple text-2xl text-devonz-elements-textSecondary hover:text-devonz-elements-textPrimary transition-colors" />
            </button>
          )}
        </div>

        <div className="flex-1 flex justify-center">
          {chat.started && (
            <span className="px-4 truncate text-center text-devonz-elements-textSecondary text-sm flex items-center justify-center gap-2">
              <Suspense fallback={null}>
                <ChatDescription />
              </Suspense>
              {plan.isActive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-xs font-medium whitespace-nowrap">
                  <span className="i-ph:list-checks-fill text-xs" />
                  Plan
                </span>
              )}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-devonz-elements-textSecondary pointer-events-auto">
          {chat.started && (
            <Suspense fallback={null}>
              <HeaderActionButtons />
            </Suspense>
          )}
          <SettingsButton onClick={() => setIsSettingsOpen(true)} />
          <ThemeSwitch />
        </div>
      </PanelErrorBoundary>

      {isSettingsOpen && (
        <Suspense>
          <ControlPanel open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </Suspense>
      )}
    </header>
  );
}
