import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import products from '../../data/products';

const ProductGrid = () => {
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceRange: [0, 20000]
  });
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesBrand = !filters.brand || product.brand === filters.brand;
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesBrand && matchesPrice && matchesSearch;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'tr');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'tr');
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'sales':
          return b.sales - a.sales;
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters, sortBy, searchTerm]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      priceRange: [0, 20000]
    });
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Ürünler</h1>
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {filteredAndSortedProducts.length} ürün bulundu
            </p>
          </div>

          {/* Products */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün bulunamadı</h3>
              <p className="text-gray-600 mb-4">
                Arama kriterlerinizi değiştirmeyi deneyin.
              </p>
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Tüm filtreleri temizle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;

