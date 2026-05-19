import { useEffect } from 'react';
import { useMyTransactions } from '../hooks/useMyTransactions';

export const MyTransactions = () => {
    const { transactions, loading, loadTransactions } = useMyTransactions();

    useEffect(() => {
        loadTransactions();
    }, []);

    return (
        <div className="p-6 animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-[var(--color-fuchsia-vivid)] uppercase italic tracking-wider">
                    Historial de Transacciones
                </h1>
                <p className="text-purple-400/50 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                    Astra Bank Activity Tracker
                </p>
            </div>

            {loading && transactions.length === 0 ? (
                <div className='rounded-xl border border-dashed border-[var(--color-surface-border)] p-8 text-center bg-[var(--color-deep-purple)]/40'>
                    <p className="text-[var(--color-text-dark-secondary)] mb-4">Cargando tu historial...</p>
                </div>
            ) : transactions.length === 0 ? (
                <div className='rounded-xl border border-dashed border-[var(--color-surface-border)] p-8 text-center bg-[var(--color-deep-purple)]/40'>
                    <p className="text-[var(--color-text-dark-secondary)] mb-4">Aún no tienes transacciones registradas.</p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-6">
                    {transactions.map((tx) => (
                        <div key={tx._id} className="bg-[var(--color-deep-purple)] p-6 rounded-2xl border border-[var(--color-surface-border)] w-80 shadow-lg flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-black text-white uppercase mb-1">{tx.type}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border ${
                                        tx.status === 'REVERSED'
                                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                                    }`}>
                                        {tx.status || 'COMPLETED'}
                                    </span>
                                </div>
                                <p className="text-[var(--color-cyan-deep)] text-xs font-bold uppercase tracking-widest mb-4">
                                    {new Date(tx.date || tx.createdAt).toLocaleString()}
                                </p>

                                <p className="text-[var(--color-text-dark-tertiary)] text-[10px] uppercase font-bold tracking-widest mb-1">Detalle</p>
                                <p className="text-[var(--color-text-dark-secondary)] text-sm mb-6 line-clamp-2 h-10">
                                    {tx.description || "Transacción procesada correctamente"}
                                </p>

                                <div className="flex justify-between items-end border-t border-[var(--color-surface-border)] pt-4">
                                    <div>
                                        <p className="text-[var(--color-text-dark-tertiary)] text-[10px] uppercase font-bold tracking-widest mb-1">Ref ID</p>
                                        <p className="text-white/50 font-mono text-xs">{tx._id?.substring(0, 8)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[var(--color-text-dark-tertiary)] text-[10px] uppercase font-bold tracking-widest mb-1">Monto</p>
                                        <p className="text-[var(--color-fuchsia-vivid)] font-black text-2xl">Q {tx.amount?.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};