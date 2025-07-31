import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, X } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const CreateService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    location: '',
    experience: '',
    languages: [],
    certifications: [],
    availability: {
      monday: { available: false, start: '09:00', end: '17:00' },
      tuesday: { available: false, start: '09:00', end: '17:00' },
      wednesday: { available: false, start: '09:00', end: '17:00' },
      thursday: { available: false, start: '09:00', end: '17:00' },
      friday: { available: false, start: '09:00', end: '17:00' },
      saturday: { available: false, start: '09:00', end: '17:00' },
      sunday: { available: false, start: '09:00', end: '17:00' }
    }
  });

  const [newLanguage, setNewLanguage] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { id: 'cleaning', name: 'Rengjøring', icon: '🧹' },
    { id: 'pet-care', name: 'Dyrepass', icon: '🐕' },
    { id: 'tutoring', name: 'Undervisning', icon: '📚' },
    { id: 'gardening', name: 'Hagearbeid', icon: '🌱' },
    { id: 'tech-help', name: 'Teknisk hjelp', icon: '💻' },
    { id: 'babysitting', name: 'Barnepass', icon: '👶' },
    { id: 'cooking', name: 'Matlaging', icon: '👨‍🍳' },
    { id: 'photography', name: 'Fotografering', icon: '📸' },
    { id: 'music', name: 'Musikkundervisning', icon: '🎵' },
    { id: 'sports', name: 'Idrettscoaching', icon: '⚽' },
    { id: 'art', name: 'Kunst & Håndverk', icon: '🎨' },
    { id: 'other', name: 'Annet', icon: '✨' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certification) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== certification)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      alert('Du må være logget inn for å opprette en tjeneste');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare the job data
      const jobData = {
        ...formData,
        userId: auth.currentUser.uid,
        providerId: auth.currentUser.uid,
        providerName: auth.currentUser.displayName || 'Ukjent tilbyder',
        providerType: 'seeker', // Default to seeker since they're offering services
        price: parseInt(formData.price),
        createdAt: new Date(),
        status: 'active',
        images: [], // Will be implemented later
        averageRating: 0,
        reviewCount: 0,
        reviews: []
      };

      // Save to Firebase
      const docRef = await addDoc(collection(db, 'jobs'), jobData);
      
      console.log('Job created with ID:', docRef.id);
      alert('Tjeneste opprettet!');
      navigate('/services');
      
    } catch (error) {
      console.error('Error creating job:', error);
      setError('Feil ved opprettelse av tjeneste. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Opprett din tjeneste</h1>
          <p className="text-gray-600">Del dine ferdigheter og start å tjene penger</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Grunnleggende informasjon</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tjenestetittel *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="f.eks. Husrengjøring, Matematikkundervisning"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Velg en kategori</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pris per time (NOK) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="150"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sted *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="f.eks. Oslo, Bergen"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beskrivelse *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Beskriv din tjeneste, erfaring og hva som gjør deg unik..."
                rows="4"
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Experience & Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Erfaring og ferdigheter</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  År med erfaring
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="f.eks. 2 år, 6 måneder"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Språk du snakker
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="f.eks. Norsk"
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="btn-secondary px-4"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.languages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.languages.map((language, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                      >
                        {language}
                        <button
                          type="button"
                          onClick={() => removeLanguage(language)}
                          className="ml-2"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sertifikater og kvalifikasjoner
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="f.eks. Førstehjelpssertifikat"
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={addCertification}
                  className="btn-secondary px-4"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.certifications.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.certifications.map((certification, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-100 text-secondary-800"
                    >
                      {certification}
                      <button
                        type="button"
                        onClick={() => removeCertification(certification)}
                        className="ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Tilgjengelighet</h2>
            
            <div className="space-y-4">
              {Object.entries(formData.availability).map(([day, schedule]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-24">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={schedule.available}
                        onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 font-medium capitalize">{day}</span>
                    </label>
                  </div>
                  
                  {schedule.available && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={schedule.start}
                        onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                        className="input-field w-32"
                      />
                      <span>til</span>
                      <input
                        type="time"
                        value={schedule.end}
                        onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                        className="input-field w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Bilder (valgfritt)</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-gray-600">
                  Last opp bilder av ditt arbeid eller deg selv for å bygge tillit med kunder
                </p>
                <button
                  type="button"
                  className="mt-2 btn-primary"
                >
                  Velg filer
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 text-lg"
            >
              {loading ? 'Oppretter...' : 'Opprett tjeneste'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService; 