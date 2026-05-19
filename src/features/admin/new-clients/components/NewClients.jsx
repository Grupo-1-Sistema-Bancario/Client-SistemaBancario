import { useState, useEffect } from "react";
import { useAccountRequestStore } from "../store/useNewClientStore.js"; // Store adaptado
import { Spinner } from "../../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { AccountReviewModal } from "./NewClientModal.jsx"; // Modal renombrado

export const NewClients = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const { newClients, getRequests, loading } = useAccountRequestStore();

    useEffect(() => {
        getRequests();
    }, [getRequests]);

    //loading = true; // Simulación de carga para mostrar el spinner
    
    //if (loading) return <Spinner />;

    return (
        <div className="p-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-pink-600">
                        Solicitudes de Nuevos Exploradores
                    </h1>
                    <p className="text-purple-400/50 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        Terminal de Autorización / Astra Bank
                    </p>
                </div>
            </div>

            {/* GRID DE SOLICITUDES */}
            <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {newClients.map((client) => (
                    <div
                        key={client.id || client._id}
                        className="bg-[#0D0618]/60 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 transition-all duration-300 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(219,39,119,0.15)] flex flex-col justify-between"
                    >
                        {/* CONTENIDO DE LA TARJETA */}
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-purple-600/10 rounded-xl border border-purple-500/20 shadow-inner">
                                    <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-1 rounded bg-pink-600/10 text-pink-500 border border-pink-500/30 animate-pulse">
                                    PENDIENTE
                                </span>
                            </div>

                            <h2 className="text-xl font-bold text-white uppercase tracking-tight truncate">
                                {client.name} {client.surname}
                            </h2>

                            <div className="space-y-3 mt-4">
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-[10px] text-purple-400 uppercase font-mono tracking-wider">Identificador DPI</span>
                                    <span className="text-sm text-white font-mono">{client.dpi}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-[10px] text-purple-400 uppercase font-mono tracking-wider">Rango Laboral</span>
                                    <span className="text-sm text-white font-mono">{client.jobType}</span>
                                </div>
                            </div>
                        </div>

                        {/* BOTÓN DE REVISIÓN */}
                        <div className="mt-8">
                            <button
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:brightness-125 transition-all shadow-lg shadow-pink-900/20 active:scale-95"
                                onClick={() => {
                                    setSelectedClient(client);
                                    setOpenModal(true);
                                }}
                            >
                                Revisar Expediente
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* SI LA LISTA ESTÁ VACÍA */}
            {!loading && newClients.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-purple-500/10 rounded-3xl">
                    <p className="text-purple-400/30 font-mono text-xs uppercase tracking-[0.5em]">
                        No hay transmisiones entrantes
                    </p>
                </div>
            )}

            {/* MODAL DE REVISIÓN RENOMBRADO */}
            <AccountReviewModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedClient(null);
                }}
                client={selectedClient}
            />
        </div>
    );
};