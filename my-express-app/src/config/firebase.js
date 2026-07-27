const admin = require('firebase-admin');

/**
 * Initialize Firebase Admin SDK
 * Supports two configuration modes:
 *   1. Service Account JSON file path via FIREBASE_SERVICE_ACCOUNT_PATH
 *   2. Individual env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 */
const initializeFirebase = () => {
  // Check if already initialized
  try {
    if (admin.apps && admin.apps.length > 0) {
      return admin;
    }
  } catch (e) {
    // apps property not available yet, proceed with initialization
  }

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountPath) {
    // Mode 1: Service Account JSON file
    try {
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('[FIREBASE] Initialized with service account file.');
      return admin;
    } catch (err) {
      console.error('[FIREBASE] Failed to load service account file:', err.message);
      console.warn('[FIREBASE] Server will start but Firebase auth will not work.');
      return null;
    }
  } else if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PROJECT_ID !== 'your_firebase_project_id'
  ) {
    // Mode 2: Individual environment variables (skip placeholder values)
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Private key comes with escaped newlines from env
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        }),
      });
      console.log('[FIREBASE] Initialized with env var credentials.');
      return admin;
    } catch (err) {
      console.error('[FIREBASE] Failed to initialize with env var credentials:', err.message);
      console.warn('[FIREBASE] Server will start but Firebase auth will not work.');
      return null;
    }
  } else {
    console.warn('[FIREBASE] No credentials configured. Firebase Admin SDK will not be available.');
    console.warn('[FIREBASE] Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_PROJECT_ID in .env');
    return null;
  }
};

const firebaseAdmin = initializeFirebase();

module.exports = { admin: firebaseAdmin || admin };
