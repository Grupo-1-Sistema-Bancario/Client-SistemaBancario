import { useEffect, useState } from "react";
import { useTransactionsStore } from "../store/useTransactionsStore";

export const TransactionsHistoryPage = () => {
    const { transactions, loading, error, getTransactions } = useTransactionsStore();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getTransactions();
    }, []);

    const filteredTransactions = transactions.filter(tx =>
        tx._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.accountOrigin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.accountDestination?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && transactions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(circle_at_top,#1A1038,#05010D)]">
                <div className="text-cyan-400 text-xl font-mono animate-pulse">Cargando transacciones...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-[radial-gradient(circle_at_top,#1A1038,#05010D)] animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-4xl font-black uppercase italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                    Auditoría de Transacciones
                </h1>
                <p className="text-cyan-400/50 uppercase tracking-[0.4em] text-xs mt-3 font-mono">
                    {filteredTransactions.length} de {transactions.length} registros
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                    {error}
                </div>
            )}

            <div className="mb-8 relative">
                <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400/50"
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder="Buscar por ID, tipo, descripción o número de cuenta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/40 border border-purple-900/30 rounded-xl px-4 py-3 pl-12 text-white placeholder-purple-400/50 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-purple-900/30 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-purple-900/30 bg-purple-950/20">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">ID Transacción</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Fecha</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Tipo</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Descripción</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Monto</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-cyan-400">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((tx) => (
                                <tr key={tx._id} className="border-b border-purple-900/20 hover:bg-purple-900/10 transition-colors">
                                    <td className="px-6 py-4 text-sm text-cyan-400 font-mono font-semibold">
                                        {tx._id?.substring(0, 10)}...
                                    </td>
                                    <td className="px-6 py-4 text-sm text-purple-300">
                                        {new Date(tx.date || tx.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white font-bold uppercase">
                                        {tx.type}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white">
                                        {tx.description || "Sin descripción"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-fuchsia-400 font-mono font-bold">
                                        Q {tx.amount?.toFixed(2) || "0.00"}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                            tx.status === 'REVERSED' 
                                                ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                                                : 'bg-green-500/20 text-green-400 border-green-500/30'
                                        }`}>
                                            {tx.status || 'COMPLETED'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};