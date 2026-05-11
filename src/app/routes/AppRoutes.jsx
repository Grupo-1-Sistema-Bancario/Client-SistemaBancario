import { Routes, Route, Navigate } from "react-router-dom"
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx"
import { VerifyEmailPage } from "../../features/auth/pages/VerifyEmailPage.jsx"
import { UnauthorizedPage } from "../../features/auth/pages/UnauthorizedPage.jsx"
import { ResetPasswordPage } from "../../features/auth/pages/ResetPasswordPage.jsx"
import { DashboardPage } from "../layouts/DashboardPage.jsx"
import { NewClients } from "../../features/NewClients/components/NewClients.jsx"
import { BenefitsPage } from "../../features/benefits/pages/BenefitsPage.jsx"

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route 
                path="/dashboard" 
                element={
                    <DashboardPage />
                } 
            > 
                <Route path="NewClients" element={<NewClients />} />
                <Route path="/benefits" element={<BenefitsPage />} />
            </Route>
        </Routes>
    )
}