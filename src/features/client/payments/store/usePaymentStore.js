import { create } from 'zustand';
import { getMyProductsRequest, makePaymentRequest } from '../../../../shared/api/admin';

export const usePaymentStore = create((set) => ({
    myProducts: [],
    loyaltyPoints: 0, 
    loading: false,

    fetchMyProducts: async () => {
        try {
            set({ loading: true });
            const response = await getMyProductsRequest();
            set({ 
                myProducts: response.data.data || [], 
                loyaltyPoints: response.data.loyaltyPoints || 0,
                loading: false 
            });
        } catch (error) {
            set({ loading: false });
            console.error("Error al cargar mis productos", error);
        }
    },

    payProduct: async (paymentData) => {
        try {
            set({ loading: true });
            await makePaymentRequest(paymentData);
            set({ loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false });
            return { success: false, error: error.response?.data?.message || "Error al procesar el pago" };
        }
    }
}));