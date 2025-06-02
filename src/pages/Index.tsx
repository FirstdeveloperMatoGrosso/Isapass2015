
import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { SponsorBanner } from "@/components/SponsorBanner";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { MusicPlayer } from "@/components/MusicPlayer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const mockEvents = [
  {
    id: "1",
    title: "Festival de Verão",
    date: "15 Mar 2024",
    location: "Praia de Copacabana",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
    price: 150.00,
    classification: "16 anos",
    areas: ["Pista", "Área VIP", "Camarote"],
    attractions: ["Ivete Sangalo", "Anitta", "Jorge & Mateus"]
  },
  {
    id: "2",
    title: "Festa Eletrônica",
    date: "20 Mar 2024",
    location: "Club XYZ",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    price: 80.00,
    classification: "18 anos",
    areas: ["Pista", "Front Stage", "Camarote Premium"],
    attractions: ["Alok", "Chemical Surf", "Vintage Culture"]
  },
  {
    id: "3",
    title: "Show de Rock",
    date: "25 Mar 2024",
    location: "Arena Show",
    imageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b",
    price: 120.00,
    classification: "14 anos",
    areas: ["Pista", "Pista Premium", "Arquibancada"],
    attractions: ["CPM 22", "Pitty", "Fresno"]
  },
  {
    id: "4",
    title: "Festival de Jazz",
    date: "10 Abr 2024",
    location: "Teatro Municipal",
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629",
    price: 200.00,
    classification: "Livre",
    areas: ["Plateia", "Mezanino", "Camarote"],
    attractions: ["Esperanza Spalding", "Kamasi Washington", "Robert Glasper"]
  },
  {
    id: "5",
    title: "Sertanejo na Praia",
    date: "17 Abr 2024",
    location: "Praia do Forte",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
    price: 90.00,
    classification: "18 anos",
    areas: ["Área Geral", "Área Premium", "Lounge VIP"],
    attractions: ["Maiara & Maraisa", "Henrique & Juliano", "Marília Mendonça"]
  },
  {
    id: "6",
    title: "Festival de Hip Hop",
    date: "22 Abr 2024",
    location: "Parque da Cidade",
    imageUrl: "https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c",
    price: 110.00,
    classification: "16 anos",
    areas: ["Pista", "Área VIP", "Backstage"],
    attractions: ["Racionais MC's", "Emicida", "BK'"]
  }
];

const Index = () => {
  const [events, setEvents] = useState(mockEvents);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true })
          .limit(6);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const formattedEvents = data.map(event => ({
            id: event.id,
            title: event.title,
            date: new Date(event.date).toLocaleDateString('pt-BR', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            }),
            location: event.location || "Local a confirmar",
            imageUrl: event.image_url || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
            price: event.price,
            classification: "Livre",
            areas: ["Pista", "Área VIP", "Camarote"],
            attractions: ["A confirmar"]
          }));
          
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os eventos. Utilizando dados de exemplo."
        });
      }
    };

    fetchEvents();
  }, [toast]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 flex-grow">
        <SponsorBanner />
        <h1 className="text-4xl font-bold text-center mb-8 text-[#e91e63]">
          Encontre os melhores eventos
        </h1>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </main>
      <MusicPlayer />
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Index;
