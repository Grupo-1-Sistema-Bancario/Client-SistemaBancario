import { Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "../../features/auth/store/useAuthStore.js"
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx"
import { VerifyEmailPage } from "../../features/auth/pages/VerifyEmailPage.jsx"
import { UnauthorizedPage } from "../../features/auth/pages/UnauthorizedPage.jsx"
import { ResetPasswordPage } from "../../features/auth/pages/ResetPasswordPage.jsx"
import { DashboardPage } from "../layouts/DashboardPage.jsx"
import { NewClients } from "../../features/admin/new-clients/components/NewClients.jsx"
import { ProductsPage } from "../../features/admin/products/pages/ProductsPage.jsx"
import { DepositForm } from "../../features/admin/deposits/components/DepositForm.jsx"
import { RevertDepositList } from "../../features/admin/deposits/components/RevertDepositList.jsx"
import { TransferForm } from "../../features/client/transfers/components/TransferForm.jsx"
import { Catalog } from "../../features/client/catalog/components/Catalog.jsx"
import { Payments } from "../../features/client/payments/components/Payments.jsx"
import { Favorite } from "../../features/client/favorites/components/FavoritesBoard.jsx"

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
                        <Route path="deposits" element={<DepositForm />} />
                        <Route path="deposits/reverse" element={<RevertDepositList />} />
                    </>
                ) : (
                    <>
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="transfers" element={<TransferForm />} />
                        <Route path="payments" element={<Payments />} />
                        <Route path="favorites" element={<Favorite />} />
                        <Route path="catalog" element={<Catalog />} />
                    </>
                )}

            </Route>

            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
        </Routes>
    )
}