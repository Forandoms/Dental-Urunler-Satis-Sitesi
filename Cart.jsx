import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../../context/CartContext';
import { checkRateLimit, setLastSubmissionTime, formatTime } from '../../utils/rateLimit';

const Cart = ({ isOpen, onClose }) => {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    updateQuantity, 
    removeItem, 
    clearCart,
    isOrderSubmitting,
    setOrderSubmitting 
  } = useCart();

  const [orderForm, setOrderForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [remainingTime, setRemainingTime] = useState(0);
  const [canSubmitOrder, setCanSubmitOrder] = useState(true);

  // Check rate limit on component mount and when cart opens
  useEffect(() => {
    if (isOpen) {
      const { canSubmit, remainingTime: remaining } = checkRateLimit('lastOrderTime', 2);
      setCanSubmitOrder(canSubmit);
      setRemainingTime(remaining);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setCanSubmitOrder(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleFormChange = (e) => {
    setOrderForm({
      ...orderForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!canSubmitOrder) return;
    if (items.length === 0) return;
    if (!orderForm.name || !orderForm.email || !orderForm.phone) {
      alert('Lütfen gerekli alanları doldurun.');
      return;
    }

    setOrderSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        customerInfo: orderForm,
        items: items.map(item => ({
          name: item.name,
          brand: item.brand,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        })),
        totalItems,
        totalPrice,
        orderDate: new Date().toLocaleString('tr-TR')
      };

      // Format message for Formspree
      const message = `
YENİ SİPARİŞ - Şahin Dental

MÜŞTERİ BİLGİLERİ:
Ad Soyad: ${orderForm.name}
E-posta: ${orderForm.email}
Telefon: ${orderForm.phone}
Adres: ${orderForm.address}
Notlar: ${orderForm.notes || 'Yok'}

SİPARİŞ DETAYLARI:
${items.map(item => 
  `- ${item.name} (${item.brand}) - ${item.quantity} adet - ₺${item.price} = ₺${item.price * item.quantity}`
).join('\n')}

TOPLAM: ${totalItems} ürün - ₺${totalPrice}
Sipariş Tarihi: ${orderData.orderDate}
      `;

      // Send to Formspree (replace with your actual Formspree endpoint)
      const response = await fetch(import.meta.env.VITE_FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: orderForm.name,
          email: orderForm.email,
          message: message
        })
      });

      if (response.ok) {
        alert('Siparişiniz başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz.');
        clearCart();
        setOrderForm({
          name: '',
          email: '',
          phone: '',
          address: '',
          notes: ''
        });
        setLastSubmissionTime('lastOrderTime');
        setCanSubmitOrder(false);
        setRemainingTime(120); // 2 minutes
        onClose();
      } else {
        throw new Error('Sipariş gönderilemedi');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Sipariş gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Sepetim ({totalItems})
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Sepetiniz boş</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">{item.brand}</p>
                      <p className="text-sm font-semibold text-blue-600">₺{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Form & Total */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Total */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Toplam:</span>
                  <span className="text-xl font-bold text-blue-600">₺{totalPrice}</span>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={handleSubmitOrder} className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Ad Soyad *"
                  value={orderForm.name}
                  onChange={handleFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-posta *"
                  value={orderForm.email}
                  onChange={handleFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefon *"
                  value={orderForm.phone}
                  onChange={handleFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  name="address"
                  placeholder="Adres"
                  value={orderForm.address}
                  onChange={handleFormChange}
                  rows="2"
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  name="notes"
                  placeholder="Sipariş notları (opsiyonel)"
                  value={orderForm.notes}
                  onChange={handleFormChange}
                  rows="2"
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {!canSubmitOrder && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-sm text-yellow-800">
                      Yeni sipariş verebilmek için {formatTime(remainingTime)} beklemeniz gerekiyor.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!canSubmitOrder || isOrderSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                >
                  {isOrderSubmitting ? (
                    'Gönderiliyor...'
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Sipariş Ver
                    </>
                  )}
                </Button>
              </form>

              <p className="text-xs text-gray-500 text-center">
                * Ödeme fiziksel olarak yapılacaktır. Siparişiniz onaylandıktan sonra sizinle iletişime geçeceğiz.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

