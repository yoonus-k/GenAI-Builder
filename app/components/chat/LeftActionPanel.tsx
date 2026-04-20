import { lazy, Suspense } from 'react';
import type { Message } from 'ai';
import { toast } from 'sonner';
import { ImportFolderButton } from '~/components/chat/ImportFolderButton';
import { Button } from '~/components/ui/Button';
import { cn } from '~/utils/cn';
import type { ImportChatFn } from '~/lib/persistence/db';

const GitCloneButton = lazy(() => import('./GitCloneButton'));

type ChatData = {
  messages?: Message[];
  description?: string;
};

interface LeftActionPanelProps {
  importChat?: ImportChatFn;
}

export function LeftActionPanel({ importChat }: LeftActionPanelProps) {
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && importChat) {
      try {
        const reader = new FileReader();

        reader.onload = async (event) => {
          try {
            const content = event.target?.result as string;
            const data = JSON.parse(content) as ChatData;

            if (Array.isArray(data.messages)) {
              await importChat(data.description || 'Imported Chat', data.messages);
              toast.success('Chat imported successfully');

              return;
            }

            toast.error('Invalid chat file format');
          } catch (error: unknown) {
            if (error instanceof Error) {
              toast.error('Failed to parse chat file: ' + error.message);
            } else {
              toast.error('Failed to parse chat file');
            }
          }
        };

        reader.onerror = () => toast.error('Failed to read chat file');
        reader.readAsText(file);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to import chat');
      }

      e.target.value = '';
    } else {
      toast.error('Something went wrong');
    }
  };

  const buttonBaseClass = cn(
    'flex w-full items-center gap-2.5 justify-center',
    'text-devonz-elements-textSecondary hover:text-devonz-elements-textPrimary',
    'bg-[var(--devonz-elements-button-secondary-background)] hover:bg-[var(--devonz-elements-button-secondary-backgroundHover)] backdrop-blur-md',
    'border border-devonz-elements-borderColor hover:border-rose-200 dark:hover:border-rose-900',
    'h-11 px-6 py-2.5',
    'transition-all duration-300',
    'rounded-full text-base font-semibold',
    'active:scale-[0.97]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-400',
    'shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]',
    'disabled:pointer-events-none disabled:opacity-50',
  );

  const primaryButtonClass = cn(
    'flex w-full items-center gap-2.5 justify-center',
    'h-11 px-6 py-2.5',
    'rounded-full text-base font-semibold',
    'text-[#FFFFFF] !text-white', // Force white text for premium contrast
    'bg-[var(--devonz-elements-button-primary-background)] hover:bg-[#BB7B6A]',
    'bg-gradient-to-br from-[#FFA08C] to-[#E68D7B]', // Direct gradient for guaranteed rendering
    'border border-white/20 hover:border-white/40',
    'transition-all duration-300',
    'active:scale-[0.97]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FFA08C]',
    'shadow-md hover:shadow-[0_12px_30px_rgba(187,123,106,0.3)]',
    'disabled:pointer-events-none disabled:opacity-50',
  );

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-xl items-stretch">
      {/* Hidden file input */}
      <input
        type="file"
        id="chat-import-left"
        className="hidden"
        accept=".json"
        onChange={handleFileImport}
        aria-label="Import chat file"
      />

      {/* Import Chat Button */}
      <div className="flex h-11">
        <Button
          onClick={() => {
            const input = document.getElementById('chat-import-left');
            input?.click();
          }}
          variant="default"
          className={buttonBaseClass}
          style={{ width: '100%', height: '100%' }}
        >
          <span className="i-ph:upload-simple w-4 h-4" />
          <span>Import Chat</span>
        </Button>
      </div>

      {/* Import Folder Button */}
      <div className="flex h-11">
        <ImportFolderButton
          importChat={importChat}
          className={buttonBaseClass}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Clone a Repo Button - Primary/Highlighted */}
      <div className="flex h-11">
        <Suspense>
          <GitCloneButton
            importChat={importChat}
            className={primaryButtonClass}
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      </div>
    </div>
  );
}
