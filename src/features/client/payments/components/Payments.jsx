import { useState, useEffect } from 'react';
import { usePayments } from '../hooks/usePayments';
import MobileScreenHeader from '../../../../shared/components/layout/MobileScreenHeader.jsx';

const ConfirmPayModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-[var(--color-space-bg)] bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-[var(--color-deep-purple)] p-6 rounded-xl border border-[var(--color-gradient-mid)] max-w-sm w-full shadow-[0_0_20px_rgba(123,47,190,0.2)]">
                <h3 className="text-xl font-bold text-[var(--color-text-dark-primary)] mb-4">¿Confirmar el pago?</h3>
                <p className="text-[var(--color-text-dark-secondary)] mb-6 text-sm">Se debitará el monto de tu cuenta y el servicio se dará de baja hasta que lo vuelvas a adquirir. ¿Deseas continuar?</p>
                <div className="flex gap-4 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-[var(--color-text-dark-secondary)] hover:text-white transition-colors cursor-pointer">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} disabled={loading} className="px-4 py-2 bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-mid)] text-white font-bold rounded-lg hover:brightness-110 transition-colors disabled:opacity-50 cursor-pointer">
                        {loading ? 'Procesando...' : 'Pagar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ConfirmPointsModal = ({ isOpen, onClose, onConfirm, loading, product, points }) => {
    if (!isOpen || !product) return null;

    const coversFull = points >= product.price;
    const remaining = product.price - points;

    return (
        <div className="fixed inset-0 bg-[var(--color-space-bg)] bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-[var(--color-deep-purple)] p-6 rounded-xl border border-[var(--color-gradient-mid)] max-w-sm w-full shadow-[0_0_20px_rgba(123,47,190,0.2)]">
                <h3 className="text-xl font-black text-[var(--color-fuchsia-vivid)] uppercase mb-2">Canjear Puntos</h3>
                <p className="text-[var(--color-text-dark-secondary)] mb-4 text-sm">
                    Tienes un total de <span className="text-[var(--color-cyan-vivid)] font-bold">{points} pts</span>.
                </p>

                {coversFull ? (
                    <p className="text-green-400 text-sm mb-6 font-semibold bg-green-900/20 p-3 rounded-lg border border-green-500/30">
                        ¡Tus puntos cubren la totalidad del pago! El producto será tuyo sin gastar efectivo. ¿Deseas confirmar?
                    </p>
                ) : (
                    <div className="text-yellow-400 text-sm mb-6 font-semibold bg-yellow-900/20 p-3 rounded-lg border border-yellow-500/30">
                        <p className="mb-2">Tus puntos no alcanzan para pagar todo el producto.</p>
                        <p>Se vaciarán tus puntos y se debitarán <span className="text-white font-black">Q {remaining}</span> adicionales de tu cuenta. ¿Deseas continuar?</p>
                    </div>
                )}

                <div className="flex gap-4 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-[var(--color-text-dark-secondary)] hover:text-white transition-colors cursor-pointer">
                        Cancelar
                    </button>
                    <button onClick={() => onConfirm(product._id)} disabled={loading} className="px-4 py-2 bg-[var(--color-fuchsia-vivid)] text-white font-bold rounded-lg hover:brightness-110 transition-colors disabled:opacity-50 cursor-pointer">
                        {loading ? 'Procesando...' : 'Confirmar Canje'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Payments = () => {
    const { myProducts, loyaltyPoints, loading, loadMyProducts, handlePay } = usePayments();
    
    const [selectedProductId, setSelectedProductId] = useState(null); // Modal de pago normal
    const [selectedPointsProduct, setSelectedPointsProduct] = useState(null); // Modal de puntos (guarda todo el objeto para saber el precio)

    useEffect(() => {
        loadMyProducts();
    }, []);

    const confirmPayment = async () => {
        if (selectedProductId) {
            await handlePay(selectedProductId, false);
            setSelectedProductId(null);
        }
    };

    const confirmPointsPayment = async (productId) => {
        await handlePay(productId, true);
        setSelectedPointsProduct(null);
    };

    return (
        <div className="p-0 md:p-6 animate-fadeIn">
            <MobileScreenHeader
                title="Mis Pagos"
                subtitle="Gestión de productos adquiridos"
            />
            <div className="mb-6 md:mb-8">
                <div className="mb-4 hidden md:block">
                    <h1 className="text-4xl font-black text-[var(--color-fuchsia-vivid)] uppercase italic tracking-wider">
                        Mis Pagos
                    </h1>
                    <p className="text-purple-400/50 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        Gestión de productos adquiridos
                    </p>
                </div>
                <div className="flex w-full items-center justify-between rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-space-bg)] px-4 py-3 md:inline-flex md:w-auto md:gap-3">
                    <p className="text-[var(--color-text-dark-secondary)] text-xs font-bold uppercase tracking-widest md:text-sm">
                        Puntos disponibles
                    </p>
                    <span className="text-[var(--color-cyan-vivid)] text-xl font-black">{loyaltyPoints}</span>
                </div>
            </div>

            {loading && myProducts.length === 0 ? (
                <p className="text-[var(--color-text-dark-secondary)]">Cargando tus productos...</p>
            ) : myProducts.length === 0 ? (
                <div className='rounded-xl border border-dashed border-[var(--color-surface-border)] p-8 text-center bg-[var(--color-deep-purple)]/40'>
                    <p className="text-[var(--color-text-dark-secondary)] mb-4">
                        No tienes productos pendientes por pagar. Ve al catálogo.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-6">
                    {myProducts.map((product) => {
                        const pointsEarned = Math.floor(product.price / 10);

                        return (
                            <div key={product._id} className="bg-[var(--color-deep-purple)] p-5 md:p-6 rounded-2xl border border-[var(--color-surface-border)] w-full md:w-80 shadow-lg flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase mb-1">{product.name}</h3>
                                    <p className="text-[var(--color-cyan-deep)] text-xs font-bold uppercase tracking-widest mb-4">
                                        Compra Realizada | +{pointsEarned} Pts
                                    </p>

                                    <div className="flex justify-between items-end mb-6 mt-4 pt-4 border-t border-[var(--color-surface-border)]">
                                        <div>
                                            <p className="text-[var(--color-text-dark-tertiary)] text-[10px] uppercase font-bold tracking-widest mb-1">Cuota a Pagar</p>
                                            <p className="text-[var(--color-cyan-vivid)] font-black text-2xl">Q {product.price}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => setSelectedProductId(product._id)}
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-mid)] text-white text-sm font-bold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(216,27,96,0.3)] cursor-pointer"
                                    >
                                        Pagar Normal
                                    </button>
                                    <button
                                        onClick={() => setSelectedPointsProduct(product)}
                                        disabled={loading || loyaltyPoints === 0}
                                        className={`flex-1 text-sm font-bold py-3 rounded-lg transition-all border border-[var(--color-surface-border)] 
                                            ${loyaltyPoints === 0 
                                                ? 'bg-[var(--color-space-bg)] text-[var(--color-text-dark-secondary)] cursor-not-allowed opacity-80' 
                                                : 'bg-[var(--color-space-bg)] text-[var(--color-fuchsia-vivid)] hover:bg-[var(--color-fuchsia-vivid)] hover:text-white cursor-pointer'
                                            }`}
                                        title={loyaltyPoints === 0 ? "No tienes puntos para canjear" : "Canjear puntos"}
                                    >
                                        Canjear Pts
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmPayModal
                isOpen={!!selectedProductId}
                onClose={() => setSelectedProductId(null)}
                onConfirm={confirmPayment}
                loading={loading}
            />

            <ConfirmPointsModal
                isOpen={!!selectedPointsProduct}
                onClose={() => setSelectedPointsProduct(null)}
                onConfirm={confirmPointsPayment}
                loading={loading}
                product={selectedPointsProduct}
                points={loyaltyPoints}
            />
        </div>
    );
};