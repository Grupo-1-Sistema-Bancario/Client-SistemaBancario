import { create } from "zustand";

import {
    getAccountsRequest,
    updateAccountRequest,
    activateAccountRequest,
    deactivateAccountRequest
} from "../../../../shared/api/admin.js";

export const useUsersStore = create((set) => ({

    users: [],
    loading: false,
    error: null,

    getUsers: async () => {
        try {
            set({
                loading: true,
                error: null
            });

            const response = await getAccountsRequest();

            set({
                users: response.data.data || [],
                loading: false
            });

        } catch (error) {
            console.log(error);
            set({
                loading: false,
                error: "Error al obtener usuarios"
            });
        }
    },

    updateUser: async (userId, userData) => {
        try {
            set({ loading: true, error: null });
            
            const response = await updateAccountRequest(userId, userData);
            
            set((state) => ({
                users: state.users.map(user => 
                    user._id === userId ? response.data.data : user
                ),
                loading: false
            }));

            return response.data.data;
        } catch (error) {
            console.log(error);
            set({
                loading: false,
                error: "Error al actualizar usuario"
            });
            throw error;
        }
    },

    activateUser: async (userId) => {
        try {
            set({ loading: true, error: null });
            
            const response = await activateAccountRequest(userId);
            
            set((state) => ({
                users: state.users.map(user => 
                    user._id === userId ? { ...user, isActive: true } : user
                ),
                loading: false
            }));

            return response.data.data;
        } catch (error) {
            console.log(error);
            set({
                loading: false,
                error: "Error al activar usuario"
            });
            throw error;
        }
    },

    deactivateUser: async (userId) => {
        try {
            set({ loading: true, error: null });
            
            const response = await deactivateAccountRequest(userId);
            
            set((state) => ({
                users: state.users.map(user => 
                    user._id === userId ? { ...user, isActive: false } : user
                ),
                loading: false
            }));

            return response.data.data;
        } catch (error) {
            console.log(error);
            set({
                loading: false,
                error: "Error al desactivar usuario"
            });
            throw error;
        }
    }

}));
