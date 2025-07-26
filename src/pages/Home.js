import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, MapPin, CheckCircle, Shield, Users, CreditCard } from 'lucide-react';
import FAQ from '../components/FAQ';

const Home = () => {
  const featuredServices = [
    {
      id: 1,
      title: "Husarbeid",
      provider: "Kari Nordmann, 18",
      rating: 4.8,
      price: "150 kr/time",
      location: "Oslo",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Dyrepass",
      provider: "Ola Nordmann, 16",
      rating: 4.9,
      price: "100 kr/time",
      location: "Bergen",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Undervisning",
      provider: "Mari Nordmann, 17",
      rating: 4.7,
      price: "200 kr/time",
      location: "Trondheim",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    }
  ];

  const categories = [
    { name: "Husarbeid", icon: "🧹", count: 127 },
    { name: "Dyrepass", icon: "🐕", count: 89 },
    { name: "Undervisning", icon: "📚", count: 156 },
    { name: "Hagearbeid", icon: "🌱", count: 73 },
    { name: "Teknisk hjelp", icon: "💻", count: 94 },
    { name: "Barnepass", icon: "👶", count: 112 }
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
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Småjobber i ditt
              <span className="text-primary-600"> nærmiljø</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Koble unge som ønsker jobbmuligheter med voksne som trenger hjelp i hverdagen
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link to="/services" className="btn-primary text-lg px-10 py-4">
                Finn tjenester
              </Link>
              <Link to="/create-service" className="btn-secondary text-lg px-10 py-4">
                Tilby tjeneste
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-3">1,247</div>
              <div className="text-gray-600">Aktive tilbydere</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-3">8,934</div>
              <div className="text-gray-600">Fullførte jobber</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-3">4.9★</div>
              <div className="text-gray-600">Gjennomsnittlig rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Hvorfor Barnearbeid?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Populære kategorier</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/services"
                className="card text-center hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} tilbydere</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Utvalgte tjenester</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="card hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">av {service.provider}</p>
                <div className="flex items-center justify-between mb-4">
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
                  <span className="text-sm text-green-600 font-medium">Tilgjengelig</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Klar til å komme i gang?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Bli med i vårt samfunn og start med å tilby dine tjenester i dag.
          </p>
          <Link to="/create-service" className="bg-white text-primary-600 font-semibold py-4 px-10 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg">
            Opprett din første tjeneste
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 