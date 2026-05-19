import { create } from "zustand";
import { getTransactionHistoryRequest } from "../../../../shared/api/admin.js";

export const useMyTransactionsStore = create((set) => ({
    transactions: [],
    loading: false,

    fetchMyTransactions: async () => {
        try {
            set({ loading: true });
            const response = await getTransactionHistoryRequest();
            set({ transactions: response.data.data || [], loading: false });
        } catch (error) {
            console.error("Error al cargar historial de transacciones", error);
            set({ loading: false });
        }
    }
}));