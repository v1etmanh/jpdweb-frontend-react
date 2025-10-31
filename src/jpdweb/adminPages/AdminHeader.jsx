import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../security/Authentication";
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

// 60%: slate-100 (cho body), bg-white (cho card/header), text-slate-xxx
// 30%: cyan-500 (tương tác chính, active)
// 10%: orange-500 (CTA, highlight)

export default function AdminHeader() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  const adminMenuItems = [
    { path: "/admin/app_overview", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/creator-page", icon: Users, label: "Quản lý Creator" },
    { path: "/admin/pending-certificate", icon: FileText, label: "Chứng chỉ" },
    { path: "/admin/transaction-page", icon: DollarSign, label: "Giao dịch" },
    { path: "/admin/statistic-revenue", icon: TrendingUp, label: "Thống kê" },
    { path: "/admin/diagnosticsPage", icon: Activity, label: "Chẩn đoán" },
  ];

  const isActivePath = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    // 60% (Nền trắng + viền slate)
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo (Dùng màu 30%) */}
          <Link
            to="/admin/app_overview"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity no-underline"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            {/* 60% (Văn bản slate) */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-slate-800 m-auto">Admin Panel</h1>
            </div>
          </Link>

          {/* Desktop Navigation - ĐÃ SỬA LỖI CHIỀU CAO */}
          <nav className="hidden lg:flex items-center gap-3 h-full">
            {adminMenuItems.map((item) => {
              const isActive = isActivePath(item.path);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  // SỬA Ở ĐÂY: Thêm 'gap-1' để tạo khoảng cách giữa icon và text
                  className={`no-underline flex flex-col items-center justify-center px-4 rounded-lg transition-all duration-200 text-sm font-medium w-28 h-14 gap-1 ${
                    isActive
                      ? "bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm" // 30% (Active)
                      : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800 border border-transparent" // 60% (Inactive) - 'border-transparent' giữ nguyên chiều cao
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-cyan-600" : "text-slate-500"} />
                  {/* SỬA Ở ĐÂY: Xóa 'mt-1.5' */}
                  <span className="text-xs text-center leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Actions */}
          <div className="flex items-center gap-3 h-full">
            {/* User Info (60% - Slate) */}
            <div className="hidden md:flex items-center gap-3 pr-4 border-r border-slate-200 h-full">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center border border-slate-300 shadow-sm">
                <span className="text-slate-700 font-semibold text-sm">
                  {user?.username?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800 p-1 m-auto">
                  {user?.username || "Admin"}
                </p>
              </div>
            </div>

            {/* Logout Button (Dùng màu 10%) */}
            <button
              onClick={handleLogoutClick}
              className="flex items-center justify-center w-9 h-9 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-200 border border-orange-600 shadow-sm no-underline"
              title="Đăng xuất"
            >
              <LogOut size={16} />
            </button>

            {/* Mobile Menu Button (60% - Slate) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300 shadow-sm no-underline"
            >
              {isMobileMenuOpen ? (
                <X size={18} className="text-slate-700" />
              ) : (
                <Menu size={18} className="text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu (Áp dụng tương tự) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 bg-white shadow-inner">
            <nav className="grid grid-cols-1 gap-2">
              {adminMenuItems.map((item) => {
                const isActive = isActivePath(item.path);
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`no-underline flex items-center gap-3 px-4 rounded-lg transition-all duration-200 h-11 ${
                      isActive
                        ? "bg-cyan-50 text-cyan-700 border border-cyan-200 font-medium" // 30% (Active)
                        : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800 border border-transparent" // 60% (Inactive)
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-cyan-600" : "text-slate-500"} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Mobile User Info (60% - Slate) */}
            <div className="mt-4 pt-4 border-t border-slate-200 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center border border-slate-300 shadow-sm">
                  <span className="text-slate-700 font-semibold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {user?.username || "Admin"}
                  </p>
                  <p className="text-xs text-slate-500">Quản trị viên</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}