import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function MonthPicker({ value, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(
    value ? new Date(value).getFullYear() : new Date().getFullYear(),
  );

  const handleSelect = (monthIndex) => {
    const newDate = new Date(year, monthIndex, 1);
    onChange?.(newDate);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start">
          {value ? format(value, "MMMM yyyy", { locale: id }) : "Pilih bulan"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className={`w-[260px] p-3 ${className}`}>
        {/* Year Selector */}
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setYear((prev) => prev - 1)}
          >
            {"<"}
          </Button>

          <span className="font-medium">{year}</span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setYear((prev) => prev + 1)}
          >
            {">"}
          </Button>
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, i) => (
            <Button
              key={month}
              variant={
                value &&
                new Date(value).getMonth() === i &&
                new Date(value).getFullYear() === year
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => handleSelect(i)}
            >
              {month.slice(0, 3)}
            </Button>
          ))}
        </div>

        <div className="flex justify-end items-center">
          <Button
            size={"xs"}
            onClick={() => {
              const thisMonth = new Date().getMonth();
              handleSelect(thisMonth);
            }}
          >
            Bulan Ini
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
