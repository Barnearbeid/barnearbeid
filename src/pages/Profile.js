import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Star, Calendar, MapPin, Clock, Settings, User, Bell, CreditCard } from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import EditProfile from '../components/EditProfile';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [userJobs, setUserJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      fetchUserData();
      fetchUserJobs();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          ...userData,
          memberSince: userData.createdAt?.toDate?.()?.getFullYear() || new Date().getFullYear()
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserJobs = async () => {
    try {
      const q = query(collection(db, 'jobs'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const jobs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserJobs(jobs);
    } catch (error) {
      console.error('Error fetching user jobs:', error);
    }
  };

  const recentBookings = [];

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
              <p className="text-sm text-gray-600">Posterte jobber</p>
              <p className="text-2xl font-bold text-gray-900">{userJobs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Gjennomsnittlig rating</p>
              <p className="text-2xl font-bold text-gray-900">{user.averageRating || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Totale vurderinger</p>
              <p className="text-2xl font-bold text-gray-900">{user.totalRatings || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Bruker type</p>
              <p className="text-2xl font-bold text-gray-900">{user.userType === 'seeker' ? 'Jobbsøker' : 'Jobbposter'}</p>
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
        <h3 className="text-lg font-semibold">Mine jobber</h3>
        <Link to="/create-job" className="btn-secondary">
          Post ny jobb
        </Link>
      </div>
      
      {userJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingen jobber ennå</h3>
          <p className="text-gray-600 mb-6">Du har ikke postet noen jobber ennå.</p>
          <Link to="/create-job" className="btn-primary">
            Post din første jobb
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userJobs.map((job) => (
            <div key={job.id} className="card">
              {job.images && job.images.length > 0 && (
                <img
                  src={job.images[0]}
                  alt={job.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-xl font-semibold">{job.title}</h4>
                <span className="text-lg font-semibold text-primary-600">{job.price} kr</span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{job.location}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {job.createdAt?.toDate ? 
                    job.createdAt.toDate().toLocaleDateString('no-NO') : 
                    'Nylig'
                  }
                </span>
                <Link 
                  to={`/jobs/${job.id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Se detaljer
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Laster profil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil ikke funnet</h2>
            <p className="text-gray-600">Kunne ikke laste brukerdata.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        {user && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{user.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.age} år • {user.location}</p>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{user.averageRating || 'N/A'}</span>
                  <span className="ml-1 text-gray-600">({user.totalRatings || 0} vurderinger)</span>
                </div>
              </div>
              <button 
                onClick={() => setShowEditProfile(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Rediger profil</span>
              </button>
            </div>
          </div>
        )}

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

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfile 
          onClose={() => setShowEditProfile(false)}
          onUpdate={() => {
            fetchUserData();
            setShowEditProfile(false);
          }}
        />
      )}
    </div>
  );
};

export default Profile; 