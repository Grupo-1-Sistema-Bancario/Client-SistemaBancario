import { create } from 'zustand';
import { getActiveProductsRequest, acquireProductRequest } from '../../../../shared/api/admin';

export const useCatalogStore = create((set) => ({
    products: [],
    loading: false,

    fetchCatalog: async () => {
        try {
            set({ loading: true });
            const response = await getActiveProductsRequest();
            set({ products: response.data.data || [], loading: false });
        } catch (error) {
            set({ loading: false });
            console.error("Error al cargar catálogo", error);
        }
    },

    acquireProduct: async (productId) => {
        try {
            set({ loading: true });
            await acquireProductRequest(productId);
            set({ loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false });
            return { success: false, error: error.response?.data?.message || "Error al comprar" };
        }
    }
}));