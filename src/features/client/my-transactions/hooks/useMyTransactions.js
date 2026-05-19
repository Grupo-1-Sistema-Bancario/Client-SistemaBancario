import { useMyTransactionsStore } from '../store/useMyTransactionsStore';

export const useMyTransactions = () => {
    const { transactions, loading, fetchMyTransactions } = useMyTransactionsStore();

    const loadTransactions = async () => {
        await fetchMyTransactions();
    };

    return { transactions, loading, loadTransactions };
};