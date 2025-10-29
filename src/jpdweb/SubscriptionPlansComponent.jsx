import React, { useState } from "react";
import { Check, CreditCard, X, Info } from "lucide-react";

// Mock subscription plans
const mockPlans = [
  {
    id: 1,
    name: "Basic",
    price: 100000,
    billing: "per month",
    storageGB: 100,
    perks: ["Lưu trữ 100GB", "Hỗ trợ cơ bản", "Tải lên tài liệu"],
  },
  {
    id: 2,
    name: "Advanced",
    price: 330000,
    billing: "per month",
    storageGB: 1000,
    perks: ["Lưu trữ 1TB", "Quản lý khóa học nâng cao", "Hỗ trợ ưu tiên"],
  },
  {
    id: 3,
    name: "Premium",
    price: 500000,
    billing: "per month",
    storageGB: 2000,
    perks: ["Lưu trữ 2TB", "Streaming video chất lượng cao", "Quản lý học viên nâng cao"],
  },
];

const currencyFormat = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(v);

export default function SubscriptionPlans({ plans = mockPlans, onSubscribe }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ fullName: "", paymentMethod: "card" });
  const [message, setMessage] = useState(null);

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
    setMessage(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setForm({ fullName: "", paymentMethod: "card" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    if (!form.fullName.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập họ tên." });
      return;
    }
    setSubmitting(true);
    setMessage(null);

    // giả lập request -> bạn thay bằng API thực tế
    await new Promise((r) => setTimeout(r, 900));

    setSubmitting(false);
    setMessage({ type: "success", text: `Đăng ký gói ${selectedPlan.name} thành công!` });

    // callback nếu cần
    if (typeof onSubscribe === "function") {
      onSubscribe({ planId: selectedPlan.id, user: form });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Chọn gói dung lượng</h2>
          <p className="text-sm text-gray-500">Chọn gói phù hợp để lưu trữ và quản lý khóa học của bạn.</p>
        </div>
        <div className="text-sm text-gray-600">Thanh toán an toàn • Hủy bất kỳ lúc nào</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.id} className={`border rounded-xl p-5 shadow-sm hover:shadow-md transition relative ${selectedPlan?.id === p.id ? 'ring-2 ring-blue-400' : ''}`}>
            {p.price === Math.min(...plans.map(pl => pl.price)) && (
              <div className="absolute -top-3 left-3 bg-amber-400 text-white text-xs px-2 py-1 rounded">Giá tốt</div>
            )}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
                <div className="text-sm text-gray-500">{p.storageGB} GB • {p.billing}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">{currencyFormat(p.price)}</div>
                <div className="text-xs text-gray-500">/tháng</div>
              </div>
            </div>

            <ul className="mb-4 space-y-2 text-sm text-gray-600">
              {p.perks.map((perk, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <button
                onClick={() => openModal(p)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Đăng ký
              </button>
              <button
                onClick={() => setSelectedPlan(p)}
                className={`px-3 py-2 border rounded-lg ${selectedPlan?.id === p.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                Chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel (mobile: below cards) */}
      {selectedPlan && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold">Chi tiết: {selectedPlan.name}</h4>
              <p className="text-sm text-gray-600">{selectedPlan.storageGB} GB — {currencyFormat(selectedPlan.price)} / tháng</p>
            </div>
            <button onClick={() => setSelectedPlan(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <ul className="list-disc pl-5 space-y-1">
              {selectedPlan.perks.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-600" />
                <div>
                  <h5 className="font-semibold">Đăng ký {selectedPlan.name}</h5>
                  <div className="text-sm text-gray-500">{selectedPlan.storageGB} GB • {currencyFormat(selectedPlan.price)} / tháng</div>
                </div>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Họ tên</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Họ và tên"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Phương thức thanh toán</label>
                <div className="flex gap-2">
                  <label className={`flex-1 p-2 border rounded-md cursor-pointer ${form.paymentMethod === 'card' ? 'ring-2 ring-blue-300' : ''}`}>
                    <input type="radio" name="pm" className="hidden" checked={form.paymentMethod === 'card'} onChange={() => setForm({ ...form, paymentMethod: 'card' })} />
                    <div className="flex items-center gap-2"><CreditCard className="w-4 h-4"/> Thẻ/QR</div>
                  </label>
                  <label className={`flex-1 p-2 border rounded-md cursor-pointer ${form.paymentMethod === 'wallet' ? 'ring-2 ring-blue-300' : ''}`}>
                    <input type="radio" name="pm" className="hidden" checked={form.paymentMethod === 'wallet'} onChange={() => setForm({ ...form, paymentMethod: 'wallet' })} />
                    <div className="flex items-center gap-2">Ví điện tử</div>
                  </label>
                </div>
              </div>

              {message && (
                <div className={`p-2 text-sm rounded ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{message.text}</div>
              )}

              <div className="flex items-center gap-2 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-md">Huỷ</button>
                <button disabled={submitting} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  {submitting ? 'Đang xử lý...' : `Xác nhận ${currencyFormat(selectedPlan.price)}`}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
