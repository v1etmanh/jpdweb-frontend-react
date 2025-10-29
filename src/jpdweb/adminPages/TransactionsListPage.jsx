import React, { useEffect, useState } from "react";
import { adminTransactionApi } from "../api/adminTransactionApi";
import { Loader2 } from "lucide-react";

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
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {showFailed ? "Giao dịch thất bại" : "Danh sách giao dịch"}
        </h1>
        <div className="space-x-2">
          <button
            onClick={() => setShowFailed(false)}
            className={`px-3 py-1 rounded-md border ${
              !showFailed ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setShowFailed(true)}
            className={`px-3 py-1 rounded-md border ${
              showFailed ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            Thất bại
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Khóa học</th>
                <th className="p-3">Khách hàng</th>
                <th className="p-3">Người tạo</th>
                <th className="p-3">Số tiền</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {(showFailed ? failedTransactions : transactions).map((t) => (
                <tr key={t.transactionId} className="border-t hover:bg-gray-50">
                  <td className="p-3">{t.transactionId}</td>
                  <td className="p-3">{t.courseName}</td>
                  <td className="p-3">{t.customerName}</td>
                  <td className="p-3">{t.creatorName}</td>
                  <td className="p-3">
                    {t.amount?.toLocaleString()} {t.currency}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        t.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : t.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => handleShowDetail(t.transactionId)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup chi tiết */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            {detailLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <>
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-black"
                  onClick={() => setSelectedTransaction(null)}
                >
                  ✕
                </button>
                <h2 className="text-xl font-semibold mb-4">
                  Giao dịch #{selectedTransaction.transactionId}
                </h2>
                <p>
                  💰 Số tiền:{" "}
                  <b>
                    {selectedTransaction.amount.toLocaleString()}{" "}
                    {selectedTransaction.currency}
                  </b>
                </p>
                <p>📦 Khóa học: {selectedTransaction.courseInfo?.name}</p>
                <p>👤 Khách hàng: {selectedTransaction.customerInfo?.name}</p>
                <p>🧑‍💼 Creator: {selectedTransaction.creatorInfo?.name}</p>
                <p>📅 Ngày tạo: {selectedTransaction.createdAt}</p>
                <p>📈 Admin nhận: {selectedTransaction.adminGet}</p>
                <p>📈 Creator nhận: {selectedTransaction.creatorGet}</p>
                <p>🔑 Mã thanh toán: {selectedTransaction.paymentId}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
