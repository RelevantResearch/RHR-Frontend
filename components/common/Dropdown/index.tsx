import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowDown, Check, X } from "lucide-react";

type Props<T extends string | number> = {
  modal?: boolean;
  selectedValue: T | null | string;
  onSelect: (id: T, name: string) => void;
  options: {
    name: string;
    id: T;
    disabled?: boolean;
  }[];
  placeholder: string;
  width?: string;
  btnStyle?: string;
  disabled?: boolean;
  onSearch?: (value: string) => any;
  multi?: boolean;
  isRemove?: boolean;
  loading?: boolean;
};

const Dropdown = <T extends string | number>({
  modal = false,
  selectedValue,
  onSelect,
  options,
  placeholder,
  btnStyle,
  disabled = false,
  width,
  onSearch,
  multi,
  isRemove,
  loading = false,
}: Props<T>) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleSelect = (_id: T, name: string) => {
    onSelect(_id, name);
    setOpen(false);
  };
  const selectedValues =
    selectedValue
      ?.toString()
      ?.split(",")
      ?.filter((x) => x !== "") ?? [];

  const handleRemove = () => {
    if (typeof selectedValue === "number") {
      onSelect(undefined as any, "");
    } else {
      onSelect("" as T, "");
    }
  };

  const handleSearch = async (value: string) => {
    if (onSearch) {
      setLoading(true);
      await onSearch(value);
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger disabled={disabled} className={cn(`w-full !mt-0`, width)}>
        <div
          className={cn(
            `font-normal text-[13px] line-clamp-1 normal-case flex items-center justify-between gap-2 [&[data-state=open]>svg]:rotate-0 focus:border-primary rounded ${
              multi && selectedValues?.length > 0
                ? "border border-blue-500"
                : "border border-black-400"
            } w-full px-3 py-3 h-[46px]`,
            btnStyle,
            disabled ? "cursor-not-allowed opacity-[0.5]" : ""
          )}
        >
          {selectedValue && !multi ? (
            <span className="line-clamp-1 text-black-800 flex items-center gap-1 ">
              {options?.find((option) => option?.id === selectedValue)?.name ??
                selectedValue}
              {isRemove && (
                <X
                  size={16}
                  className="cursor-pointer text-red-500"
                  onClick={handleRemove}
                />
              )}
            </span>
          ) : (
            <span className="text-black-600 text-left line-clamp-1 whitespace-nowrap">
              {placeholder}
            </span>
          )}
          <ArrowDown size={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={`popover-content min-h-fit max-h-[200px] z-[100] lg:min-w-[250px] overflow-hidden rounded-[5px] pt-0 px-0`}
      >
        <Command
          className="overflow-x-hidden max-h-[30dvh]"
          filter={(value, search) => {
            if (value?.toLowerCase().includes(search?.toLowerCase())) return 1;
            return 0;
          }}
        >
          <div className="w-full bg-white opacity-100">
            <CommandInput
              className="bg-white placeholder:to-black-800"
              placeholder={placeholder}
              {...(onSearch && { onValueChange: handleSearch })}
            />
          </div>
          {isLoading || loading ? (
            <div
              role="status"
              className="flex items-center justify-center w-full h-[200px] bg-white"
            >
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <>
              <CommandEmpty>Data not found.</CommandEmpty>
              <CommandGroup className="w-full flex flex-col gap-3 mt-3 overflow-y-scroll">
                {options?.map(({ disabled, name, id }) => {
                  return (
                    <CommandItem
                      value={name}
                      onSelect={() => !disabled && handleSelect(id, name)}
                      className={`flex items-center gap-2 px-4 cursor-pointer ${
                        multi
                          ? selectedValues?.includes(id?.toString())
                            ? "bg-accent text-accent-foreground"
                            : ""
                          : selectedValue === id
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }`}
                      key={id}
                      disabled={disabled}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          multi
                            ? selectedValues?.includes(id?.toString())
                              ? "opacity-100"
                              : "opacity-0"
                            : selectedValue === id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <label className="paragraph-2 text-black-700">
                        {name}
                      </label>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Dropdown;
