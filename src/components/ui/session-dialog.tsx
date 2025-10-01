'use client';

import { useState } from 'react';
import {
  Dialog,  DialogContent,  DialogHeader,  DialogTitle,  DialogFooter,} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartSession: (duration: number) => void; // Duration in minutes
}

// Membuat array [1, 2, 3, ..., 10] untuk opsi durasi
const DURATION_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

export function SessionDialog({ open, onOpenChange, onStartSession }: SessionDialogProps) {
  // Default durasi diatur ke 1 jam (60 menit)
  const [duration, setDuration] = useState(60);

  const handleStart = () => {
    onStartSession(duration);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mulai Sesi</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">Pilih durasi sewa:</p>
          <RadioGroup
            defaultValue={duration.toString()} // Default pilihan ke "60"
            onValueChange={(value) => setDuration(parseInt(value, 10))}
          >
            {/* Menampilkan pilihan dalam 2 kolom */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {DURATION_OPTIONS.map((hour) => {
                const valueInMinutes = hour * 60;
                const id = `r-hour-${hour}`;
                return (
                  <div key={hour} className="flex items-center space-x-2">
                    <RadioGroupItem value={valueInMinutes.toString()} id={id} />
                    <Label htmlFor={id} className="cursor-pointer">{hour} Jam</Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button onClick={handleStart}>Mulai</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
