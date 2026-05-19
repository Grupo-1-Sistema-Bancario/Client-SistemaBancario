import { useState, useEffect } from 'react';
import { useCatalog } from '../hooks/useCatalog';
import { usePaymentStore } from '../../payments/store/usePaymentStore'; // Importamos el store de pagos

const ConfirmBuyModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-[var(--color-space-bg)] bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-[var(--color-deep-purple)] p-6 rounded-xl border border-[var(--color-gradient-mid)] max-w-sm w-full shadow-[0_0_20px_rgba(123,47,190,0.2)]">
                <h3 className="text-xl font-bold text-[var(--color-text-dark-primary)] mb-4">¿Confirmar adquisición?</h3>
                <p className="text-[var(--color-text-dark-secondary)] mb-6 text-sm">Estás a punto de agregar este producto/servicio a tu cuenta. ¿Deseas continuar?</p>
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
                        className="px-4 py-2 bg-[var(--color-fuchsia-vivid)] text-white font-bold rounded-lg hover:brightness-110 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Procesando...' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Catalog = () => {
    const { products, loading, loadCatalog, handleBuy } = useCatalog();
    const { myProducts, fetchMyProducts } = usePaymentStore(); // Extraemos los productos adquiridos
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        loadCatalog();
        fetchMyProducts(); // Cargamos los productos que ya tiene el usuario
    }, []);

    const confirmBuy = async () => {
        if (selectedProductId) {
            await handleBuy(selectedProductId);
            setSelectedProductId(null);
            await fetchMyProducts(); // Refrescamos la lista para deshabilitar el botón inmediatamente
        }
    };

    return (
        <div className="p-6 animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-[var(--color-fuchsia-vivid)] uppercase italic tracking-wider">
                    Catálogo de Productos
                </h1>
                <p className="text-purple-400/50 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                    Astra Bank Product Nexus
                </p>
            </div>

            {loading && products.length === 0 ? (
                <p className="text-[var(--color-text-dark-secondary)]">Cargando catálogo...</p>
            ) : (
                <div className="flex flex-wrap gap-6">
                    {products.map((product) => {
                        // Verificamos si el producto ya está en la lista de adquiridos
                        const isAcquired = myProducts.some(myProd => myProd._id === product._id);
                        // Calculamos los puntos (1 punto por cada Q10)
                        const points = Math.floor(product.price / 10);

                        return (
                            <div key={product._id} className="bg-[var(--color-deep-purple)] p-6 rounded-2xl border border-[var(--color-surface-border)] w-80 shadow-lg flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase mb-1">{product.name}</h3>
                                    <p className="text-[var(--color-cyan-deep)] text-xs font-bold uppercase tracking-widest mb-4">
                                        Astra Bank Products | +{points} Pts
                                    </p>

                                    <p className="text-[var(--color-text-dark-tertiary)] text-[10px] uppercase font-bold tracking-widest mb-1">Descripción</p>
                                    <p className="text-[var(--color-text-dark-secondary)] text-sm mb-4 line-clamp-2 h-10">{product.description}</p>

                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <p className="text-[var(--color-text-dark-tertiary)] text-[10px] uppercase font-bold tracking-widest mb-1">Tipo</p>
                                            <p className="text-white font-bold uppercase">{product.type}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[var(--color-text-dark-tertiary)] text-[10px] uppercase font-bold tracking-widest mb-1">Precio</p>
                                            <p className="text-[var(--color-cyan-vivid)] font-black text-xl">Q {product.price}</p>
                                        </div>
                                    </div>

                                    {isAcquired && (
                                        <p className="text-[var(--color-fuchsia-vivid)] text-xs font-semibold mb-2">
                                            * Debes pagar este producto en "Realizar Pagos" para adquirirlo de nuevo.
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => setSelectedProductId(product._id)}
                                    disabled={loading || isAcquired}
                                    className={`mt-4 font-bold py-3 rounded-lg transition-all cursor-pointer 
                                        ${isAcquired
                                            ? 'bg-[var(--color-space-bg)] border border-[var(--color-surface-border)] text-[var(--color-text-dark-secondary)] cursor-not-allowed opacity-80'
                                            : 'bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-mid)] text-white hover:brightness-110 disabled:opacity-50 shadow-[0_0_15px_rgba(216,27,96,0.3)]'
                                        }`}
                                >
                                    {isAcquired ? 'Comprado' : 'Comprar'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmBuyModal
                isOpen={!!selectedProductId}
                onClose={() => setSelectedProductId(null)}
                onConfirm={confirmBuy}
                loading={loading}
            />
        </div>
    );
};