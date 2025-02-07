
import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { SponsorBanner } from "@/components/SponsorBanner";
import { CookieConsent } from "@/components/CookieConsent";

const mockEvents = [
  {
    id: "1",
    title: "Festival de Verão",
    date: "15 Mar 2024",
    location: "Praia de Copacabana",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
    price: 150.00
  },
  {
    id: "2",
    title: "Festa Eletrônica",
    date: "20 Mar 2024",
    location: "Club XYZ",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    price: 80.00
  },
  {
    id: "3",
    title: "Show de Rock",
    date: "25 Mar 2024",
    location: "Arena Show",
    imageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b",
    price: 120.00
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <SponsorBanner />
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Encontre os melhores eventos
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </main>
      <CookieConsent />
    </div>
  );
};

export default Index;
