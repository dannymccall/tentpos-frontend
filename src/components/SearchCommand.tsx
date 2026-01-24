// components/SearchCommand.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";

interface SearchCommandProps<T> {
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;

  items: T[];
  loading?: boolean;
  error?: boolean;

  getKey: (item: T) => string | number;
  getLabel: (item: T) => string;
  getSubLabel?: (item: T) => string;

  onSelect: (item: T) => void;
}

export function SearchCommand<T>({
  placeholder = "Search...",
  value,
  onValueChange,
  items,
  loading,
  error,
  getKey,
  getLabel,
  getSubLabel,
  onSelect,
}: SearchCommandProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Command className="border rounded-md overflow-visible">
        <CommandInput
          placeholder={placeholder}
          value={value}
          onValueChange={(val) => {
            onValueChange(val);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full z-[100] bg-white border rounded-md shadow-lg mt-1"
            >
              <CommandList>
                {loading && (
                  <CommandItem disabled>Searching...</CommandItem>
                )}

                {error && (
                  <CommandItem disabled>Error fetching results</CommandItem>
                )}

                <CommandGroup heading="Results">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <CommandItem
                        key={getKey(item)}
                        onSelect={() => {
                          onSelect(item);
                          setOpen(false);
                        }}
                      >
                        <div className="flex flex-col">
                          <span>{getLabel(item)}</span>
                          {getSubLabel && (
                            <span className="text-xs text-muted-foreground">
                              {getSubLabel(item)}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))
                  ) : (
                    !loading && (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )
                  )}
                </CommandGroup>
              </CommandList>
            </motion.div>
          )}
        </AnimatePresence>
      </Command>
    </div>
  );
}
