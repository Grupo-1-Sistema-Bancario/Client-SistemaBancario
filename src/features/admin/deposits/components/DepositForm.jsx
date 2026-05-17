import { useState } from 'react';
import { useDeposits } from '../hooks/useDeposits';

export const DepositForm = () => {
    const { handleMakeDeposit, loading } = useDeposits();
    const [formData, setFormData] = useState({ accountNumberTo: '', amount: '', description: '' });

    const onSubmit = (e) => {
        e.preventDefault();
        handleMakeDeposit(formData, () => setFormData({ accountNumberTo: '', amount: '', description: '' }));
    };

    return (
        <div className="p-6 bg-[var(--color-deep-purple)] rounded-xl shadow-lg border border-[var(--color-surface-border)] max-w-2xl mx-auto animate-fadeIn">
            <h2 className="text-2xl font-bold text-[var(--color-fuchsia-vivid)] mb-6">Realizar Depósito</h2>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="text-[var(--color-text-dark-secondary)] mb-2 block font-medium">Número de Cuenta Destino</label>
                    <input
                        type="number"
                        required
                        className="w-full p-3 bg-[var(--color-space-bg)] text-[var(--color-text-dark-primary)] rounded-lg border border-[var(--color-surface-border)] focus:border-[var(--color-fuchsia-vivid)] focus:ring-1 focus:ring-[var(--color-fuchsia-vivid)] outline-none transition-all font-mono"
                        value={formData.accountNumberTo}
                        onChange={(e) => setFormData({ ...formData, accountNumberTo: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-[var(--color-text-dark-secondary)] mb-2 block font-medium">Monto (Q)</label>
                    <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        className="w-full p-3 bg-[var(--color-space-bg)] text-[var(--color-text-dark-primary)] rounded-lg border border-[var(--color-surface-border)] focus:border-[var(--color-fuchsia-vivid)] focus:ring-1 focus:ring-[var(--color-fuchsia-vivid)] outline-none transition-all font-mono"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-[var(--color-text-dark-secondary)] mb-2 block font-medium">Descripción (Opcional)</label>
                    <input
                        type="text"
                        className="w-full p-3 bg-[var(--color-space-bg)] text-[var(--color-text-dark-primary)] rounded-lg border border-[var(--color-surface-border)] focus:border-[var(--color-fuchsia-vivid)] focus:ring-1 focus:ring-[var(--color-fuchsia-vivid)] outline-none transition-all"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-mid)] text-white font-bold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(216,27,96,0.3)] cursor-pointer"
                >
                    {loading ? 'Procesando...' : 'Depositar Fondos'}
                </button>
            </form>
        </div>
    );
};