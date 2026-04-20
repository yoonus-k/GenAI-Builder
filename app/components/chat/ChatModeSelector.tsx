import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import { cn } from '~/utils/cn';
import { IconButton } from '~/components/ui/IconButton';

type ChatMode = 'build' | 'plan' | 'discuss';

interface ChatModeSelectorProps {
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  planMode?: boolean;
  setPlanMode?: (enabled: boolean) => void;
}

const modes: { id: ChatMode; icon: string; label: string; description: string }[] = [
  { id: 'build', icon: 'i-ph:lightning', label: 'Build', description: 'Write code and create files' },
  { id: 'plan', icon: 'i-ph:list-checks', label: 'Plan', description: 'Create a plan first, then build' },
  { id: 'discuss', icon: 'i-ph:chats', label: 'Discuss', description: 'Chat without code changes' },
];

export function ChatModeSelector({ chatMode, setChatMode, planMode, setPlanMode }: ChatModeSelectorProps) {
  const [open, setOpen] = useState(false);

  // Derive active mode from the two separate state props
  const activeMode: ChatMode = planMode ? 'plan' : chatMode === 'discuss' ? 'discuss' : 'build';
  const activeModeConfig = modes.find((m) => m.id === activeMode)!;

  const handleSelect = (mode: ChatMode) => {
    switch (mode) {
      case 'build':
        setPlanMode?.(false);
        setChatMode?.('build');
        break;
      case 'plan':
        setPlanMode?.(true);
        setChatMode?.('build');
        break;
      case 'discuss':
        setPlanMode?.(false);
        setChatMode?.('discuss');
        break;
    }

    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <IconButton
          title="Chat mode"
          className={cn(
            'transition-colors flex items-center gap-1.5 px-1.5 rounded-md !bg-transparent hover:!bg-transparent',
            activeMode !== 'build' ? 'text-[#BB7B6A]' : 'text-[#64748b] hover:text-[#1e293b]',
          )}
        >
          <div className={cn(activeModeConfig.icon, 'text-xl')} />
          <span className="text-sm font-medium">{activeModeConfig.label}</span>
        </IconButton>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          side="top"
          align="start"
          className="min-w-[220px] rounded-xl z-workbench overflow-hidden border border-[#D8D6FE] bg-[#F1F0FF] dark:border-[#1e293b] dark:bg-[#0f1219] shadow-[0_14px_34px_-18px_rgba(0,33,52,0.35)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        >
          <div className="p-1">
            {modes.map((mode) => (
              <button
                key={mode.id}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors border border-transparent',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A39EFF]',
                  activeMode === mode.id
                    ? 'bg-[#FFF6F4] text-[#BB7B6A] border-[#FFD8CF] dark:bg-[rgba(255,160,140,0.15)] dark:text-[#FFA08C] dark:border-[rgba(255,160,140,0.28)]'
                    : 'bg-transparent text-[#475569] hover:bg-[#E8E6FF] hover:text-[#002134] dark:text-[#9ca3af] dark:hover:bg-[#1a1f2e] dark:hover:text-white',
                )}
                onClick={() => handleSelect(mode.id)}
              >
                <div className={cn(mode.icon, 'text-lg flex-shrink-0')} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{mode.label}</span>
                  <span className="text-xs opacity-70">{mode.description}</span>
                </div>
                {activeMode === mode.id && <div className="i-ph:check ml-auto text-lg flex-shrink-0" />}
              </button>
            ))}
          </div>
          <Popover.Arrow className="fill-[#F1F0FF] dark:fill-[#0f1219]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
