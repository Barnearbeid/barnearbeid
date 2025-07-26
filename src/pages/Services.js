import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Clock } from 'lucide-react';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'pet-care', name: 'Pet Care' },
    { id: 'tutoring', name: 'Tutoring' },
    { id: 'gardening', name: 'Gardening' },
    { id: 'tech-help', name: 'Tech Help' },
    { id: 'babysitting', name: 'Babysitting' }
  ];

  const services = [
    {
      id: 1,
      title: "House Cleaning",
      category: "cleaning",
      provider: "Emma, 18",
      rating: 4.8,
      reviews: 24,
      price: "150 kr/hour",
      location: "Oslo",
      description: "Professional house cleaning service. I'm reliable, thorough, and pay attention to detail.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
      available: true
    },
    {
      id: 2,
      title: "Dog Walking",
      category: "pet-care",
      provider: "Lars, 16",
      rating: 4.9,
      reviews: 31,
      price: "100 kr/hour",
      location: "Bergen",
      description: "Experienced dog walker. I love animals and provide reliable walking services.",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
      available: true
    },
    {
      id: 3,
      title: "Math Tutoring",
      category: "tutoring",
      provider: "Sofia, 17",
      rating: 4.7,
      reviews: 18,
      price: "200 kr/hour",
      location: "Trondheim",
      description: "Math tutor specializing in algebra and calculus. Patient and effective teaching methods.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
      available: true
    },
    {
      id: 4,
      title: "Garden Maintenance",
      category: "gardening",
      provider: "Ole, 15",
      rating: 4.6,
      reviews: 12,
      price: "120 kr/hour",
      location: "Stavanger",
      description: "Garden maintenance including weeding, planting, and general upkeep.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      available: true
    },
    {
      id: 5,
      title: "Computer Help",
      category: "tech-help",
      provider: "Mia, 16",
      rating: 4.9,
      reviews: 27,
      price: "180 kr/hour",
      location: "Oslo",
      description: "Tech support for computers, phones, and software. Patient and thorough.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      available: true
    },
    {
      id: 6,
      title: "Babysitting",
      category: "babysitting",
      provider: "Anna, 17",
      rating: 4.8,
      reviews: 35,
      price: "130 kr/hour",
      location: "Bergen",
      description: "Experienced babysitter with first aid certification. Fun and responsible.",
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop",
      available: true
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return parseInt(a.price) - parseInt(b.price);
      case 'price-high':
        return parseInt(b.price) - parseInt(a.price);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Services</h1>
          <p className="text-gray-600">Discover talented young people offering services in your area</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search services, providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="rating">Sort by Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedServices.length} of {services.length} services
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedServices.map((service) => (
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
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                <span className="text-lg font-semibold text-primary-600">{service.price}</span>
              </div>
              <p className="text-gray-600 mb-3">by {service.provider}</p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{service.rating}</span>
                  <span className="ml-1 text-sm text-gray-500">({service.reviews})</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {service.location}
                </div>
              </div>
              
              {service.available && (
                <div className="mt-3 flex items-center text-sm text-green-600">
                  <Clock className="w-4 h-4 mr-1" />
                  Available now
                </div>
              )}
            </Link>
          ))}
        </div>

        {sortedServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
            <p className="text-gray-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services; 