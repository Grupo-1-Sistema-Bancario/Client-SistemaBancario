import { create } from 'zustand';
import {
    getFavoritesRequest,
    addFavoriteRequest,
    updateFavoriteAliasRequest,
    removeFavoriteRequest,
    makeTransferRequest,
} from '../../../../shared/api/admin';

export const useFavoriteStore = create((set) => ({
    favorites: [],
    loading: false,
    error: null,
    isCreateModalOpen: false,

    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),

    fetchFavorites: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getFavoritesRequest();
            set({ favorites: response.data?.data || [], loading: false });
            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al cargar favoritos';
            set({ loading: false, error: msg });
            return { success: false, error: msg };
        }
    },

    addFavorite: async (favoriteData) => {
        try {
            set({ loading: true, error: null });
            const response = await addFavoriteRequest(favoriteData);
            const newFavorite = response.data?.data;

            set((state) => ({
                favorites: newFavorite ? [newFavorite, ...state.favorites] : state.favorites,
                loading: false,
            }));

            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al agregar favorito';
            set({ loading: false, error: msg });
            return { success: false, error: msg };
        }
    },

    updateFavoriteAlias: async (favoriteId, alias) => {
        try {
            set({ loading: true, error: null });
            const response = await updateFavoriteAliasRequest(favoriteId, alias);
            const updated = response.data?.data;

            set((state) => ({
                favorites: state.favorites.map((fav) =>
                    fav._id === favoriteId ? { ...fav, alias: updated?.alias ?? alias } : fav
                ),
                loading: false,
            }));

            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al actualizar alias';
            set({ loading: false, error: msg });
            return { success: false, error: msg };
        }
    },

    removeFavorite: async (favoriteId) => {
        try {
            set({ loading: true, error: null });
            await removeFavoriteRequest(favoriteId);

            set((state) => ({
                favorites: state.favorites.filter((fav) => fav._id !== favoriteId),
                loading: false,
            }));

            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al eliminar favorito';
            set({ loading: false, error: msg });
            return { success: false, error: msg };
        }
    },

    transferToFavorite: async ({ accountNumberTo, amount, description }) => {
        try {
            set({ loading: true, error: null });
            await makeTransferRequest({
                accountNumberTo,
                type: 'TRANSFER',
                amount,
                description,
            });
            set({ loading: false });
            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al transferir al favorito';
            set({ loading: false, error: msg });
            return { success: false, error: msg };
        }
    },
}));
