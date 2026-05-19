import { useTransferStore } from '../store/useTransferStore';
import { showSuccess, showError } from '../../../../shared/utils/toast';

export const useTransfers = () => {
    const { loading, makeTransfer } = useTransferStore();

    const handleTransfer = async (formData, onSuccess) => {
        const transferData = {
            accountNumberTo: formData.accountNumberTo,
            type: "TRANSFER",
            amount: Number(formData.amount),
            description: formData.description || "Sin descripción"
        };

        const result = await makeTransfer(transferData);
        if (result.success) {
            showSuccess("Transferencia realizada exitosamente");
            if (onSuccess) onSuccess();
        } else {
            showError(result.error);
        }
    };

    return {
        loading,
        handleTransfer
    };
};