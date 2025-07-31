import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
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
      const jobsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const jobData = {
            id: doc.id,
            ...doc.data()
          };
          
          // If job doesn't have providerName, fetch it from users collection
          if (!jobData.providerName && jobData.userId) {
            try {
              const userDoc = await getDoc(doc(db, 'users', jobData.userId));
              if (userDoc.exists()) {
                jobData.providerName = userDoc.data().name;
              } else {
                jobData.providerName = 'Ukjent tilbyder';
              }
            } catch (error) {
              console.error('Error fetching user name:', error);
              jobData.providerName = 'Ukjent tilbyder';
            }
          }
          
          return jobData;
        })
      );
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'cleaning': '🧹',
      'pet-care': '🐕',
      'tutoring': '📚',
      'gardening': '🌱',
      'tech-help': '💻',
      'babysitting': '👶',
      'cooking': '👨‍🍳',
      'other': '✨'
    };
    return icons[category] || '✨';
  };

  const getCategoryName = (category) => {
    const names = {
      'cleaning': 'Husarbeid',
      'pet-care': 'Dyrepass',
      'tutoring': 'Undervisning',
      'gardening': 'Hagearbeid',
      'tech-help': 'Teknisk hjelp',
      'babysitting': 'Barnepass',
      'cooking': 'Matlaging',
      'other': 'Annet'
    };
    return names[category] || 'Annet';
  };

  const filteredJobs = filter === 'all' ? jobs : jobs.filter(job => job.category === filter);

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
              onClick={() => setFilter('cleaning')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'cleaning' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🧹 Husarbeid
            </button>
            <button
              onClick={() => setFilter('tutoring')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'tutoring' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📚 Undervisning
            </button>
            <button
              onClick={() => setFilter('babysitting')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'babysitting' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👶 Barnepass
            </button>
            <button
              onClick={() => setFilter('gardening')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'gardening' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🌱 Hagearbeid
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
                  <span className="text-2xl">{getCategoryIcon(job.category)}</span>
                </div>
                
                <p className="text-gray-600 mb-2">av {job.providerName || 'Ukjent tilbyder'}</p>
                
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