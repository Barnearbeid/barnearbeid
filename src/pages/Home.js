import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, MapPin, CheckCircle, Shield, Users, CreditCard } from 'lucide-react';
import FAQ from '../components/FAQ';

const Home = () => {
  const featuredServices = [
    {
      id: 1,
      title: "Husarbeid",
      provider: "Emma, 18",
      rating: 4.8,
      price: "150 kr/time",
      location: "Oslo",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Dyrepass",
      provider: "Lars, 16",
      rating: 4.9,
      price: "100 kr/time",
      location: "Bergen",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Undervisning - Matematikk",
      provider: "Sofia, 17",
      rating: 4.7,
      price: "200 kr/time",
      location: "Trondheim",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    }
  ];

  const categories = [
    { name: "Husarbeid", icon: "🧹", count: 45 },
    { name: "Dyrepass", icon: "🐕", count: 32 },
    { name: "Undervisning", icon: "📚", count: 28 },
    { name: "Hagearbeid", icon: "🌱", count: 19 },
    { name: "Teknisk hjelp", icon: "💻", count: 23 },
    { name: "Barnepass", icon: "👶", count: 41 }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: "Etablert verifisering",
      description: "Unge og småjobbsgivere må verifiseres for å kunne bruke plattformen."
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary-600" />,
      title: "Lokale oppdrag",
      description: "Jobber kan bare utføres i ditt nærmiljø, kort vei til og fra oppdrag."
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: "Unge får erfaring",
      description: "Vår plattform ser til at unge tidlig får erfaring i arbeidslivet."
    },
    {
      icon: <CreditCard className="w-8 h-8 text-primary-600" />,
      title: "Enkel og trygg betaling",
      description: "Alle jobber som listes er forhåndsbetalt"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Småjobber i ditt nærmiljø
            </h1>
            <div className="bg-yellow-100 inline-block px-4 py-2 rounded-full mb-4">
              <span className="text-yellow-800 font-medium">Åpen beta</span>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Barnearbeid kobler unge som ønsker jobbmuligheter, med voksne som vil ha småjobber gjort
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/services" className="btn-primary text-lg px-8 py-3 flex items-center justify-center">
                Youth
              </Link>
              <Link to="/create-service" className="btn-secondary text-lg px-8 py-3">
                Småjobbsgivere
              </Link>
            </div>
            
            {/* App Store Buttons */}
            <div className="flex justify-center space-x-4">
              <a href="https://play.google.com/store/apps/details?id=com.barnearbeid.app" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors">
                <span>📱</span>
                <span>Google Play</span>
              </a>
              <a href="https://apps.apple.com/app/barnearbeid/id123456789" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors">
                <span>📱</span>
                <span>App Store</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured In Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Omtalt av</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <a href="https://kampanje.com/premium/januar-2025/innsikt/17-ar-og-grunder---alderen-din-er-bare-et-tall/" target="_blank" rel="noopener noreferrer" className="bg-gray-100 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              <span className="font-semibold text-gray-800">Kampanje</span>
            </a>
            <a href="https://www.finansavisen.no/karriere/2025/01/19/8228927/sebastian-linge-schwaiger-har-startet-youth-on-demand" target="_blank" rel="noopener noreferrer" className="bg-gray-100 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              <span className="font-semibold text-gray-800">Finansavisen</span>
            </a>
            <a href="https://www.akersposten.no/sebastian-17-vil-fa-unge-i-jobb-na-lanserer-han-app-i-oslo-vest/s/5-142-233886" target="_blank" rel="noopener noreferrer" className="bg-gray-100 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              <span className="font-semibold text-gray-800">Akersposten</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Aktive unge tilbydere</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">2,000+</div>
              <div className="text-gray-600">Fullførte tjenester</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">4.8★</div>
              <div className="text-gray-600">Gjennomsnittlig vurdering</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Service Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Kort om tjenesten</h2>
          <h3 className="text-xl text-center text-gray-600 mb-12">Hvorfor bruke Barnearbeid?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Populære kategorier</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/services"
                className="card text-center hover:shadow-xl transition-shadow duration-200"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} tilbydere</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Utvalgte tjenester</h2>
            <Link to="/services" className="text-primary-600 hover:text-primary-700 font-medium">
              Se alle
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="card hover:shadow-xl transition-shadow duration-200"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-3">by {service.provider}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{service.rating}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {service.location}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary-600">{service.price}</span>
                  <span className="text-sm text-gray-500">Available now</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Area Registration Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Meld inn ditt område!
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            For øyeblikket er appen kun tilgjengelig på Ullern og Vestre Aker, men vi har mål om å lansere i flere nye områder i år. Foreslå ditt område! Jo flere som melder seg inn i ditt område jo raskere vil vi tilby Barnearbeid-plattformen hos deg.
          </p>
          <button className="btn-secondary text-lg px-8 py-3">
            Meld interesse
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Klar til å komme i gang?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Bli med i vårt samfunn av unge entreprenører og start med å tilby dine tjenester i dag.
          </p>
          <Link to="/create-service" className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            Opprett din første tjeneste
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 