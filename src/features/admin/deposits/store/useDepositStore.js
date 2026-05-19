import { create } from 'zustand';
import { 
    makeDepositRequest, 
    getDepositsRequest, 
    revertDepositRequest 
} from '../../../../shared/api/admin';

export const useDepositStore = create((set, get) => ({
    deposits: [],
    loading: false,
    error: null,

    getDeposits: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getDepositsRequest();
            let data = response.data?.data || response.data || [];
            if (!Array.isArray(data)) data = []; 
            
            const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            set({ deposits: sorted, loading: false });
        } catch (error) {
            set({ error: "Error al cargar los depósitos", loading: false });
        }
    },

    makeDeposit: async (depositData) => {
        try {
            set({ loading: true, error: null });
            await makeDepositRequest(depositData);
            set({ loading: false });
            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || "Error al realizar el depósito";
            set({ loading: false, error: msg });
            return { success: false, error: msg };
        }
    },

    revertDeposit: async (transactionId) => {
        try {
            set({ loading: true, error: null });
            const response = await revertDepositRequest(transactionId);
            
            if (response.status === 200 || response.data?.success) {
                set((state) => ({
                    deposits: state.deposits.filter(deposit => (deposit._id || deposit.id) !== transactionId),
                    loading: false
                }));
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            const msg = error.response?.data?.message || "Error al revertir o tiempo expirado";
            set({ loading: false, error: msg });
            return { success: false, error: msg };
        }
    }
}));