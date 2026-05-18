import { useFavoriteStore } from '../store/useFavoriteStore';
import { showError, showSuccess } from '../../../../shared/utils/toast';

export const useFavorites = () => {
    const {
        favorites,
        loading,
        isCreateModalOpen,
        openCreateModal,
        closeCreateModal,
        fetchFavorites,
        addFavorite,
        updateFavoriteAlias,
        removeFavorite,
        transferToFavorite,
    } = useFavoriteStore();

    const loadFavorites = async () => {
        const result = await fetchFavorites();
        if (!result.success) {
            showError(result.error);
        }
    };

    const handleAddFavorite = async (favoriteData, onSuccess) => {
        const result = await addFavorite(favoriteData);
        if (result.success) {
            showSuccess('Favorito agregado correctamente');
            if (onSuccess) onSuccess();
        } else {
            showError(result.error);
        }
    };

    const handleUpdateAlias = async (favoriteId, alias, onSuccess) => {
        const result = await updateFavoriteAlias(favoriteId, alias);
        if (result.success) {
            showSuccess('Alias actualizado');
            if (onSuccess) onSuccess();
        } else {
            showError(result.error);
        }
    };

    const handleRemoveFavorite = async (favoriteId) => {
        const result = await removeFavorite(favoriteId);
        if (result.success) {
            showSuccess('Favorito eliminado');
        } else {
            showError(result.error);
        }
    };

    const handleTransferToFavorite = async (favorite, transferData, onSuccess) => {
        const result = await transferToFavorite({
            accountNumberTo: favorite.favoriteAccountNumber,
            amount: Number(transferData.amount),
            description: transferData.description || `Transferencia a ${favorite.alias || 'favorito'}`,
        });

        if (result.success) {
            showSuccess('Transferencia realizada exitosamente');
            if (onSuccess) onSuccess();
        } else {
            showError(result.error);
        }
    };

    return {
        favorites,
        loading,
        isCreateModalOpen,
        openCreateModal,
        closeCreateModal,
        loadFavorites,
        handleAddFavorite,
        handleUpdateAlias,
        handleRemoveFavorite,
        handleTransferToFavorite,
    };
};
