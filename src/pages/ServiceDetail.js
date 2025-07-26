import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Calendar, MessageCircle, Phone, Mail, ArrowLeft } from 'lucide-react';
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

  useEffect(() => {
    fetchService();
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
        setError('Service not found');
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      setError('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();
    // In a real app, this would send the booking to an API
    alert('Booking request sent! The provider will contact you soon.');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service...</p>
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Service not found</h3>
            <p className="text-gray-600 mb-6">{error || 'The service you are looking for does not exist.'}</p>
            <Link to="/services" className="btn-primary">
              Back to Services
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
          Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                  <p className="text-gray-600 mb-3">by {service.providerName || 'Unknown Provider'}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">{service.averageRating || 'No rating'}</span>
                      <span className="ml-1 text-gray-600">({service.reviewCount || 0} reviews)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {service.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">{service.price} kr</div>
                  <div className="text-sm text-gray-600">per hour</div>
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
                <h3 className="text-lg font-semibold mb-3">About this service</h3>
                <p className="text-gray-700 mb-4">{service.description}</p>
              </div>
            </div>

            {/* Provider Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">About {service.providerName || 'Provider'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600"><strong>Experience:</strong> {service.experience || 'Not specified'}</p>
                  <p className="text-gray-600"><strong>Languages:</strong> {service.languages ? service.languages.join(', ') : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-600"><strong>Certifications:</strong></p>
                  <ul className="text-gray-600">
                    {service.certifications && service.certifications.length > 0 ? (
                      service.certifications.map((cert, index) => (
                        <li key={index}>• {cert}</li>
                      ))
                    ) : (
                      <li>No certifications listed</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Availability */}
            {service.availability && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Availability</h3>
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
                <h3 className="text-xl font-semibold">Reviews</h3>
                {auth.currentUser && auth.currentUser.uid !== service.providerId && (
                  <button
                    onClick={handleRateUser}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Rate this provider
                  </button>
                )}
              </div>
              {service.reviews && service.reviews.length > 0 ? (
                <div className="space-y-4">
                  {service.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium">{review.userName || 'Anonymous'}</span>
                          <div className="flex items-center ml-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < (review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date || 'Unknown date'}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review this service!</p>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-4">Book this service</h3>
              
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
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
                    Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any special requests or details..."
                    rows="3"
                    className="input-field"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary py-3 text-lg"
                >
                  Request Booking
                </button>
              </form>

              {/* Contact Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-3">Contact {service.providerName || 'Provider'}</h4>
                <div className="space-y-2">
                  <button 
                    onClick={handleSendMessage}
                    className="w-full flex items-center justify-center space-x-2 btn-secondary py-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
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
          targetUserName={service.providerName || 'Provider'}
          onClose={() => setShowMessaging(false)}
        />
      )}

      {/* Rating Modal */}
      {showRating && service.providerId && (
        <RatingSystem
          targetUserId={service.providerId}
          targetUserName={service.providerName || 'Provider'}
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