import { Routes, Route, Navigate } from "react-router-dom"

/*import { AuthPage } from "../../features/auth/pages/AuthPage.jsx"
import { VerifyEmailPage } from "../../features/auth/pages/VerifyEmailPage.jsx"
import { UnauthorizedPage } from "../../features/auth/pages/UnauthorizedPage.jsx"
import { ResetPasswordPage } from "../../features/auth/pages/ResetPasswordPage.jsx"

import { ProtectedRoute } from "./ProtectedRoute.jsx"
import { RoleGuard } from "./RoleGuard.jsx"
*/
import { DashboardPage } from "../layouts/DashboardPage.jsx"

export const AppRoutes = () => {
    return (
        <Routes>
            {/* RUTAS PUBLICAS */}
           {/* <Route path="/" element={<AuthPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            */}
            {/* PROTECTED ROUTES + ROLE (comentadas por ahora) */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
    )
}