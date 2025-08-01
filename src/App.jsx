import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, Menu, X, Mail, Phone, MapPin, Send, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './App.css';

// Sample product data
const products = [
  {
    id: '1',
    name: 'DentalPro Kompozit Dolgu Seti',
    brand: 'DentalPro',
    category: 'Dolgular ve Materyaller',
    price: 1200,
    sales: 85,
    image: '/src/assets/images/products/dolgular_materyaller.png',
    description: 'Yüksek kaliteli kompozit dolgu seti, estetik ve dayanıklı restorasyonlar için idealdir.'
  },
  {
    id: '2',
    name: 'MediClean Sterilizasyon Poşetleri',
    brand: 'MediClean',
    category: 'Sterilizasyon Ürünleri',
    price: 150,
    sales: 120,
    image: '/src/assets/images/products/sterilizasyon_urunleri.png',
    description: 'Tıbbi cihazların güvenli sterilizasyonu için özel olarak tasarlanmış, yüksek bariyerli poşetler.'
  },
  {
    id: '3',
    name: 'TechDent Mikromotor Seti',
    brand: 'TechDent',
    category: 'Teknik Araçlar',
    price: 4500,
    sales: 60,
    image: '/src/assets/images/products/teknik_araclar.png',
    description: 'Hassas dental işlemler için güçlü ve ergonomik mikromotor seti.'
  },
  {
    id: '4',
    name: 'ProCare Diş Fırçası Çeşitleri',
    brand: 'ProCare',
    category: 'Temizlik Malzemeleri',
    price: 25,
    sales: 200,
    image: '/src/assets/images/products/temizlik_malzemeleri.png',
    description: 'Farklı sertlik ve başlık seçenekleriyle profesyonel diş fırçaları.'
  },
  {
    id: '5',
    name: 'DentaMax İmplant Protez',
    brand: 'DentaMax',
    category: 'Plaklar ve Protezler',
    price: 8000,
    sales: 40,
    image: '/src/assets/images/products/plaklar_protezler.png',
    description: 'Doğal görünümlü ve uzun ömürlü dental implant protez çözümleri.'
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

// Header Component
const Header = ({ cartItems, onCartOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Ürünler', href: '/products' },
    { name: 'İletişim', href: '/contact' }
  ];

  const isActive = (href) => location.pathname === href;
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Şahin Dental</span>
          </Link>

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

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
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

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topSellingProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
                  <span className="text-sm text-gray-500">
                    {topSellingProducts[currentSlide]?.sales} satış
                  </span>
                </div>
                <Button 
                  onClick={() => onAddToCart(topSellingProducts[currentSlide])}
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Star, title: 'Kaliteli Ürünler', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
              { icon: TrendingUp, title: 'Hızlı Teslimat', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
              { icon: Phone, title: '7/24 Destek', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
              { icon: Mail, title: 'Güvenli Ödeme', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center bg-white p-6 rounded-lg shadow-sm">
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
    </div>
  );
};

// Products Page
const Products = ({ onAddToCart }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({ category: '', brand: '', search: '' });

  const categories = ['Tümü', ...new Set(products.map(p => p.category))];
  const brands = ['Tümü', ...new Set(products.map(p => p.brand))];

  React.useEffect(() => {
    let filtered = products.filter(product => {
      const matchesCategory = !filters.category || filters.category === 'Tümü' || product.category === filters.category;
      const matchesBrand = !filters.brand || filters.brand === 'Tümü' || product.brand === filters.brand;
      const matchesSearch = !filters.search || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesCategory && matchesBrand && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ürünler</h1>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <Button 
            onClick={() => setFilters({ category: '', brand: '', search: '' })}
            variant="outline"
          >
            Filtreleri Temizle
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <p className="text-sm text-gray-500">{product.brand}</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">₺{product.price}</span>
                <Button onClick={() => onAddToCart(product)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Sepete Ekle
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
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
      setIsSubmitting(false);
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

// Cart Component
const Cart = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeItem, clearCart } = React.useContext(CartContext);
  const [orderForm, setOrderForm] = useState({
    name: '', email: '', phone: '', address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitStatus, setOrderSubmitStatus] = useState(null); // 'success', 'error', null

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

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

    const { canSubmit, remainingTime } = checkRateLimit("orderForm", 2); // 2 dakika gecikme
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
      totalPrice: totalPrice
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
        setOrderForm({ name: '', email: '', phone: '', address: '' });
        onClose();
      } else {
        setOrderSubmitStatus('error');
      }
    } catch (error) {
      console.error('Sipariş gönderim hatası:', error);
      setOrderSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
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
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside cart
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sepetim ({cartItems.length})</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Sepetiniz boş.</p>
        ) : (
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

            <div className="text-right text-xl font-bold mt-4">
              Toplam: ₺{totalPrice}
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4">Sipariş Bilgileri</h3>
            <form onSubmit={handleSubmitOrder} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Ad Soyad *"
                value={orderForm.name}
                onChange={handleOrderFormChange}
                required
                className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="E-posta *"
                value={orderForm.email}
                onChange={handleOrderFormChange}
                required
                className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Telefon *"
                value={orderForm.phone}
                onChange={handleOrderFormChange}
                required
                className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="address"
                placeholder="Adres"
                rows="3"
                value={orderForm.address}
                onChange={handleOrderFormChange}
                className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Gönderiliyor...' : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Sipariş Ver
                  </>
                )}
              </Button>
              {orderSubmitStatus === 'success' && <p className="text-green-600 text-center mt-2">Siparişiniz başarıyla alındı!</p>}
              {orderSubmitStatus === 'error' && <p className="text-red-600 text-center mt-2">Sipariş gönderilirken bir hata oluştu. Lütfen tekrar deneyin.</p>}
            </form>
            <p className="text-sm text-gray-500 text-center mt-2">* Ödeme fiziksel olarak yapılacaktır.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart, cartItems } = React.useContext(CartContext);

  return (
    <Router>
      <Header cartItems={cartItems} onCartOpen={() => setIsCartOpen(true)} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onAddToCart={addToCart} />} />
          <Route path="/products" element={<Products onAddToCart={addToCart} />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </Router>
  );
};

export default () => (
  <CartProvider>
    <App />
  </CartProvider>
);


