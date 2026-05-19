import { create } from 'zustand';
import { makeTransferRequest } from '../../../../shared/api/admin';

export const useTransferStore = create((set) => ({
    loading: false,
    error: null,

    makeTransfer: async (transferData) => {
        try {
            set({ loading: true, error: null });
            await makeTransferRequest(transferData);
            set({ loading: false });
            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || "Error al realizar la transferencia";
            set({ loading: false, error: msg });
            return { success: false, error: msg };
        }
    }
}));