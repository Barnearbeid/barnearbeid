import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, X } from 'lucide-react';

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

  const categories = [
    { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
    { id: 'pet-care', name: 'Pet Care', icon: '🐕' },
    { id: 'tutoring', name: 'Tutoring', icon: '📚' },
    { id: 'gardening', name: 'Gardening', icon: '🌱' },
    { id: 'tech-help', name: 'Tech Help', icon: '💻' },
    { id: 'babysitting', name: 'Babysitting', icon: '👶' },
    { id: 'cooking', name: 'Cooking', icon: '👨‍🍳' },
    { id: 'photography', name: 'Photography', icon: '📸' },
    { id: 'music', name: 'Music Lessons', icon: '🎵' },
    { id: 'sports', name: 'Sports Coaching', icon: '⚽' },
    { id: 'art', name: 'Art & Crafts', icon: '🎨' },
    { id: 'other', name: 'Other', icon: '✨' }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the data to an API
    console.log('Service data:', formData);
    alert('Service created successfully!');
    navigate('/services');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Service</h1>
          <p className="text-gray-600">Share your skills and start earning money</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., House Cleaning, Math Tutoring"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Hour (NOK) *
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
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Oslo, Bergen"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your service, experience, and what makes you unique..."
                rows="4"
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Experience & Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Experience & Skills</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 years, 6 months"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages You Speak
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="e.g., Norwegian"
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
                Certifications & Qualifications
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="e.g., First Aid Certificate"
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
            <h2 className="text-xl font-semibold mb-6">Availability</h2>
            
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
                      <span>to</span>
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
            <h2 className="text-xl font-semibold mb-6">Photos (Optional)</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-gray-600">
                  Upload photos of your work or yourself to build trust with customers
                </p>
                <button
                  type="button"
                  className="mt-2 btn-primary"
                >
                  Choose Files
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
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-8 py-3 text-lg"
            >
              Create Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService; 