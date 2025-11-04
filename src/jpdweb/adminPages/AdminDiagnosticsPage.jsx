// AdminDiagnosticsPage.jsx
import React, { useEffect, useState } from 'react';
import { adminDiagnosticsApi } from '../api/admin/adminDiagnosticsApi';

const INJECTED_STYLE_ID = 'admin-diagnostics-styles-no-horizontal-scroll';

const styles = `
:root {
  --diag-60: #F1F5F9;
  --diag-30: #06B6D4;
  --diag-30-700: #028FA8;
  --diag-10: #F97316;
  --diag-10-700: #D65A12;
  --diag-text: #0f172a;
  --diag-muted: #475569;
  --card-bg: #ffffff;
  --card-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.05);
}

* {
  box-sizing: border-box;
}

.app-shell {
  background: var(--diag-60);
  min-height: 100vh;
  padding: 1.5rem 2rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  max-width: 100%;
  overflow-x: hidden;
}

/* Header Section */
.page-header {
  background: linear-gradient(135deg, var(--diag-30), var(--diag-30-700));
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
  box-shadow: var(--card-shadow);
  max-width: 100%;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-subtitle {
  opacity: 0.9;
  font-size: 1.1rem;
  font-weight: 400;
}

/* Main Layout */
.main-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  align-items: start;
  max-width: 100%;
}

@media (max-width: 1200px) {
  .main-layout {
    grid-template-columns: 280px 1fr;
    gap: 1.25rem;
  }
}

@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  
  .app-shell {
    padding: 1rem 1.5rem;
  }
}

/* Cards */
.card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(6, 182, 212, 0.1);
  margin-bottom: 1.25rem;
  max-width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--diag-30-700);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1.25rem 0;
}

.stat-card {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(6, 182, 212, 0.03));
  border-radius: 10px;
  padding: 1.25rem;
  border-left: 4px solid var(--diag-30);
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--diag-30-700);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--diag-muted);
  font-weight: 500;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--diag-30), var(--diag-30-700));
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(6, 182, 212, 0.3);
}

.btn-secondary {
  background: linear-gradient(135deg, var(--diag-10), var(--diag-10-700));
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.3);
}

/* Input */
.input-group {
  margin: 1.25rem 0;
}

.input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: white;
  max-width: 100%;
}

.input:focus {
  outline: none;
  border-color: var(--diag-30);
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

/* Progress */
.progress-container {
  margin: 1.25rem 0;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--diag-muted);
  font-weight: 500;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--diag-30), var(--diag-30-700));
  transition: width 0.3s ease;
}

/* Tables */
.table-container {
  overflow-x: auto;
  border-radius: 10px;
  margin: 1.25rem 0;
  border: 1px solid #e2e8f0;
  max-width: 100%;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  min-width: 600px;
}

.table th {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(6, 182, 212, 0.06));
  color: var(--diag-30-700);
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid var(--diag-30);
  white-space: nowrap;
}

.table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: var(--diag-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.table tr:hover {
  background: rgba(6, 182, 212, 0.03);
}

/* Lists */
.list-container {
  max-height: 350px;
  overflow-y: auto;
  margin: 1.25rem 0;
}

.list-item {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.list-item:hover {
  background: rgba(6, 182, 212, 0.04);
}

.list-item:last-child {
  border-bottom: none;
}

/* Quick Links */
.quick-links {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin: 1.25rem 0;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(6, 182, 212, 0.05);
  border-radius: 10px;
  color: var(--diag-text);
  transition: all 0.2s ease;
}

.quick-link:hover {
  background: rgba(6, 182, 212, 0.1);
  transform: translateX(4px);
}

.quick-link-content {
  flex: 1;
}

.quick-link-title {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.quick-link-desc {
  font-size: 0.85rem;
  color: var(--diag-muted);
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: var(--diag-10);
  color: white;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

/* Content Grid */
.content-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Thread Summary Layout */
.thread-summary {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 768px) {
  .thread-summary {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* Two Column Layout */
.two-column-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .two-column-layout {
    grid-template-columns: 1fr;
  }
}

/* Loading State */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: var(--diag-muted);
  font-size: 1.1rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e2e8f0;
  border-top: 2px solid var(--diag-30);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Card Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f1f5f9;
  color: var(--diag-muted);
  font-size: 0.9rem;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Thread States Grid */
.thread-states-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

/* Environment Properties */
.env-property-group {
  margin-bottom: 1.5rem;
}

.env-property-header {
  font-weight: 600;
  color: var(--diag-30-700);
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: rgba(6, 182, 212, 0.06);
  border-radius: 8px;
  font-size: 0.95rem;
}

.env-properties {
  display: grid;
  gap: 0.5rem;
}

.env-property {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  border-bottom: 1px solid #f1f5f9;
  align-items: start;
}

.env-property:last-child {
  border-bottom: none;
}

.env-key {
  color: var(--diag-muted);
  font-weight: 500;
  word-break: break-word;
}

.env-value {
  color: var(--diag-text);
  font-family: 'Monaco', 'Consolas', monospace;
  word-break: break-word;
  text-align: right;
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: 1.5rem;
}
`;

