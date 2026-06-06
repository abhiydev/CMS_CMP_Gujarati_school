import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LoadingSpinner from './components/LoadingSpinner';

const HomePage = lazy(() => import('./pages/HomePage'));
const AdminLoginPage = lazy(() => import('./admin/AdminLoginPage'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./admin/AdminDashboardPage'));
const AdminContentPage = lazy(() => import('./admin/AdminContentPage'));
const AdminGalleryPage = lazy(() => import('./admin/AdminGalleryPage'));
const AdminNoticesPage = lazy(() => import('./admin/AdminNoticesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner message="Loading application…" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="content" element={<AdminContentPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="notices" element={<AdminNoticesPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
