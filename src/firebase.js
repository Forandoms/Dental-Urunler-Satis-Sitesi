import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';

// Firebase konfigürasyonu - Environment variables kullanarak
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sahin-dental.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sahin-dental",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sahin-dental.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Auth ve Firestore servislerini al
export const auth = getAuth(app);
export const db = getFirestore(app);

// Kullanıcı kayıt fonksiyonu
export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Kullanıcı bilgilerini Firestore'a kaydet
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      email: user.email,
      createdAt: new Date(),
      role: 'customer'
    });
    
    return { success: true, user: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Kullanıcı giriş fonksiyonu
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Kullanıcı çıkış fonksiyonu
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Kullanıcı bilgilerini getir
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: 'Kullanıcı bulunamadı' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Kullanıcı bilgilerini güncelle
export const updateUserData = async (uid, userData) => {
  try {
    await updateDoc(doc(db, 'users', uid), userData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Favori ürün ekle
export const addToFavorites = async (userId, product) => {
  try {
    // Önce aynı ürünün zaten favorilerde olup olmadığını kontrol et
    const existingQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('productId', '==', product.id)
    );
    const existingDocs = await getDocs(existingQuery);
    
    if (!existingDocs.empty) {
      return { success: false, error: 'Ürün zaten favorilerde' };
    }

    // Yeni favori ekle
    await addDoc(collection(db, 'favorites'), {
      userId: userId,
      productId: product.id,
      product: product,
      createdAt: new Date()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Favori ürün çıkar
export const removeFromFavorites = async (userId, productId) => {
  try {
    const query = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('productId', '==', productId)
    );
    const querySnapshot = await getDocs(query);
    
    if (!querySnapshot.empty) {
      const docToDelete = querySnapshot.docs[0];
      await deleteDoc(docToDelete.ref);
      return { success: true };
    } else {
      return { success: false, error: 'Favori bulunamadı' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Kullanıcının favorilerini getir
export const getUserFavorites = async (userId) => {
  try {
    const query = query(
      collection(db, 'favorites'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(query);
    
    const favorites = [];
    querySnapshot.forEach((doc) => {
      favorites.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: favorites };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Ürünün favori olup olmadığını kontrol et
export const isProductFavorite = async (userId, productId) => {
  try {
    const query = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('productId', '==', productId)
    );
    const querySnapshot = await getDocs(query);
    
    return { success: true, isFavorite: !querySnapshot.empty };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Auth state listener
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default app; 