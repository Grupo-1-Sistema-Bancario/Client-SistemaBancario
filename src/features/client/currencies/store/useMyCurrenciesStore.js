import { create } from "zustand";
import { getMyAccountCurrenciesRequest } from "../../../../shared/api/admin.js";

export const useMyCurrenciesStore = create((set) => ({
    balances: null, // Guardará el objeto con las 10 divisas
    loading: false,

    fetchMyCurrencies: async () => {
        try {
            set({ loading: true });
            const response = await getMyAccountCurrenciesRequest();
            // Tu backend responde con: { success: true, data: { balances: { GTQ, USD, ... } } }
            set({ balances: response.data.data.balances || null, loading: false });
        } catch (error) {
            console.error("Error al cargar el balance de divisas", error);
            set({ loading: false });
        }
    }
}));