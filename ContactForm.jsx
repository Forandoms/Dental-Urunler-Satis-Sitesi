import React, { useState, useEffect } from 'react';
import { Send, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { checkRateLimit, setLastSubmissionTime, formatTime } from '../../utils/rateLimit';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [canSubmit, setCanSubmit] = useState(true);

  // Check rate limit on component mount
  useEffect(() => {
    const { canSubmit: canSubmitForm, remainingTime: remaining } = checkRateLimit('lastContactTime', 3);
    setCanSubmit(canSubmitForm);
    setRemainingTime(remaining);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setCanSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canSubmit) return;
    if (!formData.name || !formData.email || !formData.message) {
      alert('Lütfen gerekli alanları doldurun.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format message for Formspree
      const message = `
İLETİŞİM FORMU - Şahin Dental

Ad Soyad: ${formData.name}
E-posta: ${formData.email}
Telefon: ${formData.phone || 'Belirtilmemiş'}
Konu: ${formData.subject || 'Genel'}

Mesaj:
${formData.message}

Gönderim Tarihi: ${new Date().toLocaleString('tr-TR')}
      `;

      // Send to Formspree
      const response = await fetch('https://formspree.io/f/mgvzzzje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'İletişim Formu',
          message: message
        })
      });

      // Alternative method if the first one fails
      if (!response.ok) {
        const formDataAlt = new FormData();
        formDataAlt.append('name', formData.name);
        formDataAlt.append('email', formData.email);
        formDataAlt.append('subject', formData.subject || 'İletişim Formu');
        formDataAlt.append('message', message);
        
        const altResponse = await fetch('https://formspree.io/f/mgvzzzje', {
          method: 'POST',
          body: formDataAlt
        });
        
        if (!altResponse.ok) {
          throw new Error('Mesaj gönderilemedi');
        }
      }

      if (response.ok) {
        alert('Mesajınız başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setLastSubmissionTime('lastContactTime');
        setCanSubmit(false);
        setRemainingTime(180); // 3 minutes
      } else {
        throw new Error('Mesaj gönderilemedi');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      alert(`Mesaj gönderilirken bir hata oluştu: ${error.message}. Lütfen tekrar deneyin veya telefon ile iletişime geçin.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">İletişim</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sorularınız, önerileriniz veya sipariş talepleriniz için bizimle iletişime geçin. 
          Size en kısa sürede dönüş yapacağız.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Telefon</h3>
                <p className="text-gray-600">+90 212 555 0123</p>
                <p className="text-gray-600">+90 212 555 0124</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">E-posta</h3>
                <p className="text-gray-600">info@sahindental.com</p>
                <p className="text-gray-600">siparis@sahindental.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Adres</h3>
                <p className="text-gray-600">
                  Dental Plaza, Kat: 3, No: 15<br />
                  Şişli / İstanbul<br />
                  Türkiye
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Çalışma Saatleri</h3>
                <p className="text-gray-600">
                  Pazartesi - Cuma: 09:00 - 18:00<br />
                  Cumartesi: 09:00 - 15:00<br />
                  Pazar: Kapalı
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Hızlı İletişim</h3>
            <p className="text-gray-600 mb-4">
              Acil durumlar için WhatsApp hattımızdan 7/24 ulaşabilirsiniz.
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              WhatsApp ile İletişim
            </Button>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mesaj Gönder</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adınızı ve soyadınızı girin"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="E-posta adresinizi girin"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Telefon numaranızı girin"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Konu
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Konu seçin</option>
                  <option value="Ürün Bilgisi">Ürün Bilgisi</option>
                  <option value="Sipariş">Sipariş</option>
                  <option value="Teknik Destek">Teknik Destek</option>
                  <option value="Şikayet">Şikayet</option>
                  <option value="Öneri">Öneri</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Mesaj *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mesajınızı buraya yazın..."
              />
            </div>

            {!canSubmit && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Yeni mesaj gönderebilmek için {formatTime(remainingTime)} beklemeniz gerekiyor.
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              size="lg"
            >
              {isSubmitting ? (
                'Gönderiliyor...'
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Mesaj Gönder
                </>
              )}
            </Button>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            * Zorunlu alanlar. Mesajınıza en geç 24 saat içinde yanıt vereceğiz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;

