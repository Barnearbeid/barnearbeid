import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Clock, User, Briefcase, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import LoadingSpinner from '../components/LoadingSpinner';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = useMemo(() => [
    { id: 'all', name: 'Alle kategorier' },
    { id: 'grass-cutting', name: 'Klippe gress' },
    { id: 'weed-removal', name: 'Fjerne ugress' },
    { id: 'hedge-cutting', name: 'Klippe hekk' },
    { id: 'cleaning', name: 'Rengjøre' },
    { id: 'window-washing', name: 'Vaske vinduer' },
    { id: 'heavy-lifting', name: 'Bærejobb' },
    { id: 'painting', name: 'Male' },
    { id: 'car-washing', name: 'Vaske bilen' },
    { id: 'snow-shoveling', name: 'Snømåking' },
    { id: 'moving-help', name: 'Hjelpe med flytting' },
    { id: 'pet-care', name: 'Dyrepass' }
  ], []);

  useEffect(() => {
    // Check for search parameter in URL
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
    fetchServices();
  }, [searchParams]);

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

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.providerName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Handle both old services with 'category' and new services with 'categories'
      const matchesCategory = selectedCategory === 'all' || 
        (service.categories && Array.isArray(service.categories) 
          ? service.categories.includes(selectedCategory)
          : service.category === selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

  const sortedServices = useMemo(() => {
    return [...filteredServices].sort((a, b) => {
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
  }, [filteredServices, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(sortedServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = sortedServices.slice(startIndex, endIndex);

  const getUserTypeLabel = useMemo(() => (userType) => {
    return userType === 'seeker' ? 'Jobbsøker' : 'Jobbposter';
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    
    // Update URL with search parameter
    if (value.trim()) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page when changing sort
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" text="Laster tjenester..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finn jobber</h1>
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
                  placeholder="Søk etter tjenester, tilbydere..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
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
                onChange={handleSortChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="rating">Sorter etter rating</option>
                <option value="price-low">Pris: Lav til høy</option>
                <option value="price-high">Pris: Høy til lav</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Viser {startIndex + 1}-{Math.min(endIndex, sortedServices.length)} av {sortedServices.length} tjenester
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Services Grid */}
        {currentServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Ingen resultater funnet' : 'Ingen tjenester ennå'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `Ingen tjenester matcher "${searchTerm}". Prøv et annet søkeord.`
                : 'Det er ingen tjenester postet ennå. Vær den første!'
              }
            </p>
            <Link to="/create-service" className="btn-primary">
              Post første tjeneste
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentServices.map((service) => (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="card hover:shadow-xl transition-shadow duration-200"
                >
                  {service.files && service.files.length > 0 && service.files[0].type === 'image' && (
                    <img
                      src={service.files[0].url}
                      alt={service.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                    <span className="text-lg font-semibold text-primary-600">
                      {service.pricingType === 'hourly' ? `${service.price} kr/time` : `${service.price} kr`}
                    </span>
                  </div>
                  
                  {/* Provider info with user type */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-gray-600">av</span>
                    <span className="font-medium">{service.providerName || 'Ukjent tilbyder'}</span>
                    <div className="flex items-center space-x-1">
                      {service.providerType === 'seeker' ? (
                        <User className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-green-600" />
                      )}
                      <span className="text-xs text-gray-500">
                        {getUserTypeLabel(service.providerType)}
                      </span>
                    </div>
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
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-green-600">
                        <Clock className="w-4 h-4 mr-1" />
                        Tilgjengelig nå
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        {service.jobType === 'recurring' ? (
                          <>
                            <span className="text-lg mr-1">🔄</span>
                            <span>Gjentakende</span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg mr-1">🔨</span>
                            <span>Engangsjobb</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        {service.needsCar === 'yes' && (
                          <span className="mr-3">🚗 Bil kreves</span>
                        )}
                        {service.needsEquipment === 'yes' && (
                          <span>🔧 Utstyr kreves</span>
                        )}
                        {service.needsEquipment === 'some' && (
                          <span>🔨 Noe utstyr</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        {service.pricingType === 'hourly' ? (
                          <span>⏰ {service.price} kr/time</span>
                        ) : (
                          <span>💰 {service.price} kr</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Services; 