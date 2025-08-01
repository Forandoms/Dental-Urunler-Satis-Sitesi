# Şahin Dental E-Ticaret Sitesi - Mimari Tasarım

## Teknoloji Stack'i
- **Frontend Framework**: React 18 (Hooks, Context API)
- **Styling**: Tailwind CSS + Custom CSS
- **State Management**: React Context + useReducer
- **Routing**: React Router v6
- **Form Handling**: Formspree + Custom validation
- **Icons**: React Icons (Lucide React)
- **Animations**: Framer Motion
- **Build Tool**: Vite

## Proje Yapısı
```
sahin-dental/
├── public/
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── Button.jsx
│   │   ├── home/
│   │   │   ├── Hero.jsx
│   │   │   ├── ProductSlider.jsx
│   │   │   └── WhyUs.jsx
│   │   ├── products/
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductFilter.jsx
│   │   │   └── Cart.jsx
│   │   └── contact/
│   │       └── ContactForm.jsx
│   ├── context/
│   │   ├── CartContext.jsx
│   │   └── ProductContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   └── Contact.jsx
│   ├── data/
│   │   └── products.js
│   ├── utils/
│   │   ├── formspree.js
│   │   └── rateLimit.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
```

## Tasarım Sistemi

### Renk Paleti
- **Primary**: #2563EB (Mavi - Güven ve profesyonellik)
- **Secondary**: #059669 (Yeşil - Sağlık ve temizlik)
- **Accent**: #DC2626 (Kırmızı - CTA butonları)
- **Neutral**: #64748B (Gri - Metin)
- **Background**: #F8FAFC (Açık gri)
- **White**: #FFFFFF

### Tipografi
- **Heading Font**: Inter (Modern, okunabilir)
- **Body Font**: Inter
- **Font Sizes**:
  - H1: 3rem (48px)
  - H2: 2.25rem (36px)
  - H3: 1.875rem (30px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

### Component Hiyerarşisi

#### Ana Sayfa Bileşenleri
1. **Header**: Logo, navigasyon menüsü, sepet ikonu
2. **Hero Section**: Ana başlık, alt başlık, CTA butonu
3. **Product Slider**: En çok satılan 5 ürün (Swiper.js)
4. **Why Us Section**: Şahin Dental'i seçme nedenleri
5. **Footer**: Telif hakları, sosyal medya linkleri

#### Ürünler Sayfası Bileşenleri
1. **Product Filter**: Marka, fiyat, kategori filtreleri
2. **Product Grid**: Ürün kartları grid layout
3. **Product Card**: Ürün görseli, ismi, fiyatı, sepete ekle butonu
4. **Pagination**: Sayfa navigasyonu
5. **Cart Sidebar**: Sepet içeriği, sipariş formu

#### İletişim Sayfası Bileşenleri
1. **Contact Form**: İsim, email, mesaj alanları
2. **Company Info**: Adres, telefon, email bilgileri
3. **Map Section**: Konum haritası (placeholder)

## State Management Yapısı

### CartContext
```javascript
{
  items: [],
  totalItems: 0,
  totalPrice: 0,
  addItem: (product) => {},
  removeItem: (id) => {},
  clearCart: () => {},
  isOrderSubmitting: false,
  lastOrderTime: null
}
```

### ProductContext
```javascript
{
  products: [],
  filteredProducts: [],
  filters: {
    brand: '',
    priceRange: [0, 1000],
    category: ''
  },
  setFilters: (filters) => {},
  sortBy: 'name',
  setSortBy: (sort) => {}
}
```

## Ürün Kategorileri ve Markalar

### Kategoriler
1. **Plaklar ve Protezler**
2. **Temizlik Malzemeleri**
3. **Teknik Araçlar**
4. **Dolgular ve Materyaller**
5. **Sterilizasyon Ürünleri**

### Markalar (Rastgele)
1. **DentalPro**
2. **MediClean**
3. **TechDent**
4. **ProCare**
5. **DentaMax**
6. **CleanTech**

## Rate Limiting Sistemi
- **Sipariş Formu**: 2 dakika bekleme süresi
- **İletişim Formu**: 3 dakika bekleme süresi
- LocalStorage ile son gönderim zamanı takibi
- Kullanıcı dostu geri sayım timer'ı

## Responsive Breakpoints
- **Mobile**: 0-640px
- **Tablet**: 641-1024px
- **Desktop**: 1025px+

## Animasyonlar ve Etkileşimler
- Sayfa geçişleri (Framer Motion)
- Hover efektleri (scale, shadow)
- Loading animasyonları
- Smooth scroll
- Sepete ekleme animasyonu
- Form validation feedback

