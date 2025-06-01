import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-sm bg-opacity-90">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="IsaPass" 
              className="h-12 w-auto mr-3 transition-transform duration-300 hover:scale-105" 
            />
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">IsaPass</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/client/dashboard" 
              className={`text-gray-700 hover:text-blue-600 font-medium relative py-1 ${isActive('/client/dashboard') ? 'text-blue-600' : ''}`}
            >
              Meus Ingressos
              {isActive('/client/dashboard') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full transform transition-all duration-300"></span>
              )}
            </Link>
            <Link 
              to="/client/events" 
              className={`text-gray-700 hover:text-blue-600 font-medium relative py-1 ${isActive('/client/events') ? 'text-blue-600' : ''}`}
            >
              Eventos
              {isActive('/client/events') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full transform transition-all duration-300"></span>
              )}
            </Link>
            <Link 
              to="/client/profile" 
              className={`text-gray-700 hover:text-blue-600 font-medium relative py-1 ${isActive('/client/profile') ? 'text-blue-600' : ''}`}
            >
              Meu Perfil
              {isActive('/client/profile') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full transform transition-all duration-300"></span>
              )}
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-2 px-4 shadow-lg animate-fadeIn">
            <nav className="flex flex-col space-y-4 py-2">
              <Link 
                to="/client/dashboard" 
                className={`text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${isActive('/client/dashboard') ? 'bg-blue-50 text-blue-600' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Meus Ingressos
              </Link>
              <Link 
                to="/client/events" 
                className={`text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${isActive('/client/events') ? 'bg-blue-50 text-blue-600' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Eventos
              </Link>
              <Link 
                to="/client/profile" 
                className={`text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${isActive('/client/profile') ? 'bg-blue-50 text-blue-600' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Meu Perfil
              </Link>
            </nav>
          </div>
        )}
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="container mx-auto px-4 md:flex md:justify-between md:items-center text-center md:text-left">
          <p className="text-gray-600 mb-4 md:mb-0">&copy; {new Date().getFullYear()} IsaPass. Todos os direitos reservados.</p>
          <div className="flex justify-center md:justify-end space-x-4">
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">Termos de Uso</a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">Privacidade</a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
