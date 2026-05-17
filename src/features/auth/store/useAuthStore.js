import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    login as loginRequest,
    register as registerRequest,
    forgotPassword as forgotPasswordRequest,
    verifyEmail as verifyEmailRequest,
    resetPassword as resetPasswordRequest
} from "../../../shared/api"
import {
    createAccountRequest
} from "../../../shared/api/admin"

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            expiresAt: null,
            loading: false,
            error: null,
            isAuthenticated: false,
            isLoadingAuth: true,

            checkAuth: () => {
                const token = get().token;
                
                if (!token) {
                    set({
                        user: null,
                        token: null,
                        refreshToken: null,
                        expiresAt: null,
                        isAuthenticated: false,
                        isLoadingAuth: false,
                        loading: false
                    });
                    return;
                }

                set({
                    isLoadingAuth: false,
                    isAuthenticated: true
                });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    expiresAt: null,
                    isAuthenticated: false
                })
            },

            register: async (formData) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await registerRequest(formData);
                    const authAccountId = data?.user?.id;
                    
                    if (authAccountId) {
                        await createAccountRequest({
                            authAccountId: authAccountId,
                            dpi: formData.get('DPI'),
                            address: formData.get('Address'),
                            email: formData.get('Email'),
                            phone: formData.get('Phone'),
                            jobType: formData.get('JobType'),
                            monthlyIncome: formData.get('Income'),
                        });
                    }
                    set({ loading: false });
                    return {
                        success: true,
                        emailVerificationRequired: data?.emailVerificationRequired,
                        data
                    }
                } catch (err) {
                    const message = err.response?.data.message || "Error al registrarse";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },

            requestPasswordReset: async (email) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await forgotPasswordRequest(email);
                    set({ loading: false });
                    return { success: true, data }
                } catch (err) {
                    const message = err.response?.data?.message || "Error al solicitar restablecimiento de contraseña";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },

            resetPassword: async ({ token, newPassword }) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await resetPasswordRequest(token, newPassword);
                    set({ loading: false });
                    return { success: true }
                } catch (err) {
                    const message = err.response?.data?.message || "Error al restablecer la contraseña";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },

            verifyEmail: async (token) => {
                try {
                    set({ loading: true, error: null });
                    await verifyEmailRequest(token);
                    set({ loading: false });
                    return { success: true }
                } catch (err) {
                    const message = err.response?.data?.message || "Error al verificar el correo";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },

            login: async ({ emailOrUsername, password }) => {
                try {
                    set({ loading: true, error: null });

                    const { data } = await loginRequest({ emailOrUsername, password })
                    
                    const accessToken = data.accessToken ?? data.token;
                    
                    set({
                        user: data.userDetails,
                        token: accessToken,
                        refreshToken: data.refreshToken,
                        expiresAt: data.expiresAt,
                        loading: false,
                        isAuthenticated: true
                    })

                    return { success: true }

                } catch (err) {
                    const message =
                        err.response?.data?.message || "Error de autenticación";
                    set({ error: message, loading: false })
                    return { success: false, error: message }
                }
            },
            
            setError: (error) => {
                set({ error: null });
                setTimeout(() => set({ error }), 10);
            },
            clearError: () => set({ error: null })
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                refreshToken: state.refreshToken,
                expiresAt: state.expiresAt,
                isAuthenticated: state.isAuthenticated
            }),
            merge: (persistedState, currentState) => ({
                ...currentState,
                ...persistedState,
                error: null,
                loading: false
            })
        }
    )
)