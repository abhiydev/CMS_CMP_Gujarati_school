import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const AdminLoginPage = lazy(() => import('./admin/AdminLoginPage.jsx'));
const AdminLayout = lazy(() => import('./admin/AdminLayout.jsx'));
const AdminDashboardPage = lazy(() => import('./admin/AdminDashboardPage.jsx'));
const AdminContentPage = lazy(() => import('./admin/AdminContentPage.jsx'));
const AdminGalleryPage = lazy(() => import('./admin/AdminGalleryPage.jsx'));
const AdminNoticesPage = lazy(() => import('./admin/AdminNoticesPage.jsx'));
const AdminActivityPage = lazy(() => import('./admin/AdminActivityPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner message="Loading application…" />}>
          <Routes>
            <Route
              path="/"
              element={(
                <ErrorBoundary name="homepage" fallbackTitle="Homepage unavailable">
                  <HomePage />
                </ErrorBoundary>
              )}
            />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="content" element={<AdminContentPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="notices" element={<AdminNoticesPage />} />
              <Route path="activity" element={<AdminActivityPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
