import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, RefreshCw, CheckCircle2, AlertCircle, Phone, 
  Clock, MapPin, Share2, CreditCard, Landmark, DollarSign 
} from 'lucide-react';
import { fetchSiteSettingsAdmin, saveSiteSettingsAdmin } from '../../firebase/adminService.js';
import Card from '../UI/Card.jsx';
import Button from '../UI/Button.jsx';

export const SettingsManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  // General Settings state
  const [general, setGeneral] = useState({
    phone: '',
    whatsappNumber: '',
    email: '',
    googleMapsUrl: 'https://maps.app.goo.gl/MQF1gR36KicZYmhu5',
    address: { en: '', ur: '', shortEn: '', shortUr: '' },
    timings: {
      en: '',
      ur: '',
      daysEn: '',
      daysUr: '',
      hoursEn: '',
      hoursUr: '',
      offDayEn: '',
      offDayUr: ''
    },
    socials: {
      instagram: 'https://www.instagram.com/asad.shalman?cplk=MWxrbDNxNDBwNDEyNg==',
      facebook: 'https://www.facebook.com/share/19UtS7h9fh/',
      tiktok: 'https://www.tiktok.com/@drasad.shalman?is_from_webapp=1&sender_device=pc'
    }
  });

  // Payment Methods Settings state
  const [paymentMethods, setPaymentMethods] = useState({
    easypaisa: {
      accountTitle: '',
      accountNumber: '',
      notesEn: '',
      notesUr: ''
    },
    jazzcash: {
      accountTitle: '',
      accountNumber: '',
      notesEn: '',
      notesUr: ''
    },
    bankTransfer: {
      bankName: '',
      accountTitle: '',
      accountNumber: '',
      iban: '',
      branchCode: '',
      notesEn: '',
      notesUr: ''
    }
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchSiteSettingsAdmin();
      if (data) {
        if (data.general) setGeneral(prev => ({ ...prev, ...data.general }));
        if (data.paymentMethods) setPaymentMethods(prev => ({ ...prev, ...data.paymentMethods }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setStatusMsg({ text: 'Failed to load settings from Firestore.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ text: '', type: '' });
    try {
      await saveSiteSettingsAdmin(general, paymentMethods);
      setStatusMsg({ text: 'Site settings and payment instructions saved to Firestore!', type: 'success' });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setStatusMsg({ text: 'Failed to save settings. Please verify admin privileges.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-[#6B5B55]">
        <RefreshCw className="w-8 h-8 mx-auto mb-2 text-[#D9A38F] animate-spin" />
        <p className="text-sm">Loading clinic settings from database...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Banner & Save CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#F4E4DE] shadow-xs">
        <div>
          <h3 className="font-serif font-semibold text-base text-[#3A3A3A]">
            Clinic Master Configuration
          </h3>
          <p className="text-xs text-[#6B5B55]">
            Updates take effect across the public website and guest checkout instructions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadSettings}
            disabled={saving}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={saving}
            className="flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {statusMsg.text && (
        <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
          statusMsg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          {statusMsg.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Section 1: Contact Details */}
      <Card className="p-5 border-[#F4E4DE] space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#F4E4DE]">
          <Phone className="w-4 h-4 text-[#D9A38F]" />
          <h4 className="font-serif font-semibold text-base text-[#3A3A3A]">
            Clinic Contact & Locations
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              Clinic Phone Number
            </label>
            <input
              type="text"
              value={general.phone || ''}
              onChange={(e) => setGeneral(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+92 347 9305057"
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              WhatsApp Number (Format: 923479305057)
            </label>
            <input
              type="text"
              value={general.whatsappNumber || ''}
              onChange={(e) => setGeneral(prev => ({ ...prev, whatsappNumber: e.target.value }))}
              placeholder="923479305057"
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              Official Email
            </label>
            <input
              type="email"
              value={general.email || ''}
              onChange={(e) => setGeneral(prev => ({ ...prev, email: e.target.value }))}
              placeholder="royalaesthetic@gmail.com"
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              Clinic Address (English)
            </label>
            <textarea
              rows={2}
              value={general.address?.en || ''}
              onChange={(e) => setGeneral(prev => ({
                ...prev,
                address: { ...prev.address, en: e.target.value }
              }))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              Clinic Address (اردو پتہ)
            </label>
            <textarea
              rows={2}
              dir="rtl"
              value={general.address?.ur || ''}
              onChange={(e) => setGeneral(prev => ({
                ...prev,
                address: { ...prev.address, ur: e.target.value }
              }))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none font-serif text-end"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
            Google Maps Link
          </label>
          <input
            type="url"
            value={general.googleMapsUrl || ''}
            onChange={(e) => setGeneral(prev => ({ ...prev, googleMapsUrl: e.target.value }))}
            placeholder="https://maps.app.goo.gl/..."
            className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
          />
        </div>
      </Card>

      {/* Section 2: Clinic Timings */}
      <Card className="p-5 border-[#F4E4DE] space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#F4E4DE]">
          <Clock className="w-4 h-4 text-[#D9A38F]" />
          <h4 className="font-serif font-semibold text-base text-[#3A3A3A]">
            Clinic Operational Hours & Off Days
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              Days (English)
            </label>
            <input
              type="text"
              value={general.timings?.daysEn || ''}
              onChange={(e) => setGeneral(prev => ({
                ...prev,
                timings: { ...prev.timings, daysEn: e.target.value }
              }))}
              placeholder="Saturday – Thursday"
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              Days (اردو دن)
            </label>
            <input
              type="text"
              dir="rtl"
              value={general.timings?.daysUr || ''}
              onChange={(e) => setGeneral(prev => ({
                ...prev,
                timings: { ...prev.timings, daysUr: e.target.value }
              }))}
              placeholder="ہفتہ تا جمعرات"
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none font-serif text-end"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              Operating Hours (English)
            </label>
            <input
              type="text"
              value={general.timings?.hoursEn || ''}
              onChange={(e) => setGeneral(prev => ({
                ...prev,
                timings: { ...prev.timings, hoursEn: e.target.value }
              }))}
              placeholder="11:00 AM - 5:00 PM"
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              Operating Hours (اردو اوقات)
            </label>
            <input
              type="text"
              dir="rtl"
              value={general.timings?.hoursUr || ''}
              onChange={(e) => setGeneral(prev => ({
                ...prev,
                timings: { ...prev.timings, hoursUr: e.target.value }
              }))}
              placeholder="صبح 11 بجے سے شام 5 بجے تک"
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none font-serif text-end"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              Off Day Note (English)
            </label>
            <input
              type="text"
              value={general.timings?.offDayEn || ''}
              onChange={(e) => setGeneral(prev => ({
                ...prev,
                timings: { ...prev.timings, offDayEn: e.target.value }
              }))}
              placeholder="Friday (Closed)"
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              Off Day Note (اردو چھٹی کا دن)
            </label>
            <input
              type="text"
              dir="rtl"
              value={general.timings?.offDayUr || ''}
              onChange={(e) => setGeneral(prev => ({
                ...prev,
                timings: { ...prev.timings, offDayUr: e.target.value }
              }))}
              placeholder="جمعہ (بند)"
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none font-serif text-end"
            />
          </div>
        </div>
      </Card>

      {/* Section 3: Social Media Links */}
      <Card className="p-5 border-[#F4E4DE] space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#F4E4DE]">
          <Share2 className="w-4 h-4 text-[#D9A38F]" />
          <h4 className="font-serif font-semibold text-base text-[#3A3A3A]">
            Social Media Links
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              Instagram Profile URL
            </label>
            <input
              type="url"
              value={general.socials?.instagram || ''}
              onChange={(e) => setGeneral(prev => ({
                ...prev,
                socials: { ...prev.socials, instagram: e.target.value }
              }))}
              placeholder="https://instagram.com/..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              Facebook Page URL
            </label>
            <input
              type="url"
              value={general.socials?.facebook || ''}
              onChange={(e) => setGeneral(prev => ({
                ...prev,
                socials: { ...prev.socials, facebook: e.target.value }
              }))}
              placeholder="https://facebook.com/..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
              TikTok Profile URL
            </label>
            <input
              type="url"
              value={general.socials?.tiktok || ''}
              onChange={(e) => setGeneral(prev => ({
                ...prev,
                socials: { ...prev.socials, tiktok: e.target.value }
              }))}
              placeholder="https://tiktok.com/@..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Section 4: Payment Instructions (Easypaisa, JazzCash, Bank Transfer) */}
      <Card className="p-5 border-[#F4E4DE] space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-[#F4E4DE]">
          <CreditCard className="w-4 h-4 text-[#D9A38F]" />
          <div>
            <h4 className="font-serif font-semibold text-base text-[#3A3A3A]">
              Checkout Payment Instructions & Accounts
            </h4>
            <p className="text-xs text-[#6B5B55]">
              Shown to customers on the guest checkout page for offline bank/mobile transfer.
            </p>
          </div>
        </div>

        {/* Easypaisa */}
        <div className="p-4 bg-[#FBF3F0]/60 rounded-2xl border border-[#F4E4DE] space-y-3">
          <span className="font-semibold text-sm text-[#3A3A3A] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Easypaisa Account Details
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                Account Title
              </label>
              <input
                type="text"
                value={paymentMethods.easypaisa?.accountTitle || ''}
                onChange={(e) => setPaymentMethods(prev => ({
                  ...prev,
                  easypaisa: { ...prev.easypaisa, accountTitle: e.target.value }
                }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                Account / Mobile Number
              </label>
              <input
                type="text"
                value={paymentMethods.easypaisa?.accountNumber || ''}
                onChange={(e) => setPaymentMethods(prev => ({
                  ...prev,
                  easypaisa: { ...prev.easypaisa, accountNumber: e.target.value }
                }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] bg-white focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* JazzCash */}
        <div className="p-4 bg-[#FBF3F0]/60 rounded-2xl border border-[#F4E4DE] space-y-3">
          <span className="font-semibold text-sm text-[#3A3A3A] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            JazzCash Account Details
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                Account Title
              </label>
              <input
                type="text"
                value={paymentMethods.jazzcash?.accountTitle || ''}
                onChange={(e) => setPaymentMethods(prev => ({
                  ...prev,
                  jazzcash: { ...prev.jazzcash, accountTitle: e.target.value }
                }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                Account / Mobile Number
              </label>
              <input
                type="text"
                value={paymentMethods.jazzcash?.accountNumber || ''}
                onChange={(e) => setPaymentMethods(prev => ({
                  ...prev,
                  jazzcash: { ...prev.jazzcash, accountNumber: e.target.value }
                }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] bg-white focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Bank Transfer */}
        <div className="p-4 bg-[#FBF3F0]/60 rounded-2xl border border-[#F4E4DE] space-y-3">
          <span className="font-semibold text-sm text-[#3A3A3A] flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-[#D9A38F]" />
            Bank Transfer Details
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={paymentMethods.bankTransfer?.bankName || ''}
                onChange={(e) => setPaymentMethods(prev => ({
                  ...prev,
                  bankTransfer: { ...prev.bankTransfer, bankName: e.target.value }
                }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                Account Title
              </label>
              <input
                type="text"
                value={paymentMethods.bankTransfer?.accountTitle || ''}
                onChange={(e) => setPaymentMethods(prev => ({
                  ...prev,
                  bankTransfer: { ...prev.bankTransfer, accountTitle: e.target.value }
                }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={paymentMethods.bankTransfer?.accountNumber || ''}
                onChange={(e) => setPaymentMethods(prev => ({
                  ...prev,
                  bankTransfer: { ...prev.bankTransfer, accountNumber: e.target.value }
                }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] bg-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                IBAN
              </label>
              <input
                type="text"
                value={paymentMethods.bankTransfer?.iban || ''}
                onChange={(e) => setPaymentMethods(prev => ({
                  ...prev,
                  bankTransfer: { ...prev.bankTransfer, iban: e.target.value }
                }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] bg-white focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                Branch Code / Location
              </label>
              <input
                type="text"
                value={paymentMethods.bankTransfer?.branchCode || ''}
                onChange={(e) => setPaymentMethods(prev => ({
                  ...prev,
                  bankTransfer: { ...prev.bankTransfer, branchCode: e.target.value }
                }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#F4E4DE] bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={saving}
          className="flex items-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All Settings to Firestore'}
        </Button>
      </div>
    </form>
  );
};

export default SettingsManager;
