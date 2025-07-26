import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Kontakt oss</h3>
            <p className="text-gray-300 mb-4">
              Tordenskiolds gate 2, 0160, Oslo
            </p>
            <p className="text-gray-300 mb-2">Barnearbeid AS</p>
            <p className="text-gray-300 mb-4">Org.nr 934557417</p>
            <p className="text-gray-400 text-sm">
              Utviklet i samarbeid med Nordens største advokatfirma
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Informasjon</h4>
            <nav className="space-y-2">
              <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
                Support
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
                Informasjon
              </Link>
              <Link to="/legal/brukervilkar" className="block text-gray-300 hover:text-white transition-colors">
                Brukervilkår
              </Link>
              <Link to="/legal/personvernerklaering" className="block text-gray-300 hover:text-white transition-colors">
                Personvernerklæring
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Følg oss</h4>
            <div className="space-y-2">
              <a 
                href="https://www.linkedin.com/company/barnearbeid" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href="https://www.instagram.com/barnearbeid" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a 
                href="https://www.facebook.com/barnearbeid" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a 
                href="https://www.tiktok.com/@barnearbeid" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Barnearbeid AS. Alle rettigheter forbeholdt.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 