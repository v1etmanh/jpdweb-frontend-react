import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";

import HomepageComponent from "./creator&&customer/component/HomeComponent";
import CoursesResultPage from "./creator&&customer/page/CoursesResultPage";
import "./JpdWebStyle.css";
import CourseDescriptionPage from "./creator&&customer/page/CourseDescriptionPage";
import MyLearningPage from "./creator&&customer/page/MyLearningPage";
import CourseContentComponent from "./creator&&customer/component/CourseContentComponent";
import HeaderComponent from "./creator&&customer/component/HeaderComponent";

import CreatorHomePage from "./creator&&customer/page/CreateHomePage";
import CreatorProfileComponent from "./creator&&customer/page/RegisterCreatorPage";

import Sidebar from "./CreatorSideBarComponent";

import { BookOpen, Menu, X } from "lucide-react";

import CreateCourseForm from "./creator&&customer/page/CreateCourseForm";
import CourseManagementInterface from "./creator&&customer/page/CourseManagementPage";

import DirectComponent from "./creator&&customer/component/DictionaryConponent";
import { Button } from "react-bootstrap";
import FooterComponent from "./creator&&customer/component/FooteComponent";
import CoursesTable from "./creator&&customer/page/CoursesInforPage";
import CourseDetail from "./creator&&customer/page/CourseCommercialDetailPage";
import CoursesList from "./creator&&customer/page/CreatorCourseListPage";
import CreatorAccountInfo from "./creator&&customer/page/CreatorAccount";
import CourseContentOverviewPage from "./creator&&customer/page/CourseContentOverviewPage";
import AuthProvider, { useAuth } from "./security/Authentication";
import LoginComponent from "./creator&&customer/component/LoginComponent";

import "./api/core/AuthInterceptor";

import ProtectedRoute from "./ProtectedRoute";
import CreatorProtectedRoute from "./CreatorProtectedRoute";
import AdminRoute from "./AdminRoute";

import WithdrawHistory from "./creator&&customer/page/CreatorHistoryTransactionPage";
import TransactionDetailPage from "./creator&&customer/page/TransactionDetailPage";
import BalancePage from "./creator&&customer/page/BalancePage";

import KahootList from "./creator&&customer/page/KahootManagementPage";
import TeacherDashboard from "./creator&&customer/kahoot/TeacherDashboard";
import StudentJoin from "./creator&&customer/kahoot/StudentJoin";
import KahootSpecificContentPage from "./creator&&customer/page/KahootSpecificContentPage";

import AdminCreatorManagement from "./adminPages/AdminCreatorPages";
import AdminCreatorDetail from "./adminPages/AdminCreatorDetail";
import AdminPendingCertificates from "./adminPages/AdminPendingCertificates";
import CreatorViolationsHistory from "./adminPages/CreatorViolationsHistory";
import CreatorAuditLogs from "./adminPages/CreatorAuditLogs";
import TransactionsListPage from "./adminPages/TransactionsListPage";
import RevenueReportPage from "./adminPages/RevenueReportPage";
import SystemOverview from "./adminPages/SystemOverview";
import AdminDiagnosticsPage from "./adminPages/AdminDiagnosticsPage";

import AdminHeader from "./adminPages/AdminHeader";
import Unauthorized from "./Unauthorized";
import CommunityDictionary from "./creator&&customer/page/DictionaryCommunityPage";
import AdminCourseManagement from "./adminPages/AdminCourseManagement";
import AdminCourseDetailPage from "./adminPages/AdminCourseDetailPage";

