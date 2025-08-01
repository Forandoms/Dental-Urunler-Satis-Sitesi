import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { topSellingProducts } from '../../data/products';
import { useCart } from '../../context/CartContext';

const ProductSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addItem } = useCart();

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === topSellingProducts.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? topSellingProducts.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === topSellingProducts.length - 1 ? 0 : currentIndex + 1);
  };

  const handleAddToCart = (product) => {
    addItem(product);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">En Çok Satılan Ürünler</h2>
          <p className="text-lg text-gray-600">Diş hekimlerinin en çok tercih ettiği kaliteli ürünler</p>
        </div>

        <div className="relative">
          {/* Slider Container */}
          <div className="overflow-hidden rounded-lg">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {topSellingProducts.map((product) => (
                <div key={product.id} className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      {/* Product Image */}
                      <div className="text-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-64 h-64 object-cover rounded-lg mx-auto shadow-lg"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="text-center lg:text-left">
                        <div className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                          En Çok Satan
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                          <span className="text-3xl font-bold text-blue-600">₺{product.price}</span>
                          <span className="text-sm text-gray-500">{product.sales} satış</span>
                        </div>
                        <Button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Sepete Ekle
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {topSellingProducts.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;

