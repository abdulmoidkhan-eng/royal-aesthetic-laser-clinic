import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Save, CheckCircle2, AlertTriangle, Calendar, 
  Eye, RefreshCw, ToggleLeft, ToggleRight, ArrowRight 
} from 'lucide-react';
import { getOffersBanner, saveOffersBanner, DEFAULT_BANNER } from '../../firebase/contentService.js';
import Button from '../UI/Button.jsx';
import Card from '../UI/Card.jsx';
import Badge from '../UI/Badge.jsx';

export const BannerManager = () => {
  const [banner, setBanner] = useState(DEFAULT_BANNER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await getOffersBanner();
        if (isMounted && data) {
          setBanner(data);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load banner settings');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      await saveOffersBanner(banner);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update banner');
    } finally {
      setSaving(false);
    }
  };

  const isExpired = banner.endDate && new Date(banner.endDate).getTime() < Date.now();

  if (loading) {
    return (
      <Card className="p-8 text-center text-[#6B5B55]">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#D9A38F]" />
        <p className="text-sm">Loading offers banner configuration...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-[#F4E4DE]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-bold text-[#3A3A3A]">
              Offers & Announcements Banner
            </h2>
            <Badge variant={banner.active && !isExpired ? "success" : "neutral"}>
              {banner.active ? (isExpired ? "Expired" : "Active on Site") : "Turned Off"}
            </Badge>
          </div>
          <p className="text-xs text-[#6B5B55] mt-1">
            Displayed prominently at the top of every page. Manage promotional packages, holiday discounts, and doctor announcements.
          </p>
        </div>

        {/* Live On/Off Switch */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs font-semibold text-[#3A3A3A]">
              {banner.active ? "Banner ON" : "Banner OFF"}
            </span>
            <input
              type="checkbox"
              checked={banner.active}
              onChange={(e) => setBanner(prev => ({ ...prev, active: e.target.checked }))}
              className="sr-only"
            />
            <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              banner.active ? 'bg-emerald-600' : 'bg-zinc-300'
            }`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                banner.active ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </div>
          </label>
        </div>
      </div>

      {/* Live Preview Panel */}
      <Card className="p-5 border border-[#F4E4DE] bg-[#FBF3F0]/40 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-[#6B5B55]">
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#D9A38F]" />
            Live Visitor Preview (English & Urdu):
          </span>
          {banner.active && !isExpired ? (
            <span className="text-emerald-700 font-bold">● Visible to all visitors</span>
          ) : (
            <span className="text-rose-600 font-bold">○ Hidden from visitors</span>
          )}
        </div>

        {/* English Preview */}
        <div className="rounded-xl overflow-hidden border border-[#D9A38F]/30 bg-gradient-to-r from-[#F4E4DE] via-[#FBF3F0] to-[#F4E4DE] p-3 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 justify-center text-center">
            <span className="w-4 h-4 rounded-full bg-[#D9A38F] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-2.5 h-2.5" />
            </span>
            <span className="font-medium text-[#3A3A3A]">
              {banner.textEn || "No English text specified"}
            </span>
            {banner.endDate && (
              <span className="bg-white/80 px-2 py-0.5 rounded text-[10px] font-semibold text-[#8C5E50]">
                Until {banner.endDate}
              </span>
            )}
            <span className="font-bold underline text-[#3A3A3A] ms-1">
              {banner.linkTextEn || "Inquire Now"} →
            </span>
          </div>
        </div>

        {/* Urdu Preview */}
        <div dir="rtl" className="rounded-xl overflow-hidden border border-[#D9A38F]/30 bg-gradient-to-r from-[#F4E4DE] via-[#FBF3F0] to-[#F4E4DE] p-3 text-xs flex items-center justify-between gap-2 font-serif">
          <div className="flex items-center gap-2 flex-1 justify-center text-center">
            <span className="w-4 h-4 rounded-full bg-[#D9A38F] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-2.5 h-2.5" />
            </span>
            <span className="font-medium text-[#3A3A3A]">
              {banner.textUr || "کوئی اردو متن درج نہیں کیا گیا"}
            </span>
            {banner.endDate && (
              <span className="bg-white/80 px-2 py-0.5 rounded text-[10px] font-semibold text-[#8C5E50]">
                آخری تاریخ: {banner.endDate}
              </span>
            )}
            <span className="font-bold underline text-[#3A3A3A] ms-1">
              {banner.linkTextUr || "معلومات حاصل کریں"} ←
            </span>
          </div>
        </div>
      </Card>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-[#F4E4DE] shadow-xs space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#3A3A3A]">
          Banner Content & Schedule
        </h3>

        {/* Text Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              English Announcement Text *
            </label>
            <textarea
              rows={3}
              value={banner.textEn || ''}
              onChange={(e) => setBanner(prev => ({ ...prev, textEn: e.target.value }))}
              placeholder="e.g. Avail the 50% offers on all aesthetic procedure for Limited time."
              className="w-full text-xs p-3 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1 text-end">
              * اردو اعلان متن
            </label>
            <textarea
              dir="rtl"
              rows={3}
              value={banner.textUr || ''}
              onChange={(e) => setBanner(prev => ({ ...prev, textUr: e.target.value }))}
              placeholder="مثال: محدود وقت کے لیے تمام جمالیاتی طریقہ کار پر 50% رعایت حاصل کریں!"
              className="w-full text-xs p-3 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F] font-serif"
              required
            />
          </div>
        </div>

        {/* Schedule & Expiry */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-[#F4E4DE]">
          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              Optional Expiry Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={banner.endDate || ''}
                onChange={(e) => setBanner(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
              />
            </div>
            <p className="text-[11px] text-[#6B5B55] mt-1">
              Banner automatically deactivates after this date. Leave blank for indefinite.
            </p>
            {banner.endDate && (
              <button
                type="button"
                onClick={() => setBanner(prev => ({ ...prev, endDate: '' }))}
                className="text-[10px] text-rose-600 hover:underline mt-1 block"
              >
                Clear End Date (Show indefinitely)
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              English Button / Action Label
            </label>
            <input
              type="text"
              value={banner.linkTextEn || ''}
              onChange={(e) => setBanner(prev => ({ ...prev, linkTextEn: e.target.value }))}
              placeholder="e.g. Inquire Now"
              className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1 text-end">
              اردو ایکشن بٹن متن
            </label>
            <input
              dir="rtl"
              type="text"
              value={banner.linkTextUr || ''}
              onChange={(e) => setBanner(prev => ({ ...prev, linkTextUr: e.target.value }))}
              placeholder="مثال: معلومات حاصل کریں"
              className="w-full text-xs p-2.5 rounded-xl border border-[#F4E4DE] focus:outline-none focus:ring-2 focus:ring-[#D9A38F] font-serif"
            />
          </div>
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Offers banner successfully saved and updated across the site!</span>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F4E4DE]">
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            className="flex items-center gap-2 shadow-sm"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save className="w-4 h-4 text-white" />
            )}
            <span>Save Banner Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BannerManager;
