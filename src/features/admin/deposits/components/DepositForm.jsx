import { useState } from 'react';
import { useDeposits } from '../hooks/useDeposits';

export const DepositForm = () => {
    const { handleMakeDeposit, loading } = useDeposits();
    const [formData, setFormData] = useState({ accountNumberTo: '', amount: '', description: '' });
    const [validationError, setValidationError] = useState("");

    const validateForm = () => {
        if (!/^\d{10}$/.test(formData.accountNumberTo || "")) {
            setValidationError("El número de cuenta debe tener exactamente 10 dígitos.");
            return false;
        }

        if (Number(formData.amount) < 0) {
            setValidationError("El monto del depósito no puede ser negativo.");
            return false;
        }

        if (Number(formData.amount) > 2000) {
            setValidationError("El monto del depósito no puede exceder de Q2000.");
            return false;
        }

        setValidationError("");
        return true;
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        handleMakeDeposit(formData, () =>
            setFormData({
                accountNumberTo: '',
                amount: '',
                description: ''
            })
        );
    };

    return (
        <div className="min-h-full p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-black uppercase italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                    Realizar Depósito
                </h1>
                <p className="text-cyan-400/50 uppercase tracking-[0.4em] text-xs mt-3 font-mono">
                    Operación de Bóveda
                </p>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-purple-900/30 rounded-2xl p-6 animate-fadeIn">
                <form onSubmit={onSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-cyan-400 mb-2 uppercase tracking-wider">
                            Número de Cuenta Destino
                        </label>
                        <input
                            type="number"
                            required
                            maxLength={8}
                            pattern="\d{8}"
                            className="w-full bg-black/40 border border-purple-900/30 rounded-xl px-4 py-3 text-white placeholder-purple-400/50 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
                            placeholder="Ej. 0000000000"
                            value={formData.accountNumberTo}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                if (value.length <= 10) {
                                    setFormData({
                                        ...formData,
                                        accountNumberTo: e.target.value
                                    })
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-cyan-400 mb-2 uppercase tracking-wider">
                            Monto (Q)
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            step="0.01"
                            className="w-full bg-black/40 border border-purple-900/30 rounded-xl px-4 py-3 text-white placeholder-purple-400/50 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-cyan-400 mb-2 uppercase tracking-wider">
                            Descripción (Opcional)
                        </label>
                        <input
                            type="text"
                            className="w-full bg-black/40 border border-purple-900/30 rounded-xl px-4 py-3 text-white placeholder-purple-400/50 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                            placeholder="Motivo del depósito"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    {validationError && (
                        <div className="
                                    mb-6
                                    p-3
                                    rounded-lg
                                    bg-red-500/20
                                    border
                                    border-red-500/50
                                    text-red-400
                                    text-sm
                                ">
                            {validationError}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,191,165,0.3)]"
                    >
                        {loading ? 'Procesando...' : 'Depositar Fondos'}
                    </button>
                </form>
            </div>
        </div>
    );
};