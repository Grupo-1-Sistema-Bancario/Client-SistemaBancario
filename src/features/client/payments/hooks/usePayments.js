import { usePaymentStore } from '../store/usePaymentStore';
import { showSuccess, showError } from '../../../../shared/utils/toast';

export const usePayments = () => {
    const { myProducts, loading, fetchMyProducts, payProduct } = usePaymentStore();

    const loadMyProducts = async () => {
        await fetchMyProducts();
    };

    const handlePay = async (productId) => {
        const paymentData = {
            type: "PAYMENT",
            product: productId,
            usePoints: false 
        };

        const result = await payProduct(paymentData);
        if (result.success) {
            showSuccess("Pago realizado exitosamente");
            await fetchMyProducts(); 
        } else {
            showError(result.error);
        }
    };

    return { myProducts, loading, loadMyProducts, handlePay };
};