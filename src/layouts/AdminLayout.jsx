import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import ScrollToTop from '../components/common/ScrollToTop';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <ScrollToTop />
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-grow p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
