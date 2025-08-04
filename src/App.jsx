import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Menu, X, Mail, Phone, MapPin, Send, Star, TrendingUp, User, LogOut, Bell, Search, Filter, Eye, Share2, Bookmark, BookmarkCheck, Plus, Minus, Truck, CreditCard, Shield, Clock, MapPin as MapPinIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth, loginUser, registerUser, logoutUser, getUserData, updateUserData, onAuthStateChange, addToFavorites as addToFavoritesFirebase, removeFromFavorites as removeFromFavoritesFirebase, getUserFavorites, isProductFavorite } from './firebase';
import './App.css';

// Enhanced product data with more details
const products = [
  {
    id: '1',
    name: 'DentalPro Kompozit Dolgu Seti',
    brand: 'DentalPro',
    category: 'Dolgular ve Materyaller',
    price: 1200,
    originalPrice: 1400,
    sales: 85,
    rating: 4.8,
    reviews: 24,
    stock: 15,
    image: '/src/assets/images/products/dolgular_materyaller.png',
    images: ['/src/assets/images/products/dolgular_materyaller.png', '/src/assets/images/products/dolgular_materyaller_2.png'],
    description: 'Yüksek kaliteli kompozit dolgu seti, estetik ve dayanıklı restorasyonlar için idealdir.',
    features: ['Hızlı kuruma', 'Doğal görünüm', 'Uzun ömürlü', 'Kolay uygulama'],
    specifications: {
      'Renk Seçenekleri': 'A1, A2, A3, A3.5, A4, B1, B2, B3, C1, C2, C3, C4',
      'Kuruma Süresi': '20-30 saniye',
      'Shelf Life': '24 ay',
      'Paket İçeriği': '10 adet kompozit dolgu'
    }
  },
  {
    id: '2',
    name: 'MediClean Sterilizasyon Poşetleri',
    brand: 'MediClean',
    category: 'Sterilizasyon Ürünleri',
    price: 150,
    originalPrice: 180,
    sales: 120,
    rating: 4.6,
    reviews: 18,
    stock: 50,
    image: '/src/assets/images/products/sterilizasyon_urunleri.png',
    images: ['/src/assets/images/products/sterilizasyon_urunleri.png'],
    description: 'Tıbbi cihazların güvenli sterilizasyonu için özel olarak tasarlanmış, yüksek bariyerli poşetler.',
    features: ['Yüksek bariyer', 'Güvenli sterilizasyon', 'Farklı boyutlar', 'Kolay kullanım'],
    specifications: {
      'Boyut Seçenekleri': 'S, M, L, XL',
      'Sterilizasyon Sıcaklığı': '121°C - 134°C',
      'Paket İçeriği': '100 adet poşet',
      'Shelf Life': '36 ay'
    }
  },
  {
    id: '3',
    name: 'TechDent Mikromotor Seti',
    brand: 'TechDent',
    category: 'Teknik Araçlar',
    price: 4500,
    originalPrice: 5000,
    sales: 60,
    rating: 4.9,
    reviews: 12,
    stock: 8,
    image: '/src/assets/images/products/teknik_araclar.png',
    images: ['/src/assets/images/products/teknik_araclar.png'],
    description: 'Hassas dental işlemler için güçlü ve ergonomik mikromotor seti.',
    features: ['Yüksek performans', 'Ergonomik tasarım', 'Sessiz çalışma', 'Uzun ömürlü'],
    specifications: {
      'Güç': '20W',
      'Hız': '0-40,000 RPM',
      'Garanti': '2 yıl',
      'Paket İçeriği': 'Mikromotor + 5 uç'
    }
  },
  {
    id: '4',
    name: 'ProCare Diş Fırçası Çeşitleri',
    brand: 'ProCare',
    category: 'Temizlik Malzemeleri',
    price: 25,
    originalPrice: 30,
    sales: 200,
    rating: 4.7,
    reviews: 45,
    stock: 100,
    image: '/src/assets/images/products/temizlik_malzemeleri.png',
    images: ['/src/assets/images/products/temizlik_malzemeleri.png'],
    description: 'Farklı sertlik ve başlık seçenekleriyle profesyonel diş fırçaları.',
    features: ['Farklı sertlikler', 'Ergonomik sap', 'Antibakteriyel', 'Uzun ömürlü'],
    specifications: {
      'Sertlik Seçenekleri': 'Yumuşak, Orta, Sert',
      'Paket İçeriği': '10 adet fırça',
      'Garanti': '1 yıl',
      'Renk Seçenekleri': 'Mavi, Yeşil, Kırmızı'
    }
  },
  {
    id: '5',
    name: 'DentaMax İmplant Protez',
    brand: 'DentaMax',
    category: 'Plaklar ve Protezler',
    price: 8000,
    originalPrice: 9000,
    sales: 40,
    rating: 4.9,
    reviews: 8,
    stock: 5,
    image: '/src/assets/images/products/plaklar_protezler.png',
    images: ['/src/assets/images/products/plaklar_protezler.png'],
    description: 'Doğal görünümlü ve uzun ömürlü dental implant protez çözümleri.',
    features: ['Doğal görünüm', 'Uzun ömürlü', 'Konforlu kullanım', 'Garantili'],
    specifications: {
      'Materyal': 'Seramik',
      'Garanti': '5 yıl',
      'Renk Seçenekleri': 'A1, A2, A3, B1, B2',
      'Uygulama Süresi': '2-3 seans'
    }
  }
];

