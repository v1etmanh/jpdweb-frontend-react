import React, { useEffect, useState } from 'react';
import { adminDiagnosticsApi } from '../api/adminDiagnosticsApi';


const AdminDiagnosticsPage = () => {
  const [threadSummary, setThreadSummary] = useState(null);
  const [loggers, setLoggers] = useState([]);
  const [environment, setEnvironment] = useState([]);
  const [beansSummary, setBeansSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [threadRes, loggerRes, envRes, beansRes] = await Promise.all([
          adminDiagnosticsApi.getThreadSummary(),
          adminDiagnosticsApi.getLoggers(),
          adminDiagnosticsApi.getEnvironment(),
          adminDiagnosticsApi.getBeansSummary(),
        ]);
 
      console.log(beansRes)
        setThreadSummary(threadRes.data);
        setLoggers(loggerRes.data.loggers || []);
        setEnvironment(envRes.data.propertySources || []);
        setBeansSummary(beansRes.data);
      } catch (error) {
        console.error('Lỗi tải dữ liệu diagnostics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilterChange = async (e) => {
    const value = e.target.value;
    setFilter(value);
    try {
      const [loggerRes, envRes] = await Promise.all([
        adminDiagnosticsApi.getLoggers(value),
        adminDiagnosticsApi.getEnvironment(value),
      ]);
    
      setLoggers(loggerRes?.loggers || []);
      setEnvironment(envRes?.propertySources || []);
    } catch (error) {
      console.error('Lỗi khi lọc dữ liệu:', error);
    }
  };

  if (loading)
    return <div className="p-6 text-gray-500 animate-pulse">Đang tải dữ liệu hệ thống...</div>;

  return (
    <div className="p-6 space-y-8 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">🧠 Deep Diagnostics</h1>

      {/* Bộ lọc */}
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Nhập từ khóa để lọc loggers hoặc environment..."
          className="border border-gray-600 rounded-lg px-3 py-2 w-full bg-gray-800 text-gray-200"
        />
      </div>

      {/* THREAD SUMMARY */}
      <section className="bg-gray-800 rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-semibold mb-3">🧵 Thread Summary</h2>
        {threadSummary ? (
          <div className="space-y-2">
            <p><b>Tổng thread:</b> {threadSummary.total}</p>
            <ul className="list-disc pl-6">
              {Object.entries(threadSummary.states || {}).map(([state, count]) => (
                <li key={state}>{state}: {count}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Không có dữ liệu thread.</p>
        )}
      </section>

      {/* LOGGERS */}
      <section className="bg-gray-800 rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-semibold mb-3">📜 Loggers ({loggers.length})</h2>
        <div className="overflow-x-auto max-h-64 overflow-y-auto border-t border-gray-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                <th className="px-3 py-2">Tên Logger</th>
                <th className="px-3 py-2">Cấp cấu hình</th>
                <th className="px-3 py-2">Cấp hiệu lực</th>
              </tr>
            </thead>
            <tbody>
              {loggers.map((logger) => (
                <tr key={logger.name} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="px-3 py-2">{logger.name}</td>
                  <td className="px-3 py-2">{logger.configuredLevel || '-'}</td>
                  <td className="px-3 py-2">{logger.effectiveLevel || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ENVIRONMENT */}
      <section className="bg-gray-800 rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-semibold mb-3">🌿 Environment Variables</h2>
        <div className="space-y-4 max-h-72 overflow-y-auto">
          {environment.map((ps) => (
            <div key={ps.name} className="border-b border-gray-700 pb-2">
              <p className="font-semibold text-blue-300">{ps.name}</p>
              <ul className="text-sm pl-4">
                {Object.entries(ps.properties || {}).map(([key, value]) => (
                  <li key={key} className="break-all">
                    <span className="text-gray-400">{key}:</span> {String(value)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* BEANS SUMMARY */}
      <section className="bg-gray-800 rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-semibold mb-3">🫘 Beans Summary</h2>
        {beansSummary ? (
          <>
            <p><b>Tổng số Bean:</b> {beansSummary.total}</p>
            <div className="max-h-64 overflow-y-auto mt-2 border-t border-gray-700 pt-2">
              <ul className="text-sm space-y-1">
                {Object.entries(beansSummary.packages || {}).map(([pkg, count]) => (
                  <li key={pkg}>{pkg}: {count}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p>Không có dữ liệu beans.</p>
        )}
      </section>
    </div>
  );
};

export default AdminDiagnosticsPage;
