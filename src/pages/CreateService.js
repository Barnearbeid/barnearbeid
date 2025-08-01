import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, X } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

const CreateService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    categories: [],
    description: '',
    price: '',
    location: '',
    jobType: 'one-time', // 'one-time' or 'recurring'
    pricingType: 'hourly', // 'hourly' or 'fixed'
    needsCar: 'no', // 'yes' or 'no'
    needsEquipment: 'no' // 'yes' or 'no'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const categories = [
    { id: 'grass-cutting', name: 'Klippe gress', icon: '🌿' },
    { id: 'weed-removal', name: 'Fjerne ugress', icon: '🌱' },
    { id: 'bark-soil', name: 'Legge bark eller ny jord', icon: '🪴' },
    { id: 'hedge-cutting', name: 'Klippe hekk', icon: '🌳' },
    { id: 'garbage-disposal', name: 'Kjøre søppel', icon: '🗑️' },
    { id: 'pressure-washing', name: 'Spyle', icon: '💦' },
    { id: 'cleaning', name: 'Rengjøre', icon: '🧹' },
    { id: 'window-washing', name: 'Vaske vinduer', icon: '🪟' },
    { id: 'heavy-lifting', name: 'Bærejobb', icon: '🏋️' },
    { id: 'painting', name: 'Male', icon: '🎨' },
    { id: 'staining', name: 'Beise', icon: '🪵' },
    { id: 'repair', name: 'Reparere', icon: '🔧' },
    { id: 'organizing', name: 'Rydde', icon: '📦' },
    { id: 'car-washing', name: 'Vaske bilen', icon: '🚗' },
    { id: 'snow-shoveling', name: 'Snømåking', icon: '❄️' },
    { id: 'moving-help', name: 'Hjelpe med flytting', icon: '📦' },
    { id: 'salt-sand', name: 'Strø med sand / salt', icon: '🧂' },
    { id: 'pet-care', name: 'Dyrepass', icon: '🐕' },
    { id: 'other', name: 'Annet', icon: '✨' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleJobTypeChange = (jobType) => {
    setFormData(prev => ({
      ...prev,
      jobType: jobType
    }));
  };

  const handleRadioChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });
    
    if (validFiles.length !== selectedFiles.length) {
      alert('Noen filer ble ikke lagt til. Kun bilder og videoer under 10MB er tillatt.');
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return [];
    
    setUploading(true);
    const uploadedUrls = [];
    
    try {
      for (const file of files) {
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `services/${fileName}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedUrls.push({
          url: downloadURL,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          name: file.name
        });
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      throw new Error('Feil ved opplasting av filer');
    } finally {
      setUploading(false);
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      alert('Du må være logget inn for å opprette en tjeneste');
      return;
    }
    
    if (formData.categories.length === 0) {
      alert('Du må velge minst én kategori');
      return;
    }
    
    if (!formData.jobType) {
      alert('Du må velge type jobb');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload files first
      const uploadedFiles = await uploadFiles();
      
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
        files: uploadedFiles,
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategorier *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categories.map(category => (
                    <label
                      key={category.id}
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.categories.includes(category.id)
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="sr-only"
                      />
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                    </label>
                  ))}
                </div>
                {formData.categories.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">Velg minst én kategori</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type jobb *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.jobType === 'one-time'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="jobType"
                      value="one-time"
                      checked={formData.jobType === 'one-time'}
                      onChange={() => handleJobTypeChange('one-time')}
                      className="sr-only"
                    />
                    <span className="text-lg">🔨</span>
                    <div>
                      <span className="text-sm font-medium">Engangsjobb</span>
                      <p className="text-xs text-gray-500">Enkelt oppdrag</p>
                    </div>
                  </label>
                  <label
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.jobType === 'recurring'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="jobType"
                      value="recurring"
                      checked={formData.jobType === 'recurring'}
                      onChange={() => handleJobTypeChange('recurring')}
                      className="sr-only"
                    />
                    <span className="text-lg">🔄</span>
                    <div>
                      <span className="text-sm font-medium">Gjentakende jobb</span>
                      <p className="text-xs text-gray-500">Regelmessig arbeid</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prisetype *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.pricingType === 'hourly'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pricingType"
                      value="hourly"
                      checked={formData.pricingType === 'hourly'}
                      onChange={() => handleRadioChange('pricingType', 'hourly')}
                      className="sr-only"
                    />
                    <span className="text-lg">⏰</span>
                    <div>
                      <span className="text-sm font-medium">Timebetalt</span>
                      <p className="text-xs text-gray-500">Per time</p>
                    </div>
                  </label>
                  <label
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.pricingType === 'fixed'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pricingType"
                      value="fixed"
                      checked={formData.pricingType === 'fixed'}
                      onChange={() => handleRadioChange('pricingType', 'fixed')}
                      className="sr-only"
                    />
                    <span className="text-lg">💰</span>
                    <div>
                      <span className="text-sm font-medium">Fastpris</span>
                      <p className="text-xs text-gray-500">Fast beløp</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.pricingType === 'hourly' ? 'Pris per time (NOK)' : 'Fastpris (NOK)'} *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder={formData.pricingType === 'hourly' ? "150" : "500"}
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

          {/* Job Requirements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Jobbkrav</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bil kreves
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.needsCar === 'yes'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="needsCar"
                      value="yes"
                      checked={formData.needsCar === 'yes'}
                      onChange={() => handleRadioChange('needsCar', 'yes')}
                      className="sr-only"
                    />
                    <span className="text-lg">🚗</span>
                    <span className="text-sm font-medium">Ja</span>
                  </label>
                  <label
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.needsCar === 'no'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="needsCar"
                      value="no"
                      checked={formData.needsCar === 'no'}
                      onChange={() => handleRadioChange('needsCar', 'no')}
                      className="sr-only"
                    />
                    <span className="text-lg">❌</span>
                    <span className="text-sm font-medium">Nei</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Utstyr kreves
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.needsEquipment === 'yes'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="needsEquipment"
                      value="yes"
                      checked={formData.needsEquipment === 'yes'}
                      onChange={() => handleRadioChange('needsEquipment', 'yes')}
                      className="sr-only"
                    />
                    <span className="text-lg">🔧</span>
                    <span className="text-sm font-medium">Ja</span>
                  </label>
                  <label
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.needsEquipment === 'some'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="needsEquipment"
                      value="some"
                      checked={formData.needsEquipment === 'some'}
                      onChange={() => handleRadioChange('needsEquipment', 'some')}
                      className="sr-only"
                    />
                    <span className="text-lg">🔨</span>
                    <span className="text-sm font-medium">Noe utstyr</span>
                  </label>
                  <label
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.needsEquipment === 'no'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="needsEquipment"
                      value="no"
                      checked={formData.needsEquipment === 'no'}
                      onChange={() => handleRadioChange('needsEquipment', 'no')}
                      className="sr-only"
                    />
                    <span className="text-lg">❌</span>
                    <span className="text-sm font-medium">Nei</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Photos & Videos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Bilder og videoer (valgfritt)</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-gray-600 mb-4">
                  Last opp bilder og videoer av ditt arbeid for å bygge tillit med kunder
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Maksimal filstørrelse: 10MB. Støttede formater: JPG, PNG, GIF, MP4, MOV
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="btn-primary cursor-pointer inline-block"
                >
                  Velg filer
                </label>
              </div>
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Valgte filer ({files.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover"
                            muted
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploading && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Laster opp filer...</span>
                </div>
              </div>
            )}
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
              disabled={loading || uploading}
              className="btn-primary px-8 py-3 text-lg"
            >
              {loading || uploading ? 'Oppretter...' : 'Opprett tjeneste'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService; 