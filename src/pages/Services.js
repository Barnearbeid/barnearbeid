import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Clock } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'pet-care', name: 'Pet Care' },
    { id: 'tutoring', name: 'Tutoring' },
    { id: 'gardening', name: 'Gardening' },
    { id: 'tech-help', name: 'Tech Help' },
    { id: 'babysitting', name: 'Babysitting' }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const servicesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      case 'price-low':
        return parseInt(a.price) - parseInt(b.price);
      case 'price-high':
        return parseInt(b.price) - parseInt(a.price);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Laster tjenester...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finn tjenester</h1>
          <p className="text-gray-600">Oppdage talentfulle unge som tilbyr tjenester i ditt område</p>
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
        {sortedServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingen tjenester ennå</h3>
            <p className="text-gray-600 mb-6">Det er ingen tjenester postet ennå. Vær den første!</p>
            <Link to="/create-job" className="btn-primary">
              Post første tjeneste
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedServices.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="card hover:shadow-xl transition-shadow duration-200"
              >
                {service.images && service.images.length > 0 && (
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                  <span className="text-lg font-semibold text-primary-600">{service.price} kr</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {service.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.duration || 'Fleksibel'}
                  </div>
                </div>
                
                <div className="mt-3 flex items-center text-sm text-green-600">
                  <Clock className="w-4 h-4 mr-1" />
                  Tilgjengelig nå
                </div>
              </Link>
            ))}
          </div>
        )}


      </div>
    </div>
  );
};

export default Services; 