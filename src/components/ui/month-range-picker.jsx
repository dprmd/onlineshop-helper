"use client";

import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export default function MonthRangePicker({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [year, setYear] = React.useState(new Date().getFullYear());

  const [start, setStart] = React.useState(value?.start || null);
  const [end, setEnd] = React.useState(value?.end || null);

  const handleSelect = (monthIndex) => {
    const selectedDate = new Date(year, monthIndex, 1);

    if (!start || (start && end)) {
      // mulai baru
      setStart(selectedDate);
      setEnd(null);
      onChange?.({ start: selectedDate, end: null });
    } else {
      // set end
      if (selectedDate < start) {
        setStart(selectedDate);
        setEnd(start);
        onChange?.({ start: selectedDate, end: start });
      } else {
        setEnd(selectedDate);
        onChange?.({ start, end: selectedDate });
      }
      setOpen(false);
    }
  };

  const isInRange = (monthIndex) => {
    if (!start || !end) return false;
    const current = new Date(year, monthIndex, 1);
    return current >= start && current <= end;
  };

  const isSelected = (monthIndex) => {
    const current = new Date(year, monthIndex, 1);
    return (
      (start &&
        current.getMonth() === start.getMonth() &&
        current.getFullYear() === start.getFullYear()) ||
      (end &&
        current.getMonth() === end.getMonth() &&
        current.getFullYear() === end.getFullYear())
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[260px] justify-start">
          {start
            ? end
              ? `${format(start, "MMM yyyy", { locale: id })} - ${format(
                  end,
                  "MMM yyyy",
                  { locale: id },
                )}`
              : format(start, "MMM yyyy", { locale: id })
            : "Pilih range bulan"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[260px] p-3">
        {/* Year */}
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setYear((prev) => prev - 1)}
          >
            ←
          </Button>

          <span className="font-medium">{year}</span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setYear((prev) => prev + 1)}
          >
            →
          </Button>
        </div>

        {/* Months */}
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, i) => (
            <Button
              key={month}
              size="sm"
              variant={
                isSelected(i)
                  ? "default"
                  : isInRange(i)
                    ? "secondary"
                    : "outline"
              }
              onClick={() => handleSelect(i)}
            >
              {month}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
