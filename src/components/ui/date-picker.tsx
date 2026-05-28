'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date' }: DatePickerProps) {
  // Convert ISO string to Date object for the Calendar component
  const date = value ? new Date(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger 
        render={
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : <span>{placeholder}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate && onChange) {
              // Convert back to ISO string, ensuring the time part is set to noon UTC to avoid timezone issues
              // Or use the exact ISO string if time is important. Since these are StartDate/EndDate, midnight UTC is usually fine.
              // For simplicity, we'll format it as a full ISO string.
              onChange(selectedDate.toISOString());
            }
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
