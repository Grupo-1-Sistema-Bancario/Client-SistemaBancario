import { Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "../../features/auth/store/useAuthStore.js"
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx"
import { VerifyEmailPage } from "../../features/auth/pages/VerifyEmailPage.jsx"
import { UnauthorizedPage } from "../../features/auth/pages/UnauthorizedPage.jsx"
import { ResetPasswordPage } from "../../features/auth/pages/ResetPasswordPage.jsx"
import { DashboardPage } from "../layouts/DashboardPage.jsx"
import { NewClients } from "../../features/admin/new-clients/components/NewClients.jsx"
import { ProductsPage } from "../../features/admin/products/pages/ProductsPage.jsx"
import { AccountsStatsPage } from "../../features/admin/accounts/pages/AccountsStatsPage.jsx"
import { UsersManagementPage } from "../../features/admin/users/pages/UsersManagementPage.jsx"
import { DepositForm } from "../../features/admin/deposits/components/DepositForm.jsx"
import { RevertDepositList } from "../../features/admin/deposits/components/RevertDepositList.jsx"
import { TransferForm } from "../../features/client/transfers/components/TransferForm.jsx"
import { Catalog } from "../../features/client/catalog/components/Catalog.jsx"
import { Payments } from "../../features/client/payments/components/Payments.jsx"
import { Favorite } from "../../features/client/favorites/components/FavoritesBoard.jsx"
import { TransactionsHistoryPage } from "../../features/admin/transactions-history/pages/TransactionsHistoryPage.jsx" 
import { MyTransactions } from "../../features/client/my-transactions/components/MyTransactions.jsx"
import { AdminHome } from "../../features/admin/home/AdminHome.jsx"
import { ClientHome } from "../../features/client/home/ClientHome.jsx"

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
                        <Route index element={<AdminHome />} />
                        <Route path="new-clients" element={<NewClients />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="accounts-stats" element={<AccountsStatsPage />} />
                        <Route path="users" element={<UsersManagementPage />} />
                        <Route path="deposits" element={<DepositForm />} />
                        <Route path="deposits/reverse" element={<RevertDepositList />} />
                        <Route path="history" element={<TransactionsHistoryPage />} />
                    </>
                ) : (
                    <>
                        <Route index element={<ClientHome />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="transfers" element={<TransferForm />} />
                        <Route path="payments" element={<Payments />} />
                        <Route path="favorites" element={<Favorite />} />
                        <Route path="catalog" element={<Catalog />} />
                        <Route path="history" element={<MyTransactions />} />
                    </>
                )}
            </Route>

            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
        </Routes>
    )
}