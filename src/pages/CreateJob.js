import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, X } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

const CreateJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    location: '',
    duration: '',
    requirements: []
  });
  const [images, setImages] = useState([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'cleaning', name: 'Husarbeid', icon: '🧹' },
    { id: 'pet-care', name: 'Dyrepass', icon: '🐕' },
    { id: 'tutoring', name: 'Undervisning', icon: '📚' },
    { id: 'gardening', name: 'Hagearbeid', icon: '🌱' },
    { id: 'tech-help', name: 'Teknisk hjelp', icon: '💻' },
    { id: 'babysitting', name: 'Barnepass', icon: '👶' },
    { id: 'cooking', name: 'Matlaging', icon: '👨‍🍳' },
    { id: 'other', name: 'Annet', icon: '✨' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (requirement) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r !== requirement)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert('Du må være logget inn for å opprette en jobb');
      return;
    }

    setLoading(true);
    try {
      // Upload images
      const imageUrls = [];
      for (const image of images) {
        const imageRef = ref(storage, `jobs/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        imageUrls.push(url);
      }

      // Create job document
      const jobData = {
        ...formData,
        images: imageUrls,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
        status: 'active'
      };

      await addDoc(collection(db, 'jobs'), jobData);
      alert('Jobb opprettet!');
      navigate('/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Feil ved opprettelse av jobb');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Opprett ny jobb</h1>
          <p className="text-gray-600">Beskriv jobben du trenger hjelp med</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Grunnleggende informasjon</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jobbtittel *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Hjelp med husarbeid, Undervisning i matematikk"
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
                  <option value="">Velg kategori</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Betaling (NOK) *
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
                  placeholder="e.g., Oslo, Bergen"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Varighet
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 timer, Hele dagen"
                  className="input-field"
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
                placeholder="Beskriv jobben i detalj..."
                rows="4"
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Krav og forutsetninger</h2>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="e.g., Erfaring med barn, Førerkort"
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="btn-secondary px-4"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {formData.requirements.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.requirements.map((requirement, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                  >
                    {requirement}
                    <button
                      type="button"
                      onClick={() => removeRequirement(requirement)}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Bilder (valgfritt)</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-gray-600">
                  Last opp bilder som viser jobben eller eksempler på arbeid
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-2 hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="mt-2 btn-primary inline-block cursor-pointer">
                  Velg filer
                </label>
              </div>
            </div>

            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 text-lg"
            >
              {loading ? 'Oppretter...' : 'Opprett jobb'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob; 