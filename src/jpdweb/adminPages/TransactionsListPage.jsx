import React, { useEffect, useState } from "react";
import { adminTransactionApi } from "../api/admin/adminTransactionApi";
import { Loader2, X, DollarSign, Package, User, Calendar, Key, TrendingUp } from "lucide-react";

export default function TransactionsListPage() {
  const [transactions, setTransactions] = useState([]);
  const [failedTransactions, setFailedTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [showFailed, setShowFailed] = useState(false);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await adminTransactionApi.getTransactionList({ page, size });
      setTransactions(res?.data.data.content || []);
    } finally {
      setLoading(false);
    }
  };

  const loadFailedTransactions = async () => {
    setLoading(true);
    try {
      const res = await adminTransactionApi.getFailedTransactions({ page, size });
      setFailedTransactions(res?.data.data.content || []);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetail = async (transactionId) => {
    setDetailLoading(true);
    try {
      const detail = await adminTransactionApi.getTransactionDetail(transactionId);
      setSelectedTransaction(detail.data.data);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (showFailed) loadFailedTransactions();
    else loadTransactions();
  }, [page, showFailed]);

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header (30% - #06B6D4) */}
        <div className="bg-[#06B6D4] rounded-lg p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {showFailed ? "Giao dịch thất bại" : "Danh sách giao dịch"}
              </h1>
              <p className="text-white/90 mt-1">
                Quản lý và theo dõi tất cả các giao dịch trong hệ thống
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowFailed(false);
                  setPage(0);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  !showFailed
                    ? "bg-white text-[#06B6D4] shadow-md"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => {
                  setShowFailed(true);
                  setPage(0);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showFailed
                    ? "bg-white text-[#06B6D4] shadow-md"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                Thất bại
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F1F5F9] border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-20 text-center">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider text-center">
                      Khóa học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider text-center">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider text-center">
                      Người tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-32 text-center">
                      Số tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-32 text-center">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-32 text-center">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(showFailed ? failedTransactions : transactions).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    (showFailed ? failedTransactions : transactions).map((t) => (
                      <tr
                        key={t.transactionId}
                        className="hover:bg-[#F1F5F9] transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{t.transactionId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {t.courseName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {t.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {t.creatorName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {t.amount?.toLocaleString()} {t.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                              t.status === "SUCCESS"
                                ? "bg-green-100 text-green-800"
                                : t.status === "FAILED"
                                ? "bg-[#F97316] bg-opacity-10 text-[#F97316]"
                                : "bg-[#F1F5F9] text-gray-700"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="px-3 py-1.5 text-sm bg-[#06B6D4] text-white rounded-lg hover:bg-[#0891b2] transition-colors font-medium"
                            onClick={() => handleShowDetail(t.transactionId)}
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-white rounded-lg shadow-sm mt-4 px-6 py-4 flex justify-between items-center border border-gray-200">
          <div className="text-sm text-gray-700">
            Trang <span className="font-medium">{page + 1}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-[#F1F5F9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Trước
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={(showFailed ? failedTransactions : transactions).length < size}
              className="px-4 py-2 bg-[#06B6D4] text-white rounded-lg hover:bg-[#0891b2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sau
            </button>
          </div>
        </div>

        {/* Popup chi tiết */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header (30% - #06B6D4) */}
              <div className="sticky top-0 bg-[#06B6D4] px-6 py-4 flex items-center justify-between rounded-t-lg">
                <h2 className="text-xl font-bold text-white">
                  Chi tiết giao dịch #{selectedTransaction.transactionId}
                </h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {detailLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {/* Amount Card (Highlighted) */}
                  <div className="bg-[#06B6D4] bg-opacity-10 border border-[#06B6D4] rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#06B6D4] rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Số tiền giao dịch</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {selectedTransaction.amount?.toLocaleString()}{" "}
                          {selectedTransaction.currency}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#F1F5F9] rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#06B6D4] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 mb-1">Khóa học</p>
                          <p className="text-sm font-medium text-gray-900 break-words">
                            {selectedTransaction.courseInfo?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F1F5F9] rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#06B6D4] rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 mb-1">Khách hàng</p>
                          <p className="text-sm font-medium text-gray-900 break-words">
                            {selectedTransaction.customerInfo?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F1F5F9] rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#06B6D4] rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 mb-1">Creator</p>
                          <p className="text-sm font-medium text-gray-900 break-words">
                            {selectedTransaction.creatorInfo?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F1F5F9] rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#06B6D4] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 mb-1">Ngày tạo</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedTransaction.createdAt || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F1F5F9] rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#06B6D4] rounded-lg flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 mb-1">Admin nhận</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedTransaction.adminGet?.toLocaleString() || "0"} {selectedTransaction.currency}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F1F5F9] rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#06B6D4] rounded-lg flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 mb-1">Creator nhận</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedTransaction.creatorGet?.toLocaleString() || "0"} {selectedTransaction.currency}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment ID */}
                  <div className="bg-[#F1F5F9] rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#06B6D4] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Key className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 mb-1">Mã thanh toán</p>
                        <p className="text-sm font-mono text-gray-900 break-all">
                          {selectedTransaction.paymentId || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="w-full px-4 py-2.5 bg-[#06B6D4] text-white rounded-lg hover:bg-[#0891b2] transition-colors font-medium"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}