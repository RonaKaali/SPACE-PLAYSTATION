'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

export default function AudioPlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create the Audio object only on the client side.
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;

    const audio = audioRef.current;

    // Sync state with audio element
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Clean up on component unmount
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
    };
  }, [src]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // The play() method returns a Promise that can be rejected by autoplay policies.
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={togglePlayPause}
        size="icon"
        className="rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg"
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </Button>
    </div>
  );
}