export default function JpdWebComponent() {
  // Nâng state lên từ B để có thể control ở cấp cao hơn
  const [isCreator, setCreator] = useState(false);
  const [showDirect, setShowDirect] = useState(false);

  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <JpdWebContent
            isCreator={isCreator}
            setCreator={setCreator}
            showDirect={showDirect}
            setShowDirect={setShowDirect}
          />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

// Component layout chính
function JpdWebContent({ isCreator, setCreator, showDirect, setShowDirect }) {
  const auth = useAuth();
  const location = useLocation();

  const isCreatorPage = location.pathname.startsWith("/creator");
  const isAdminPage = location.pathname.startsWith("/admin");
  const isHomePage = location.pathname === "/";

  return (
    <>
      {/* HEADER */}
      {auth.isAdmin && isAdminPage ? <AdminHeader /> : <HeaderComponent />}

      {/* CÁC TIỆN ÍCH FLOATING (TỪ ĐIỂN & SIDEBAR CREATOR) */}
      {auth.isAuthentication && !auth.isAdmin && (
        <>
          {/* TỪ ĐIỂN CÁ NHÂN
              - Quy tắc hiển thị: chỉ khi KHÔNG ở trang /creator
              - UI lấy theo bản B (gradient tím, overlay mờ)
          */}
          {!isCreatorPage && (
            <>
              {/* Nút mở từ điển (UI đẹp từ B) */}
              <Button
                variant="primary"
                className="floating-btn"
                onClick={() => setShowDirect(true)}
                style={{
                  position: "fixed",
                  bottom: "30px",
                  right: "30px",
                  zIndex: 998,
                  borderRadius: "50px",
                  padding: "14px 24px",
                  fontSize: "15px",
                  fontWeight: "600",
                  boxShadow: "0 6px 24px rgba(0, 123, 255, 0.35)",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 30px rgba(102, 126, 234, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 24px rgba(0, 123, 255, 0.35)";
                }}
              >
                <BookOpen size={20} />
                <span>Từ điển</span>
              </Button>

              {/* Sidebar Từ điển (UI lấy từ B: header gradient tím, close xoay, overlay mờ) */}
              <div
                className={`dictionary-sidebar ${showDirect ? "show" : ""}`}
                style={{
                  position: "fixed",
                  top: "0",
                  right: showDirect ? "0" : "-650px",
                  width: "650px",
                  maxWidth: "90vw",
                  height: "100vh",
                  backgroundColor: "#ffffff",
                  boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.12)",
                  zIndex: 1050,
                  transition: "right 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderLeft: "1px solid #e3e8ef",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Header của từ điển */}
                <div
                  style={{
                    padding: "24px 28px",
                    borderBottom: "2px solid #f0f3f7",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <BookOpen size={28} style={{ color: "#ffffff" }} />
                    <h4
                      style={{
                        margin: 0,
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "20px",
                        letterSpacing: "0.3px",
                      }}
                    >
                      Từ Điển Cá Nhân
                    </h4>
                  </div>

                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => setShowDirect(false)}
                    style={{
                      borderRadius: "50%",
                      width: "42px",
                      height: "42px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.3)";
                      e.currentTarget.style.transform = "rotate(90deg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.2)";
                      e.currentTarget.style.transform = "rotate(0deg)";
                    }}
                  >
                    <X size={20} />
                  </Button>
                </div>

                {/* Nội dung từ điển */}
                <div
                  style={{
                    flex: 1,
                    overflow: "auto",
                    padding: "0",
                    backgroundColor: "#fafbfc",
                  }}
                >
                  <DirectComponent />
                </div>
              </div>

              {/* Overlay tối mờ khi mở từ điển */}
              {showDirect && (
                <div
                  onClick={() => setShowDirect(false)}
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    zIndex: 1049,
                    transition: "opacity 0.3s ease",
                  }}
                />
              )}
            </>
          )}

          {/* NÚT VÀ SIDEBAR CREATOR
             - Quy tắc hiển thị theo A:
               chỉ hiện cho user thường (đã đăng nhập, không phải admin)
             - UI Sidebar: theo B (Sidebar tự render theo isOpen)
             - Ta vẫn giữ nút toggle nổi (từ A) để bật/tắt creator menu
          */}

          {/* Sidebar creator (UI từ B: để Sidebar tự handle isOpen/onToggle) */}
          <Sidebar
            isOpen={isCreator}
            onToggle={() => setCreator((prev) => !prev)}
          >
            {isCreator ? <X size={22} /> : <Menu size={22} />}
          </Sidebar>
        </>
      )}

      {/* KHU VỰC NỘI DUNG CHÍNH */}
      <div
        className="main-content"
        style={{
          // Kết hợp:
          // - paddingTop logic từ A (để tránh bị header fixed che mất)
          // - backgroundColor và transition từ B
          paddingTop: isAdminPage ? "0px" : isHomePage ? "0px" : "85px",
          minHeight: "100vh",
          backgroundColor: isHomePage ? "transparent" : "#f8f9fa",
          transition: "all 0.3s ease",
        }}
      >
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomepageComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/dictionary" element={<CommunityDictionary />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/course_result/:name"
            element={<CoursesResultPage />}
          />
          <Route path="/course/specific/:id" element={<CourseDescriptionPage />} />

          {/* PUBLIC - Student Join Kahoot (không cần đăng nhập) */}
          <Route
            path="/creator/class/kahoot/studentJoin/:id"
            element={<StudentJoin />}
          />

          {/* ADMIN ROUTES - bảo vệ bằng AdminRoute (từ A) */}
          <Route
            path="/admin/app_overview"
            element={
              <AdminRoute>
                <SystemOverview />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/creator-page"
            element={
              <AdminRoute>
                <AdminCreatorManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/creatorDetail/:id"
            element={
              <AdminRoute>
                <AdminCreatorDetail />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/pending-certificate"
            element={
              <AdminRoute>
                <AdminPendingCertificates />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/violent-history/:creatorId"
            element={
              <AdminRoute>
                <CreatorViolationsHistory />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/course-manager"
            element={
              <AdminRoute>
                <AdminCourseManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/course/:courseId"
            element={
              <AdminRoute>
                <AdminCourseDetailPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/auditlog-history/:creatorId"
            element={
              <AdminRoute>
                <CreatorAuditLogs />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/transaction-page"
            element={
              <AdminRoute>
                <TransactionsListPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/statistic-revenue"
            element={
              <AdminRoute>
                <RevenueReportPage />
              </AdminRoute>
            }
          />
        
  
          {/* USER PROTECTED ROUTES - cần đăng nhập */}
          <Route
            path="/mylearning"
            element={
              <ProtectedRoute>
                <MyLearningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/content_overview/:id"
            element={
              <ProtectedRoute>
                <CourseContentOverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transaction-detail"
            element={
              <ProtectedRoute>
                <TransactionDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload_profile"
            element={
              <ProtectedRoute>
                <CreatorProfileComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creator/commercial/history_transaction"
            element={
              <ProtectedRoute>
                <WithdrawHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creator/commercial/balance"
            element={
              <ProtectedRoute>
                <BalancePage />
              </ProtectedRoute>
            }
          />

          {/* CREATOR PROTECTED ROUTES - cần đăng nhập + quyền creator */}
          <Route
            path="/creator/commercial/dashboard"
            element={
              <CreatorProtectedRoute>
                <CreatorHomePage />
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/course_manage/:courseId"
            element={
              <CreatorProtectedRoute>
                <CourseManagementInterface />
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/class/kahoot"
            element={
              <CreatorProtectedRoute>
                <KahootList />
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/class/kahoot/:id"
            element={
              <CreatorProtectedRoute>
                <KahootSpecificContentPage />
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/class/kahoot/:id/start"
            element={
              <CreatorProtectedRoute>
                <TeacherDashboard />
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/create_course"
            element={
              <CreatorProtectedRoute>
                <CreateCourseForm />
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/commercial/courseDetail"
            element={
              <CreatorProtectedRoute>
                <CoursesTable />
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/commercial/courseDetail/:courseId"
            element={
              <CreatorProtectedRoute>
                <CourseDetail />
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/courseList"
            element={
              <CreatorProtectedRoute>
                <CoursesList />
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/profile"
            element={
              <CreatorProtectedRoute>
                <CreatorAccountInfo />
              </CreatorProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* FOOTER: theo logic A
         - Admin pages KHÔNG có footer
         - Các trang khác có footer
      */}
      {!isAdminPage && <FooterComponent />}
    </>
  );
}
