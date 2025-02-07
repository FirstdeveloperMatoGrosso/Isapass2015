
import { Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Copyright */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-xl mb-4">TicketWave</h3>
            <p className="text-gray-600 text-sm">
              © 2024 rodrigodev.shop<br />
              Todos os direitos reservados.
            </p>
          </div>

          {/* Políticas */}
          <div className="text-center md:text-left">
            <h3 className="font-bold mb-4">Políticas</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">Política de privacidade</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">Termos e Condições</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">Política de cancelamento</a>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div className="text-center md:text-left">
            <h3 className="font-bold mb-4">Redes Sociais</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
