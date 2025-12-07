import { useAccentColor } from '../../hooks/useAccentColor';

interface TaskCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  showCheckmark?: boolean;
}

export const TaskCheckbox = ({
  checked,
  onChange,
  disabled = false,
  showCheckmark = false,
}: TaskCheckboxProps) => {
  const { accentColor } = useAccentColor();

  return (
    <div className="relative mt-0.5 flex-shrink-0">
      <input
        type="checkbox"
        checked={checked || showCheckmark}
        onChange={onChange}
        disabled={disabled}
        className={`w-5 h-5 rounded border-2 border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-offset-0 transition-all duration-200 appearance-none checked:scale-110 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        style={
          {
            accentColor: accentColor,
            '--tw-ring-color': accentColor,
          } as React.CSSProperties & { '--tw-ring-color': string }
        }
      />
      {(checked || showCheckmark) && (
        <svg
          className="absolute top-0 left-0 w-5 h-5 pointer-events-none text-white animate-in fade-in zoom-in duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
};
