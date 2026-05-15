import { create } from "zustand";
import {
    createProductRequest,
    getProductsRequest,
    updateProductRequest,
    changeProductStatusRequest
} from "../../../shared/api/product";

export const useProductStore = create((set, get) => ({

    products: [],
    loading: false,
    error: null,

    getProducts: async () => {
        try {
            set({ loading: true });

            const response = await getProductsRequest();

            set({
                products: response.data.products || [],
                loading: false
            });

        } catch (error) {
            set({
                error: "Error al obtener productos",
                loading: false
            });
        }
    },

    createProduct: async (data) => {
        try {
            set({ loading: true });

            const response = await createProductRequest(data);

            set({
                products: [...get().products, response.data.product],
                loading: false
            });

            return { success: true };

        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al crear producto"
            });

            return { success: false };
        }
    },

    updateProduct: async (id, data) => {
        try {
            set({ loading: true });

            const response = await updateProductRequest(id, data);

            set({
                products: get().products.map(product =>
                    product._id === id ? response.data.product : product
                ),
                loading: false
            });

            return { success: true };

        } catch (error) {
            set({
                loading: false,
                error: "Error al actualizar"
            });

            return { success: false };
        }
    },

    toggleProductStatus: async (id, isActive) => {
        try {
            set({ loading: true });

            await changeProductStatusRequest(id, isActive);

            set({
                products: get().products.map(product =>
                    product._id === id
                        ? { ...product, isActive: !isActive }
                        : product
                ),
                loading: false
            });

        } catch (error) {
            set({
                loading: false,
                error: "Error al cambiar estado"
            });
        }
    }

}));