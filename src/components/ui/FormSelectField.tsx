import { CustomSelect } from './CustomSelect';
import { LABEL_CLASSES } from '../../constants/uiConstants';

interface FormSelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
}

export const FormSelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  disabled = false,
}: FormSelectFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={LABEL_CLASSES}
      >
        {label}
      </label>
      <CustomSelect
        id={id}
        value={value}
        onChange={onChange}
        options={options}
        disabled={disabled}
      />
    </div>
  );
};

