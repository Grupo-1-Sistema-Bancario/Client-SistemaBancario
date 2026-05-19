import { create } from "zustand";
import { getAllTransactionsRequest } from "../../../../shared/api/admin.js";

export const useTransactionsStore = create((set) => ({
    transactions: [],
    loading: false,
    error: null,

    getTransactions: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getAllTransactionsRequest();
            set({
                transactions: response.data.data || [],
                loading: false
            });
        } catch (error) {
            console.log(error);
            set({
                loading: false,
                error: "Error al obtener el historial de transacciones"
            });
        }
    }
}));