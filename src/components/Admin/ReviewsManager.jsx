import React, { useState, useEffect } from 'react';
import { 
  Star, Plus, Edit2, Trash2, Save, X, AlertTriangle, 
  CheckCircle2, RefreshCw, MessageSquare, MapPin, User 
} from 'lucide-react';
import { getReviews, saveReview, deleteReview } from '../../firebase/contentService.js';
import { getActiveServices } from '../../firebase/servicesService.js';
import Button from '../UI/Button.jsx';
import Card from '../UI/Card.jsx';
import Badge from '../UI/Badge.jsx';

export const ReviewsManager = () => {
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  const initialForm = {
    name: '',
    rating: 5,
    service: 'Hydra Facial',
    location: 'Thana, Malakand',
    textEn: '',
    textUr: '',
    date: 'Recently verified'
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [reviewsData, servicesData] = await Promise.all([
          getReviews(),
          getActiveServices()
        ]);
        if (isMounted) {
          if (reviewsData) setReviews(reviewsData);
          if (servicesData) setServices(servicesData);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load reviews');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const openNewModal = () => {
    setIsNew(true);
    setEditingReview(null);
    setFormData(initialForm);
    setError(null);
  };

  const openEditModal = (rev) => {
    setIsNew(false);
    setEditingReview(rev);
    setFormData({
      id: rev.id,
      name: rev.name || '',
      rating: rev.rating || 5,
      service: rev.treatment?.en || rev.service || 'Laser Treatment',
      location: rev.location || 'Malakand',
      textEn: rev.comment?.en || rev.textEn || '',
      textUr: rev.comment?.ur || rev.textUr || '',
      date: rev.date || 'Recently verified'
    });
    setError(null);
  };

  const closeModal = () => {
    setEditingReview(null);
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
        id: isNew ? `rev-${Date.now()}` : formData.id,
        rating: Number(formData.rating) || 5,
        treatment: { en: formData.service, ur: formData.service },
        comment: { en: formData.textEn, ur: formData.textUr }
      };

      await saveReview(payload, isNew);

      // Refresh list
      const updated = await getReviews();
      setReviews(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      closeModal();
    } catch (err) {
      setError(err.message || 'Failed to save review');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this patient testimonial permanently?')) {
      return;
    }
    try {
      await deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center text-[#6B5B55]">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#D9A38F]" />
        <p className="text-sm">Loading patient reviews...</p>
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
              Patient Reviews & Testimonials
            </h2>
            <Badge variant="blush">{reviews.length} Testimonials</Badge>
          </div>
          <p className="text-xs text-[#6B5B55] mt-1">
            Admin-controlled patient testimonials. Displayed on the Home page and dedicated Reviews page.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openNewModal}
          className="flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Patient Review</span>
        </Button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Review saved successfully and published!</span>
        </div>
      )}

      {/* Grid of reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => {
          const textEn = rev.comment?.en || rev.textEn || '';
          const textUr = rev.comment?.ur || rev.textUr || '';
          const serviceName = rev.treatment?.en || rev.service || '';
          const rating = rev.rating || 5;

          return (
            <Card key={rev.id} className="p-5 border border-[#F4E4DE] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#6B5B55]">{rev.date || 'Recent'}</span>
                </div>

                <div className="space-y-2 mb-4">
                  {textEn && (
                    <p className="text-xs text-[#3A3A3A] italic leading-relaxed">
                      "{textEn}"
                    </p>
                  )}
                  {textUr && (
                    <p dir="rtl" className="text-xs text-[#6B5B55] font-serif leading-relaxed border-t border-[#F4E4DE]/60 pt-2">
                      "{textUr}"
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F4E4DE]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-serif font-bold text-sm text-[#3A3A3A]">
                      {rev.name}
                    </p>
                    <p className="text-[11px] text-[#6B5B55] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D9A38F]" />
                      <span>{rev.location || 'Malakand'}</span>
                    </p>
                  </div>
                  {serviceName && (
                    <Badge variant="blush" className="text-[10px]">
                      {serviceName}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F4E4DE]/40">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(rev)}
                    className="flex items-center gap-1 text-xs py-1"
                  >
                    <Edit2 className="w-3 h-3 text-[#D9A38F]" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(rev.id)}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:bg-rose-50 border-rose-200 py-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal for Add / Edit Review */}
      {(isNew || editingReview) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#F4E4DE] shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F4E4DE] pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#3A3A3A]">
                  {isNew ? "Add Patient Testimonial" : "Edit Review"}
                </h3>
                <p className="text-xs text-[#6B5B55]">
                  Authentic patient quotes verified by clinic doctor
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
              {/* Name and Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Patient Name / Initials *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Dr. Ayesha K. or M. U."
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              {/* Service and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Associated Treatment / Service
                  </label>
                  <input
                    type="text"
                    value={formData.service}
                    onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                    placeholder="e.g. Diode Laser Hair Removal"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Patient City / Area
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Thana, Malakand"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
                  />
                </div>
              </div>

              {/* Review Text English */}
              <div>
                <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                  Testimonial Text (English) *
                </label>
                <textarea
                  rows={3}
                  value={formData.textEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, textEn: e.target.value }))}
                  placeholder="The doctor explained everything in detail. The cooling tip makes it genuinely painless..."
                  className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
                  required
                />
              </div>

              {/* Review Text Urdu */}
              <div>
                <label className="block text-xs font-semibold text-[#3A3A3A] mb-1 text-end">
                  * مریض کا تاثر (اردو)
                </label>
                <textarea
                  dir="rtl"
                  rows={3}
                  value={formData.textUr}
                  onChange={(e) => setFormData(prev => ({ ...prev, textUr: e.target.value }))}
                  placeholder="کلینک کا ماحول انتہائی صاف ستھرا اور پرسکون ہے۔ علاج کے بعد چہرہ بالکل صاف..."
                  className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F] font-serif"
                  required
                />
              </div>

              {/* Date / timeframe label */}
              <div>
                <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                  Date / Timeframe Label
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  placeholder="e.g. 2 weeks ago, or Verified Patient"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
                />
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
                  <span>{isNew ? "Publish Review" : "Save Changes"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsManager;
