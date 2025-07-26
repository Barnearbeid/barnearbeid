import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Calendar, MessageCircle, Phone, Mail, ArrowLeft } from 'lucide-react';

const ServiceDetail = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');

  // Mock service data - in a real app, this would come from an API
  const service = {
    id: 1,
    title: "House Cleaning",
    category: "cleaning",
    provider: "Emma, 18",
    providerId: "emma18",
    rating: 4.8,
    reviews: 24,
    price: "150 kr/hour",
    location: "Oslo",
    description: "Professional house cleaning service. I'm reliable, thorough, and pay attention to detail. I specialize in regular cleaning, deep cleaning, and move-in/move-out cleaning. I bring my own supplies and equipment to ensure a thorough job.",
    longDescription: "I offer comprehensive house cleaning services tailored to your needs. Whether you need a one-time deep clean or regular maintenance, I provide reliable and thorough service. I'm experienced with various cleaning techniques and use eco-friendly products when requested. I'm punctual, professional, and always leave your home spotless.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    available: true,
    experience: "2 years",
    languages: ["Norwegian", "English"],
    certifications: ["First Aid", "Cleaning Safety"],
    availability: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Not available"
    }
  };

  const reviews = [
    {
      id: 1,
      user: "Maria S.",
      rating: 5,
      date: "2024-01-15",
      comment: "Emma did an excellent job cleaning our apartment. Very thorough and professional. Highly recommend!"
    },
    {
      id: 2,
      user: "Johan K.",
      rating: 4,
      date: "2024-01-10",
      comment: "Great service, very reliable. Emma was on time and did a good job with the cleaning."
    },
    {
      id: 3,
      user: "Lisa M.",
      rating: 5,
      date: "2024-01-05",
      comment: "Perfect! Emma is very detail-oriented and left our house spotless. Will definitely book again."
    }
  ];

  const handleBooking = (e) => {
    e.preventDefault();
    // In a real app, this would send the booking to an API
    alert('Booking request sent! Emma will contact you soon.');
  };

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
                  <p className="text-gray-600 mb-3">by {service.provider}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">{service.rating}</span>
                      <span className="ml-1 text-gray-600">({service.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {service.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">{service.price}</div>
                  <div className="text-sm text-gray-600">per hour</div>
                </div>
              </div>
              
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">About this service</h3>
                <p className="text-gray-700 mb-4">{service.longDescription}</p>
              </div>
            </div>

            {/* Provider Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">About {service.provider}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600"><strong>Experience:</strong> {service.experience}</p>
                  <p className="text-gray-600"><strong>Languages:</strong> {service.languages.join(', ')}</p>
                </div>
                <div>
                  <p className="text-gray-600"><strong>Certifications:</strong></p>
                  <ul className="text-gray-600">
                    {service.certifications.map((cert, index) => (
                      <li key={index}>• {cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Availability */}
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

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4">Reviews</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-medium">{review.user}</span>
                        <div className="flex items-center ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
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
                <h4 className="font-semibold mb-3">Contact {service.provider}</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center space-x-2 btn-secondary py-2">
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
    </div>
  );
};

export default ServiceDetail; 