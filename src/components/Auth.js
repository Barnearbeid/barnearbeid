import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User, Briefcase } from 'lucide-react';

const Auth = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [userType, setUserType] = useState('seeker'); // 'seeker' or 'poster'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let userCredential;
      
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Create user profile in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: formData.name,
          age: parseInt(formData.age),
          location: formData.location,
          userType: userType,
          createdAt: new Date(),
          email: formData.email
        });
      }
      
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{isLogin ? 'Logg inn' : 'Registrer deg'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {!isLogin && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Jeg er:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('seeker')}
                className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 ${
                  userType === 'seeker' 
                    ? 'border-primary-600 bg-primary-50 text-primary-600' 
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Jobbsøker</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('poster')}
                className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 ${
                  userType === 'poster' 
                    ? 'border-primary-600 bg-primary-50 text-primary-600' 
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                <span>Jobbposter</span>
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {userType === 'seeker' 
                ? 'Jobbsøkere kan søke og booke jobber' 
                : 'Jobbpostere kan opprette og tilby tjenester'
              }
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Navn</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alder</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input-field"
                  min="13"
                  max="25"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sted</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Oslo, Bergen, etc."
                  required
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">E-post</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Passord</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input-field"
              minLength="6"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3"
          >
            {loading ? 'Laster...' : (isLogin ? 'Logg inn' : 'Registrer deg')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            {isLogin ? 'Ny bruker? Registrer deg' : 'Har du konto? Logg inn'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth; 