import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Star, Calendar, MapPin, Clock, Settings, User, Bell, CreditCard } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const user = {
    name: "Emma Andersen",
    age: 18,
    location: "Oslo",
    rating: 4.8,
    totalReviews: 24,
    totalEarnings: "12,450 kr",
    completedJobs: 45,
    memberSince: "2023"
  };

  const userServices = [
    {
      id: 1,
      title: "House Cleaning",
      price: "150 kr/hour",
      status: "active",
      bookings: 12,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Window Cleaning",
      price: "200 kr/hour",
      status: "active",
      bookings: 8,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
    }
  ];

  const recentBookings = [
    {
      id: 1,
      service: "House Cleaning",
      client: "Maria S.",
      date: "2024-01-20",
      time: "14:00",
      status: "completed",
      earnings: "300 kr"
    },
    {
      id: 2,
      service: "Window Cleaning",
      client: "Johan K.",
      date: "2024-01-22",
      time: "10:00",
      status: "upcoming",
      earnings: "400 kr"
    },
    {
      id: 3,
      service: "House Cleaning",
      client: "Lisa M.",
      date: "2024-01-18",
      time: "16:00",
      status: "completed",
      earnings: "450 kr"
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'services', name: 'My Services', icon: Settings },
    { id: 'bookings', name: 'Bookings', icon: Calendar },
    { id: 'earnings', name: 'Earnings', icon: CreditCard }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'upcoming': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{user.completedJobs}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">{user.totalEarnings}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900">{user.rating}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Services</p>
              <p className="text-2xl font-bold text-gray-900">{userServices.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
        <div className="space-y-4">
          {recentBookings.slice(0, 3).map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">{booking.service}</p>
                <p className="text-sm text-gray-600">Client: {booking.client}</p>
                <p className="text-sm text-gray-600">{booking.date} at {booking.time}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
                <p className="text-sm font-medium mt-1">{booking.earnings}</p>
              </div>
            </div>
          ))}
        </div>
        <Link to="/profile?tab=bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View all bookings →
        </Link>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">My Services</h3>
        <Link to="/create-service" className="btn-secondary">
          Add New Service
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userServices.map((service) => (
          <div key={service.id} className="card">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-xl font-semibold">{service.title}</h4>
              <span className="text-lg font-semibold text-primary-600">{service.price}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm">{service.rating}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                {service.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{service.bookings} bookings</span>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Edit Service
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">All Bookings</h3>
      
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium">Service</th>
                <th className="text-left py-3 px-4 font-medium">Client</th>
                <th className="text-left py-3 px-4 font-medium">Date & Time</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Earnings</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">{booking.service}</td>
                  <td className="py-3 px-4">{booking.client}</td>
                  <td className="py-3 px-4">{booking.date} at {booking.time}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">{booking.earnings}</td>
                  <td className="py-3 px-4">
                    <button className="text-primary-600 hover:text-primary-700 text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Earnings Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-2">This Month</p>
          <p className="text-3xl font-bold text-primary-600">3,200 kr</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-2">Last Month</p>
          <p className="text-3xl font-bold text-gray-900">2,800 kr</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-2">Total</p>
          <p className="text-3xl font-bold text-gray-900">{user.totalEarnings}</p>
        </div>
      </div>

      <div className="card">
        <h4 className="text-lg font-semibold mb-4">Earnings History</h4>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">{booking.service}</p>
                <p className="text-sm text-gray-600">{booking.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{booking.earnings}</p>
                <p className="text-sm text-gray-600">{booking.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{user.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.age} years old • {user.location}</p>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{user.rating}</span>
                <span className="ml-1 text-gray-600">({user.totalReviews} reviews)</span>
              </div>
            </div>
            <button className="btn-primary flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'services' && renderServices()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'earnings' && renderEarnings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 