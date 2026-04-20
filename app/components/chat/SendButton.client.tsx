import { AnimatePresence, cubicBezier, motion } from 'framer-motion';
import { cn } from '~/utils/cn';

interface SendButtonProps {
  show: boolean;
  isStreaming?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onImagesSelected?: (images: File[]) => void;
}

const customEasingFn = cubicBezier(0.4, 0, 0.2, 1);

export const SendButton = ({ show, isStreaming, disabled, onClick }: SendButtonProps) => {
  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          className={cn(
            'absolute flex justify-center items-center bottom-[14px] right-[14px] w-10 h-10 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-[0.98]',
            'bg-[var(--devonz-elements-button-primary-background)] text-white',
            'bg-gradient-to-br from-[#FFA08C] to-[#E68D7B]',
          )}
          transition={{ ease: customEasingFn, duration: 0.17 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          disabled={disabled}
          aria-label={isStreaming ? 'Stop response' : 'Send message'}
          onClick={(event) => {
            event.preventDefault();

            if (!disabled) {
              onClick?.(event);
            }
          }}
        >
          <div className="text-xl">
            {!isStreaming ? <div className="i-ph:paper-plane-right-bold" /> : <div className="i-ph:stop-bold" />}
          </div>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
};
