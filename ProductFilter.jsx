import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories, brands } from '../../data/products';

const ProductFilter = ({ 
  filters, 
  onFilterChange, 
  sortBy, 
  onSortChange, 
  isOpen, 
  onToggle,
  onClearFilters 
}) => {
  const handleCategoryChange = (category) => {
    onFilterChange({ ...filters, category: category === 'Tümü' ? '' : category });
  };

  const handleBrandChange = (brand) => {
    onFilterChange({ ...filters, brand: brand === 'Tümü' ? '' : brand });
  };

  const handlePriceRangeChange = (range) => {
    onFilterChange({ ...filters, priceRange: range });
  };

  const priceRanges = [
    { label: 'Tümü', value: [0, 20000] },
    { label: '0-100 TL', value: [0, 100] },
    { label: '100-500 TL', value: [100, 500] },
    { label: '500-2000 TL', value: [500, 2000] },
    { label: '2000-5000 TL', value: [2000, 5000] },
    { label: '5000+ TL', value: [5000, 20000] }
  ];

  const hasActiveFilters = filters.category || filters.brand || 
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 20000);

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={onToggle}
          className="w-full justify-center"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtreler {hasActiveFilters && '(Aktif)'}
        </Button>
      </div>

      {/* Filter Panel */}
      <div className={`bg-white rounded-lg shadow-sm p-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="mr-1 h-4 w-4" />
              Temizle
            </Button>
          )}
        </div>

        {/* Sort By */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sıralama
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">İsme Göre (A-Z)</option>
            <option value="name-desc">İsme Göre (Z-A)</option>
            <option value="price">Fiyata Göre (Düşük-Yüksek)</option>
            <option value="price-desc">Fiyata Göre (Yüksek-Düşük)</option>
            <option value="sales">Satışa Göre (En Çok Satan)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={category === 'Tümü' ? !filters.category : filters.category === category}
                  onChange={() => handleCategoryChange(category)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marka
          </label>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center">
                <input
                  type="radio"
                  name="brand"
                  checked={brand === 'Tümü' ? !filters.brand : filters.brand === brand}
                  onChange={() => handleBrandChange(brand)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fiyat Aralığı
          </label>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range.label} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={
                    filters.priceRange[0] === range.value[0] && 
                    filters.priceRange[1] === range.value[1]
                  }
                  onChange={() => handlePriceRangeChange(range.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilter;

