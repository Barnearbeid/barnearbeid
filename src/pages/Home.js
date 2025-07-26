import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';

const Home = () => {
  const featuredServices = [
    {
      id: 1,
      title: "House Cleaning",
      provider: "Emma, 18",
      rating: 4.8,
      price: "150 kr/hour",
      location: "Oslo",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Dog Walking",
      provider: "Lars, 16",
      rating: 4.9,
      price: "100 kr/hour",
      location: "Bergen",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Tutoring - Math",
      provider: "Sofia, 17",
      rating: 4.7,
      price: "200 kr/hour",
      location: "Trondheim",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    }
  ];

  const categories = [
    { name: "Cleaning", icon: "🧹", count: 45 },
    { name: "Pet Care", icon: "🐕", count: 32 },
    { name: "Tutoring", icon: "📚", count: 28 },
    { name: "Gardening", icon: "🌱", count: 19 },
    { name: "Tech Help", icon: "💻", count: 23 },
    { name: "Babysitting", icon: "👶", count: 41 }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Youth Services
              <span className="text-primary-600"> On-Demand</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with talented young people offering reliable services in your area. 
              From cleaning to tutoring, find the help you need from trusted youth providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services" className="btn-primary text-lg px-8 py-3 flex items-center justify-center">
                Find Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/create-service" className="btn-secondary text-lg px-8 py-3">
                Offer Your Service
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Active Youth Providers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">2,000+</div>
              <div className="text-gray-600">Completed Services</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/services"
                className="card text-center hover:shadow-xl transition-shadow duration-200"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} providers</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Services</h2>
            <Link to="/services" className="text-primary-600 hover:text-primary-700 font-medium">
              View All
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

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our community of young entrepreneurs and start offering your services today.
          </p>
          <Link to="/create-service" className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            Create Your First Service
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 