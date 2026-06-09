
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { LocaleProvider } from './context/LocaleContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ArticlesPage } from './pages/ArticlesPage';
import { NovelsPage } from './pages/NovelsPage';
import { GalleryPage } from './pages/GalleryPage';
import { StorePage } from './pages/StorePage';
import { TechPage } from './pages/TechPage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';

export default function App() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <AuthProvider>
          <ChatProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-sura-dark text-sura-ivory transition-colors duration-300">
                <Navbar />
                <AnimatePresence mode="wait">
                  <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/articles" element={<ArticlesPage />} />
                      <Route path="/novels" element={<NovelsPage />} />
                      <Route path="/gallery" element={<GalleryPage />} />
                      <Route path="/store" element={<StorePage />} />
                      <Route path="/tech" element={<TechPage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                </AnimatePresence>
                <Footer />
              </div>
            </BrowserRouter>
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
