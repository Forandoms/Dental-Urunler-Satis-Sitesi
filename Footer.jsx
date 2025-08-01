import React from 'react';
import { Tooth, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Tooth className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">Şahin Dental</span>
            </div>
            <p className="text-gray-300 mb-4">
              Profesyonel dental ürünleri ve ekipmanları konusunda 20 yılı aşkın deneyimimizle, 
              diş hekimlerinin ihtiyaçlarına yönelik kaliteli çözümler sunuyoruz.
            </p>
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

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Ana Sayfa</a></li>
              <li><a href="/products" className="text-gray-300 hover:text-white transition-colors">Ürünler</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">İletişim</a></li>
            </ul>
          </div>

          {/* Product Categories */}
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

export default Footer;

