import { create } from "zustand";
import { getProductsWithCurrenciesRequest } from "../../../../shared/api/admin.js";

export const useProductsStore = create((set) => ({
    products: [],
    loading: false,

    fetchProductsWithCurrencies: async () => {
        try {
            set({ loading: true });
            const response = await getProductsWithCurrenciesRequest();
            // Tu backend responde con: { success: true, data: [ ... ], pagination: { ... } }
            set({ products: response.data.data || [], loading: false });
        } catch (error) {
            console.error("Error al cargar productos con divisas", error);
            set({ loading: false });
        }
    }
}));