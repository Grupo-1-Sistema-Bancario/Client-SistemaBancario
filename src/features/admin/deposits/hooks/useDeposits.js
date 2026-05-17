import { useDepositStore } from '../store/useDepositStore';
import { showSuccess, showError } from '../../../../shared/utils/toast';

export const useDeposits = () => {
    const { deposits, loading, getDeposits, makeDeposit, revertDeposit } = useDepositStore();

    const fetchDeposits = async () => {
        await getDeposits();
    };

    const handleMakeDeposit = async (formData, onSuccess) => {
        const depositData = {
            accountNumberTo: formData.accountNumberTo,
            type: "DEPOSIT",
            amount: Number(formData.amount),
            description: formData.description || "Sin descripción"
        };

        const result = await makeDeposit(depositData);
        if (result.success) {
            showSuccess("Depósito realizado con éxito");
            if (onSuccess) onSuccess();
        } else {
            showError(result.error);
        }
    };

    const handleRevertDeposit = async (transactionId) => {
        const result = await revertDeposit(transactionId);
        if (result.success) {
            showSuccess("Depósito revertido exitosamente");
        } else {
            showError(result.error || "Error al revertir el depósito");
        }
    };

    return {
        loading,
        deposits,
        fetchDeposits,
        handleMakeDeposit,
        handleRevertDeposit
    };
};