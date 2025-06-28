// 'use client';

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// type Option = {
//   label: string;
//   value: string;
// };

// type CustomSelectProps = {
//   options: Option[];
//   value: string;
//   onValueChange: (value: string) => void;
//   placeholder?: string;
//   className?: string;
// };

// export default function CustomSelect({
//   options,
//   value,
//   onValueChange,
//   placeholder = "Select an option",
//   className,
// }: CustomSelectProps) {
//   return (
//     <Select value={value} onValueChange={onValueChange}>
//       <SelectTrigger className={className}>
//         <SelectValue placeholder={placeholder} />
//       </SelectTrigger>
//       <SelectContent>
//         {options.map(({ label, value }) => (
//           <SelectItem key={value} value={value}>
//             {label}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// }

'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  label: string;
  value: string;
};

type CustomSelectProps = {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function CustomSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  className,
}: CustomSelectProps) {
  // 🔍 Try to match label for current value
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>
          {selectedOption?.label ?? placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
