// AdminHeader.jsx
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
  X
} from "lucide-react";
import { useState } from "react";

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
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/admin/app_overview" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {adminMenuItems.map((item) => {
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    isActive 
                      ? "bg-blue-50 text-blue-600 border border-blue-200" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Actions */}
          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="hidden md:flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                <span className="text-blue-600 font-bold text-sm">
                  {user?.username?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.username || "Admin"}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all text-sm font-medium"
              title="Đăng xuất"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white">
            <nav className="flex flex-col gap-1">
              {adminMenuItems.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive 
                        ? "bg-blue-50 text-blue-600 border border-blue-200 font-medium" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}