import { create } from "zustand";

import {
  getProductsRequest,
  createProductRequest,
  updateProductRequest,
  changeProductStatusRequest,
} from "../../../shared/api/product";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  getProducts: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await getProductsRequest();

      console.log(response.data);

      set({
        products: response.data.data || [],
        loading: false,
      });
    } catch (error) {
      console.log(error);

      set({
        products: [],
        loading: false,
        error: "Error al obtener productos",
      });
    }
  },

  createProduct: async (data) => {
    try {
      set({
        loading: true,
      });

      const response = await createProductRequest(data);

      set({
        products: [response.data.data, ...get().products],
        loading: false,
      });

      return {
        success: true,
      };
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Error al crear producto",
      });

      return {
        success: false,
      };
    }
  },

  updateProduct: async (id, data) => {
    try {
      set({
        loading: true,
      });

      const response = await updateProductRequest(id, data);

      set({
        products: get().products.map((product) =>
          product._id === id ? response.data.data : product,
        ),
        loading: false,
      });

      return {
        success: true,
      };
    } catch (error) {
      set({
        loading: false,
        error: "Error al actualizar producto",
      });

      return {
        success: false,
      };
    }
  },

  toggleProductStatus: async (id, isActive) => {
    try {
      set({
        loading: true,
      });

      const response = await changeProductStatusRequest(id, isActive);

      set({
        products: get().products.map((product) =>
          product._id === id ? response.data.data : product,
        ),
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: "Error al cambiar estado",
      });
    }
  },
}));
