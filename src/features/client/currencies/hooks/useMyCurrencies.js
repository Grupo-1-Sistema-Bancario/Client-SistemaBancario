import { useMyCurrenciesStore } from '../store/useMyCurrenciesStore';

export const useMyCurrencies = () => {
    const { balances, loading, fetchMyCurrencies } = useMyCurrenciesStore();

    const loadCurrencies = async () => {
        await fetchMyCurrencies();
    };

    return { balances, loading, loadCurrencies };
};