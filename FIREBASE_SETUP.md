# Firebase Kurulum Rehberi

Bu rehber, Şahin Dental e-ticaret sitesi için Firebase Authentication ve Firestore Database kurulumunu açıklar.

## 🚀 Firebase Projesi Oluşturma

### 1. Firebase Console'a Giriş
1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. Google hesabınızla giriş yapın
3. "Proje Ekle" butonuna tıklayın

### 2. Proje Oluşturma
- **Proje adı**: `sahin-dental`
- **Google Analytics**: İsteğe bağlı (önerilir)
- **Proje oluştur** butonuna tıklayın

## 🔐 Authentication Kurulumu

### 1. Authentication'ı Etkinleştir
1. Sol menüden "Authentication" seçin
2. "Get started" butonuna tıklayın
3. "Sign-in method" sekmesine gidin

### 2. Email/Password Yöntemini Etkinleştir
1. "Email/Password" seçin
2. "Enable" butonuna tıklayın
3. "Email link (passwordless sign-in)" seçeneğini kapatın
4. "Save" butonuna tıklayın

## 🗄️ Firestore Database Kurulumu

### 1. Firestore Database Oluştur
1. Sol menüden "Firestore Database" seçin
2. "Create database" butonuna tıklayın
3. **Güvenlik modu seçin**:
   - **Test modu** (geliştirme için)
   - **Production modu** (canlı için)

### 2. Güvenlik Kuralları
Firestore Rules'da şu kuralları ekleyin:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Kullanıcılar sadece kendi verilerini okuyabilir/yazabilir
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Siparişler - kullanıcılar sadece kendi siparişlerini görebilir
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Favoriler - kullanıcılar sadece kendi favorilerini görebilir
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## ⚙️ Firebase Konfigürasyonu

### 1. Web Uygulaması Ekle
1. Proje genel bakış sayfasında "Web" simgesine tıklayın
2. Uygulama takma adı: `sahin-dental-web`
3. "Register app" butonuna tıklayın

### 2. Konfigürasyon Bilgilerini Al
Firebase size şu bilgileri verecek:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "sahin-dental.firebaseapp.com",
  projectId: "sahin-dental",
  storageBucket: "sahin-dental.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 3. Konfigürasyonu Güncelle
`src/firebase.js` dosyasındaki `firebaseConfig` nesnesini yukarıdaki bilgilerle güncelleyin.

## 📱 Uygulama Özellikleri

### Kullanıcı Yönetimi
- ✅ Kullanıcı kayıt (email/password)
- ✅ Kullanıcı giriş
- ✅ Kullanıcı çıkış
- ✅ Profil güncelleme
- ✅ Oturum durumu takibi

### Veri Yapısı

#### Users Collection
```javascript
{
  uid: "user-id",
  name: "Ad Soyad",
  email: "user@example.com",
  phone: "0555 123 45 67",
  city: "İstanbul",
  address: "Adres bilgisi",
  createdAt: timestamp,
  role: "customer"
}
```

#### Orders Collection
```javascript
{
  orderId: "order-id",
  userId: "user-id",
  items: [...],
  totalPrice: 1500,
  status: "pending",
  createdAt: timestamp,
  deliveryAddress: "...",
  deliveryMethod: "standard"
}
```

#### Favorites Collection
```javascript
{
  favoriteId: "favorite-id",
  userId: "user-id",
  productId: "product-id",
  createdAt: timestamp
}
```

## 🔒 Güvenlik Önlemleri

### 1. Environment Variables
Sensitive bilgileri `.env` dosyasında saklayın:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=sahin-dental.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sahin-dental
VITE_FIREBASE_STORAGE_BUCKET=sahin-dental.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 2. Firebase Config Güncelleme
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## 🚀 Deployment

### 1. Production Kurulumu
1. Firebase Console'da "Authentication" > "Settings" > "Authorized domains"
2. Domain'inizi ekleyin (örn: `sahindental.com`)

### 2. Firestore Rules (Production)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 📊 Monitoring

### 1. Firebase Analytics
- Kullanıcı davranışlarını takip edin
- Popüler ürünleri analiz edin
- Conversion rate'leri ölçün

### 2. Firebase Performance
- Sayfa yükleme hızlarını izleyin
- Kullanıcı deneyimini optimize edin

## 🔧 Troubleshooting

### Yaygın Hatalar

1. **"Firebase App named '[DEFAULT]' already exists"**
   - Firebase'i sadece bir kez initialize edin

2. **"Permission denied"**
   - Firestore Rules'ı kontrol edin
   - Kullanıcının authenticate olduğundan emin olun

3. **"Network request failed"**
   - İnternet bağlantısını kontrol edin
   - Firebase projesinin aktif olduğundan emin olun

## 📞 Destek

Sorun yaşarsanız:
1. Firebase Console'da "Support" sekmesini kontrol edin
2. Firebase dokümantasyonunu inceleyin
3. Stack Overflow'da arama yapın

---

**Not**: Bu kurulum tamamlandıktan sonra, kullanıcılar güvenli bir şekilde hesap oluşturabilir, giriş yapabilir ve verileri kalıcı olarak saklanır. 