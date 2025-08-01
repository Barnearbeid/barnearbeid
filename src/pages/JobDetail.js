import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin, Clock, Calendar, ArrowLeft, User } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const jobDoc = await getDoc(doc(db, 'jobs', id));
      if (jobDoc.exists()) {
        const jobData = {
          id: jobDoc.id,
          ...jobDoc.data()
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
        
        setJob(jobData);
      } else {
        setError('Jobb ikke funnet');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      setError('Feil ved henting av jobb');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Laster jobb...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Feil</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/jobs')}
              className="btn-primary"
            >
              Tilbake til jobber
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  // Get categories to display
  const displayCategories = job.categories && Array.isArray(job.categories) 
    ? job.categories 
    : job.category 
      ? [job.category] 
      : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tilbake til jobber
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex space-x-1">
                    {displayCategories.slice(0, 3).map((cat, index) => (
                      <span key={index} className="text-2xl">{getCategoryIcon(cat)}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {displayCategories.map((cat, index) => (
                      <span
                        key={index}
                        className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                      >
                        {getCategoryName(cat)}
                      </span>
                    ))}
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <p className="text-gray-600">av {job.providerName || 'Ukjent tilbyder'}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">{job.price} kr</div>
                <div className="text-sm text-gray-500">Betaling</div>
              </div>
            </div>
          </div>

          {/* Images */}
          {job.images && job.images.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Bilder</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Jobb bilde ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Beskrivelse</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Details */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Detaljer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="font-medium">Sted</div>
                  <div className="text-gray-600">{job.location}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="font-medium">Varighet</div>
                  <div className="text-gray-600">{job.duration || 'Fleksibel'}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="font-medium">Opprettet</div>
                  <div className="text-gray-600">
                    {job.createdAt?.toDate ? 
                      job.createdAt.toDate().toLocaleDateString('no-NO') : 
                      'Nylig'
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="font-medium">Status</div>
                  <div className="text-gray-600 capitalize">{job.status || 'Aktiv'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Krav og forutsetninger</h3>
              <div className="flex flex-wrap gap-2">
                {job.requirements.map((requirement, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  >
                    {requirement}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-6">
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/jobs')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Tilbake til jobber
              </button>
              <button className="flex-1 btn-primary">
                Søk på jobb
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail; 