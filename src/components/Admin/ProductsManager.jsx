import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Plus, Edit2, Trash2, Check, X, Search, 
  DollarSign, Image as ImageIcon, AlertCircle, RefreshCw, CheckCircle2, XCircle 
} from 'lucide-react';
import { 
  fetchAllProductsAdmin, saveProductAdmin, toggleProductStockAdmin, deleteProductAdmin 
} from '../../firebase/adminService.js';
import Card from '../UI/Card.jsx';
import Button from '../UI/Button.jsx';
import Badge from '../UI/Badge.jsx';

const EMPTY_PRODUCT = {
  id: '',
  name: { en: '', ur: '' },
  description: { en: '', ur: '' },
  price: 0,
  category: 'Facewash',
  inStock: true,
  images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800']
};

export const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [newImageUrl, setNewImageUrl] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchAllProductsAdmin();
      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products:', err);
      setStatusMsg({ text: 'Failed to load products from database.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct({ ...EMPTY_PRODUCT, id: `prod-${Date.now()}` });
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct({
      ...prod,
      name: { en: prod.name?.en || '', ur: prod.name?.ur || '' },
      description: { en: prod.description?.en || '', ur: prod.description?.ur || '' },
      images: Array.isArray(prod.images) ? [...prod.images] : (prod.images ? [prod.images] : [])
    });
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  const handleToggleStock = async (prod) => {
    try {
      const updatedStock = await toggleProductStockAdmin(prod.id, prod.inStock);
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, inStock: updatedStock } : p));
      setStatusMsg({
        text: `"${prod.name?.en}" is now marked as ${updatedStock ? 'In Stock' : 'Out of Stock'}.`,
        type: 'success'
      });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Stock toggle error:', err);
      setStatusMsg({ text: 'Could not update stock status.', type: 'error' });
    }
  };

  const handleDelete = async (prod) => {
    if (!window.confirm(`Delete product "${prod.name?.en || prod.id}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteProductAdmin(prod.id);
      setProducts(prev => prev.filter(p => p.id !== prod.id));
      setStatusMsg({ text: `Product "${prod.name?.en}" deleted.`, type: 'success' });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setStatusMsg({ text: 'Failed to delete product.', type: 'error' });
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setEditingProduct(prev => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()]
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setEditingProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!editingProduct.name.en.trim() || !editingProduct.name.ur.trim()) {
      alert('Please provide both English and Urdu product names.');
      return;
    }

    setIsSaving(true);
    try {
      const isNew = !products.some(p => p.id === editingProduct.id);
      await saveProductAdmin(editingProduct, isNew);
      await loadProducts();
      setIsModalOpen(false);
      setStatusMsg({ text: `Product "${editingProduct.name.en}" saved successfully!`, type: 'success' });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setStatusMsg({ text: 'Error saving product to database.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(p => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameEn = (p.name?.en || '').toLowerCase();
    const nameUr = (p.name?.ur || '').toLowerCase();
    return nameEn.includes(q) || nameUr.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#F4E4DE] shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#D9A38F] absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by English or Urdu name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-4 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] bg-white text-[#3A3A3A] focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Facewash">Facewash</option>
            <option value="Sunblock">Sunblock</option>
            <option value="Serum">Serum</option>
            <option value="Moisturizer">Moisturizer</option>
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={loadProducts}
            disabled={loading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </div>
      </div>

      {statusMsg.text && (
        <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
          statusMsg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Product Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-[#6B5B55]">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 text-[#D9A38F] animate-spin" />
          <p className="text-sm">Loading dispensary products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-[#F4E4DE] text-center">
          <ShoppingBag className="w-10 h-10 text-[#D9A38F] mx-auto mb-3 opacity-60" />
          <p className="font-serif text-lg text-[#3A3A3A]">No skincare products found</p>
          <p className="text-xs text-[#6B5B55] mt-1 mb-4">Click below to add a new dispensary product</p>
          <Button variant="primary" size="sm" onClick={handleOpenAdd}>
            Create Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((prod) => (
            <Card key={prod.id} className="p-4 flex flex-col justify-between border-[#F4E4DE] hover:shadow-md transition-shadow">
              <div>
                {/* Image & Stock Badge */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FBF3F0] mb-3 border border-[#F4E4DE]">
                  <img
                    src={prod.images?.[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'}
                    alt={prod.name?.en || 'Product'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 end-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(prod)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs transition-transform active:scale-95 ${
                        prod.inStock
                          ? 'bg-emerald-500 text-white'
                          : 'bg-zinc-700 text-white'
                      }`}
                      title="Click to toggle In Stock / Out of Stock"
                    >
                      {prod.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </div>
                  <span className="absolute bottom-2 start-2 text-[10px] bg-white/90 backdrop-blur-xs text-[#3A3A3A] px-2 py-0.5 rounded-md font-medium">
                    {prod.category}
                  </span>
                </div>

                <h4 className="font-serif font-semibold text-[#3A3A3A] text-base truncate">
                  {prod.name?.en}
                </h4>
                <p className="text-xs font-serif text-[#D9A38F] dir-rtl text-end truncate mb-2">
                  {prod.name?.ur}
                </p>

                <p className="text-xs text-[#6B5B55] line-clamp-2 mb-3">
                  {prod.description?.en}
                </p>

                {/* Price Display */}
                <div className="p-2 bg-[#FBF3F0]/60 rounded-xl mb-3 flex items-center justify-between">
                  <span className="text-xs text-[#6B5B55]">Price:</span>
                  <span className="font-serif font-bold text-sm text-[#3A3A3A]">
                    {prod.price && prod.price > 0 ? (
                      `PKR ${Number(prod.price).toLocaleString()}`
                    ) : (
                      <span className="text-xs text-amber-700 font-normal">Price to be set by admin</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F4E4DE]">
                <button
                  type="button"
                  onClick={() => handleToggleStock(prod)}
                  className="text-xs text-[#6B5B55] hover:text-[#3A3A3A] flex items-center gap-1 font-medium"
                >
                  {prod.inStock ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{prod.inStock ? 'Available' : 'Unavailable'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(prod)}
                    className="flex items-center gap-1 text-xs py-1"
                  >
                    <Edit2 className="w-3 h-3 text-[#D9A38F]" />
                    Edit
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleDelete(prod)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Product Edit / Add Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#F4E4DE] my-8 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4E4DE] bg-[#FBF3F0]/60">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#D9A38F]" />
                <h3 className="font-serif font-semibold text-lg text-[#3A3A3A]">
                  {products.some(p => p.id === editingProduct.id) ? 'Edit Product' : 'Add New Skincare Product'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#6B5B55] hover:text-[#3A3A3A] rounded-xl hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    English Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name.en}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      name: { ...prev.name, en: e.target.value }
                    }))}
                    placeholder="e.g. Brightening Facewash"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Urdu Name (اردو نام) *
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={editingProduct.name.ur}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      name: { ...prev.name, ur: e.target.value }
                    }))}
                    placeholder="مثلاً: برائٹننگ فیس واش"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none font-serif text-end"
                  />
                </div>
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] bg-white focus:border-[#D9A38F] focus:outline-none"
                  >
                    <option value="Facewash">Facewash</option>
                    <option value="Sunblock">Sunblock</option>
                    <option value="Serum">Serum</option>
                    <option value="Moisturizer">Moisturizer</option>
                    <option value="Laser Care">Laser Post-Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Price in PKR (0 = "Price to be set by admin")
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, price: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    English Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.description.en}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      description: { ...prev.description, en: e.target.value }
                    }))}
                    placeholder="Key benefits, clinical formula, skin type..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Urdu Description (اردو تفصیل)
                  </label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={editingProduct.description.ur}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      description: { ...prev.description, ur: e.target.value }
                    }))}
                    placeholder="فائدے، استعمال کا طریقہ اور جلد کی اقسام..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none font-serif text-end"
                  />
                </div>
              </div>

              {/* Stock Status Checkbox */}
              <div className="p-3 bg-[#FBF3F0]/60 rounded-xl border border-[#F4E4DE] flex items-center gap-3">
                <input
                  type="checkbox"
                  id="prodStockToggle"
                  checked={editingProduct.inStock}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev, inStock: e.target.checked }))}
                  className="w-4 h-4 text-[#D9A38F] rounded border-[#F4E4DE] focus:ring-[#D9A38F]"
                />
                <label htmlFor="prodStockToggle" className="text-sm font-semibold text-[#3A3A3A] cursor-pointer">
                  In Stock (Item available for guest ordering)
                </label>
              </div>

              {/* Images Manager */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#3A3A3A]">
                  Product Images (URLs)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#F4E4DE] focus:outline-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddImage}
                    className="text-xs"
                  >
                    Add Image
                  </Button>
                </div>

                {/* Image thumbnails */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(editingProduct.images || []).map((imgUrl, idx) => (
                    <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-[#F4E4DE] bg-[#FBF3F0]">
                      <img src={imgUrl} alt={`Prod image ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 end-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F4E4DE]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Save Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
