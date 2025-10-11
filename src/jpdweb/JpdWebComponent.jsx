import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomepageComponent from "./HomeComponent";
import CoursesResultComponent from "./CoursesResultComponent";
import './JpdWebStyle.css'
import CourseDescription from "./CourseDescription";
import MyLearningComponent from "./MyLearningComponent";
import CourseContentComponent from "./CourseContentComponent";
import HeaderComponent from "./HeaderComponent";
import CreatorHomePage from "./CreateHomePage";
import CreatorProfileComponent from "./CreateProfileComponent";
import { useState } from "react";
import Sidebar from "./CreatorSideBar";
import { BookOpen, Menu, X } from "lucide-react";

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
import './api/AuthInterceptor'
import ProtectedRoute from "./ProtectedRoute";
import CreatorProtectedRoute from "./CreatorProtectedRoute";
import WithdrawHistory from "./CreatorHistoryTransacction";
export default function JpdWebComponent(){
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
  const auth = useAuth(); // Bây giờ mới có thể dùng useAuth

  return (
    <>
      <HeaderComponent />
      
      {/* Chỉ hiển thị khi đã authenticated */}
      {auth.isAuthentication && (
        <>
          {/* Floating Dictionary Button */}
          <Button
            variant="primary"
            className="floating-btn"
            onClick={() => setShowDirect(true)}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 998,
              borderRadius: '50px',
              padding: '12px 20px',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 20px rgba(0,123,255,0.3)',
              border: 'none',
              background: 'linear-gradient(45deg, #007bff, #0056b3)',
              transition: 'all 0.3s ease'
            }}
          >
            <BookOpen size={20} className="me-2" />
            Từ điển
          </Button>

          {/* Dictionary Sidebar */}
          <div 
            className={`dictionary-sidebar ${showDirect ? 'show' : ''}`}
            style={{
              position: 'fixed',
              top: '0',
              right: showDirect ? '0' : '-600px',
              width: '600px',
              height: '100vh',
              backgroundColor: '#ffffff',
              boxShadow: '-5px 0 25px rgba(0,0,0,0.15)',
              zIndex: 999,
              transition: 'right 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              borderLeft: '1px solid #e9ecef',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              padding: '20px 25px',
              borderBottom: '1px solid #e9ecef',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <BookOpen size={24} className="text-primary me-2" />
                <h4 style={{ margin: '0', color: '#2c3e50', fontWeight: '600' }}>
                  Từ Điển Cá Nhân
                </h4>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowDirect(false)}
                style={{
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <X size={18} />
              </Button>
            </div>
            <div style={{ flex: '1', overflow: 'auto', padding: '0' }}>
              <DirectComponent />
            </div>
          </div>

          {/* Toggle Creator Sidebar Button */}
          <button
            onClick={() => setCreator((prev) => !prev)}
            style={{
              position: 'fixed',
              top: '20px',
              left: '20px',
              zIndex: 1100,
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: 'white'
            }}
          >
            {isCreator ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Creator Sidebar */}
          {isCreator && (
            <div
              className={`creator-sidebar ${isCreator ? 'show' : ''}`}
              style={{
                position: 'fixed',
                top: '0',
                left: isCreator ? '0' : '-280px',
                width: '280px',
                height: '100vh',
                backgroundColor: '#fdfdfd',
                boxShadow: '2px 0 15px rgba(0,0,0,0.1)',
                zIndex: 999,
                transition: 'left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                borderRight: '1px solid #e9ecef',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Sidebar />
            </div>
          )}
        </>
      )}

      {/* Main Content */}
      <div className="main-content bg-white">
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
          <Route path="/course_result/:name" element={<CoursesResultComponent />} />
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
            path="/course/content/:moduleid/:contentid"
            element={
              <ProtectedRoute>
                <CourseContentComponent />
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