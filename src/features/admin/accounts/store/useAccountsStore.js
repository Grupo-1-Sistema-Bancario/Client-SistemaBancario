import { create } from "zustand";

import {
    getAccountsRequest
} from "../../../../shared/api/admin";

export const useAccountsStore = create((set) => ({

    accounts: [],
    loading: false,
    error: null,

    getAccounts: async () => {

        try {

            set({
                loading: true,
                error: null
            });

            const response = await getAccountsRequest();

            set({
                accounts: response.data.data || [],
                loading: false
            });

        } catch (error) {

            console.log(error);

            set({
                loading: false,
                error: "Error al obtener cuentas"
            });

        }

    }

}));
