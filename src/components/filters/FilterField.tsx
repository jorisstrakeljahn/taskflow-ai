import { CustomSelect } from '../ui/CustomSelect';
import { ReactNode } from 'react';

interface FilterFieldProps {
  id: string;
  label: string;
  icon?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

export const FilterField = ({ id, label, icon, value, onChange, options }: FilterFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 mb-0.5">
        {icon && (
          <div className="text-text-secondary-light dark:text-text-secondary-dark">{icon}</div>
        )}
        <label
          htmlFor={id}
          className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
        >
          {label}
        </label>
      </div>
      <CustomSelect id={id} value={value} onChange={onChange} options={options} />
    </div>
  );
};
