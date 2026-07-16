import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Requests } from './pages/Requests';
import { NewRequest } from './pages/NewRequest';
import { Orders } from './pages/Orders';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';

import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminRequests } from './pages/admin/AdminRequests';
import { AdminClients } from './pages/admin/AdminClients';
import { AdminPricing } from './pages/admin/AdminPricing';
import { AdminLogs } from './pages/admin/AdminLogs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="requests" element={<Requests />} />
          <Route path="requests/new" element={<NewRequest />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="pricing" element={<AdminPricing />} />
          <Route path="logs" element={<AdminLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
