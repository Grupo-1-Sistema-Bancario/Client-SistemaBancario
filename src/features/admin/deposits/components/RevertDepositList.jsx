import { useState, useEffect } from 'react';
import { useDeposits } from '../hooks/useDeposits';

const ConfirmRevertModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-[var(--color-space-bg)] bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-[var(--color-deep-purple)] p-6 rounded-xl border border-red-500 max-w-sm w-full shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                <h3 className="text-xl font-bold text-[var(--color-text-dark-primary)] mb-4">¿Revertir este depósito?</h3>
                <p className="text-[var(--color-text-dark-secondary)] mb-6 text-sm">Esta acción es irreversible y solo es válida dentro del tiempo límite establecido.</p>
                <div className="flex gap-4 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-[var(--color-text-dark-secondary)] hover:text-white transition-colors cursor-pointer">Cancelar</button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Revirtiendo...' : 'Confirmar Reversión'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const RevertDepositList = () => {
    const { deposits, fetchDeposits, handleRevertDeposit, loading } = useDeposits();
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchDeposits();
    }, []);

    const confirmRevert = async () => {
        if (selectedId) {
            await handleRevertDeposit(selectedId);
            setSelectedId(null);
        }
    };

    return (
        <div className="p-6 bg-[var(--color-deep-purple)] rounded-xl shadow-lg border border-[var(--color-surface-border)] animate-fadeIn">
            <h2 className="text-2xl font-bold text-[var(--color-fuchsia-vivid)] mb-6">Revertir Depósitos</h2>

            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {deposits.length === 0 ? (
                    <p className="text-[var(--color-text-dark-tertiary)] text-center py-8">No hay depósitos recientes para revertir.</p>
                ) : (
                    deposits.map((deposit) => {
                        const id = deposit._id || deposit.id;
                        
                        const accountData = deposit.accountNumberTo || deposit.accountTo;
                        const accountDest = typeof accountData === 'object' && accountData !== null 
                            ? accountData.accountNumber 
                            : (accountData || "Desconocida");
                        
                        const rawDate = deposit.date || deposit.createdAt;
                        const displayDate = rawDate 
                            ? new Date(rawDate).toLocaleString(undefined, {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              }) 
                            : "Fecha no disponible";
                        
                        return (
                            <div key={id} className="bg-[var(--color-surface-dark)] p-4 rounded-lg border border-[var(--color-surface-border)] flex justify-between items-center hover:border-[var(--color-text-dark-tertiary)] transition-colors">
                                <div>
                                    <p className="text-[var(--color-text-dark-primary)] font-bold">Cuenta: <span className="text-[var(--color-text-dark-secondary)] font-mono">{accountDest}</span></p>
                                    <p className="text-[var(--color-cyan-vivid)] text-xl font-semibold">Q{deposit.amount}</p>
                                    {deposit.description && <p className="text-[var(--color-text-dark-tertiary)] text-sm italic">{deposit.description}</p>}
                                    <p className="text-[var(--color-text-dark-tertiary)] text-xs mt-1">{displayDate}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedId(id)}
                                    className="bg-transparent border border-red-500 text-red-400 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                                >
                                    Revertir
                                </button>
                            </div>
                        )
                    })
                )}
            </div>

            <ConfirmRevertModal
                isOpen={!!selectedId}
                onClose={() => setSelectedId(null)}
                onConfirm={confirmRevert}
                loading={loading}
            />
        </div>
    );
};