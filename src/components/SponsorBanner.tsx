
import { useState, useEffect } from "react";

const sponsors = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    alt: "Patrocinador 1"
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    alt: "Patrocinador 2"
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    alt: "Patrocinador 3"
  }
];

export const SponsorBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Gera um índice aleatório diferente do atual
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * sponsors.length);
      } while (newIndex === currentIndex);
      
      setCurrentIndex(newIndex);
    }, 3000); // Muda a cada 3 segundos

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="w-full h-48 md:h-64 mb-8 overflow-hidden relative">
      {sponsors.map((sponsor, index) => (
        <div
          key={sponsor.id}
          className={`absolute w-full h-full transition-opacity duration-700 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={sponsor.imageUrl}
            alt={sponsor.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      ))}
    </div>
  );
};
