// Firebase configuration -----------------------------------------------------
// 1. Go to https://console.firebase.google.com and open your project.
// 2. Project settings (gear icon) -> General -> "Your apps" -> add a Web app (</>).
// 3. Copy the "firebaseConfig" object and paste the real values here.
//
// NOTE: this web config is NOT secret — it is meant to be public in the browser.
// Security is enforced by the Firebase "rules" (see database.rules.json).
export const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT.firebaseapp.com",
  databaseURL: "PASTE_DATABASE_URL",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};
