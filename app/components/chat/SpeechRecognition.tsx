import { IconButton } from '~/components/ui/IconButton';
import { cn } from '~/utils/cn';

export const SpeechRecognitionButton = ({
  isListening,
  onStart,
  onStop,
  disabled,
}: {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled: boolean;
}) => {
  return (
    <IconButton
      title={isListening ? 'Stop listening' : 'Start speech recognition'}
      disabled={disabled}
      className={cn('transition-all', {
        '!bg-transparent hover:!bg-transparent text-[#64748b] hover:text-[#1e293b]': !isListening,
        '!bg-transparent hover:!bg-transparent text-[#BB7B6A]': isListening,
      })}
      onClick={isListening ? onStop : onStart}
    >
      {isListening ? <div className="i-ph:microphone-slash text-xl" /> : <div className="i-ph:microphone text-xl" />}
    </IconButton>
  );
};
