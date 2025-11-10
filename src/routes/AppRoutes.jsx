import { Routes, Route } from "react-router-dom";

// Pages
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import AboutJaenPage from "./pages/AboutJaenPage";

import CoursesResultPage from "../pages/Course/CourseResultPage";
import CourseDescriptionPage from "../pages/Course/CourseDescriptionPage";
import CourseContentOverviewPage from "../pages/Course/CourseContentOverviewPage";
import CourseContentPage from "../pages/Course/CourseContentPage";
import CourseCommercialDetailPage from "../pages/Course/CourseDetailPage";

import MyLearningPage from "../pages/Learner/MyLearningPage";
import SubscriptionPlansPage from "../pages/Learner/SubscriptionPlansPage";

import CourseManagementPage from "../pages/Admin/CourseManagementPage";
import FeedbackPage from "../pages/Admin/FeedbackPage";

import SpeakingPage from "../pages/Practice/SpeakingPage";
import ErrorPage from "../pages/Error/ErrorPage";

// Layouts
import MainLayout from "../layouts/MainLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about/*" element={<AboutJaenPage />} />
        <Route path="/course_result/:name" element={<CoursesResultPage />} />
        <Route path="/course/specific/:id" element={<CourseDescriptionPage />} />
        <Route path="/course/content_overview/:id" element={<CourseContentOverviewPage />} />
        <Route path="/course/content/:moduleid/:contentid" element={<CourseContentPage />} />
        <Route path="/course/commercial/:id" element={<CourseCommercialDetailPage />} />

        <Route path="/mylearning" element={<MyLearningPage />} />
        <Route path="/plans" element={<SubscriptionPlansPage />} />

        <Route path="/admin/course_manage" element={<CourseManagementPage />} />
        <Route path="/admin/feedback" element={<FeedbackPage />} />

        <Route path="/practice/speaking" element={<SpeakingPage />} />

        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}
