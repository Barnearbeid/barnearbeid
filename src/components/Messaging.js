import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, onSnapshot, getDoc, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Send, MessageCircle, X } from 'lucide-react';

const Messaging = ({ targetUserId, targetUserName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (auth.currentUser && targetUserId) {
      loadMessages();
      markMessagesAsRead();
    }
  }, [targetUserId]);

  const markMessagesAsRead = async () => {
    if (!auth.currentUser || !targetUserId) return;

    try {
      // Query for unread messages from this specific user
      const q = query(
        collection(db, 'messages'),
        where('fromUserId', '==', targetUserId),
        where('toUserId', '==', auth.currentUser.uid),
        where('read', '==', false)
      );

      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const batch = writeBatch(db);
        
        snapshot.docs.forEach((doc) => {
          batch.update(doc.ref, { read: true });
        });
        
        await batch.commit();
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const loadMessages = () => {
    // Query for messages between these two users (both directions)
    const q1 = query(
      collection(db, 'messages'),
      where('fromUserId', '==', auth.currentUser.uid),
      where('toUserId', '==', targetUserId),
      orderBy('createdAt', 'asc')
    );

    const q2 = query(
      collection(db, 'messages'),
      where('fromUserId', '==', targetUserId),
      where('toUserId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe1 = onSnapshot(q1, (snapshot) => {
      const sentMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Combine with received messages
      const allMessages = [...sentMessages, ...messages.filter(m => m.fromUserId === targetUserId)];
      setMessages(allMessages.sort((a, b) => a.createdAt - b.createdAt));
      setLoading(false);
    });

    const unsubscribe2 = onSnapshot(q2, (snapshot) => {
      const receivedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Combine with sent messages
      const allMessages = [...messages.filter(m => m.fromUserId === auth.currentUser.uid), ...receivedMessages];
      setMessages(allMessages.sort((a, b) => a.createdAt - b.createdAt));
      setLoading(false);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    setSending(true);
    try {
      await addDoc(collection(db, 'messages'), {
        fromUserId: auth.currentUser.uid,
        toUserId: targetUserId,
        message: newMessage.trim(),
        createdAt: new Date(),
        read: false
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Feil ved sending av melding');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('no-NO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-center">Laster meldinger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6 text-primary-600" />
            <div>
              <h3 className="font-semibold">Chat med {targetUserName}</h3>
              <p className="text-sm text-gray-600">Direktemelding</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Ingen meldinger ennå</p>
              <p className="text-sm">Start en samtale!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.fromUserId === auth.currentUser?.uid ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.fromUserId === auth.currentUser?.uid
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.fromUserId === auth.currentUser?.uid
                      ? 'text-primary-100'
                      : 'text-gray-500'
                  }`}>
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Skriv en melding..."
              className="flex-1 input-field"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="btn-primary px-4"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Messaging; 