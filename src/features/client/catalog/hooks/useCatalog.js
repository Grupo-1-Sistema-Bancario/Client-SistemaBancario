import { useCatalogStore } from '../store/useCatalogStore';
import { showSuccess, showError } from '../../../../shared/utils/toast';

export const useCatalog = () => {
    const { products, loading, fetchCatalog, acquireProduct } = useCatalogStore();

    const loadCatalog = async () => {
        await fetchCatalog();
    };

    const handleBuy = async (productId) => {
        const result = await acquireProduct(productId);
        if (result.success) {
            showSuccess("Producto adquirido con éxito. Ve a Pagos para administrarlo.");
        } else {
            showError(result.error);
        }
    };

    return { products, loading, loadCatalog, handleBuy };
};