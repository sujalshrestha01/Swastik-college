import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import NotificationTicker from './components/NotificationTicker';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingQuickAction from './components/FloatingQuickAction';
import Home from './pages/Home';
import Programs from './pages/Programs';
import CourseDetail from './pages/CourseDetail';
import NoticeBoard from './pages/NoticeBoard';
import Contact from './pages/Contact';
import About from './pages/About';
import Faculty from './pages/Faculty';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminNotices from './pages/admin/AdminNotices';
import AdminFaculty from './pages/admin/AdminFaculty';
import AdminEvents from './pages/admin/AdminEvents';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminGallery from './pages/admin/AdminGallery';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicSite() {
  return (
    <div className="min-h-screen flex flex-col bg-paper dark:bg-navy-900 transition-colors">
      <NotificationTicker />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:slug" element={<CourseDetail />} />
          <Route path="/notices" element={<NoticeBoard />} />
          <Route path="/about" element={<About />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <FloatingQuickAction />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="notices" element={<AdminNotices />} />
              <Route path="faculty" element={<AdminFaculty />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="/*" element={<PublicSite />} />
          </Routes>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
