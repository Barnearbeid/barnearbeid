# Firebase Setup Guide

## Quick Setup (5 minutes)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it: `barnearbeid-mvp`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Services
1. **Authentication**: 
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Click "Save"

2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" (for MVP)
   - Select location (europe-west1)

3. **Storage**:
   - Go to Storage
   - Click "Get started"
   - Choose "Start in test mode"
   - Select location (europe-west1)

### 3. Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web
4. Name: `barnearbeid-web`
5. Copy the config object

### 4. Update Firebase Config
Replace the config in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 5. Install Dependencies
```bash
npm install
```

### 6. Test the App
```bash
npm start
```

## What Works Now:
✅ **User Registration/Login** - Two user types (Job Seekers & Job Posters)  
✅ **Job Posting** - Create jobs with images and requirements  
✅ **Job Browsing** - View and filter all posted jobs  
✅ **Image Upload** - Upload multiple images per job  
✅ **Real-time Data** - All data stored in Firebase  

## Test Flow:
1. Register as a "Job Poster"
2. Post a job with images
3. Register as a "Job Seeker" 
4. Browse and view jobs

## Security Rules (Later)
For production, update Firestore rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /jobs/{jobId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Storage Rules (Later)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /jobs/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

That's it! Your MVP is now fully functional! 🚀 