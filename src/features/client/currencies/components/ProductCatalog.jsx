import { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';

const currencySymbols = {
    GTQ: 'Q', USD: '$', EUR: '€', MXN: '$', RUB: '₽',
    JPY: '¥', GBP: '£', CHF: 'CHF', CNY: '¥', BTC: '₿'
};

export const ProductCatalog = () => {
    const { products, loading, loadProducts } = useProducts();
    
    // Filtro de categoría: 'ALL', 'PRODUCT', 'SERVICE'
    const [filterType, setFilterType] = useState('ALL');
    // Divisa global seleccionada para comparar precios secundarios
    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    useEffect(() => {
        loadProducts();
    }, []);

    // Aplicamos el filtro de tipo en el frontend
    const filteredProducts = products.filter(product => {
        if (filterType === 'ALL') return true;
        return product.type === filterType;
    });

    return (
        <div className="p-6 animate-fadeIn text-white">
            {/* Encabezado Principal */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-[var(--color-fuchsia-vivid)] uppercase italic tracking-wider">
                        Catálogo Astra
                    </h1>
                    <p className="text-purple-400/50 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        Adquiere productos y servicios financieros globales
                    </p>
                </div>

                {/* Control de Divisa de Comparación Global */}
                <div className="flex items-center gap-2 bg-black/30 border border-[var(--color-surface-border)] px-3 py-1.5 rounded-lg self-start md:self-auto">
                    <span className="text-[10px] font-mono uppercase text-purple-400/70 tracking-wider">Ver equivalencia en:</span>
                    <select 
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="bg-transparent text-sm font-bold text-[var(--color-cyan-deep)] focus:outline-none cursor-pointer"
                    >
                        {Object.keys(currencySymbols).filter(c => c !== 'GTQ').map(code => (
                            <option key={code} value={code} className="bg-[var(--color-deep-purple)] text-white">
                                {code}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Barra de Filtros Minimalista (Tabs) */}
            <div className="flex border-b border-[var(--color-surface-border)]/40 mb-8 max-w-xs font-mono text-xs font-bold tracking-widest uppercase">
                {['ALL', 'PRODUCT', 'SERVICE'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`flex-1 pb-3 text-center transition-all relative ${
                            filterType === type 
                                ? 'text-[var(--color-fuchsia-vivid)] font-black' 
                                : 'text-[var(--color-text-dark-tertiary)] hover:text-white'
                        }`}
                    >
                        {type === 'ALL' ? 'Todos' : type === 'PRODUCT' ? 'Productos' : 'Servicios'}
                        {filterType === type && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-fuchsia-vivid)] animate-fadeIn" />
                        )}
                    </button>
                ))}
            </div>

            {/* Renderizado de Contenidos */}
            {loading && products.length === 0 ? (
                <div className='rounded-xl border border-dashed border-[var(--color-surface-border)] p-8 text-center bg-[var(--color-deep-purple)]/40'>
                    <p className="text-[var(--color-text-dark-secondary)] font-mono text-sm">Cargando catálogo financiero...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className='rounded-xl border border-dashed border-[var(--color-surface-border)] p-8 text-center bg-[var(--color-deep-purple)]/40'>
                    <p className="text-[var(--color-text-dark-secondary)] text-sm">No hay elementos disponibles en esta sección.</p>
                </div>
            ) : (
                /* Grid de Tarjetas de Productos */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((item, idx) => {
                        const priceBase = item.prices?.GTQ || 0;
                        const priceConverted = item.prices?.[selectedCurrency] || 0;
                        const symbolConverted = currencySymbols[selectedCurrency];

                        return (
                            <div 
                                key={item._id || idx} 
                                className="bg-[var(--color-deep-purple)] border border-[var(--color-surface-border)] p-6 rounded-2xl shadow-lg flex flex-col justify-between hover:border-[var(--color-fuchsia-vivid)]/40 transition-all duration-300 group"
                            >
                                <div>
                                    {/* Cabecera de la Tarjeta */}
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-[9px] font-mono font-black tracking-widest px-2 py-0.5 rounded uppercase border ${
                                            item.type === 'PRODUCT'
                                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                            {item.type === 'PRODUCT' ? 'Producto' : 'Servicio'}
                                        </span>
                                    </div>

                                    {/* Nombre */}
                                    <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2 group-hover:text-[var(--color-fuchsia-vivid)] transition-colors">
                                        {item.name}
                                    </h3>
                                    
                                    {/* Nota: Como tu backend de getProductsWithCurrencies no retorna la descripción del modelo en el mapeo, agregamos un placeholder dinámico elegante */}
                                    <p className="text-[var(--color-text-dark-secondary)] text-xs leading-relaxed mb-6 h-12 line-clamp-2">
                                        Beneficio financiero premium optimizado para el ecosistema digital de Astra Bank.
                                    </p>
                                </div>

                                {/* Contenedor de Precios */}
                                <div className="border-t border-[var(--color-surface-border)]/50 pt-4 flex items-center justify-between">
                                    {/* Precio Local (Base) */}
                                    <div>
                                        <p className="text-[var(--color-text-dark-tertiary)] text-[9px] font-mono uppercase tracking-widest mb-0.5">Precio Base</p>
                                        <p className="text-2xl font-black font-mono text-white tracking-tight">
                                            Q {priceBase.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    {/* Precio Equivalente Dinámico */}
                                    <div className="text-right">
                                        <p className="text-[var(--color-text-dark-tertiary)] text-[9px] font-mono uppercase tracking-widest mb-0.5">Equivalencia</p>
                                        <p className="text-md font-bold font-mono text-[var(--color-cyan-deep)] tracking-tight">
                                            <span className="text-[11px] font-normal mr-0.5 opacity-80">{symbolConverted}</span>
                                            {selectedCurrency === 'BTC' ? priceConverted.toFixed(6) : priceConverted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            <span className="text-[10px] font-normal text-purple-300/60 ml-1">{selectedCurrency}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};