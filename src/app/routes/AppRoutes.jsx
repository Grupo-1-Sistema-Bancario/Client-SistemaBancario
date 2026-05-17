import { Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "../../features/auth/store/useAuthStore.js"
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx"
import { VerifyEmailPage } from "../../features/auth/pages/VerifyEmailPage.jsx"
import { UnauthorizedPage } from "../../features/auth/pages/UnauthorizedPage.jsx"
import { ResetPasswordPage } from "../../features/auth/pages/ResetPasswordPage.jsx"
import { DashboardPage } from "../layouts/DashboardPage.jsx"
import { NewClients } from "../../features/admin/new-clients/components/NewClients.jsx"
import { ProductsPage } from "../../features/admin/products/pages/ProductsPage.jsx"

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    if (!isAuthenticated) return <Navigate to="/" replace />;
    return children;
};

export const AppRoutes = () => {
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'ADMIN_ROLE';
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Ruta Protegida */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            }>                 
                {isAdmin ? (
                    <>
                        <Route path="new-clients" element={<NewClients />} />
                        <Route path="products" element={<ProductsPage />} />
                    </>
                ) : (
                    <>
                        <Route path="products" element={<ProductsPage />} />
                    </>
                )}

            </Route>

            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
        </Routes>
    )
}