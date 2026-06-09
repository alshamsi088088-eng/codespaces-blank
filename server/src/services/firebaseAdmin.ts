import admin from 'firebase-admin';

let initialized = false;

export function initFirebaseAdmin(serviceAccount?: Record<string, any>) {
  if (initialized) return admin;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    admin.initializeApp();
  }

  initialized = true;
  return admin;
}

export function getFirebaseAuth() {
  if (!initialized) initFirebaseAdmin();
  return admin.auth();
}
