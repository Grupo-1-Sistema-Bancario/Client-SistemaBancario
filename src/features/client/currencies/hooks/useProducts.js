import { useProductsStore } from '../store/useProductsStore';

export const useProducts = () => {
    const { products, loading, fetchProductsWithCurrencies } = useProductsStore();

    const loadProducts = async () => {
        await fetchProductsWithCurrencies();
    };

    return { products, loading, loadProducts };
};