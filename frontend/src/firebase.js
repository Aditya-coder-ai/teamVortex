import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

/**
 * Firebase Client Configuration
 * Project: team-vortex-b7fe2
 */
const firebaseConfig = {
  apiKey: "AIzaSyA2E5mEuSHgcgzJvSjNDhqaSEEvU4MgMZM",
  authDomain: "team-vortex-b7fe2.firebaseapp.com",
  projectId: "team-vortex-b7fe2",
  storageBucket: "team-vortex-b7fe2.firebasestorage.app",
  messagingSenderId: "676767090905",
  appId: "1:676767090905:web:254c95e2f26aa74e9e96c8",
  measurementId: "G-H4D1TTV47L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export { auth, googleProvider };
export default app;
