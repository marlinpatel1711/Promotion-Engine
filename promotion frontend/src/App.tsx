import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, Box, CircularProgress } from '@mui/material';
import PromotionListPage from './pages/PromotionListPage';
import PromotionFormPage from './pages/PromotionFormPage';
import theme from './config/theme';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import RuleBuilderPage from './pages/RuleBuilderPage';
import CouponsPage from './pages/CouponsPage';
import InsightsPage from './pages/InsightsPage';
import SettingsPage from './pages/SettingsPage';
import CartEvaluationPage from './pages/CartEvaluationPage';
import { PromotionProvider } from './context/PromotionContext';
import { Suspense } from 'react';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PromotionProvider>
        <Router>
          <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
              <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/rule-builder" element={<RuleBuilderPage />} />
                  <Route path="/coupons" element={<CouponsPage />} />
                  <Route path="/insights" element={<InsightsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/cart-evaluation" element={<CartEvaluationPage />} />
                  <Route path="/promotions" element={<PromotionListPage />} />
                  <Route path="/promotions/new" element={<PromotionFormPage mode="create" />} />
                  <Route path="/promotions/:id/edit" element={<PromotionFormPage mode="edit" />} />
                </Routes>
              </Suspense>
            </Box>
          </Box>
        </Router>
      </PromotionProvider>
    </ThemeProvider>
  );
}

export default App
