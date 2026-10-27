import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Filter, RefreshCw, CheckCircle2, Clock, 
  Truck, CheckCheck, XCircle, Copy, Check, MessageCircle, ExternalLink, 
  AlertCircle, ChevronDown, ChevronUp, Image as ImageIcon 
} from 'lucide-react';
import { fetchAllOrdersAdmin, updateOrderStatusAdmin } from '../../firebase/adminService.js';
import { buildWhatsAppLink } from '../../utils/whatsapp.js';
import Card from '../UI/Card.jsx';
import Button from '../UI/Button.jsx';
import Badge from '../UI/Badge.jsx';
import ReceiptModal from './ReceiptModal.jsx';

const STATUS_OPTIONS = [
  'Pending payment verification',
  'Confirmed',
  'Shipped',
  'Delivered',
  'Cancelled'
];

export const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOrdersAdmin();
      setOrders(data || []);
    } catch (err) {
      console.error('Error loading orders:', err);
      setStatusMsg({ text: 'Failed to load orders from Firestore.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      await updateOrderStatusAdmin(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setStatusMsg({ text: `Order ${orderId} updated to "${newStatus}"`, type: 'success' });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Status update error:', err);
      setStatusMsg({ text: `Failed to update status for order ${orderId}`, type: 'error' });
    } finally {
      setStatusUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <Badge variant="blush" className="bg-blue-50 text-blue-700 border-blue-200">Confirmed</Badge>;
      case 'Shipped':
        return <Badge variant="blush" className="bg-amber-50 text-amber-700 border-amber-200">Shipped</Badge>;
      case 'Delivered':
        return <Badge variant="blush" className="bg-emerald-50 text-emerald-800 border-emerald-200">Delivered</Badge>;
      case 'Cancelled':
        return <Badge variant="blush" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case 'Pending payment verification':
      default:
        return <Badge variant="blush" className="bg-orange-50 text-orange-700 border-orange-200">Pending Verification</Badge>;
    }
  };

  const handleContactCustomerWhatsApp = (order) => {
    const phone = order.customer?.phone || '';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    let targetWa = cleanPhone;
    if (targetWa.startsWith('0')) {
      targetWa = '92' + targetWa.slice(1);
    }
    const message = `Hello ${order.customer?.fullName || 'Customer'}, this is Royal Aesthetic & Laser Clinic regarding your order ${order.orderNumber}. We have reviewed your payment transaction ID (${order.transactionId}). Current status: ${order.status}. Thank you!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${targetWa}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const orderNum = (o.orderNumber || o.id || '').toLowerCase();
    const custName = (o.customer?.fullName || '').toLowerCase();
    const custPhone = (o.customer?.phone || '').toLowerCase();
    const trxId = (o.transactionId || '').toLowerCase();
    const city = (o.customer?.city || '').toLowerCase();
    return orderNum.includes(q) || custName.includes(q) || custPhone.includes(q) || trxId.includes(q) || city.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#F4E4DE] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#D9A38F] absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order #, customer, phone, or Trx ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-4 py-2 text-sm rounded-xl border border-[#F4E4DE] focus:border-[#D9A38F] focus:outline-none"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadOrders}
            disabled={loading}
            className="flex items-center gap-1.5 self-end sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Orders
          </Button>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1 overflow-x-auto">
          {['All', ...STATUS_OPTIONS].map((status) => {
            const count = status === 'All' ? orders.length : orders.filter(o => o.status === status).length;
            const active = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-xs rounded-xl transition-all whitespace-nowrap font-medium flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#3A3A3A] text-white shadow-xs'
                    : 'bg-[#FBF3F0] text-[#6B5B55] hover:bg-[#F4E4DE]'
                }`}
              >
                <span>{status === 'Pending payment verification' ? 'Pending' : status}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-white/20' : 'bg-white'}`}>
                  {count}
                </span>
              </button>
            );
          })}
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

      {/* Orders List */}
      {loading ? (
        <div className="py-16 text-center text-[#6B5B55]">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 text-[#D9A38F] animate-spin" />
          <p className="text-sm">Loading clinic orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-[#F4E4DE] text-center">
          <ShoppingBag className="w-10 h-10 text-[#D9A38F] mx-auto mb-3 opacity-60" />
          <p className="font-serif text-lg text-[#3A3A3A]">No customer orders found</p>
          <p className="text-xs text-[#6B5B55] mt-1">
            {statusFilter !== 'All' ? 'No orders match this status filter.' : 'Guest checkout orders will appear here for verification.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const updatingThis = statusUpdating[order.id];

            return (
              <Card key={order.id} className="p-4 sm:p-5 border-[#F4E4DE] overflow-hidden">
                {/* Header row: Order #, Customer, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F4E4DE]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FBF3F0] text-[#D9A38F] flex items-center justify-center shrink-0 border border-[#F4E4DE]">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#3A3A3A]">
                          {order.orderNumber || order.id}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-[#6B5B55] mt-0.5">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'}
                      </p>
                    </div>
                  </div>

                  {/* Quick summary: Total & Status Changer */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="text-start sm:text-end pe-2">
                      <span className="text-[11px] text-[#6B5B55] block">Total Amount</span>
                      <span className="font-serif font-bold text-base text-[#3A3A3A]">
                        PKR {Number(order.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        disabled={updatingThis}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#F4E4DE] bg-white text-[#3A3A3A] focus:border-[#D9A38F] focus:outline-none shadow-2xs"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="p-1.5 rounded-lg text-[#6B5B55] hover:text-[#3A3A3A] hover:bg-[#FBF3F0] transition-colors"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Key Verification Strip: Trx ID, Payment Method, Screenshot */}
                <div className="py-3 px-3 my-3 bg-[#FBF3F0]/60 rounded-xl border border-[#F4E4DE] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-[#6B5B55] block">Payment Method</span>
                    <span className="font-semibold text-[#3A3A3A] uppercase">
                      {order.paymentMethod || 'Manual Transfer'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[#6B5B55] block">Transaction ID (Trx ID)</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono font-bold text-[#3A3A3A] bg-white px-2 py-0.5 rounded border border-[#F4E4DE]">
                        {order.transactionId || 'None'}
                      </span>
                      {order.transactionId && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(order.transactionId, `trx-${order.id}`)}
                          className="text-[#D9A38F] hover:text-[#3A3A3A] p-0.5 transition-colors"
                          title="Copy Transaction ID"
                        >
                          {copiedKey === `trx-${order.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-[#6B5B55] block">Payment Screenshot Proof</span>
                    {order.screenshotUrl ? (
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt({ url: order.screenshotUrl, orderNumber: order.orderNumber || order.id })}
                        className="mt-0.5 inline-flex items-center gap-1 text-xs text-[#D9A38F] hover:underline font-semibold"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        View Screenshot Proof
                      </button>
                    ) : (
                      <span className="text-zinc-500 italic">No screenshot uploaded</span>
                    )}
                  </div>
                </div>

                {/* Expanded Details: Customer information & Itemized cart */}
                {isExpanded && (
                  <div className="pt-3 border-t border-[#F4E4DE] space-y-4 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Customer Details */}
                      <div className="p-3 bg-white rounded-xl border border-[#F4E4DE] space-y-1.5 text-xs">
                        <span className="font-semibold text-[#3A3A3A] block mb-1">
                          Customer Delivery Info:
                        </span>
                        <div className="flex justify-between">
                          <span className="text-[#6B5B55]">Full Name:</span>
                          <span className="font-semibold text-[#3A3A3A]">{order.customer?.fullName || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B5B55]">Phone Number:</span>
                          <span className="font-mono text-[#3A3A3A]">{order.customer?.phone || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B5B55]">City / Town:</span>
                          <span className="text-[#3A3A3A]">{order.customer?.city || '-'}</span>
                        </div>
                        <div>
                          <span className="text-[#6B5B55] block">Full Shipping Address:</span>
                          <p className="text-[#3A3A3A] mt-0.5 bg-[#FBF3F0]/60 p-2 rounded-lg">
                            {order.customer?.address || '-'}
                          </p>
                        </div>
                        {order.customer?.notes && (
                          <div>
                            <span className="text-[#6B5B55] block">Order Notes:</span>
                            <p className="text-zinc-600 italic mt-0.5 bg-[#FBF3F0]/60 p-2 rounded-lg">
                              {order.customer.notes}
                            </p>
                          </div>
                        )}

                        {/* WhatsApp Customer Action */}
                        {order.customer?.phone && (
                          <div className="pt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleContactCustomerWhatsApp(order)}
                              className="w-full flex items-center justify-center gap-1.5 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              WhatsApp Customer on {order.customer.phone}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Itemized Order Cart */}
                      <div className="p-3 bg-white rounded-xl border border-[#F4E4DE] text-xs space-y-2">
                        <span className="font-semibold text-[#3A3A3A] block mb-1">
                          Ordered Items ({(order.items || []).length}):
                        </span>
                        <div className="divide-y divide-[#F4E4DE] max-h-48 overflow-y-auto">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between">
                              <div>
                                <p className="font-medium text-[#3A3A3A]">
                                  {item.name?.en || item.name}
                                </p>
                                <p className="text-[10px] text-[#6B5B55]">
                                  Qty: {item.quantity} × PKR {Number(item.price || 0).toLocaleString()}
                                </p>
                              </div>
                              <span className="font-mono font-semibold text-[#3A3A3A]">
                                PKR {((item.quantity || 1) * (item.price || 0)).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-[#F4E4DE] flex justify-between font-semibold text-sm text-[#3A3A3A]">
                          <span>Total to Verify:</span>
                          <span className="font-serif">PKR {Number(order.totalAmount || 0).toLocaleString()}</span>
                        </div>
                        <p className="text-[11px] text-emerald-700">
                          ✓ Free delivery applied all over Pakistan
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Payment Receipt Zoom Modal */}
      {selectedReceipt && (
        <ReceiptModal
          isOpen={true}
          onClose={() => setSelectedReceipt(null)}
          imageUrl={selectedReceipt.url}
          orderNumber={selectedReceipt.orderNumber}
        />
      )}
    </div>
  );
};

export default OrdersManager;
