import { DashboardContainer } from "../../shared/components/layout/DashboardContainer.jsx"
import { Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from "../../features/auth/store/useAuthStore.js"
import { ClientHome } from "../../features/client/home/ClientHome.jsx"
import { AdminHome } from "../../features/admin/home/AdminHome.jsx"

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isAdmin = user?.role === 'ADMIN_ROLE';

  const isRootDashboard = location.pathname === '/dashboard';

  return (
    <DashboardContainer>
        {isRootDashboard ? (
            isAdmin ? <AdminHome /> : <ClientHome />
        ) : (
            <Outlet/>
        )}
    </DashboardContainer>
  )
}