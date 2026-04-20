import { motion, type Variants } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogButton, DialogDescription, DialogRoot, DialogTitle } from '~/components/ui/Dialog';
import { PanelErrorBoundary } from '~/components/ui/PanelErrorBoundary';
import { Button } from '~/components/ui/Button';
import { db, deleteById, getAll, chatId, type ChatHistoryItem, useChatHistory } from '~/lib/persistence';
import { cubicEasingFn } from '~/utils/easings';
import { HistoryItem } from './HistoryItem';
import { binDates } from './date-binning';
import { useSearchFilter } from '~/lib/hooks/useSearchFilter';
import { cn } from '~/utils/cn';
import { createScopedLogger } from '~/utils/logger';
import { useStore } from '@nanostores/react';
import { sidebarStore } from '~/lib/stores/sidebar';
import { themeStore } from '~/lib/stores/theme';

const logger = createScopedLogger('Menu');

const menuVariants = {
  closed: {
    opacity: 0,
    visibility: 'hidden',
    left: '-340px',
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
  open: {
    opacity: 1,
    visibility: 'initial',
    left: 0,
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants;

type DialogContent =
  | { type: 'delete'; item: ChatHistoryItem }
  | { type: 'bulkDelete'; items: ChatHistoryItem[] }
  | null;

function CurrentDateTime() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-devonz-elements-textSecondary border-b border-devonz-elements-borderColor">
      <div className="h-4 w-4 i-ph:clock opacity-80" />
      <div className="flex gap-2">
        <span>{dateTime.toLocaleDateString()}</span>
        <span>{dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}

export const Menu = () => {
  const { duplicateCurrentChat, exportChat } = useChatHistory();
  const menuRef = useRef<HTMLDivElement>(null);
  const [list, setList] = useState<ChatHistoryItem[]>([]);
  const open = useStore(sidebarStore.open);
  const theme = useStore(themeStore);
  const [dialogContent, setDialogContent] = useState<DialogContent>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { filteredItems: filteredList, handleSearchChange } = useSearchFilter({
    items: list,
    searchFields: ['description'],
  });

  const loadEntries = useCallback(() => {
    if (db) {
      getAll(db)
        .then((list) => list.filter((item) => item.urlId && item.description))
        .then(setList)
        .catch((error) => toast.error(error.message));
    }
  }, []);

  const deleteChat = useCallback(
    async (id: string): Promise<void> => {
      if (!db) {
        throw new Error('Database not available');
      }

      // Delete chat snapshot from localStorage
      try {
        const snapshotKey = `snapshot:${id}`;
        localStorage.removeItem(snapshotKey);
        logger.debug('Removed snapshot for chat:', id);
      } catch (snapshotError) {
        logger.error(`Error deleting snapshot for chat ${id}:`, snapshotError);
      }

      // Delete the chat from the database
      await deleteById(db, id);
      logger.debug('Successfully deleted chat:', id);
    },
    [db],
  );

  const deleteItem = useCallback(
    (event: React.UIEvent, item: ChatHistoryItem) => {
      event.preventDefault();
      event.stopPropagation();

      // Log the delete operation to help debugging
      logger.debug('Attempting to delete chat:', { id: item.id, description: item.description });

      deleteChat(item.id)
        .then(() => {
          toast.success('Chat deleted successfully', {
            duration: 3000,
          });

          // Always refresh the list
          loadEntries();

          if (chatId.get() === item.id) {
            // hard page navigation to clear the stores
            logger.debug('Navigating away from deleted chat');
            window.location.pathname = '/';
          }
        })
        .catch((error) => {
          logger.error('Failed to delete chat:', error);
          toast.error('Failed to delete conversation', {
            duration: 3000,
          });

          // Still try to reload entries in case data has changed
          loadEntries();
        });
    },
    [loadEntries, deleteChat],
  );

  const deleteSelectedItems = useCallback(
    async (itemsToDeleteIds: string[]) => {
      if (!db || itemsToDeleteIds.length === 0) {
        logger.debug('Bulk delete skipped: No DB or no items to delete.');
        return;
      }

      logger.debug(`Starting bulk delete for ${itemsToDeleteIds.length} chats`, itemsToDeleteIds);

      let deletedCount = 0;
      const errors: string[] = [];
      const currentChatId = chatId.get();
      let shouldNavigate = false;

      // Process deletions sequentially using the shared deleteChat logic
      for (const id of itemsToDeleteIds) {
        try {
          await deleteChat(id);
          deletedCount++;

          if (id === currentChatId) {
            shouldNavigate = true;
          }
        } catch (error) {
          logger.error(`Error deleting chat ${id}:`, error);
          errors.push(id);
        }
      }

      // Show appropriate toast message
      if (errors.length === 0) {
        toast.success(`${deletedCount} chat${deletedCount === 1 ? '' : 's'} deleted successfully`);
      } else {
        toast.warning(`Deleted ${deletedCount} of ${itemsToDeleteIds.length} chats. ${errors.length} failed.`, {
          duration: 5000,
        });
      }

      // Reload the list after all deletions
      await loadEntries();

      // Clear selection state
      setSelectedItems([]);
      setSelectionMode(false);

      // Navigate if needed
      if (shouldNavigate) {
        logger.debug('Navigating away from deleted chat');
        window.location.pathname = '/';
      }
    },
    [deleteChat, loadEntries, db],
  );

  const closeDialog = () => {
    setDialogContent(null);
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);

    if (selectionMode) {
      // If turning selection mode OFF, clear selection
      setSelectedItems([]);
    }
  };

  const toggleItemSelection = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const newSelectedItems = prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id];
      logger.trace('Selected items updated:', newSelectedItems);

      return newSelectedItems; // Return the new array
    });
  }, []); // No dependencies needed

  const handleBulkDeleteClick = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.info('Select at least one chat to delete');
      return;
    }

    const selectedChats = list.filter((item) => selectedItems.includes(item.id));

    if (selectedChats.length === 0) {
      toast.error('Could not find selected chats');
      return;
    }

    setDialogContent({ type: 'bulkDelete', items: selectedChats });
  }, [selectedItems, list]); // Keep list dependency

  const selectAll = useCallback(() => {
    const allFilteredIds = filteredList.map((item) => item.id);
    setSelectedItems((prev) => {
      const allFilteredAreSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => prev.includes(id));

      if (allFilteredAreSelected) {
        // Deselect only the filtered items
        const newSelectedItems = prev.filter((id) => !allFilteredIds.includes(id));
        logger.trace('Deselecting all filtered items. New selection:', newSelectedItems);

        return newSelectedItems;
      } else {
        // Select all filtered items, adding them to any existing selections
        const newSelectedItems = [...new Set([...prev, ...allFilteredIds])];
        logger.trace('Selecting all filtered items. New selection:', newSelectedItems);

        return newSelectedItems;
      }
    });
  }, [filteredList]); // Depends only on filteredList

  useEffect(() => {
    if (open) {
      loadEntries();
    }
  }, [open, loadEntries]);

  // Exit selection mode when sidebar is closed
  useEffect(() => {
    if (!open && selectionMode) {
      /*
       * Don't clear selection state anymore when sidebar closes
       * This allows the selection to persist when reopening the sidebar
       */
      logger.trace('Sidebar closed, preserving selection state');
    }
  }, [open, selectionMode]);

  // Close sidebar when clicking outside
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        sidebarStore.setOpen(false);
      }
    }

    // Delay adding listener to prevent immediate close from the toggle click
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateCurrentChat(id);
      loadEntries(); // Reload the list after duplication
    } catch {
      toast.error('Failed to duplicate chat');
    }
  };

  const setDialogContentWithLogging = useCallback((content: DialogContent) => {
    logger.trace('Setting dialog content:', content);
    setDialogContent(content);
  }, []);

  return (
    <>
      <motion.div
        ref={menuRef}
        initial="closed"
        animate={open ? 'open' : 'closed'}
        variants={menuVariants}
        style={{ width: '340px', backgroundColor: 'var(--devonz-elements-bg-depth-1)' }}
        className={cn(
          'flex selection-accent flex-col side-menu fixed top-0 h-full rounded-r-2xl',
          'border-none shadow-premium transition-theme',
          'text-sm rounded-r-2xl border-r border-devonz-elements-borderColor',
          'z-sidebar',
        )}
      >
        <PanelErrorBoundary panelName="sidebar">
          <div className="h-16 flex items-center justify-between px-6 border-none">
            <div className="flex items-center gap-3">
              <img
                src={theme === 'dark' ? '/logo/Logo_Dark_Text.svg' : '/logo/Logo_Light_Text.svg'}
                alt="Alinma AI Hub"
                className="h-8 object-contain drop-shadow-sm"
              />
            </div>
          </div>
          <CurrentDateTime />
          <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <a href="/" className="flex-1 premium-button">
                  <span className="inline-block i-ph:plus-circle h-4 w-4" />
                  <span>Start new chat</span>
                </a>
                <button
                  onClick={toggleSelectionMode}
                  className={cn(
                    'flex gap-1 items-center rounded-lg px-3 py-2 transition-all duration-200',
                    selectionMode
                      ? 'bg-[#E68D7B] text-white border border-[#BB7B6A] shadow-sm'
                      : 'bg-devonz-elements-background-depth-3 text-devonz-elements-textSecondary hover:bg-devonz-elements-background-depth-4 border border-devonz-elements-borderColor',
                  )}
                  aria-label={selectionMode ? 'Exit selection mode' : 'Enter selection mode'}
                >
                  <span className={selectionMode ? 'i-ph:x h-4 w-4' : 'i-ph:check-square h-4 w-4'} />
                </button>
              </div>
              <div className="relative w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <span className="i-ph:magnifying-glass h-4 w-4 text-devonz-elements-textTertiary" />
                </div>
                <input
                  className="w-full bg-devonz-elements-background-depth-3 relative pl-9 pr-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E68D7B]/50 text-sm text-devonz-elements-textPrimary placeholder-devonz-elements-textTertiary border border-devonz-elements-borderColor"
                  type="search"
                  placeholder="Search chats..."
                  onChange={handleSearchChange}
                  aria-label="Search chats"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm px-4 py-2">
              <div className="font-medium text-devonz-elements-textSecondary">Your Chats</div>
              {selectionMode && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={selectAll}>
                    {selectedItems.length === filteredList.length ? 'Deselect all' : 'Select all'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDeleteClick}
                    disabled={selectedItems.length === 0}
                  >
                    Delete selected
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-auto px-3 pb-3 modern-scrollbar">
              {filteredList.length === 0 && (
                <div className="px-4 text-devonz-elements-textTertiary text-sm">
                  {list.length === 0 ? 'No previous conversations' : 'No matches found'}
                </div>
              )}
              <DialogRoot open={dialogContent !== null}>
                {binDates(filteredList).map(({ category, items }) => (
                  <div key={category} className="mt-2 first:mt-0 space-y-1">
                    <div className="text-[10px] font-bold text-devonz-elements-textTertiary sticky top-0 z-1 bg-devonz-elements-bg-depth-2/95 backdrop-blur-md px-4 py-1.5 uppercase tracking-wider border-b border-devonz-elements-borderColor transition-all">
                      {category}
                    </div>
                    <div className="space-y-0.5 pr-1">
                      {items.map((item) => (
                        <HistoryItem
                          key={item.id}
                          item={item}
                          exportChat={exportChat}
                          onDelete={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            logger.debug('Delete triggered for item:', item);
                            setDialogContentWithLogging({ type: 'delete', item });
                          }}
                          onDuplicate={() => handleDuplicate(item.id)}
                          selectionMode={selectionMode}
                          isSelected={selectedItems.includes(item.id)}
                          onToggleSelection={toggleItemSelection}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                {(() => {
                  const isDark = theme === 'dark';
                  const dialogBg = isDark ? 'bg-[#0f172a]' : 'bg-white';
                  const sectionBg = isDark ? 'bg-[#1e293b]' : 'bg-[#f8fafc]';
                  const textPrimary = isDark ? 'text-white' : 'text-[#1e293b]';
                  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';

                  return (
                    <Dialog onBackdrop={closeDialog} onClose={closeDialog} className={dialogBg}>
                      {dialogContent?.type === 'delete' && (
                        <>
                          <div className={cn('p-6', dialogBg)}>
                            <DialogTitle className={cn(textPrimary, 'font-bold')}>Delete Chat?</DialogTitle>
                            <DialogDescription className={cn('mt-4 leading-relaxed', textSecondary)}>
                              <p>
                                You are about to delete{' '}
                                <span className={cn('font-bold underline decoration-[#E68D7B]/30', textPrimary)}>
                                  {dialogContent.item.description}
                                </span>
                              </p>
                              <p className="mt-3 text-sm font-medium opacity-90">
                                Are you sure you want to delete this conversation? This action cannot be undone.
                              </p>
                            </DialogDescription>
                          </div>
                          <div
                            className={cn(
                              'flex justify-end gap-3 px-6 py-4 border-t border-devonz-elements-borderColor/20',
                              sectionBg,
                            )}
                          >
                            <DialogButton type="secondary" onClick={closeDialog}>
                              Cancel
                            </DialogButton>
                            <DialogButton
                              type="danger"
                              onClick={(event) => {
                                logger.debug('Dialog delete button clicked for item:', dialogContent.item);
                                deleteItem(event, dialogContent.item);
                                closeDialog();
                              }}
                            >
                              Delete Chat
                            </DialogButton>
                          </div>
                        </>
                      )}
                      {dialogContent?.type === 'bulkDelete' && (
                        <>
                          <div className={cn('p-6', dialogBg)}>
                            <DialogTitle className={cn(textPrimary, 'font-bold text-center')}>
                              Delete Selected Chats?
                            </DialogTitle>
                            <DialogDescription className={cn('mt-4 leading-relaxed text-center', textSecondary)}>
                              <p>
                                You are about to delete{' '}
                                <span className="font-extrabold text-[#E68D7B] text-lg">
                                  {dialogContent.items.length}
                                </span>{' '}
                                {dialogContent.items.length === 1 ? 'conversation' : 'conversations'}:
                              </p>
                              <div
                                className={cn(
                                  'mt-4 max-h-40 overflow-auto border rounded-xl p-3 modern-scrollbar text-left transition-colors',
                                  isDark ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200 shadow-inner',
                                )}
                              >
                                <ul className="space-y-3">
                                  {dialogContent.items.map((item) => (
                                    <li key={item.id} className="text-sm flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-[#E68D7B]/60 shadow-[0_0_8px_rgba(230,141,123,0.3)] flex-shrink-0" />
                                      <span className={cn('font-medium truncate', textPrimary)}>
                                        {item.description}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <p className="mt-5 text-sm font-semibold">
                                Are you sure you want to proceed? This cannot be undone.
                              </p>
                            </DialogDescription>
                          </div>
                          <div
                            className={cn(
                              'flex justify-end gap-3 px-6 py-4 border-t border-devonz-elements-borderColor/20',
                              sectionBg,
                            )}
                          >
                            <DialogButton type="secondary" onClick={closeDialog}>
                              Cancel
                            </DialogButton>
                            <DialogButton
                              type="danger"
                              onClick={() => {
                                const itemsToDeleteNow = [...selectedItems];
                                logger.debug('Bulk delete confirmed for', itemsToDeleteNow.length, 'items');
                                deleteSelectedItems(itemsToDeleteNow);
                                closeDialog();
                              }}
                            >
                              Delete {dialogContent.items.length} Chats
                            </DialogButton>
                          </div>
                        </>
                      )}
                    </Dialog>
                  );
                })()}
              </DialogRoot>
            </div>
          </div>
        </PanelErrorBoundary>
      </motion.div>
    </>
  );
};
