import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import HomepageComponent from "./HomeComponent";
import CoursesResultComponent from "./CoursesResultComponent";
import "./JpdWebStyle.css";
import CourseDescription from "./CourseDescription";
import MyLearningComponent from "./MyLearningComponent";
import CourseContentComponent from "./CourseContentComponent";
import HeaderComponent from "./HeaderComponent";
import CreatorHomePage from "./CreateHomePage";
import CreatorProfileComponent from "./CreateProfileComponent";
import { useState } from "react";
import Sidebar from "./CreatorSideBar";
import { BookOpen, X } from "lucide-react";

import CreateCourseForm from "./CreateCourseForm";
import CourseManagementInterface from "./CourseManagementComponent";

import DirectComponent from "./DictionaryConponent";
import { Button } from "react-bootstrap";
import FooterComponent from "./FooteComponent";
import CoursesTable from "./CourseTable";
import CourseDetail from "./CourseCommercialDetailComponent";
import CoursesList from "./CreatorCourseList";
import CreatorAccountInfo from "./CreatorAccount";
import CourseContentOverviewComponent from "./CourseContentOverviewComponent";
import AuthProvider, { useAuth } from "./security/Authentication";
import LoginComponent from "./LoginComponent";
import "./api/AuthInterceptor";
import ProtectedRoute from "./ProtectedRoute";
import CreatorProtectedRoute from "./CreatorProtectedRoute";
import WithdrawHistory from "./CreatorHistoryTransacction";
import TransactionDetailPage from "./TransactionDetailPage";
import BalanceComponent from "./BalanceComponent";
import KahootPage from "./Kahhootpage";
import KahootList from "./KahootManagement";
import TeacherDashboard from "./kahoot/TeacherDashboard";
import StudentJoin from "./kahoot/StudentJoin";
import KahootSpecificContent from "./KahootSpecificContent";
import AdminCreatorManagement from "./adminPages/AdminCreatorPages";
import AdminCreatorDetail from "./adminPages/AdminCreatorDetail";
import AdminPendingCertificates from "./adminPages/AdminPendingCertificates";
import CreatorViolationsHistory from "./adminPages/CreatorViolationsHistory";
import CreatorAuditLogs from "./adminPages/CreatorAuditLogs";
import TransactionsListPage from "./adminPages/TransactionsListPage";
import RevenueReportPage from "./adminPages/RevenueReportPage";
export default function JpdWebComponent() {
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

// Tách phần content ra component riêng để có thể sử dụng useAuth
function JpdWebContent({ isCreator, setCreator, showDirect, setShowDirect }) {
  const auth = useAuth();
  const location = useLocation();
  const isCreatorPage = location.pathname.startsWith("/creator");
  const isHomePage = location.pathname === "/";

  return (
    <>
      <HeaderComponent />

      {/* Chỉ hiển thị khi đã authenticated */}
      {auth.isAuthentication && (
        <>
          {/* ✅ Chỉ hiển thị TỪ ĐIỂN nếu KHÔNG phải trang /creator */}
          {!isCreatorPage && (
            <>
              {/* Floating Dictionary Button */}
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
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(102, 126, 234, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(0, 123, 255, 0.35)";
                }}
              >
                <BookOpen size={20} />
                <span>Từ điển</span>
              </Button>

              {/* Dictionary Sidebar */}
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
                {/* Dictionary Header */}
                <div
                  style={{
                    padding: "24px 28px",
                    borderBottom: "2px solid #f0f3f7",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <BookOpen size={28} style={{ color: "#ffffff" }} />
                    <h4
                      style={{
                        margin: "0",
                        color: "#ffffff",
                        fontWeight: "700",
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
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                      e.currentTarget.style.transform = "rotate(90deg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                      e.currentTarget.style.transform = "rotate(0deg)";
                    }}
                  >
                    <X size={20} />
                  </Button>
                </div>

                {/* Dictionary Content */}
                <div
                  style={{
                    flex: "1",
                    overflow: "auto",
                    padding: "0",
                    backgroundColor: "#fafbfc",
                  }}
                >
                  <DirectComponent />
                </div>
              </div>

              {/* Overlay when dictionary is open */}
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

          {/* Creator Sidebar với Sidebar component */}
          <Sidebar isOpen={isCreator} onToggle={() => setCreator((prev) => !prev)} />
        </>
      )}

      {/* Main Content */}
      <div
        className="main-content"
        style={{
          paddingTop: isHomePage ? "0" : "50px",
          minHeight: "100vh",
          backgroundColor: isHomePage ? "transparent" : "#f8f9fa",
          transition: "all 0.3s ease",
        }}
      >
        <Routes>
          <Route path="/" element={<HomepageComponent />} />
          <Route path="/login" element={<LoginComponent />} />

          {/* Regular Protected Routes */}
          <Route
            path="/mylearning"
            element={
              <ProtectedRoute>
                <MyLearningComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course_result/:name"
            element={<CoursesResultComponent />}
          />
          <Route path="/course/specific/:id" element={<CourseDescription />} />
          <Route
            path="/course/content_overview/:id"
            element={
              <ProtectedRoute>
                <CourseContentOverviewComponent />
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

          {/*admin*/}
          <Route
            path="/admin/creator-page"
            element={
              <ProtectedRoute>
                <AdminCreatorManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/creatorDetail/:id"
            element={
              <ProtectedRoute>
                <AdminCreatorDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pending-certificate"
            element={
              <ProtectedRoute>
                <AdminPendingCertificates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/violent-history/:creatorId"
            element={
              <ProtectedRoute>
                <CreatorViolationsHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/auditlog-history/:creatorId"
            element={
              <ProtectedRoute>
                <CreatorAuditLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transaction-page"
            element={
              <ProtectedRoute>
                <TransactionsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/statistic-revenue"
            element={
              <ProtectedRoute>
                <RevenueReportPage />
              </ProtectedRoute>
            }
          />
          {/* Upload Profile - Chỉ cần authentication */}
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
                <BalanceComponent />
              </ProtectedRoute>
            }
          />
          {/* Creator Routes - Cần authentication + isCreator = true */}
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
                <KahootList></KahootList>
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/class/kahoot/:id"
            element={
              <CreatorProtectedRoute>
                <KahootSpecificContent></KahootSpecificContent>
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/class/kahoot/:id/start"
            element={
              <CreatorProtectedRoute>
                <TeacherDashboard></TeacherDashboard>
              </CreatorProtectedRoute>
            }
          />
          <Route
            path="/creator/class/kahoot/studentJoin"
            element={<StudentJoin></StudentJoin>}
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

      <FooterComponent />
    </>
  );
}