function ensureStylesInjected() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(INJECTED_STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = INJECTED_STYLE_ID;
  el.innerHTML = styles;
  document.head.appendChild(el);
}

const AdminDiagnosticsPage = () => {
  const [threadSummary, setThreadSummary] = useState(null);
  const [loggers, setLoggers] = useState([]);
  const [environment, setEnvironment] = useState([]);
  const [beansSummary, setBeansSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    ensureStylesInjected();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [threadRes, loggerRes, envRes, beansRes] = await Promise.all([
          adminDiagnosticsApi.getThreadSummary(),
          adminDiagnosticsApi.getLoggers(),
          adminDiagnosticsApi.getEnvironment(),
          adminDiagnosticsApi.getBeansSummary(),
        ]);
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

  if (loading) {
    return (
      <div className="app-shell">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Đang tải dữ liệu hệ thống...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          <span>🔍</span>
          Hệ thống Diagnostics
        </h1>
        <p className="page-subtitle">
          Theo dõi và phân tích hiệu suất hệ thống thời gian thực
        </p>
      </div>

      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">📊 Bộ lọc & Tổng quan</h2>
              <span className="status-badge">Live</span>
            </div>

            <div className="input-group">
              <input
                className="input"
                placeholder="Lọc theo tên logger hoặc environment..."
                value={filter}
                onChange={handleFilterChange}
              />
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{threadSummary?.total ?? '-'}</div>
                <div className="stat-label">Total Threads</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{beansSummary?.total ?? '-'}</div>
                <div className="stat-label">Total Beans</div>
              </div>
            </div>

            <div className="progress-container">
              <div className="progress-label">
                <span>System Health</span>
                <span>{Math.min(100, ((threadSummary?.total || 0) / 50) * 100).toFixed(0)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(100, ((threadSummary?.total || 0) / 50) * 100)}%` }}
                />
              </div>
            </div>

            <div className="card-footer">
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card">
            <h3 className="card-title">⚡ Thông tin hệ thống</h3>
            <div className="quick-links">
              <div className="quick-link">
                <span style={{ fontSize: '1.25rem' }}>💻</span>
                <div className="quick-link-content">
                  <div className="quick-link-title">CPU Cores</div>
                  <div className="quick-link-desc">
                    {environment?.[0]?.properties?.['cpu.count'] ?? '—'} cores
                  </div>
                </div>
              </div>
              <div className="quick-link">
                <span style={{ fontSize: '1.25rem' }}>☕</span>
                <div className="quick-link-content">
                  <div className="quick-link-title">Java Version</div>
                  <div className="quick-link-desc">
                    {environment?.[0]?.properties?.['java.version'] ?? '—'}
                  </div>
                </div>
              </div>
              <div className="quick-link">
                <span style={{ fontSize: '1.25rem' }}>🖥️</span>
                <div className="quick-link-content">
                  <div className="quick-link-title">Operating System</div>
                  <div className="quick-link-desc">
                    {environment?.[0]?.properties?.['os.name'] ?? '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="content-grid">
          {/* Thread Summary */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">🧵 Thread Summary</h2>
              <div style={{ color: 'var(--diag-muted)', fontSize: '0.9rem' }}>
                Cập nhật: {new Date().toLocaleTimeString('vi-VN')}
              </div>
            </div>

            <div className="thread-summary">
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--diag-30-700)', lineHeight: '1', marginBottom: '0.5rem' }}>
                  {threadSummary?.total ?? 0}
                </div>
                <div style={{ color: 'var(--diag-muted)', marginBottom: '1rem' }}>
                  Active Threads
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(100, ((threadSummary?.total || 0) / 50) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                {threadSummary ? (
                  <div className="thread-states-grid">
                    {Object.entries(threadSummary.states || {}).map(([state, count]) => (
                      <div key={state} className="stat-card">
                        <div className="stat-number">{count}</div>
                        <div className="stat-label" style={{ textTransform: 'capitalize' }}>
                          {state.toLowerCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: 'var(--diag-muted)' }}>
                    No thread data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loggers Table */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                📜 System Loggers
                <span style={{ color: 'var(--diag-muted)', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
                  ({loggers.length})
                </span>
              </h2>
              <button className="btn btn-secondary">
                📊 Monitor
              </button>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '50%' }}>Tên Logger</th>
                    <th style={{ width: '25%' }}>Cấp cấu hình</th>
                    <th style={{ width: '25%' }}>Cấp hiệu lực</th>
                  </tr>
                </thead>
                <tbody>
                  {loggers.map((logger) => (
                    <tr key={logger.name}>
                      <td style={{ fontFamily: "'Monaco', 'Consolas', monospace", fontSize: '0.85rem' }}>
                        {logger.name}
                      </td>
                      <td>
                        <span className="status-badge" style={{ 
                          background: logger.configuredLevel ? 'var(--diag-30)' : 'var(--diag-muted)'
                        }}>
                          {logger.configuredLevel || '—'}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge">
                          {logger.effectiveLevel || '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-footer">
              <div>Hiển thị {loggers.length} loggers</div>
              <button className="btn btn-secondary">
                📥 Export
              </button>
            </div>
          </div>

          {/* Environment & Beans */}
          <div className="two-column-layout">
            {/* Environment */}
            <div className="card">
              <h3 className="card-title">🌿 Environment Variables</h3>
              <div className="list-container">
                {environment.map((propertySource) => (
                  <div key={propertySource.name} className="env-property-group">
                    <div className="env-property-header">
                      {propertySource.name}
                    </div>
                    <div className="env-properties">
                      {Object.entries(propertySource.properties || {}).slice(0, 8).map(([key, value]) => (
                        <div key={key} className="env-property">
                          <span className="env-key">{key}</span>
                          <span className="env-value">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Beans Summary */}
            <div className="card">
              <h3 className="card-title">🫘 Beans Summary</h3>
              <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--diag-30-700)' }}>
                  {beansSummary?.total ?? '-'}
                </div>
                <div style={{ color: 'var(--diag-muted)' }}>
                  Total Packages
                </div>
              </div>

              <div className="list-container">
                {Object.entries(beansSummary?.packages || {}).slice(0, 10).map(([pkg, count]) => (
                  <div key={pkg} className="list-item">
                    <span style={{ 
                      fontFamily: "'Monaco', 'Consolas', monospace", 
                      fontSize: '0.85rem',
                      color: 'var(--diag-30-700)',
                      fontWeight: '600'
                    }}>
                      {pkg}
                    </span>
                    <span className="status-badge">
                      {count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="card-footer">
                <div>Top packages</div>
                <button className="btn btn-secondary">
                  🔍 Details
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDiagnosticsPage;