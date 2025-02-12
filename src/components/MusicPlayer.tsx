
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
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border w-72 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {currentMusic?.title || "Nenhuma música"}
            </span>
            <span className="text-xs text-gray-500">
              {currentMusic?.artist || ""}
            </span>
          </div>
          <Volume2 className="h-4 w-4" />
        </div>
        
        <div className="flex items-center gap-2">
          <Slider
            value={volume}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-24"
          />
        </div>

        <div className="flex items-center justify-center gap-2 mt-2">
          <Button variant="ghost" size="icon" onClick={handlePrevious}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button 
            variant="default" 
            size="icon"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNext}>
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
