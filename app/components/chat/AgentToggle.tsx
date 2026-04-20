import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { cn } from '~/utils/cn';
import { agentModeStore, toggleAgentMode } from '~/lib/stores/agentMode';
import { IconButton } from '~/components/ui/IconButton';

type AgentMode = 'standard' | 'agent';

const agentModes: { id: AgentMode; icon: string; label: string; description: string }[] = [
  { id: 'standard', icon: 'i-ph:cursor-click', label: 'Standard', description: 'Normal AI assistant mode' },
  { id: 'agent', icon: 'i-devonz:mode', label: 'Agent', description: 'Autonomous AI agent with tools' },
];

/**
 * Popover selector for Standard ↔ Agent mode, matching the ChatModeSelector pattern.
 */
export function AgentToggle() {
  const [open, setOpen] = useState(false);
  const agentState = useStore(agentModeStore);
  const enabled = agentState.settings.enabled;

  const activeMode: AgentMode = enabled ? 'agent' : 'standard';
  const activeModeConfig = agentModes.find((m) => m.id === activeMode)!;

  const handleSelect = (mode: AgentMode) => {
    toggleAgentMode(mode === 'agent');
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <IconButton
          title="Agent mode"
          className={cn(
            'transition-colors flex items-center gap-1.5 px-1.5 rounded-md !bg-transparent hover:!bg-transparent',
            enabled ? 'text-[#BB7B6A]' : 'text-[#64748b] hover:text-[#1e293b]',
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
            {agentModes.map((mode) => (
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