// Get top selling products
const topSellingProducts = products.sort((a, b) => b.sales - a.sales).slice(0, 5);

// Rate Limiting Utility (simulated)
const lastSubmissionTimes = {};

const checkRateLimit = (formId, delayMinutes) => {
  const lastTime = lastSubmissionTimes[formId] || 0;
  const currentTime = Date.now();
  const delayMs = delayMinutes * 60 * 1000;

  if (currentTime - lastTime < delayMs) {
    return { canSubmit: false, remainingTime: Math.ceil((delayMs - (currentTime - lastTime)) / 1000) };
  }
  return { canSubmit: true };
};

const setLastSubmissionTime = (formId) => {
  lastSubmissionTimes[formId] = Date.now();
};

// User Authentication Context
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase kullanıcısı varsa, Firestore'dan detaylı bilgileri al
        const result = await getUserData(firebaseUser.uid);
        if (result.success) {
          setUserData(result.data);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...result.data
          });
        } else {
          // Firestore'da veri yoksa, temel bilgileri kullan
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'Kullanıcı'
          });
        }
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setUserData(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await loginUser(email, password);
      if (result.success) {
        // Login başarılı, AuthContext zaten auth state change ile güncellenecek
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, userData) => {
    try {
      const result = await registerUser(email, password, userData);
      if (result.success) {
        // Kayıt başarılı, AuthContext zaten auth state change ile güncellenecek
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      // Logout başarılı, AuthContext zaten auth state change ile güncellenecek
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (newUserData) => {
    if (!user?.uid) return { success: false, error: 'Kullanıcı girişi gerekli' };
    
    try {
      const result = await updateUserData(user.uid, newUserData);
      if (result.success) {
        setUserData(prev => ({ ...prev, ...newUserData }));
        setUser(prev => ({ ...prev, ...newUserData }));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData,
      isAuthenticated, 
      login, 
      logout, 
      register,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Notifications Context
const NotificationContext = React.createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Favorites Context
const FavoritesContext = React.createContext();

const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = React.useContext(AuthContext);
  const { addNotification } = React.useContext(NotificationContext);

  // Kullanıcı giriş yaptığında favorileri yükle
  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      loadUserFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated, user?.uid]);

  const loadUserFavorites = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const result = await getUserFavorites(user.uid);
      if (result.success) {
        setFavorites(result.data.map(fav => fav.product));
      }
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (product) => {
    if (!isAuthenticated || !user?.uid) {
      addNotification({
        type: 'warning',
        title: 'Giriş gerekli',
        message: 'Favorilere eklemek için giriş yapın.'
      });
      return;
    }

    try {
      const result = await addToFavoritesFirebase(user.uid, product);
      if (result.success) {
        setFavorites(prev => [...prev, product]);
        addNotification({
          type: 'success',
          title: 'Favorilere eklendi',
          message: `${product.name} favorilerinize eklendi.`
        });
      } else {
        addNotification({
          type: 'info',
          title: 'Bilgi',
          message: result.error || 'Ürün zaten favorilerde.'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Hata',
        message: 'Favorilere eklenirken bir hata oluştu.'
      });
    }
  };

  const removeFromFavorites = async (productId) => {
    if (!isAuthenticated || !user?.uid) return;

    try {
      const result = await removeFromFavoritesFirebase(user.uid, productId);
      if (result.success) {
        setFavorites(prev => prev.filter(item => item.id !== productId));
        addNotification({
          type: 'success',
          title: 'Favorilerden çıkarıldı',
          message: 'Ürün favorilerinizden çıkarıldı.'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Hata',
        message: 'Favorilerden çıkarılırken bir hata oluştu.'
      });
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addToFavorites, 
      removeFromFavorites, 
      isFavorite,
      loading 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Header Component with enhanced features
const Header = ({ cartItems, onCartOpen, favorites }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { user, isAuthenticated, logout } = React.useContext(AuthContext);
  const { notifications } = React.useContext(NotificationContext);
  const { addToFavorites, removeFromFavorites, isFavorite } = React.useContext(FavoritesContext);

  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Ürünler', href: '/products' },
    { name: 'Blog', href: '/blog' },
    { name: 'İletişim', href: '/contact' }
  ];

  const isActive = (href) => location.pathname === href;
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalFavorites = favorites.length;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Şahin Dental</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Favorites Button */}
            <Button
              variant="outline"
              size="sm"
              className="relative"
            >
              <Bookmark className="h-5 w-5" />
              {totalFavorites > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalFavorites}
                </span>
              )}
            </Button>

            {/* Notifications */}
            <Button
              variant="outline"
              size="sm"
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>

            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onCartOpen}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block">{user?.name}</span>
                </Button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profilim
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Siparişlerim
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link to="/login">Giriş Yap</Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">Şahin Dental</span>
            </div>
            <p className="text-gray-300 mb-4">
              Profesyonel dental ürünleri ve ekipmanları konusunda 20 yılı aşkın deneyimimizle, 
              diş hekimlerinin ihtiyaçlarına yönelik kaliteli çözümler sunuyoruz.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">+90 212 555 0123</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">info@sahindental.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">İstanbul, Türkiye</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Ürün Kategorileri</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-300">Plaklar ve Protezler</span></li>
              <li><span className="text-gray-300">Temizlik Malzemeleri</span></li>
              <li><span className="text-gray-300">Teknik Araçlar</span></li>
              <li><span className="text-gray-300">Dolgular ve Materyaller</span></li>
              <li><span className="text-gray-300">Sterilizasyon Ürünleri</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Şahin Dental. Tüm hakları saklıdır. | Profesyonel dental çözümler için güvenilir adresiniz.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Home Page
const Home = ({ onAddToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addNotification } = React.useContext(NotificationContext);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topSellingProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (product) => {
    onAddToCart(product);
    addNotification({
      type: 'success',
      title: 'Ürün sepete eklendi',
      message: `${product.name} sepete eklendi.`
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Profesyonel <span className="text-blue-600">Dental Ürünleri</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Diş hekimlerinin ihtiyaçlarına yönelik kaliteli ve güvenilir dental ürünleri. 
            20 yılı aşkın deneyimimizle sağlık sektörüne hizmet veriyoruz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/products">Ürünleri İncele</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">İletişime Geç</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Product Slider */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">En Çok Satılan Ürünler</h2>
            <p className="text-lg text-gray-600">Diş hekimlerinin en çok tercih ettiği kaliteli ürünler</p>
          </div>

          <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-center">
                <div className="w-64 h-64 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Ürün Görseli</span>
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  En Çok Satan
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {topSellingProducts[currentSlide]?.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {topSellingProducts[currentSlide]?.description}
                </p>
                <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                  <span className="text-3xl font-bold text-blue-600">
                    ₺{topSellingProducts[currentSlide]?.price}
                  </span>
                  {topSellingProducts[currentSlide]?.originalPrice > topSellingProducts[currentSlide]?.price && (
                    <span className="text-lg text-gray-500 line-through">
                      ₺{topSellingProducts[currentSlide]?.originalPrice}
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    {topSellingProducts[currentSlide]?.sales} satış
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(topSellingProducts[currentSlide]?.rating || 0) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {topSellingProducts[currentSlide]?.rating} ({topSellingProducts[currentSlide]?.reviews} değerlendirme)
                  </span>
                </div>
                <Button 
                  onClick={() => handleAddToCart(topSellingProducts[currentSlide])}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Sepete Ekle
                </Button>
              </div>
            </div>

            <div className="flex justify-center space-x-2 mt-6">
              {topSellingProducts.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden Şahin Dental?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              20 yılı aşkın deneyimimizle dental sektöründe güvenilir çözüm ortağınız oluyoruz. 
              Kaliteli ürünler, hızlı teslimat ve müşteri memnuniyeti odaklı hizmet anlayışımızla 
              diş hekimlerinin ihtiyaçlarını karşılıyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Star, 
                title: 'Kaliteli Ürünler', 
                desc: 'Sadece en kaliteli ve güvenilir dental ürünleri sunuyoruz.' 
              },
              { 
                icon: TrendingUp, 
                title: 'Hızlı Teslimat', 
                desc: 'Siparişlerinizi en kısa sürede adresinize ulaştırıyoruz.' 
              },
              { 
                icon: Phone, 
                title: '7/24 Destek', 
                desc: 'Teknik destek ve müşteri hizmetleri için her zaman yanınızdayız.' 
              },
              { 
                icon: Shield, 
                title: 'Güvenli Ödeme', 
                desc: 'Güvenli ödeme seçenekleri ve garanti kapsamında hizmet.' 
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Güncel Kalın</h2>
          <p className="text-xl text-blue-100 mb-8">
            Yeni ürünler ve özel fırsatlardan haberdar olmak için bültenimize abone olun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Abone Ol
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Products Page
const Products = ({ onAddToCart }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({ 
    category: '', 
    brand: '', 
    search: '', 
    priceRange: '',
    sortBy: 'name'
  });
  const [showFilters, setShowFilters] = useState(false);
  const { addToFavorites, removeFromFavorites, isFavorite } = React.useContext(FavoritesContext);
  const { isAuthenticated } = React.useContext(AuthContext);
  const { addNotification } = React.useContext(NotificationContext);

  const categories = ['Tümü', ...new Set(products.map(p => p.category))];
  const brands = ['Tümü', ...new Set(products.map(p => p.brand))];
  const priceRanges = [
    { label: 'Tümü', value: '' },
    { label: '₺0 - ₺500', value: '0-500' },
    { label: '₺500 - ₺1000', value: '500-1000' },
    { label: '₺1000 - ₺5000', value: '1000-5000' },
    { label: '₺5000+', value: '5000+' }
  ];

  React.useEffect(() => {
    let filtered = products.filter(product => {
      const matchesCategory = !filters.category || filters.category === 'Tümü' || product.category === filters.category;
      const matchesBrand = !filters.brand || filters.brand === 'Tümü' || product.brand === filters.brand;
      const matchesSearch = !filters.search || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase());
      
      let matchesPrice = true;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (filters.priceRange === '5000+') {
          matchesPrice = product.price >= 5000;
        } else {
          matchesPrice = product.price >= min && product.price <= max;
        }
      }
      
      return matchesCategory && matchesBrand && matchesSearch && matchesPrice;
    });

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'sales':
        filtered.sort((a, b) => b.sales - a.sales);
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
  }, [filters]);

  const handleFavoriteToggle = (product) => {
    if (!isAuthenticated) {
      addNotification({
        type: 'warning',
        title: 'Giriş gerekli',
        message: 'Favorilere eklemek için giriş yapın.'
      });
      return;
    }

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      addNotification({
        type: 'success',
        title: 'Favorilerden çıkarıldı',
        message: `${product.name} favorilerinizden çıkarıldı.`
      });
    } else {
      addToFavorites(product);
      addNotification({
        type: 'success',
        title: 'Favorilere eklendi',
        message: `${product.name} favorilerinize eklendi.`
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ürünler</h1>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="md:hidden"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtreler
        </Button>
      </div>
      
      {/* Enhanced Filters */}
      <div className={`bg-white p-6 rounded-lg shadow-sm mb-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Ürün ara..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="p-2 border border-gray-300 rounded-lg"
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {categories.map(cat => (
              <option key={cat} value={cat === 'Tümü' ? '' : cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filters.brand}
            onChange={(e) => setFilters({...filters, brand: e.target.value})}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {brands.map(brand => (
              <option key={brand} value={brand === 'Tümü' ? '' : brand}>{brand}</option>
            ))}
          </select>
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {priceRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="name">İsme Göre</option>
            <option value="price-low">Fiyat (Düşük-Yüksek)</option>
            <option value="price-high">Fiyat (Yüksek-Düşük)</option>
            <option value="rating">Puana Göre</option>
            <option value="sales">Satışa Göre</option>
          </select>
          <Button 
            onClick={() => setFilters({ category: '', brand: '', search: '', priceRange: '', sortBy: 'name' })}
            variant="outline"
          >
            Temizle
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="relative">
              <Link to={`/products/${product.id}`}>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              </Link>
              <button
                onClick={() => handleFavoriteToggle(product)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
              >
                {isFavorite(product.id) ? (
                  <BookmarkCheck className="h-5 w-5 text-pink-500 fill-current" />
                ) : (
                  <Bookmark className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {product.originalPrice > product.price && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} İndirim
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">{product.brand}</p>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                </div>
              </div>
              <Link to={`/products/${product.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-blue-600">₺{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">₺{product.originalPrice}</span>
                  )}
                </div>
                <Button 
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock === 0}
                  size="sm"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                </Button>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <span>{product.sales} satış</span>
                <span>{product.stock} stokta</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün bulunamadı</h3>
          <p className="text-gray-600">Arama kriterlerinizi değiştirmeyi deneyin.</p>
        </div>
      )}
    </div>
  );
};

// Contact Page
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { canSubmit, remainingTime } = checkRateLimit("contactForm", 2); // 2 dakika gecikme
    if (!canSubmit) {
      alert(`Lütfen ${remainingTime} saniye sonra tekrar deneyin.`);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://formspree.io/f/mgvzzzje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form gönderim hatası:', error);
      setSubmitStatus('error');
    } finally {
      setLastSubmissionTime("contactForm");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">İletişim</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">Sorularınız için bizimle iletişime geçin. Size en kısa sürede dönüş yapacağız.</p>

      <div className="bg-white p-8 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">İletişim Bilgileri</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">+90 212 555 0123</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">info@sahindental.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">Dental Plaza, Kat: 3, No: 15<br/>Şişli / İstanbul</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mesaj Gönder</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Ad Soyad *"
                value={formData.name}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="E-posta *"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Telefon"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Konu seçin</option>
              <option value="Ürün Bilgisi">Ürün Bilgisi</option>
              <option value="Sipariş">Sipariş</option>
              <option value="Teknik Destek">Teknik Destek</option>
              <option value="Diğer">Diğer</option>
            </select>
            <textarea
              name="message"
              placeholder="Mesajınızı buraya yazın... *"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isSubmitting ? 'Gönderiliyor...' : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Mesaj Gönder
                </>
              )}
            </Button>
            {submitStatus === 'success' && <p className="text-green-600 text-center mt-4">Mesajınız başarıyla gönderildi!</p>}
            {submitStatus === 'error' && <p className="text-red-600 text-center mt-4">Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

// Login Page
const Login = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = React.useContext(AuthContext);
  const { addNotification } = React.useContext(NotificationContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setIsSubmitting(false);
      return;
    }

    if (!isLogin && formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      setIsSubmitting(false);
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.email, formData.password, {
          name: formData.name,
          phone: '',
          address: '',
          city: ''
        });
      }

      if (result.success) {
        addNotification({
          type: 'success',
          title: isLogin ? 'Giriş başarılı' : 'Kayıt başarılı',
          message: isLogin ? 'Hoş geldiniz!' : 'Hesabınız oluşturuldu!'
        });
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Heart className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Ad Soyad
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta adresi
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Şifre Tekrar
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Veya</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={switchMode}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-500"
              >
                {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Detail Page
const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addNotification } = React.useContext(NotificationContext);
  const { isAuthenticated } = React.useContext(AuthContext);
  const { addToFavorites, removeFromFavorites, isFavorite } = React.useContext(FavoritesContext);
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return <Navigate to="/products" />;
  }

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity });
    addNotification({
      type: 'success',
      title: 'Ürün sepete eklendi',
      message: `${product.name} sepete eklendi.`
    });
  };

  const handleAddToFavorites = () => {
    if (!isAuthenticated) {
      addNotification({
        type: 'warning',
        title: 'Giriş gerekli',
        message: 'Favorilere eklemek için giriş yapın.'
      });
      return;
    }
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      addNotification({
        type: 'success',
        title: 'Favorilerden çıkarıldı',
        message: `${product.name} favorilerinizden çıkarıldı.`
      });
    } else {
      addToFavorites(product);
      addNotification({
        type: 'success',
        title: 'Favorilere eklendi',
        message: `${product.name} favorilerinize eklendi.`
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-w-1 aspect-h-1 w-full">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm text-gray-500">{product.brand}</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-500">{product.category}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">{product.rating} ({product.reviews} değerlendirme)</span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-blue-600">₺{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-gray-500 line-through">₺{product.originalPrice}</span>
            )}
            {product.originalPrice > product.price && (
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} İndirim
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Özellikler</h3>
            <div className="grid grid-cols-2 gap-2">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {product.stock > 0 ? `${product.stock} adet stokta` : 'Stokta yok'}
              </span>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Adet:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Sepete Ekle
              </Button>
              <Button
                onClick={handleAddToFavorites}
                variant="outline"
                className="flex-shrink-0"
              >
                {isFavorite(product.id) ? (
                  <BookmarkCheck className="h-4 w-4 text-pink-500" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Teknik Özellikler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="border-b border-gray-200 pb-2">
                  <span className="text-sm font-medium text-gray-700">{key}:</span>
                  <span className="text-sm text-gray-600 ml-2">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Blog Page
const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Dental Hijyenin Önemi',
      excerpt: 'Günlük dental hijyen rutininizde dikkat etmeniz gereken önemli noktalar...',
      image: '/src/assets/images/blog/dental-hijyen.jpg',
      date: '2024-01-15',
      author: 'Dr. Ahmet Yılmaz',
      category: 'Hijyen'
    },
    {
      id: 2,
      title: 'Modern Dental Teknolojileri',
      excerpt: 'Son yıllarda dental teknolojilerinde yaşanan gelişmeler ve yenilikler...',
      image: '/src/assets/images/blog/dental-teknoloji.jpg',
      date: '2024-01-10',
      author: 'Dr. Fatma Kaya',
      category: 'Teknoloji'
    },
    {
      id: 3,
      title: 'İmplant Tedavisi Süreci',
      excerpt: 'İmplant tedavisi öncesi, sırası ve sonrasında bilmeniz gerekenler...',
      image: '/src/assets/images/blog/implant-tedavisi.jpg',
      date: '2024-01-05',
      author: 'Dr. Mehmet Özkan',
      category: 'Tedavi'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog & Haberler</h1>
        <p className="text-lg text-gray-600">Dental sektöründeki son gelişmeler ve uzman görüşleri</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString('tr-TR')}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{post.author}</span>
                <Button variant="outline" size="sm">
                  Devamını Oku
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

// Profile Page
const Profile = () => {
  const { user, userData, isAuthenticated, updateProfile } = React.useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: userData?.name || '',
    phone: userData?.phone || '',
    city: userData?.city || '',
    address: userData?.address || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage('');

    try {
      const result = await updateProfile(profileForm);
      if (result.success) {
        setUpdateMessage('Profil bilgileri başarıyla güncellendi!');
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        setUpdateMessage('Güncelleme sırasında bir hata oluştu.');
      }
    } catch (error) {
      setUpdateMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profilim</h1>
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'profile', name: 'Profil Bilgileri' },
              { id: 'orders', name: 'Siparişlerim' },
              { id: 'favorites', name: 'Favorilerim' },
              { id: 'settings', name: 'Ayarlar' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {updateMessage && (
                <div className={`p-4 rounded-lg ${
                  updateMessage.includes('başarıyla') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {updateMessage}
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">E-posta</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">E-posta adresi değiştirilemez</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Şehir</label>
                    <input
                      type="text"
                      name="city"
                      value={profileForm.city}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adres</label>
                  <textarea
                    name="address"
                    rows="3"
                    value={profileForm.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isUpdating}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Güncelleniyor...' : 'Bilgileri Güncelle'}
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Siparişlerim</h2>
              <p className="text-gray-600">Henüz siparişiniz bulunmuyor.</p>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Favori Ürünlerim</h2>
              {favorites.length === 0 ? (
                <p className="text-gray-600">Henüz favori ürününüz bulunmuyor.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <Link to={`/products/${product.id}`}>
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                      </Link>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-blue-600">₺{product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">₺{product.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bildirim Ayarları</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">E-posta bildirimleri</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">SMS bildirimleri</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Fiyat düşüş bildirimleri</span>
                  </label>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Ayarları Kaydet
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Cart Context
const CartContext = React.createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.id !== productId);
      }
      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const removeItem = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Enhanced Cart Component
const Cart = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeItem, clearCart } = React.useContext(CartContext);
  const [orderForm, setOrderForm] = useState({
    name: '', email: '', phone: '', address: '', deliveryMethod: 'standard'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitStatus, setOrderSubmitStatus] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = orderForm.deliveryMethod === 'express' ? 50 : 25;
  const discount = appliedCoupon ? subtotal * 0.1 : 0; // 10% discount
  const totalPrice = subtotal + deliveryFee - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'dental10') {
      setAppliedCoupon({ code: couponCode, discount: 0.1 });
    } else {
      alert('Geçersiz kupon kodu');
    }
  };

  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.email || !orderForm.phone) {
      alert('Lütfen gerekli alanları doldurun.');
      return;
    }

    const { canSubmit, remainingTime } = checkRateLimit("orderForm", 2);
    if (!canSubmit) {
      alert(`Lütfen ${remainingTime} saniye sonra tekrar deneyin.`);
      return;
    }

    setIsSubmitting(true);
    setOrderSubmitStatus(null);

    const orderDetails = {
      ...orderForm,
      cart: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      deliveryFee,
      discount,
      totalPrice,
      couponCode: appliedCoupon?.code
    };

    try {
      const response = await fetch('https://formspree.io/f/mgvzzzje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        setOrderSubmitStatus('success');
        clearCart();
        setOrderForm({ name: '', email: '', phone: '', address: '', deliveryMethod: 'standard' });
        setAppliedCoupon(null);
        setCouponCode('');
        onClose();
      } else {
        setOrderSubmitStatus('error');
      }
    } catch (error) {
      console.error('Sipariş gönderim hatası:', error);
      setOrderSubmitStatus('error');
    } finally {
      setLastSubmissionTime("orderForm");
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}
      onClick={onClose}
    >
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sepetim ({cartItems.length})</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Sepetiniz boş.</p>
            <Button asChild className="mt-4">
              <Link to="/products">Alışverişe Başla</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">₺{item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                    <span className="font-medium">{item.quantity}</span>
                    <Button size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code */}
            <div className="border-t pt-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Kupon kodu"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <Button onClick={handleApplyCoupon} variant="outline">
                  Uygula
                </Button>
              </div>
              {appliedCoupon && (
                <p className="text-green-600 text-sm mt-2">Kupon uygulandı: %10 indirim</p>
              )}
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Ara toplam:</span>
                <span>₺{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>İndirim:</span>
                  <span>-₺{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Teslimat:</span>
                <span>₺{deliveryFee}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Toplam:</span>
                  <span>₺{totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Teslimat Seçenekleri</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="standard"
                    checked={orderForm.deliveryMethod === 'standard'}
                    onChange={handleOrderFormChange}
                    className="text-blue-600"
                  />
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4" />
                    <span>Standart Teslimat (2-3 gün) - ₺25</span>
                  </div>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="express"
                    checked={orderForm.deliveryMethod === 'express'}
                    onChange={handleOrderFormChange}
                    className="text-blue-600"
                  />
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Hızlı Teslimat (1 gün) - ₺50</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Form */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Sipariş Bilgileri</h3>
              <form onSubmit={handleSubmitOrder} className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Ad Soyad *"
                  value={orderForm.name}
                  onChange={handleOrderFormChange}
                  required
                  className="p-2 border border-gray-300 rounded-lg w-full"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-posta *"
                  value={orderForm.email}
                  onChange={handleOrderFormChange}
                  required
                  className="p-2 border border-gray-300 rounded-lg w-full"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefon *"
                  value={orderForm.phone}
                  onChange={handleOrderFormChange}
                  required
                  className="p-2 border border-gray-300 rounded-lg w-full"
                />
                <textarea
                  name="address"
                  placeholder="Adres"
                  rows="3"
                  value={orderForm.address}
                  onChange={handleOrderFormChange}
                  className="p-2 border border-gray-300 rounded-lg w-full"
                ></textarea>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Gönderiliyor...' : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Sipariş Ver (₺{totalPrice})
                    </>
                  )}
                </Button>
                {orderSubmitStatus === 'success' && <p className="text-green-600 text-center mt-2">Siparişiniz başarıyla alındı!</p>}
                {orderSubmitStatus === 'error' && <p className="text-red-600 text-center mt-2">Sipariş gönderilirken bir hata oluştu. Lütfen tekrar deneyin.</p>}
              </form>
              <p className="text-sm text-gray-500 text-center mt-2">* Ödeme fiziksel olarak yapılacaktır.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Notification Component
const NotificationToast = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(notification.id), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onRemove]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>;
      case 'error':
        return <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>;
      case 'warning':
        return <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>;
      default:
        return <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>;
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-white rounded-lg shadow-lg border-l-4 border-l-green-500 p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onRemove(notification.id), 300);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification Container
const NotificationContainer = () => {
  const { notifications, removeNotification } = React.useContext(NotificationContext);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

// Main App Component
const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart, cartItems } = React.useContext(CartContext);
  const { favorites } = React.useContext(FavoritesContext);

  return (
    <Router>
      <Header cartItems={cartItems} onCartOpen={() => setIsCartOpen(true)} favorites={favorites} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onAddToCart={addToCart} />} />
          <Route path="/products" element={<Products onAddToCart={addToCart} />} />
          <Route path="/products/:id" element={<ProductDetail onAddToCart={addToCart} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <NotificationContainer />
    </Router>
  );
};

export default () => (
  <CartProvider>
    <AuthProvider>
      <NotificationProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </NotificationProvider>
    </AuthProvider>
  </CartProvider>
);


