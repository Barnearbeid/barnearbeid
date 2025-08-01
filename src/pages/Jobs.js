import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Star, MapPin, Clock, Calendar, Plus } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'grass-cutting': '🌿',
      'weed-removal': '🌱',
      'bark-soil': '🪴',
      'hedge-cutting': '🌳',
      'garbage-disposal': '🗑️',
      'pressure-washing': '💦',
      'cleaning': '🧹',
      'window-washing': '🪟',
      'heavy-lifting': '🏋️',
      'painting': '🎨',
      'staining': '🪵',
      'repair': '🔧',
      'organizing': '📦',
      'car-washing': '🚗',
      'snow-shoveling': '❄️',
      'moving-help': '📦',
      'salt-sand': '🧂',
      'pet-care': '🐕',
      'other': '✨'
    };
    return icons[category] || '✨';
  };

  const getCategoryName = (category) => {
    const names = {
      'grass-cutting': 'Klippe gress',
      'weed-removal': 'Fjerne ugress',
      'bark-soil': 'Legge bark eller ny jord',
      'hedge-cutting': 'Klippe hekk',
      'garbage-disposal': 'Kjøre søppel',
      'pressure-washing': 'Spyle',
      'cleaning': 'Rengjøre',
      'window-washing': 'Vaske vinduer',
      'heavy-lifting': 'Bærejobb',
      'painting': 'Male',
      'staining': 'Beise',
      'repair': 'Reparere',
      'organizing': 'Rydde',
      'car-washing': 'Vaske bilen',
      'snow-shoveling': 'Snømåking',
      'moving-help': 'Hjelpe med flytting',
      'salt-sand': 'Strø med sand / salt',
      'pet-care': 'Dyrepass',
      'other': 'Annet'
    };
    return names[category] || 'Annet';
  };

  const filteredJobs = filter === 'all' ? jobs : jobs.filter(job => {
    // Handle both old jobs with 'category' and new jobs with 'categories'
    if (job.categories && Array.isArray(job.categories)) {
      return job.categories.includes(filter);
    }
    return job.category === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Laster jobber...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ledige jobber</h1>
            <p className="text-gray-600">Finn jobber som passer deg</p>
          </div>
          <Link to="/create-job" className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Post jobb</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alle
            </button>
            <button
              onClick={() => setFilter('grass-cutting')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'grass-cutting' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🌿 Klippe gress
            </button>
            <button
              onClick={() => setFilter('weed-removal')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'weed-removal' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🌱 Fjerne ugress
            </button>
            <button
              onClick={() => setFilter('hedge-cutting')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'hedge-cutting' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🌳 Klippe hekk
            </button>
            <button
              onClick={() => setFilter('cleaning')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'cleaning' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🧹 Rengjøre
            </button>
            <button
              onClick={() => setFilter('window-washing')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'window-washing' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🪟 Vaske vinduer
            </button>
            <button
              onClick={() => setFilter('heavy-lifting')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'heavy-lifting' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏋️ Bærejobb
            </button>
            <button
              onClick={() => setFilter('painting')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'painting' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎨 Male
            </button>
            <button
              onClick={() => setFilter('car-washing')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'car-washing' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🚗 Vaske bilen
            </button>
            <button
              onClick={() => setFilter('snow-shoveling')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'snow-shoveling' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ❄️ Snømåking
            </button>
            <button
              onClick={() => setFilter('moving-help')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'moving-help' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📦 Hjelpe med flytting
            </button>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingen jobber funnet</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Det er ingen jobber postet ennå. Vær den første!' 
                : `Ingen jobber i kategorien "${getCategoryName(filter)}"`
              }
            </p>
            <Link to="/create-job" className="btn-primary">
              Post første jobb
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="card hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                {job.images && job.images.length > 0 && (
                  <img
                    src={job.images[0]}
                    alt={job.title}
                    className="w-full h-48 object-cover rounded-xl mb-6"
                  />
                )}
                
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <div className="flex space-x-1">
                    {job.categories && Array.isArray(job.categories) ? (
                      job.categories.slice(0, 2).map((cat, index) => (
                        <span key={index} className="text-lg">{getCategoryIcon(cat)}</span>
                      ))
                    ) : (
                      <span className="text-2xl">{getCategoryIcon(job.category)}</span>
                    )}
                    {job.categories && job.categories.length > 2 && (
                      <span className="text-sm text-gray-500">+{job.categories.length - 2}</span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{job.duration || 'Fleksibel'}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary-600">{job.price} kr</span>
                  <span className="text-sm text-gray-500">
                    {job.createdAt?.toDate ? 
                      job.createdAt.toDate().toLocaleDateString('no-NO') : 
                      'Nylig'
                    }
                  </span>
                </div>

                {job.requirements && job.requirements.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {req}
                        </span>
                      ))}
                      {job.requirements.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{job.requirements.length - 3} mer
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs; 