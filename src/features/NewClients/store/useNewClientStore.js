import { create } from "zustand";
import {
    getFullPendingInfo as getRequestsRequest,
    approveAccount as approveAccountRequest,
    rejectAccount as rejectAccountRequest
} from "../../../shared/api/admin.js";

export const useAccountRequestStore = create((set, get) => ({

    newClients: [],
    loading: false,
    error: null,

    getRequests: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getRequestsRequest();
            // 2. Guardamos en el nuevo nombre
            set({ newClients: response.data.data, loading: false });
        } catch (error) {
            set({ error: "Error al obtener clientes", loading: false });
        }
    },

    approveAccount: async (authAccountId, accountData) => {
        try {
            set({ loading: true, error: null });
            await approveAccountRequest(authAccountId, accountData);

            // 3. Filtramos sobre 'newClients'
            set({
                newClients: get().newClients.filter(c => (c.id || c._id) !== authAccountId),
                loading: false
            })
            return { success: true };
        } catch (error) {
            set({ loading: false, error: "Error al autorizar" });
            return { success: false };
        }
    },

    rejectAccount: async (id) => {
        try {
            set({ loading: true });

            const response = await rejectAccountRequest(id);

            if (response.data.success) {
                set((state) => ({
                    newClients: state.newClients.filter(c => (c.id || c._id) !== id),
                    loading: false
                }));
                return { success: true };
            }
        } catch (error) {
            set({ loading: false });
            return { success: false };
        }
    }
}));