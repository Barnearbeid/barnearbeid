import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Calendar, MessageCircle, Phone, Mail, ArrowLeft, User, Briefcase } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Messaging from '../components/Messaging';
import RatingSystem from '../components/RatingSystem';
import LoadingSpinner from '../components/LoadingSpinner';

const ServiceDetail = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchService = useCallback(async () => {
    if (!id) {
      setError('Mangler tjeneste-ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const serviceDoc = await getDoc(doc(db, 'jobs', id));
      
      if (serviceDoc.exists()) {
        const serviceData = serviceDoc.data();
        setService({
          id: serviceDoc.id,
          ...serviceData
        });
      } else {
        setError('Tjeneste ikke funnet');
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      setError('Kunne ikke laste tjeneste. Prøv igjen senere.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchCurrentUser = useCallback(async () => {
    if (!auth.currentUser) {
      setCurrentUser(null);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setCurrentUser(userDoc.data());
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert('Du må være logget inn for å booke en tjeneste');
      return;
    }
    
    if (currentUser?.userType === 'poster') {
      alert('Som jobbposter kan du ikke booke tjenester. Du kan bare tilby tjenester.');
      return;
    }
    
    alert('Booking forespørsel sendt! Tilbyderen vil kontakte deg snart.');
  };

  const handleSendMessage = () => {
    if (!auth.currentUser) {
      alert('Du må være logget inn for å sende meldinger');
      return;
    }
    setShowMessaging(true);
  };

  const handleRateUser = () => {
    if (!auth.currentUser) {
      alert('Du må være logget inn for å vurdere brukere');
      return;
    }
    setShowRating(true);
  };

  const getUserTypeLabel = (userType) => {
    return userType === 'seeker' ? 'Jobbsøker' : 'Jobbposter';
  };

  const getActionButtonText = () => {
    if (!auth.currentUser) return 'Logg inn for å booke';
    if (currentUser?.userType === 'poster') return 'Du kan ikke booke som jobbposter';
    return 'Book denne tjenesten';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" text="Laster tjeneste..." />
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tjeneste ikke funnet</h3>
            <p className="text-gray-600 mb-6">{error || 'Tjenesten du leter etter eksisterer ikke.'}</p>
            <Link to="/services" className="btn-primary">
              Tilbake til tjenester
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Ensure all required fields exist with fallbacks
  const safeService = {
    id: service.id || '',
    title: service.title || 'Ukjent tjeneste',
    description: service.description || 'Ingen beskrivelse tilgjengelig',
    price: service.price || 0,
    location: service.location || 'Ikke spesifisert',
    providerName: service.providerName || 'Ukjent tilbyder',
    providerId: service.providerId || '',
    providerType: service.providerType || 'seeker',
    averageRating: service.averageRating || 0,
    reviewCount: service.reviewCount || 0,
    reviews: service.reviews || [],
    experience: service.experience || 'Ikke spesifisert',
    languages: service.languages || [],
    certifications: service.certifications || [],
    availability: service.availability || {},
    images: service.images || [],
    createdAt: service.createdAt || new Date(),
    status: service.status || 'active'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/services" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tilbake til tjenester
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{safeService.title}</h1>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-gray-600">av</span>
                    <span className="font-medium">{safeService.providerName}</span>
                    <div className="flex items-center space-x-1">
                      {safeService.providerType === 'seeker' ? (
                        <User className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-green-600" />
                      )}
                      <span className="text-sm text-gray-500">
                        {getUserTypeLabel(safeService.providerType)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">{safeService.averageRating || 'Ingen rating'}</span>
                      <span className="ml-1 text-gray-600">({safeService.reviewCount} vurderinger)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {safeService.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">{safeService.price} kr</div>
                  <div className="text-sm text-gray-600">per time</div>
                </div>
              </div>
              
              {safeService.images && safeService.images.length > 0 && (
                <img
                  src={safeService.images[0]}
                  alt={safeService.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">Om denne tjenesten</h3>
                <p className="text-gray-700 mb-4">{safeService.description}</p>
              </div>
            </div>

            {/* Provider Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Om {safeService.providerName}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600"><strong>Erfaring:</strong> {safeService.experience}</p>
                  <p className="text-gray-600"><strong>Språk:</strong> {safeService.languages.length > 0 ? safeService.languages.join(', ') : 'Ikke spesifisert'}</p>
                </div>
                <div>
                  <p className="text-gray-600"><strong>Sertifikater:</strong></p>
                  <ul className="text-gray-600">
                    {safeService.certifications.length > 0 ? (
                      safeService.certifications.map((cert, index) => (
                        <li key={index}>• {cert}</li>
                      ))
                    ) : (
                      <li>Ingen sertifikater listet</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Availability */}
            {safeService.availability && Object.keys(safeService.availability).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Tilgjengelighet</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(safeService.availability).map(([day, hours]) => {
                    let availabilityText = 'Ikke spesifisert';
                    
                    if (typeof hours === 'object' && hours !== null) {
                      if (hours.available !== undefined) {
                        availabilityText = hours.available 
                          ? `${hours.start || '09:00'} - ${hours.end || '17:00'}`
                          : 'Ikke tilgjengelig';
                      } else {
                        availabilityText = 'Ikke spesifisert';
                      }
                    } else if (typeof hours === 'string') {
                      availabilityText = hours;
                    }
                    
                    return (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium capitalize">{day}</span>
                        <span className="text-gray-600">{availabilityText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Vurderinger</h3>
                {auth.currentUser && auth.currentUser.uid !== safeService.providerId && (
                  <button
                    onClick={handleRateUser}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Vurder denne tilbyderen
                  </button>
                )}
              </div>
              {safeService.reviews && safeService.reviews.length > 0 ? (
                <div className="space-y-4">
                  {safeService.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium">{review.userName || 'Anonym'}</span>
                          <div className="flex items-center ml-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < (review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.date ? (typeof review.date === 'object' ? review.date.toDate().toLocaleDateString('no-NO') : review.date) : 'Ukjent dato'}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment || 'Ingen kommentar'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Ingen vurderinger ennå. Vær den første til å vurdere denne tjenesten!</p>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-4">Book denne tjenesten</h3>
              
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dato
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tid
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Velg tid</option>
                    <option value="09:00">9:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Melding (valgfritt)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Spesielle ønsker eller detaljer..."
                    rows="3"
                    className="input-field"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!auth.currentUser || currentUser?.userType === 'poster'}
                  className={`w-full py-3 text-lg rounded-lg font-medium transition-colors ${
                    !auth.currentUser || currentUser?.userType === 'poster'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {getActionButtonText()}
                </button>
              </form>

              {/* Contact Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-3">Kontakt {safeService.providerName}</h4>
                <div className="space-y-2">
                  <button 
                    onClick={handleSendMessage}
                    className="w-full flex items-center justify-center space-x-2 btn-secondary py-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send melding</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                    <Phone className="w-4 h-4" />
                    <span>Ring</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messaging Modal */}
      {showMessaging && safeService.providerId && (
        <Messaging
          targetUserId={safeService.providerId}
          targetUserName={safeService.providerName}
          onClose={() => setShowMessaging(false)}
        />
      )}

      {/* Rating Modal */}
      {showRating && safeService.providerId && (
        <RatingSystem
          targetUserId={safeService.providerId}
          targetUserName={safeService.providerName}
          onClose={() => setShowRating(false)}
          onRatingSubmitted={() => {
            // Refresh the service data to show updated ratings
            fetchService();
          }}
        />
      )}
    </div>
  );
};

export default ServiceDetail; 