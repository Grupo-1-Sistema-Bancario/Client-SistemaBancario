import { useState, useEffect } from 'react';
import { useDeposits } from '../hooks/useDeposits';

const ConfirmRevertModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-black/90 border border-purple-900/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-fuchsia-500 mb-4">
                    ¿Revertir este depósito?
                </h3>
                <p className="text-purple-300/70 mb-8 text-sm">
                    Esta acción es irreversible y solo es válida dentro del tiempo límite establecido.
                </p>
                <div className="flex gap-4 justify-end">
                    <button 
                        onClick={onClose} 
                        className="flex-1 px-4 py-2 rounded-lg border border-purple-900/50 text-purple-400 font-semibold hover:bg-purple-900/20 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Revirtiendo...' : 'Confirmar'}
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
        <div className="min-h-full p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-black uppercase italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                    Revertir Depósitos
                </h1>
                <p className="text-cyan-400/50 uppercase tracking-[0.4em] text-xs mt-3 font-mono">
                    Historial de transacciones de bóveda
                </p>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-purple-900/30 rounded-2xl p-6 animate-fadeIn">
                <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {deposits.length === 0 ? (
                        <p className="text-purple-300/50 text-center py-8 font-mono text-sm uppercase tracking-widest">
                            No hay depósitos recientes para revertir.
                        </p>
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
                                <div key={id} className="bg-purple-950/20 border border-purple-900/30 p-5 rounded-xl flex justify-between items-center hover:bg-purple-900/10 transition-colors">
                                    <div>
                                        <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-1">Cuenta Destino</p>
                                        <p className="text-cyan-400 font-mono font-bold text-lg mb-2">{accountDest}</p>
                                        
                                        <div className="flex items-center gap-4">
                                            <p className="text-fuchsia-400 font-mono font-bold">Q{deposit.amount?.toFixed(2) || deposit.amount}</p>
                                            {deposit.description && (
                                                <p className="text-purple-300/70 text-sm border-l border-purple-900/50 pl-4">{deposit.description}</p>
                                            )}
                                        </div>
                                        <p className="text-purple-400/50 text-xs mt-3 font-mono">{displayDate}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedId(id)}
                                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all cursor-pointer"
                                    >
                                        Revertir
                                    </button>
                                </div>
                            )
                        })
                    )}
                </div>
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