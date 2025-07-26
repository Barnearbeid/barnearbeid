import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Calendar, MessageCircle, Phone, Mail, ArrowLeft, User, Briefcase } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Messaging from '../components/Messaging';
import RatingSystem from '../components/RatingSystem';

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

  useEffect(() => {
    fetchService();
    if (auth.currentUser) {
      fetchCurrentUser();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const serviceDoc = await getDoc(doc(db, 'jobs', id));
      
      if (serviceDoc.exists()) {
        setService({
          id: serviceDoc.id,
          ...serviceDoc.data()
        });
      } else {
        setError('Tjeneste ikke funnet');
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      setError('Kunne ikke laste tjeneste');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setCurrentUser(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

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
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Laster tjeneste...</p>
          </div>
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
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-gray-600">av</span>
                    <span className="font-medium">{service.providerName || 'Ukjent tilbyder'}</span>
                    <div className="flex items-center space-x-1">
                      {service.providerType === 'seeker' ? (
                        <User className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-green-600" />
                      )}
                      <span className="text-sm text-gray-500">
                        {getUserTypeLabel(service.providerType)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">{service.averageRating || 'Ingen rating'}</span>
                      <span className="ml-1 text-gray-600">({service.reviewCount || 0} vurderinger)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {service.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">{service.price} kr</div>
                  <div className="text-sm text-gray-600">per time</div>
                </div>
              </div>
              
              {service.images && service.images.length > 0 && (
                <img
                  src={service.images[0]}
                  alt={service.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">Om denne tjenesten</h3>
                <p className="text-gray-700 mb-4">{service.description}</p>
              </div>
            </div>

            {/* Provider Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Om {service.providerName || 'tilbyderen'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600"><strong>Erfaring:</strong> {service.experience || 'Ikke spesifisert'}</p>
                  <p className="text-gray-600"><strong>Språk:</strong> {service.languages ? service.languages.join(', ') : 'Ikke spesifisert'}</p>
                </div>
                <div>
                  <p className="text-gray-600"><strong>Sertifikater:</strong></p>
                  <ul className="text-gray-600">
                    {service.certifications && service.certifications.length > 0 ? (
                      service.certifications.map((cert, index) => (
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
            {service.availability && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Tilgjengelighet</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(service.availability).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium capitalize">{day}</span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Vurderinger</h3>
                {auth.currentUser && auth.currentUser.uid !== service.providerId && (
                  <button
                    onClick={handleRateUser}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Vurder denne tilbyderen
                  </button>
                )}
              </div>
              {service.reviews && service.reviews.length > 0 ? (
                <div className="space-y-4">
                  {service.reviews.map((review, index) => (
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
                        <span className="text-sm text-gray-500">{review.date || 'Ukjent dato'}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
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
                <h4 className="font-semibold mb-3">Kontakt {service.providerName || 'tilbyderen'}</h4>
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
      {showMessaging && service.providerId && (
        <Messaging
          targetUserId={service.providerId}
          targetUserName={service.providerName || 'Tilbyder'}
          onClose={() => setShowMessaging(false)}
        />
      )}

      {/* Rating Modal */}
      {showRating && service.providerId && (
        <RatingSystem
          targetUserId={service.providerId}
          targetUserName={service.providerName || 'Tilbyder'}
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