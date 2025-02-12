
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

interface Music {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  isBlocked: boolean;
}

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [playlist, setPlaylist] = useState<Music[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentMusic = playlist[currentMusicIndex];

  useEffect(() => {
    // Aqui você pode carregar a playlist do seu backend
    // Por enquanto, vamos usar dados mockados
    setPlaylist([
      {
        id: "1",
        title: "Música Demo",
        artist: "Artista Demo",
        duration: 180,
        url: "https://example.com/music.mp3",
        isBlocked: false
      }
    ]);
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentMusicIndex((prev) => 
      prev === playlist.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevious = () => {
    setCurrentMusicIndex((prev) => 
      prev === 0 ? playlist.length - 1 : prev - 1
    );
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-4 md:right-4 md:left-auto md:w-72 bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-none md:rounded-lg shadow-lg border animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col max-w-[70%] md:max-w-full">
            <span className="text-sm font-medium truncate">
              {currentMusic?.title || "Nenhuma música"}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {currentMusic?.artist || ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <Slider
              value={volume}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-20 md:w-24"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 md:gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePrevious}
            className="h-8 w-8 md:h-9 md:w-9"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button 
            variant="default" 
            size="icon"
            onClick={handlePlayPause}
            className="h-8 w-8 md:h-9 md:w-9"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNext}
            className="h-8 w-8 md:h-9 md:w-9"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentMusic?.url}
        onEnded={handleNext}
        className="hidden"
      />
    </div>
  );
};
