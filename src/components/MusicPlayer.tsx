import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  return;
};