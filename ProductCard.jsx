import React from 'react';
import { ShoppingCart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.sales > 100 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            Popüler
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
            {product.brand}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">₺{product.price}</span>
          <span className="text-sm text-gray-500">{product.sales} satış</span>
        </div>

        <Button 
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Sepete Ekle
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;

