
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
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    alt: "Patrocinador 4"
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
    alt: "Patrocinador 5"
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b",
    alt: "Patrocinador 6"
  }
];

export const SponsorBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sponsors.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-48 md:h-64 mb-8 overflow-hidden rounded-xl">
      <img
        src={sponsors[currentIndex].imageUrl}
        alt={sponsors[currentIndex].alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
