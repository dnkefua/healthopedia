import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from './firebase-config.js';

// Initialize only the app container. Analytics, Auth, and databases are not
// enabled: reading the library and saving locally need no account or uploads.
try {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  window.healthopediaFirebase = Object.freeze({ app });
  document.documentElement.dataset.firebaseProject = app.options.projectId;
  document.documentElement.dataset.firebaseStatus = 'ready';
} catch (error) {
  // Firebase availability must not prevent browsing the local reference library.
  document.documentElement.dataset.firebaseStatus = 'unavailable';
  console.error('Healthopedia Firebase initialization failed.', error);
}
