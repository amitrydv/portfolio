import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCnrwh0d2CFWX3sQTs94lGDU1kYyxr3z5E",
  authDomain: "googly-alloy-h53bd.firebaseapp.com",
  projectId: "googly-alloy-h53bd",
  storageBucket: "googly-alloy-h53bd.firebasestorage.app",
  messagingSenderId: "9159173670",
  appId: "1:9159173670:web:16b25d9b96df6c9d0568e7"
};

const app = initializeApp(firebaseConfig);
const databaseId = "ai-studio-amityadav-2a7e5214-3eda-4d63-849a-cf84e13a167e";
export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Types
export interface CustomLink {
  id: string;
  title: string;
  url: string;
}

export interface PortfolioData {
  storyText: string;
  jobsText: string;
  projectsText: string;
  whatsappUsername: string;
  instagramLink: string;
  linkedinLink: string;
  portraitUrl: string;
  backgroundUrl: string;
  customLinks: CustomLink[];
}

export const defaultData: PortfolioData = {
  storyText: "[Your story goes here]",
  jobsText: "Interested but never hired",
  projectsText: "Coming soon. A showcase of my latest builds and experiments.",
  whatsappUsername: "@amitrydv",
  instagramLink: "https://instagram.com/amitrydv",
  linkedinLink: "https://linkedin.com/in/amitrydv",
  portraitUrl: "https://stone-expand-60400629.figma.site/_assets/v11/8da570354e86aa0d44ac3e4aa335a72c8e750d68.png",
  backgroundUrl: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85",
  customLinks: []
};

export const getPortfolioData = async () => {
  try {
    const docRef = doc(db, 'portfolio', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as PortfolioData;
    }
    // Return default if it doesn't exist yet, admin will create it on first save
    return defaultData;
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return defaultData;
  }
};

export const savePortfolioData = async (data: PortfolioData) => {
  const docRef = doc(db, 'portfolio', 'main');
  await setDoc(docRef, data);
};
