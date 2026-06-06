/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

import { auditBot } from './services/auditBot';
import { AuditStatusPanel } from './components/AuditStatusPanel';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { initializeFirestoreSync } from './services/api/localStore';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Marketing pages
import MarketingLayout from './app/(marketing)/layout';
import HomePage from './app/(marketing)/page';
import FeaturesPage from './app/(marketing)/features';
import PricingPage from './app/(marketing)/pricing';

// Auth pages
import LoginPage from './app/(auth)/login/page';

// App pages
import AppLayout from './app/(app)/layout';
import DashboardPage from './app/(app)/dashboard/page';
import ClientsPage from './app/(app)/clients/page';
import FinancialPage from './app/(app)/financial/page';
import CashFlowPage from './app/(app)/cash-flow/page';
import SalesPage from './app/(app)/sales/page';
import ReportsPage from './app/(app)/reports/page';
import FirmOverviewPage from './app/(app)/firm-overview/page';
import TemplatesPage from './app/(app)/templates/page';
import SettingsPage from './app/(app)/settings/page';
import HRScenarioPage from './app/(app)/hr-scenario/page';
import DebtScenarioPage from './app/(app)/debt-scenario/page';
import IntegrationsPage from './app/(app)/integrations/page';
import TrainingPage from './app/(app)/training/page';
import GoalsPage from './app/(app)/goals/page';
import KPIDictionaryPage from './app/(app)/kpi-dictionary/page';
import RevenueForecastPage from './app/(app)/revenue-forecast/page';
import DataEntryPage from './app/(app)/data-entry/page';

import ClientDetailPage from './app/(app)/clients/detail';

export default function App() {
  useEffect(() => {
    auditBot.start();
    
    // Add auth listener to sync stores
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        initializeFirestoreSync(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="bottom-right" />
      <AuditStatusPanel />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Route>
        
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/:id" element={<ClientDetailPage />} />
          <Route path="kpi-dictionary" element={<KPIDictionaryPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="financial" element={<FinancialPage />} />
          <Route path="revenue-forecast" element={<RevenueForecastPage />} />
          <Route path="cash-flow" element={<CashFlowPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="firm-overview" element={<FirmOverviewPage />} />
          <Route path="hr-scenario" element={<HRScenarioPage />} />
          <Route path="debt-scenario" element={<DebtScenarioPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="data-entry" element={<DataEntryPage />} />
          <Route path="training" element={<TrainingPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
