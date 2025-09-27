"use client";

import { useEffect, useState, useRef } from "react";
import * as Tone from "tone";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<Tone.MembraneSynth | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);

  useEffect(() => {
    // Initialize synth and effects only once
    const filter = new Tone.Filter(800, "lowpass").toDestination();
    const reverb = new Tone.Reverb({
      decay: 10,
      wet: 0.4,
    }).connect(filter);

    synthRef.current = new Tone.MembraneSynth({
      pitchDecay: 0.01,
      octaves: 5,
      envelope: {
        attack: 0.001,
        decay: 0.5,
        sustain: 0,
      },
    }).connect(reverb);
    
    Tone.getDestination().volume.value = -18; // Lower the volume

    // Cleanup on unmount
    return () => {
      loopRef.current?.dispose();
      synthRef.current?.dispose();
      reverb.dispose();
      filter.dispose();
    };
  }, []);

  const togglePlay = async () => {
    if (Tone.context.state !== "running") {
      await Tone.start();
    }

    if (isPlaying) {
      loopRef.current?.stop();
      setIsPlaying(false);
    } else {
      if (!loopRef.current && synthRef.current) {
        const notes = ["C2", "G2", "Eb3", "C3"];
        let noteIndex = 0;
        loopRef.current = new Tone.Loop((time) => {
          if (synthRef.current) {
            synthRef.current.triggerAttackRelease(notes[noteIndex % notes.length], "8n", time);
            noteIndex++;
          }
        }, "2n").start(0);
      }
      Tone.Transport.start();
      loopRef.current?.start();
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={togglePlay}
        className="bg-background/80 backdrop-blur-sm border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        aria-label={isPlaying ? "Mute Music" : "Play Music"}
      >
        {isPlaying ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
