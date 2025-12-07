# Firebase Setup Guide

Complete guide for setting up Firebase Authentication and Firestore for TaskFlow AI.

## 📋 Prerequisites

- A Google account
- Node.js and npm installed
- Firebase CLI installed (`npm install -g firebase-tools`)

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `taskflow-ai` (or your preferred name)
4. Enable/disable Google Analytics (optional)
5. Click **"Create project"**

## 🔐 Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Go to **Sign-in method** tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## 💾 Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll add security rules next)
4. Select a location (choose closest to your users)
5. Click **"Enable"**

## 🔒 Step 4: Configure Security Rules

1. In Firestore Database, go to **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tasks collection
    match /tasks/{taskId} {
      // Users can only read/write their own tasks
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      // Allow creating tasks with correct userId
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click **"Publish"** to save the rules

## 🔑 Step 5: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`) to add a web app
4. Register app with a nickname (e.g., "TaskFlow AI Web")
5. Copy the Firebase configuration object

## 📝 Step 6: Configure Environment Variables

1. Create a `.env` file in the project root (if it doesn't exist)
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. Replace all placeholder values with your actual Firebase config values

## 🚀 Step 7: Initialize Firebase Hosting (Optional)

If you want to deploy the app:

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Follow the prompts:
# - Select existing project
# - Public directory: dist
# - Single-page app: Yes
# - Overwrite index.html: No
```

## ✅ Step 8: Verify Setup

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Try to create an account:
   - Click "Sign Up"
   - Enter email and password
   - You should be redirected to the main app

4. Create a test task:
   - Click the "+" button
   - Create a task
   - Check Firebase Console → Firestore Database → Data
   - You should see a new document in the `tasks` collection

## 🔍 Troubleshooting

### "Firebase configuration is missing"

- Make sure your `.env` file exists in the project root
- Verify all `VITE_FIREBASE_*` variables are set
- Restart the dev server after changing `.env`

### "Missing or insufficient permissions"

- Check Firestore Security Rules are published
- Verify the rules match the format above
- Ensure you're logged in (check Authentication tab)

### "User must be authenticated"

- Make sure Email/Password authentication is enabled
- Try logging out and logging back in
- Check browser console for detailed error messages

### Tasks Not Appearing

- Check Firestore Console → Data tab
- Verify tasks have the correct `userId` field
- Check browser console for errors
- Verify Firestore Security Rules allow read access

## 🔐 Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Rotate API keys** if they're accidentally exposed
3. **Restrict API keys** in Google Cloud Console:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to APIs & Services → Credentials
   - Click on your API key
   - Under "Application restrictions", add your domain
   - Under "API restrictions", restrict to Firebase APIs only

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## 🆘 Need Help?

If you encounter issues:

1. Check the browser console for error messages
2. Check Firebase Console → Firestore Database → Data for data issues
3. Verify all environment variables are set correctly
4. Ensure Security Rules are published
