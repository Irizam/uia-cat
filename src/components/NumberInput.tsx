import { type FC } from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: number;
}

const NumberInput: FC<NumberInputProps> = ({ label, value, onChange, step = 0.1 }) => (
  <div className="flex items-center space-x-2 text-sm flex-grow">
    <label className="font-medium text-gray-400 w-24 text-right">{label}</label>
    <input type="number" value={value} onChange={onChange} step={step} className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 hover:bg-gray-600" />
  </div>
);

export default NumberInput;