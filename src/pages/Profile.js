import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Star, Calendar, MapPin, Clock, Settings, User, Bell, CreditCard, MessageCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import EditProfile from '../components/EditProfile';
import Messaging from '../components/Messaging';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [userJobs, setUserJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showMessaging, setShowMessaging] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      fetchUserData();
      fetchUserJobs();
      const unsubscribe = fetchMessages();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, []);

  const fetchUserData = useCallback(async () => {
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
  }, []);

  const fetchUserJobs = useCallback(async () => {
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
  }, []);

  const fetchMessages = useCallback(() => {
    if (!auth.currentUser) return;

    let unsubscribe1, unsubscribe2;

    // Listen for messages where current user is either sender or receiver
    const q1 = query(
      collection(db, 'messages'),
      where('fromUserId', '==', auth.currentUser.uid)
    );

    const q2 = query(
      collection(db, 'messages'),
      where('toUserId', '==', auth.currentUser.uid)
    );

    unsubscribe1 = onSnapshot(q1, (snapshot) => {
      const sentMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'sent'
      }));
      
      setMessages(prev => {
        const receivedMessages = prev.filter(m => m.type === 'received');
        return [...sentMessages, ...receivedMessages];
      });
    });

    unsubscribe2 = onSnapshot(q2, (snapshot) => {
      const receivedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'received'
      }));
      
      setMessages(prev => {
        const sentMessages = prev.filter(m => m.type === 'sent');
        return [...sentMessages, ...receivedMessages];
      });
    });

    return () => {
      if (unsubscribe1) unsubscribe1();
      if (unsubscribe2) unsubscribe2();
    };
  }, []);

  const getChatPartners = useMemo(() => {
    const chatPartners = new Map();
    
    messages.forEach(message => {
      const partnerId = message.fromUserId === auth.currentUser?.uid 
        ? message.toUserId 
        : message.fromUserId;
      
      if (!chatPartners.has(partnerId)) {
        chatPartners.set(partnerId, {
          userId: partnerId,
          lastMessage: message.message,
          lastMessageTime: message.createdAt,
          unreadCount: 0
        });
      } else {
        const chat = chatPartners.get(partnerId);
        if (message.createdAt > chat.lastMessageTime) {
          chat.lastMessage = message.message;
          chat.lastMessageTime = message.createdAt;
        }
        if (message.toUserId === auth.currentUser?.uid && !message.read) {
          chat.unreadCount++;
        }
      }
    });
    
    return Array.from(chatPartners.values()).sort((a, b) => b.lastMessageTime - a.lastMessageTime);
  }, [messages]);

  const recentBookings = [];

  const tabs = [
    { id: 'overview', name: 'Oversikt', icon: User },
    { id: 'services', name: 'Mine tjenester', icon: Settings },
    { id: 'messages', name: 'Meldinger', icon: MessageCircle },
    { id: 'bookings', name: 'Bookinger', icon: Calendar },
    { id: 'earnings', name: 'Inntekter', icon: CreditCard }
  ];

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'upcoming': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }, []);

  const renderOverview = useCallback(() => (
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
              <p className="text-2xl font-bold text-gray-900">{user?.averageRating || 'N/A'}</p>
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
              <p className="text-2xl font-bold text-gray-900">{user?.totalRatings || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{user?.userType === 'seeker' ? 'Jobbsøker' : 'Jobbposter'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Nylige bookinger</h3>
        <div className="space-y-4">
          {recentBookings.slice(0, 3).map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">{booking.service}</p>
                <p className="text-sm text-gray-600">Klient: {booking.client}</p>
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
          Se alle bookinger →
        </Link>
      </div>
    </div>
  ), [userJobs.length, user?.averageRating, user?.totalRatings, user?.userType, getStatusColor]);

  const renderServices = useCallback(() => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Mine jobber</h3>
        <Link to="/create-service" className="btn-secondary">
          Post ny jobb
        </Link>
      </div>
      
      {userJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingen jobber ennå</h3>
          <p className="text-gray-600 mb-6">Du har ikke postet noen jobber ennå.</p>
          <Link to="/create-service" className="btn-primary">
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
                  to={`/services/${job.id}`}
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
  ), [userJobs, getStatusColor]);

  const renderMessages = useCallback(() => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Meldinger</h3>
        
        {getChatPartners.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingen meldinger ennå</h3>
            <p className="text-gray-600">Du har ingen meldinger ennå.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {getChatPartners.map((chat) => (
              <div
                key={chat.userId}
                onClick={() => {
                  setSelectedChat(chat);
                  setShowMessaging(true);
                }}
                className="card cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {chat.userName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{chat.userName || 'Ukjent bruker'}</h4>
                      <p className="text-sm text-gray-600 truncate max-w-xs">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {chat.lastMessageTime?.toDate ? 
                        chat.lastMessageTime.toDate().toLocaleDateString('no-NO') : 
                        'Nylig'
                      }
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="inline-block bg-primary-600 text-white text-xs rounded-full px-2 py-1 mt-1">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }, [getChatPartners]);

  const renderBookings = useCallback(() => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Alle bookinger</h3>
      
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium">Tjeneste</th>
                <th className="text-left py-3 px-4 font-medium">Klient</th>
                <th className="text-left py-3 px-4 font-medium">Dato & Tid</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Inntekter</th>
                <th className="text-left py-3 px-4 font-medium">Handlinger</th>
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
                      Se detaljer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ), [getStatusColor]);

  const renderEarnings = useCallback(() => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Inntektsoversikt</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-2">Denne måneden</p>
          <p className="text-3xl font-bold text-primary-600">3,200 kr</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-2">Forrige måned</p>
          <p className="text-3xl font-bold text-gray-900">2,800 kr</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-2">Totalt</p>
          <p className="text-3xl font-bold text-gray-900">{user?.totalEarnings}</p>
        </div>
      </div>

      <div className="card">
        <h4 className="text-lg font-semibold mb-4">Inntektshistorikk</h4>
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
  ), [user?.totalEarnings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" text="Laster profil..." />
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
            {activeTab === 'messages' && renderMessages()}
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

      {/* Messaging Modal */}
      {showMessaging && selectedChat && (
        <Messaging
          targetUserId={selectedChat.userId}
          targetUserName={selectedChat.userName || 'Ukjent bruker'}
          onClose={() => {
            setShowMessaging(false);
            setSelectedChat(null);
          }}
        />
      )}
    </div>
  );
};

export default Profile; 