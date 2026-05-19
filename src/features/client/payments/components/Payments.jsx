import { useState, useEffect } from 'react';
import { usePayments } from '../hooks/usePayments';

const ConfirmPayModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-[var(--color-space-bg)] bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-[var(--color-deep-purple)] p-6 rounded-xl border border-[var(--color-gradient-mid)] max-w-sm w-full shadow-[0_0_20px_rgba(123,47,190,0.2)]">
                <h3 className="text-xl font-bold text-[var(--color-text-dark-primary)] mb-4">¿Confirmar el pago?</h3>
                <p className="text-[var(--color-text-dark-secondary)] mb-6 text-sm">Se debitará el monto de tu cuenta y el servicio se dará de baja hasta que lo vuelvas a adquirir. ¿Deseas continuar?</p>
                <div className="flex gap-4 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[var(--color-text-dark-secondary)] hover:text-white transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-mid)] text-white font-bold rounded-lg hover:brightness-110 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Procesando...' : 'Pagar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Payments = () => {
    const { myProducts, loading, loadMyProducts, handlePay } = usePayments();
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        loadMyProducts();
    }, []);

    const confirmPayment = async () => {
        if (selectedProductId) {
            await handlePay(selectedProductId);
            setSelectedProductId(null);
        }
    };

    return (
        <div className="p-6 animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-[var(--color-fuchsia-vivid)] uppercase italic tracking-wider">
                    Mis Pagos
                </h1>
                <p className="text-purple-400/50 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                    Gestión de productos adquiridos
                </p>
            </div>

            {loading && myProducts.length === 0 ? (
                <p className="text-[var(--color-text-dark-secondary)]">Cargando tus productos...</p>
            ) : myProducts.length === 0 ? (
                <p className="text-[var(--color-text-dark-tertiary)] bg-[var(--color-surface-dark)] p-4 rounded-lg inline-block border border-[var(--color-surface-border)]">
                    No tienes productos activos para pagar. Ve al catálogo.
                </p>
            ) : (
                <div className="flex flex-wrap gap-6">
                    {myProducts.map((product) => (
                        <div key={product._id} className="bg-[var(--color-deep-purple)] p-6 rounded-2xl border border-[var(--color-surface-border)] w-80 shadow-lg flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase mb-1">{product.name}</h3>
                                <p className="text-[var(--color-cyan-deep)] text-xs font-bold uppercase tracking-widest mb-4">Compra Realizada</p>

                                <div className="flex justify-between items-end mb-6 mt-4 pt-4 border-t border-[var(--color-surface-border)]">
                                    <div>
                                        <p className="text-[var(--color-text-dark-tertiary)] text-[10px] uppercase font-bold tracking-widest mb-1">Cuota a Pagar</p>
                                        <p className="text-[var(--color-cyan-vivid)] font-black text-2xl">Q {product.price}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedProductId(product._id)}
                                disabled={loading}
                                className="mt-4 bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-mid)] text-white font-bold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(216,27,96,0.3)] cursor-pointer"
                            >
                                Pagar Ahora
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmPayModal
                isOpen={!!selectedProductId}
                onClose={() => setSelectedProductId(null)}
                onConfirm={confirmPayment}
                loading={loading}
            />
        </div>
    );
};