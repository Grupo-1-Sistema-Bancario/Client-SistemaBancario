import { useState, useEffect } from 'react';
import { useDeposits } from '../hooks/useDeposits';

const ConfirmRevertModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-[#161925] p-6 rounded-xl border border-[#C1292E] max-w-sm w-full">
                <h3 className="text-xl font-bold text-white mb-4">¿Revertir este depósito?</h3>
                <p className="text-gray-400 mb-6">Esta acción es irreversible y depende del tiempo límite.</p>
                <div className="flex gap-4 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-white hover:text-gray-300">Cancelar</button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 bg-[#C1292E] text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50"
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
    }, [fetchDeposits]);

    const confirmRevert = async () => {
        if (selectedId) {
            await handleRevertDeposit(selectedId);
            setSelectedId(null);
        }
    };

    return (
        <div className="p-6 bg-[#161925] rounded-xl shadow-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-[#F1D302] mb-6">Revertir Depósitos</h2>

            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
                {deposits.length === 0 ? (
                    <p className="text-gray-400 text-center">No hay depósitos recientes.</p>
                ) : (
                    deposits.map((deposit) => (
                        <div key={deposit._id} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                            <div>
                                <p className="text-white font-bold">Cuenta: {deposit.accountTo}</p>
                                <p className="text-[#F1D302] text-xl">Q{deposit.amount}</p>
                                <p className="text-gray-500 text-sm">{new Date(deposit.date).toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => setSelectedId(deposit._id)}
                                className="bg-transparent border border-[#C1292E] text-[#C1292E] px-4 py-2 rounded-lg hover:bg-[#C1292E] hover:text-white transition-colors"
                            >
                                Revertir
                            </button>
                        </div>
                    ))
                )}
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