import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { formatIDRInput, parseIDRInput } from '@/utils/formatters';

interface IDRInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export const IDRInput: React.FC<IDRInputProps> = ({ value, onChange, placeholder, label, className }) => {
  const [display, setDisplay] = useState(value ? formatIDRInput(value) : '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const num = parseIDRInput(raw);
    setDisplay(num ? formatIDRInput(num) : raw.replace(/[^0-9]/g, ''));
    onChange(num);
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
        <Input
          value={display}
          onChange={handleChange}
          placeholder={placeholder || '0'}
          className="pl-10"
          inputMode="numeric"
        />
      </div>
    </div>
  );
};
