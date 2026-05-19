import { useEffect, useState } from 'react';
import { useMyCurrencies } from '../hooks/useMyCurrencies';

const currencyDetails = {
    GTQ: { name: 'Quetzal Guatemalteco', symbol: 'Q' },
    USD: { name: 'Dólar Estadounidense', symbol: '$' },
    EUR: { name: 'Euro', symbol: '€' },
    MXN: { name: 'Peso Mexicano', symbol: '$' },
    RUB: { name: 'Rublo Ruso', symbol: '₽' },
    JPY: { name: 'Yen Japonés', symbol: '¥' },
    GBP: { name: 'Libra Esterlina', symbol: '£' },
    CHF: { name: 'Franco Suizo', symbol: 'CHF' },
    CNY: { name: 'Yuan Chino', symbol: '¥' },
    BTC: { name: 'Bitcoin', symbol: '₿' }
};

export const MyCurrencies = () => {
    const { balances, loading, loadCurrencies } = useMyCurrencies();

    // Estados para la calculadora de conversión rápida interna
    const [calcAmount, setCalcAmount] = useState('');
    const [targetCurrency, setTargetCurrency] = useState('USD');
    const [simulatedResult, setSimulatedResult] = useState(null);

    useEffect(() => {
        loadCurrencies();
    }, []);

    // Separamos el saldo base de las demás monedas convertidas
    const baseBalance = balances?.GTQ || 0;
    const currencyList = balances
        ? Object.entries(balances).filter(([code]) => code !== 'GTQ')
        : [];

    // Manejador de la simulación de conversión rápida
    const handleSimulate = (e) => {
        e.preventDefault();
        if (!calcAmount || isNaN(calcAmount) || !balances) return;

        // Calculamos la tasa implícita basada en el balance actual devuelto por el backend
        const targetBalance = balances[targetCurrency] || 0;
        if (baseBalance === 0) {
            setSimulatedResult(0);
            return;
        }

        const implicitRate = targetBalance / baseBalance;
        const result = parseFloat(calcAmount) * implicitRate;
        setSimulatedResult(result);
    };

    return (
        <div className="p-6 animate-fadeIn text-white">
            {/* Encabezado Principal */}
            <div className="mb-8">
                <h1 className="text-4xl font-black text-[var(--color-fuchsia-vivid)] uppercase italic tracking-wider">
                    Conversión de Divisas
                </h1>
                <p className="text-purple-400/50 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                    Astra Bank Global Exchange Rate
                </p>
            </div>

            {loading && !balances ? (
                <div className='rounded-xl border border-dashed border-[var(--color-surface-border)] p-8 text-center bg-[var(--color-deep-purple)]/40'>
                    <p className="text-[var(--color-text-dark-secondary)] mb-4 font-mono">
                        Sincronizando tasas globales con el motor cuántico...
                    </p>
                </div>
            ) : !balances ? (
                <div className='rounded-xl border border-dashed border-[var(--color-surface-border)] p-8 text-center bg-[var(--color-deep-purple)]/40'>
                    <p className="text-[var(--color-text-dark-secondary)] mb-4">
                        No se pudieron cargar los balances de divisas.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Fila superior: Saldo Base */}
                    <div className="bg-[var(--color-deep-purple)]/40 border border-[var(--color-surface-border)] p-6 rounded-2xl max-w-md backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-[var(--color-text-dark-tertiary)] text-[10px] uppercase font-mono font-bold tracking-widest">
                                    Estado de Cuenta
                                </p>
                                <h2 className="text-sm font-semibold text-purple-300">Saldo Disponible (Base)</h2>
                            </div>
                            <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full uppercase tracking-wider">
                                GTQ
                            </span>
                        </div>
                        <p className="text-4xl font-black text-emerald-400 font-mono tracking-tight">
                            Q {baseBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    {/* Fila Inferior de dos columnas: Grid de Divisas y Calculadora */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* Listado de Divisas (Ocupa 2 de 3 columnas en pantallas grandes) */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currencyList.map(([code, value]) => {
                                const details = currencyDetails[code] || { name: 'Divisa Extranjera', symbol: '$' };
                                const isCrypto = code === 'BTC';

                                return (
                                    <div
                                        key={code}
                                        className="bg-[var(--color-deep-purple)] p-5 rounded-xl border border-[var(--color-surface-border)] hover:border-[var(--color-cyan-deep)]/40 transition-all duration-300 flex flex-col justify-between group shadow-md"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-lg font-bold tracking-wide group-hover:text-[var(--color-cyan-deep)] transition-colors">
                                                    {code}
                                                </h4>
                                                <p className="text-[var(--color-text-dark-tertiary)] text-[11px] uppercase tracking-wider">
                                                    {details.name}
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-mono text-purple-400/70 border border-[var(--color-surface-border)] px-2 py-0.5 rounded">
                                                {isCrypto ? 'Crypto' : 'Fiat'}
                                            </span>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-[var(--color-surface-border)]/50 flex justify-between items-baseline">
                                            <span className="text-[9px] text-purple-400/40 uppercase font-mono tracking-wider">
                                                Equivalencia
                                            </span>
                                            <p className="text-xl font-black font-mono text-white tracking-wide">
                                                <span className="text-xs font-normal text-purple-300/60 mr-1">{details.symbol}</span>
                                                {isCrypto
                                                    ? value.toFixed(6)
                                                    : value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                }
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Panel de Calculadora de Conversión Rápida Minimalista */}
                        <div className="bg-[var(--color-deep-purple)] p-6 rounded-xl border border-[var(--color-surface-border)] shadow-xl">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 mb-1">
                                Conversión Rápida
                            </h3>
                            <p className="text-[11px] text-[var(--color-text-dark-tertiary)] mb-4">
                                Simula un intercambio sin alterar tus fondos.
                            </p>

                            <form onSubmit={handleSimulate} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-purple-400/70 font-mono mb-1.5">
                                        Monto a convertir (GTQ)
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        placeholder="0.00"
                                        value={calcAmount}
                                        onChange={(e) => {
                                            setCalcAmount(e.target.value);
                                            setSimulatedResult(null); // Resetea si cambia el valor
                                        }}
                                        className="w-full bg-black/40 border border-[var(--color-surface-border)] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--color-fuchsia-vivid)]/60 transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-purple-400/70 font-mono mb-1.5">
                                        Divisa de Destino
                                    </label>
                                    <select
                                        value={targetCurrency}
                                        onChange={(e) => {
                                            setTargetCurrency(e.target.value);
                                            setSimulatedResult(null); // Resetea si cambia la moneda
                                        }}
                                        className="w-full bg-black/40 border border-[var(--color-surface-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-fuchsia-vivid)]/60 transition-colors"
                                    >
                                        {currencyList.map(([code]) => (
                                            <option key={code} value={code} className="bg-[var(--color-deep-purple)]">
                                                {code} - {currencyDetails[code]?.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[var(--color-fuchsia-vivid)] to-purple-600 hover:brightness-110 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg transition-all shadow-md"
                                >
                                    Calcular Simulación
                                </button>
                            </form>

                            {/* Mostrar resultado simulado de forma limpia */}
                            {simulatedResult !== null && (
                                <div className="mt-5 p-4 rounded-lg bg-black/20 border border-[var(--color-surface-border)]/60 animate-fadeIn">
                                    <p className="text-[10px] uppercase font-mono text-purple-400/60 mb-1">
                                        Monto Estimado
                                    </p>
                                    <p className="text-xl font-mono font-black text-[var(--color-cyan-deep)]">
                                        {currencyDetails[targetCurrency]?.symbol}{' '}
                                        {targetCurrency === 'BTC'
                                            ? simulatedResult.toFixed(6)
                                            : simulatedResult.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        }
                                        <span className="text-xs font-normal text-white/60 ml-1.5">{targetCurrency}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};