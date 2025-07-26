import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Star, MessageCircle } from 'lucide-react';

const RatingSystem = ({ targetUserId, targetUserName, onClose, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    checkIfUserHasRated();
  }, [targetUserId]);

  const checkIfUserHasRated = async () => {
    if (!auth.currentUser || !targetUserId) return;
    
    try {
      const q = query(
        collection(db, 'ratings'),
        where('fromUserId', '==', auth.currentUser.uid),
        where('toUserId', '==', targetUserId)
      );
      const querySnapshot = await getDocs(q);
      setHasRated(!querySnapshot.empty);
    } catch (error) {
      console.error('Error checking rating:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser || !targetUserId || rating === 0) return;

    setSubmitting(true);
    try {
      // Add rating to ratings collection
      await addDoc(collection(db, 'ratings'), {
        fromUserId: auth.currentUser.uid,
        toUserId: targetUserId,
        rating: rating,
        comment: comment,
        createdAt: new Date()
      });

      // Update user's average rating
      await updateUserAverageRating(targetUserId);

      onRatingSubmitted && onRatingSubmitted();
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Feil ved sending av vurdering');
    } finally {
      setSubmitting(false);
    }
  };

  const updateUserAverageRating = async (userId) => {
    try {
      const q = query(collection(db, 'ratings'), where('toUserId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const ratings = querySnapshot.docs.map(doc => doc.data().rating);
        const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        
        await updateDoc(doc(db, 'users', userId), {
          averageRating: Math.round(averageRating * 10) / 10,
          totalRatings: ratings.length
        });
      }
    } catch (error) {
      console.error('Error updating average rating:', error);
    }
  };

  if (hasRated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Du har allerede vurdert</h3>
            <p className="text-gray-600 mb-6">
              Du har allerede gitt en vurdering til {targetUserName}
            </p>
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Lukk
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">Vurder {targetUserName}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Din vurdering
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              {rating === 0 && 'Velg antall stjerner'}
              {rating === 1 && 'Dårlig'}
              {rating === 2 && 'Ikke så bra'}
              {rating === 3 && 'OK'}
              {rating === 4 && 'Bra'}
              {rating === 5 && 'Utmerket'}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kommentar (valgfritt)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className="input-field"
              placeholder="Fortell om din opplevelse..."
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="btn-primary flex items-center space-x-2"
            >
              <Star className="w-4 h-4" />
              <span>{submitting ? 'Sender...' : 'Send vurdering'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingSystem; 