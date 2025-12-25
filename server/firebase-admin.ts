import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let app: App;
let db: Firestore;

// Initialize Firebase Admin SDK
if (!getApps().length) {
    // For development, use application default credentials or service account
    // In production, set GOOGLE_APPLICATION_CREDENTIALS env var
    try {
        app = initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID || 'cabe-d66bb',
        });
        console.log('✅ Firebase Admin SDK initialized');
    } catch (error) {
        console.error('❌ Firebase Admin initialization failed:', error);
        throw error;
    }
} else {
    app = getApps()[0];
}

db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
