import { useState } from 'react';
import { useTransfers } from '../hooks/useTransfers';
import { useAuthStore } from '../../../../features/auth/store/useAuthStore';
import MobileScreenHeader from '../../../../shared/components/layout/MobileScreenHeader.jsx';

export const TransferForm = () => {
    const { handleTransfer, loading } = useTransfers();
    const { user } = useAuthStore();

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

        handleTransfer(formData, () => setFormData({ accountNumberTo: '', amount: '', description: '' }));
    };

    return (
        <div className="p-0 md:p-6 animate-fadeIn">
            <MobileScreenHeader
                title="Transferencias"
                subtitle="Movimiento seguro entre cuentas"
            />
            <div className="mb-8 hidden md:block">
                <h1 className="text-4xl font-black text-[var(--color-fuchsia-vivid)] uppercase italic tracking-wider">
                    Transferencias
                </h1>
                <p className="text-purple-400/50 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                    Movimiento seguro entre cuentas
                </p>
            </div>

            <div className="w-full">
                <section className="w-full rounded-2xl border border-[var(--color-surface-border)] bg-[linear-gradient(145deg,#120A24_0%,#25154D_55%,#3D1E71_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.35)] overflow-hidden">
                    <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-black text-[var(--color-text-dark-primary)] uppercase">Nueva transferencia</h2>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-[var(--color-fuchsia-vivid)]/20 border border-[var(--color-fuchsia-vivid)]/40 flex items-center justify-center text-[var(--color-fuchsia-vivid)] text-xl font-black">
                            ↗
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="p-6 space-y-5">
                        <div className="rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-space-bg)]/70 p-4 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-mid)] flex items-center justify-center text-white font-black shadow-[0_0_18px_rgba(216,27,96,0.28)]">
                                A
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text-dark-tertiary)]">Cuenta de origen</p>
                                <p className="text-[var(--color-text-dark-primary)] font-semibold truncate">
                                    {user?.accountNumber || user?.username || user?.email || 'Cuenta vinculada automáticamente'}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="text-[var(--color-text-dark-secondary)] mb-2 block font-medium">Número de Cuenta Destino</label>
                                <input
                                    type="number"
                                    required
                                    maxLength={8}
                                    pattern="\d{8}"
                                    className="w-full p-3.5 bg-[var(--color-space-bg)] text-[var(--color-text-dark-primary)] rounded-xl border border-[var(--color-surface-border)] focus:border-[var(--color-fuchsia-vivid)] focus:ring-1 focus:ring-[var(--color-fuchsia-vivid)] outline-none transition-all font-mono"
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
                                <label className="text-[var(--color-text-dark-secondary)] mb-2 block font-medium">Monto (Q)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    step="0.01"
                                    className="w-full p-3.5 bg-[var(--color-space-bg)] text-[var(--color-text-dark-primary)] rounded-xl border border-[var(--color-surface-border)] focus:border-[var(--color-fuchsia-vivid)] focus:ring-1 focus:ring-[var(--color-fuchsia-vivid)] outline-none transition-all font-mono"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-[var(--color-text-dark-secondary)] mb-2 block font-medium">Descripción (Opcional)</label>
                                <input
                                    type="text"
                                    className="w-full p-3.5 bg-[var(--color-space-bg)] text-[var(--color-text-dark-primary)] rounded-xl border border-[var(--color-surface-border)] focus:border-[var(--color-fuchsia-vivid)] focus:ring-1 focus:ring-[var(--color-fuchsia-vivid)] outline-none transition-all"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Motivo de la transferencia"
                                />
                            </div>
                        </div>

                        <div className="rounded-xl border border-[var(--color-surface-border)] bg-[linear-gradient(135deg,rgba(216,27,96,0.14),rgba(123,47,190,0.18))] p-4">
                            <p className="text-sm font-bold text-white uppercase mb-2">Antes de enviar</p>
                            <p className="text-sm text-[var(--color-text-dark-secondary)] leading-relaxed">
                                Verifica el número de cuenta, el monto y la descripción. La transferencia se procesará de inmediato y no se podrá revertir.
                            </p>
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
                            className="w-full mt-2 bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-mid)] text-white font-bold py-3.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(216,27,96,0.3)] cursor-pointer"
                        >
                            {loading ? 'Procesando...' : 'Transferir Fondos'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};