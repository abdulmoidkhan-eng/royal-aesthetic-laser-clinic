import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Plus, Edit2, Trash2, Save, X, AlertTriangle, 
  CheckCircle2, RefreshCw, Image as ImageIcon, ExternalLink 
} from 'lucide-react';
import { getGalleryItems, saveGalleryItem, deleteGalleryItem } from '../../firebase/contentService.js';
import { getActiveServices } from '../../firebase/servicesService.js';
import Button from '../UI/Button.jsx';
import Card from '../UI/Card.jsx';
import Badge from '../UI/Badge.jsx';

export const GalleryManager = () => {
  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  const initialForm = {
    captionEn: '',
    captionUr: '',
    relatedService: 'Acne Treatments',
    beforeImage: '',
    afterImage: '',
    timeframeEn: '8 Weeks (3 Sessions)',
    timeframeUr: '8 ہفتے (3 سیشنز)',
    notesEn: 'Visible improvement in dermal surface and collagen remodeling.',
    notesUr: 'جلد کی قدرتی بحالی اور نتائج میں نمایاں بہتری۔'
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [galleryData, servicesData] = await Promise.all([
          getGalleryItems(),
          getActiveServices()
        ]);
        if (isMounted) {
          if (galleryData) setItems(galleryData);
          if (servicesData) setServices(servicesData);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load gallery items');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const openNewModal = () => {
    setIsNew(true);
    setEditingItem(null);
    setFormData(initialForm);
    setError(null);
  };

  const openEditModal = (item) => {
    setIsNew(false);
    setEditingItem(item);
    setFormData({
      id: item.id,
      captionEn: item.captionEn || item.title?.en || '',
      captionUr: item.captionUr || item.title?.ur || '',
      relatedService: item.relatedService || item.service?.en || (services[0]?.name?.en || 'Acne Treatments'),
      beforeImage: item.beforeImage || item.beforeUrl || '',
      afterImage: item.afterImage || item.afterUrl || '',
      timeframeEn: item.timeframeEn || item.timeframe?.en || '',
      timeframeUr: item.timeframeUr || item.timeframe?.ur || '',
      notesEn: item.notesEn || item.notes?.en || '',
      notesUr: item.notesUr || item.notes?.ur || ''
    });
    setError(null);
  };

  const closeModal = () => {
    setEditingItem(null);
    setIsNew(false);
    setError(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        id: isNew ? `gal-${Date.now()}` : formData.id,
        title: { en: formData.captionEn, ur: formData.captionUr },
        service: { en: formData.relatedService, ur: formData.relatedService },
        timeframe: { en: formData.timeframeEn, ur: formData.timeframeUr },
        notes: { en: formData.notesEn, ur: formData.notesUr }
      };

      await saveGalleryItem(payload, isNew);

      // Refresh list
      const updated = await getGalleryItems();
      setItems(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      closeModal();
    } catch (err) {
      setError(err.message || 'Failed to save gallery case');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this Before & After result from the gallery?')) {
      return;
    }
    try {
      await deleteGalleryItem(itemId);
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center text-[#6B5B55]">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#D9A38F]" />
        <p className="text-sm">Loading gallery case studies...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#F4E4DE]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-bold text-[#3A3A3A]">
              Before & After Clinical Gallery
            </h2>
            <Badge variant="blush">{items.length} Cases</Badge>
          </div>
          <p className="text-xs text-[#6B5B55] mt-1">
            Showcase authentic clinical transformations with side-by-side image pairs, captions in English and Urdu, and associated treatment tags.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openNewModal}
          className="flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add New Case Result</span>
        </Button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Gallery updated successfully!</span>
        </div>
      )}

      {/* Grid of gallery items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const captionEn = item.captionEn || item.title?.en || 'Case Result';
          const captionUr = item.captionUr || item.title?.ur || '';
          const serviceName = item.relatedService || item.service?.en || 'Clinical Procedure';
          const beforeImg = item.beforeImage || item.beforeUrl;
          const afterImg = item.afterImage || item.afterUrl;

          return (
            <Card key={item.id} className="overflow-hidden p-0 border border-[#F4E4DE] flex flex-col justify-between">
              <div>
                {/* Images Preview */}
                <div className="grid grid-cols-2 relative bg-zinc-100 aspect-[16/10]">
                  <div className="relative border-e border-white/60">
                    <img
                      src={beforeImg}
                      alt="Before"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 start-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      BEFORE
                    </span>
                  </div>
                  <div className="relative">
                    <img
                      src={afterImg}
                      alt="After"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 end-2 bg-[#D9A38F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      AFTER
                    </span>
                  </div>
                </div>

                {/* Content info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="blush" className="text-[10px]">
                      {serviceName}
                    </Badge>
                    <span className="text-[10px] text-[#6B5B55]">
                      {item.timeframeEn || item.timeframe?.en || ''}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-[#3A3A3A] line-clamp-1">
                    {captionEn}
                  </h3>
                  {captionUr && (
                    <p dir="rtl" className="font-serif text-xs text-[#6B5B55] line-clamp-1">
                      {captionUr}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 bg-[#FBF3F0]/60 border-t border-[#F4E4DE] flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(item)}
                  className="flex items-center gap-1.5 text-xs flex-1 justify-center"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#D9A38F]" />
                  <span>Edit</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1.5 text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                  title="Delete case study"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal for Add / Edit */}
      {(isNew || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#F4E4DE] shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F4E4DE] pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#3A3A3A]">
                  {isNew ? "Add Before & After Result" : "Edit Case Study"}
                </h3>
                <p className="text-xs text-[#6B5B55]">
                  Patient before/after photographic documentation
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 text-[#6B5B55] hover:text-[#3A3A3A] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Image URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Before Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.beforeImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, beforeImage: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
                    required
                  />
                  {formData.beforeImage && (
                    <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-[#F4E4DE] bg-zinc-50">
                      <img src={formData.beforeImage} alt="Preview Before" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    After Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.afterImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, afterImage: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
                    required
                  />
                  {formData.afterImage && (
                    <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-[#F4E4DE] bg-zinc-50">
                      <img src={formData.afterImage} alt="Preview After" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Related Service */}
              <div>
                <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                  Related Clinical Service *
                </label>
                <select
                  value={formData.relatedService}
                  onChange={(e) => setFormData(prev => ({ ...prev, relatedService: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
                  required
                >
                  <option value="Acne Treatments">Acne Treatments</option>
                  <option value="Hair Removal">Hair Removal</option>
                  <option value="Hydra Facial">Hydra Facial</option>
                  <option value="Hair Transplant">Hair Transplant (Islamabad)</option>
                  <option value="PRP, [EXACT TREATMENT NAME CONFIRMED BY DOCTOR], and Exosomes">PRP & Exosomes</option>
                  <option value="Botox and Fillers">Botox and Fillers</option>
                  <option value="Pigmentation">Pigmentation & Melasma</option>
                  <option value="Mole Removal">Mole Removal</option>
                  <option value="Tattoo Removal">Tattoo Removal</option>
                  {services.map(s => {
                    const name = s.name?.en || s.name;
                    return <option key={s.id} value={name}>{name}</option>;
                  })}
                </select>
              </div>

              {/* Captions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    English Caption / Condition *
                  </label>
                  <input
                    type="text"
                    value={formData.captionEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, captionEn: e.target.value }))}
                    placeholder="e.g. Severe Acne Scars & Uneven Texture"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1 text-end">
                    * اردو تفصیل / عنوان
                  </label>
                  <input
                    dir="rtl"
                    type="text"
                    value={formData.captionUr}
                    onChange={(e) => setFormData(prev => ({ ...prev, captionUr: e.target.value }))}
                    placeholder="مثال: ایکنی کے گہرے گڑھے اور جلد کی ناہمواری"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F] font-serif"
                    required
                  />
                </div>
              </div>

              {/* Timeframe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Timeframe (English)
                  </label>
                  <input
                    type="text"
                    value={formData.timeframeEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeframeEn: e.target.value }))}
                    placeholder="e.g. 12 Weeks (3 Sessions)"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1 text-end">
                    دورانیہ (اردو)
                  </label>
                  <input
                    dir="rtl"
                    type="text"
                    value={formData.timeframeUr}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeframeUr: e.target.value }))}
                    placeholder="مثال: 12 ہفتے (3 سیشنز)"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F] font-serif"
                  />
                </div>
              </div>

              {/* Clinical Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Clinical Note (English)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notesEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, notesEn: e.target.value }))}
                    placeholder="Significant dermal leveling and collagen remodeling. Results vary."
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1 text-end">
                    طبی نوٹ (اردو)
                  </label>
                  <textarea
                    dir="rtl"
                    rows={2}
                    value={formData.notesUr}
                    onChange={(e) => setFormData(prev => ({ ...prev, notesUr: e.target.value }))}
                    placeholder="کولیجن کی قدرتی بحالی اور جلد کی ہمواری۔ نتائج مختلف ہو سکتے ہیں۔"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F] font-serif"
                  />
                </div>
              </div>

              {/* Modal footer buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F4E4DE]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving && <RefreshCw className="w-4 h-4 animate-spin text-white" />}
                  <span>{isNew ? "Create Case Study" : "Save Changes"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
