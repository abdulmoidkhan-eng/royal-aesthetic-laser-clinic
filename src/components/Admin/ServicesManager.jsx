import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Plus, Edit2, Trash2, Check, X, Search, Eye, EyeOff, 
  Tag, Clock, DollarSign, Image as ImageIcon, AlertCircle, RefreshCw 
} from 'lucide-react';
import { 
  fetchAllServicesAdmin, saveServiceAdmin, toggleServiceActiveAdmin, deleteServiceAdmin 
} from '../../firebase/adminService.js';
import Card from '../UI/Card.jsx';
import Button from '../UI/Button.jsx';
import Badge from '../UI/Badge.jsx';

const EMPTY_SERVICE = {
  id: '',
  name: { en: '', ur: '' },
  shortDescription: { en: '', ur: '' },
  longDescription: { en: '', ur: '' },
  duration: '45 mins',
  price: 0,
  priceNote: { en: '', ur: '' },
  image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
  keywords: [],
  active: true,
  branchNote: { en: '', ur: '' },
  category: 'laser'
};

export const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [keywordInput, setKeywordInput] = useState('');

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await fetchAllServicesAdmin();
      setServices(data || []);
    } catch (err) {
      console.error('Error loading services:', err);
      setStatusMsg({ text: 'Failed to load services. Check connection.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService({ ...EMPTY_SERVICE, id: `service-${Date.now()}` });
    setKeywordInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService({
      ...srv,
      name: { en: srv.name?.en || '', ur: srv.name?.ur || '' },
      shortDescription: { en: srv.shortDescription?.en || '', ur: srv.shortDescription?.ur || '' },
      longDescription: { en: srv.longDescription?.en || '', ur: srv.longDescription?.ur || '' },
      branchNote: { en: srv.branchNote?.en || '', ur: srv.branchNote?.ur || '' },
      priceNote: { en: srv.priceNote?.en || '', ur: srv.priceNote?.ur || '' },
      keywords: Array.isArray(srv.keywords) ? [...srv.keywords] : []
    });
    setKeywordInput('');
    setIsModalOpen(true);
  };

  const handleToggleActive = async (srv) => {
    try {
      const updatedState = await toggleServiceActiveAdmin(srv.id, srv.active);
      setServices(prev => prev.map(s => s.id === srv.id ? { ...s, active: updatedState } : s));
      setStatusMsg({ text: `Service "${srv.name.en}" is now ${updatedState ? 'Active' : 'Hidden'}.`, type: 'success' });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Toggle error:', err);
      setStatusMsg({ text: 'Could not toggle service status.', type: 'error' });
    }
  };

  const handleDelete = async (srv) => {
    if (!window.confirm(`Are you sure you want to delete "${srv.name?.en || srv.id}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteServiceAdmin(srv.id);
      setServices(prev => prev.filter(s => s.id !== srv.id));
      setStatusMsg({ text: `Service "${srv.name?.en}" deleted.`, type: 'success' });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setStatusMsg({ text: 'Failed to delete service.', type: 'error' });
    }
  };

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    const newKw = keywordInput.trim();
    if (!editingService.keywords.includes(newKw)) {
      setEditingService(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKw]
      }));
    }
    setKeywordInput('');
  };

  const handleRemoveKeyword = (kwToRemove) => {
    setEditingService(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== kwToRemove)
    }));
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!editingService.name.en.trim() || !editingService.name.ur.trim()) {
      alert('Please provide both English and Urdu names for the service.');
      return;
    }

    setIsSaving(true);
    try {
      const isNew = !services.some(s => s.id === editingService.id);
      await saveServiceAdmin(editingService, isNew);
      await loadServices();
      setIsModalOpen(false);
      setStatusMsg({ text: `Service "${editingService.name.en}" saved successfully!`, type: 'success' });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setStatusMsg({ text: 'Error saving service to database.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredServices = services.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameEn = (s.name?.en || '').toLowerCase();
    const nameUr = (s.name?.ur || '').toLowerCase();
    const kws = (s.keywords || []).join(' ').toLowerCase();
    return nameEn.includes(q) || nameUr.includes(q) || kws.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#F4E4DE] shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#D9A38F] absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search services by English name, Urdu, or concern keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-4 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadServices}
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
            Add New Service
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

      {/* Services List / Table */}
      {loading ? (
        <div className="py-16 text-center text-[#6B5B55]">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 text-[#D9A38F] animate-spin" />
          <p className="text-sm">Loading clinic services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-[#F4E4DE] text-center">
          <Sparkles className="w-10 h-10 text-[#D9A38F] mx-auto mb-3 opacity-60" />
          <p className="font-serif text-lg text-[#3A3A3A]">No clinical services match your filter</p>
          <p className="text-xs text-[#6B5B55] mt-1 mb-4">Click below to add a new aesthetic or laser procedure</p>
          <Button variant="primary" size="sm" onClick={handleOpenAdd}>
            Create Service
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredServices.map((srv) => (
            <Card key={srv.id} className="p-4 flex flex-col justify-between border-[#F4E4DE] hover:shadow-md transition-shadow">
              <div>
                {/* Header with image & active toggle */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FBF3F0] shrink-0 border border-[#F4E4DE]">
                    <img
                      src={srv.image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800'}
                      alt={srv.name?.en || 'Service thumbnail'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-serif font-semibold text-[#3A3A3A] truncate text-base">
                        {srv.name?.en}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(srv)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                          srv.active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                        title="Click to toggle active status"
                      >
                        {srv.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {srv.active ? 'Active' : 'Hidden'}
                      </button>
                    </div>

                    <p className="text-xs font-serif text-[#D9A38F] dir-rtl text-end truncate">
                      {srv.name?.ur}
                    </p>

                    {srv.branchNote?.en && (
                      <span className="inline-block mt-1 text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-md border border-amber-200">
                        {srv.branchNote.en}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#6B5B55] line-clamp-2 mb-3">
                  {srv.shortDescription?.en}
                </p>

                {/* Duration & Price */}
                <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-[#FBF3F0]/60 rounded-lg mb-3">
                  <span className="flex items-center gap-1 text-[#6B5B55]">
                    <Clock className="w-3 h-3 text-[#D9A38F]" />
                    {srv.duration || 'Consultation'}
                  </span>
                  <span className="font-semibold text-[#3A3A3A]">
                    {srv.price && srv.price > 0 ? `PKR ${srv.price.toLocaleString()}` : 'Price on Consultation'}
                  </span>
                </div>

                {/* Keywords preview */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {(srv.keywords || []).slice(0, 4).map((kw, idx) => (
                    <span key={idx} className="text-[10px] bg-white border border-[#F4E4DE] text-[#6B5B55] px-1.5 py-0.5 rounded-md">
                      {kw}
                    </span>
                  ))}
                  {(srv.keywords || []).length > 4 && (
                    <span className="text-[10px] text-[#D9A38F] font-semibold self-center">
                      +{(srv.keywords || []).length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F4E4DE]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(srv)}
                  className="flex items-center gap-1 text-xs py-1"
                >
                  <Edit2 className="w-3 h-3 text-[#D9A38F]" />
                  Edit
                </Button>
                <button
                  type="button"
                  onClick={() => handleDelete(srv)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#F4E4DE] my-8 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4E4DE] bg-[#FBF3F0]/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D9A38F]" />
                <h3 className="font-serif font-semibold text-lg text-[#3A3A3A]">
                  {services.some(s => s.id === editingService.id) ? 'Edit Service' : 'Add New Aesthetic Service'}
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
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Service Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    English Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.name.en}
                    onChange={(e) => setEditingService(prev => ({
                      ...prev,
                      name: { ...prev.name, en: e.target.value }
                    }))}
                    placeholder="e.g. Laser Hair Removal"
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
                    value={editingService.name.ur}
                    onChange={(e) => setEditingService(prev => ({
                      ...prev,
                      name: { ...prev.name, ur: e.target.value }
                    }))}
                    placeholder="مثلاً: لیزر ہیئر ریموول"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none font-serif text-end"
                  />
                </div>
              </div>

              {/* Short Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    English Short Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editingService.shortDescription.en}
                    onChange={(e) => setEditingService(prev => ({
                      ...prev,
                      shortDescription: { ...prev.shortDescription, en: e.target.value }
                    }))}
                    placeholder="Brief 1-2 sentence overview for cards..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Urdu Short Description (مختصر تفصیل) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    dir="rtl"
                    value={editingService.shortDescription.ur}
                    onChange={(e) => setEditingService(prev => ({
                      ...prev,
                      shortDescription: { ...prev.shortDescription, ur: e.target.value }
                    }))}
                    placeholder="کارڈز اور سرچ کے لیے مختصر خلاصہ..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none font-serif text-end"
                  />
                </div>
              </div>

              {/* Long Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    English Full Clinical Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={editingService.longDescription.en}
                    onChange={(e) => setEditingService(prev => ({
                      ...prev,
                      longDescription: { ...prev.longDescription, en: e.target.value }
                    }))}
                    placeholder="Detailed explanation of clinical steps, medical safety, and expected outcomes..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Urdu Full Clinical Description (مکمل طبی تفصیل) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    dir="rtl"
                    value={editingService.longDescription.ur}
                    onChange={(e) => setEditingService(prev => ({
                      ...prev,
                      longDescription: { ...prev.longDescription, ur: e.target.value }
                    }))}
                    placeholder="طریقہ کار، احتیاطی تدابیر اور نتائج کی تفصیلی وضاحت..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none font-serif text-end"
                  />
                </div>
              </div>

              {/* Category, Duration, Price, Branch Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Category *
                  </label>
                  <select
                    value={editingService.category || 'laser'}
                    onChange={(e) => setEditingService(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none bg-white"
                  >
                    <option value="laser">Laser Procedures</option>
                    <option value="pigmentation">Pigmentation & Melasma</option>
                    <option value="facial">Medicated Facials</option>
                    <option value="skin-rejuvenation">Skin Rejuvenation</option>
                    <option value="hair-restoration">Hair Restoration</option>
                    <option value="surgical">Hair Transplant</option>
                    <option value="injectables">Botox</option>
                    <option value="iv-therapy">IV Drips</option>
                    <option value="minor-procedure">Mole Removal</option>
                    <option value="acne-care">Acne Treatment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Duration (e.g. 45 mins)
                  </label>
                  <input
                    type="text"
                    value={editingService.duration || ''}
                    onChange={(e) => setEditingService(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Price (PKR, 0 = consultation)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={editingService.price || 0}
                    onChange={(e) => setEditingService(prev => ({ ...prev, price: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Branch Designation (e.g. Islamabad Branch)
                  </label>
                  <input
                    type="text"
                    value={editingService.branchNote?.en || ''}
                    onChange={(e) => setEditingService(prev => ({
                      ...prev,
                      branchNote: { 
                        en: e.target.value, 
                        ur: e.target.value ? (prev.branchNote?.ur || 'اسلام آباد برانچ میں کیا جاتا ہے') : '' 
                      }
                    }))}
                    placeholder="Leave blank for Malakand clinic"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URL with preview */}
              <div>
                <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={editingService.image || ''}
                    onChange={(e) => setEditingService(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
                  />
                  {editingService.image && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#F4E4DE] shrink-0">
                      <img src={editingService.image} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Keywords Tag Manager (English, Urdu, Roman Urdu) */}
              <div className="p-4 bg-[#FBF3F0]/60 rounded-2xl border border-[#F4E4DE]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#3A3A3A] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#D9A38F]" />
                    Concern Search Keywords (English, Urdu & Roman Urdu)
                  </label>
                  <span className="text-[11px] text-[#6B5B55]">
                    Used by ConcernSearch bar
                  </span>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="Type keyword and press Add (e.g. acne, pimples, کیل مہاسے, daag dhabe)..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#F4E4DE] bg-white focus:outline-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddKeyword}
                    className="text-xs"
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {(editingService.keywords || []).map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-white border border-[#F4E4DE] text-[#3A3A3A]"
                    >
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-[#6B5B55] hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Toggle Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="activeToggle"
                  checked={editingService.active}
                  onChange={(e) => setEditingService(prev => ({ ...prev, active: e.target.checked }))}
                  className="w-4 h-4 text-[#D9A38F] rounded border-[#F4E4DE] focus:ring-[#D9A38F]"
                />
                <label htmlFor="activeToggle" className="text-sm font-semibold text-[#3A3A3A] cursor-pointer">
                  Publish service live on website (Active)
                </label>
              </div>

              {/* Actions Footer inside modal */}
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
                  Save Service
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
