import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useAccountRequestStore } from "../store/useNewClientStore.js";
import { useApproveClient } from "../hooks/UseSaveNewClient.jsx";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";

export const AccountReviewModal = ({ isOpen, onClose, client }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const { approveAccount, loading } = useAccountRequestStore();


    useEffect(() => {
        if (isOpen && client) {
            reset({
                authAccountId: client.id || client._id,
                dpi: client.dpi,
                address: client.address,
                phone: client.phone,
                jobName: client.jobType || client.jobName,
                monthlyIncome: client.monthlyIncome || "No hay datos",
            });
        }
    }, [isOpen, client, reset]);

    const { saveClient } = useApproveClient();

    const onSubmit = async (data) => {
        // Formateamos la data para asegurar que el sueldo sea un número
        const finalData = {
            ...data,
            monthlyIncome: Number(data.monthlyIncome)
        };

        const res = await saveClient(data, client.id || client._id);
        if (res.success) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 px-3 sm:px-4">
            {/* CONTENEDOR PRINCIPAL */}
            <div className="bg-[#0D0618] border border-purple-500/30 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.2)] w-full max-w-lg md:max-w-xl max-h-[95vh] flex flex-col overflow-hidden">

                {/* HEADER DE LA TERMINAL */}
                <div className="p-5 text-white border-b border-purple-900/30 bg-gradient-to-r from-purple-900/20 to-transparent">
                    <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter">
                        Revisión de Expediente
                    </h2>
                    <p className="text-[10px] font-mono text-pink-500 uppercase tracking-[0.3em] opacity-80">
                        Astra Bank / Terminal de Autorización
                    </p>
                </div>

                {/* CUERPO DEL FORMULARIO */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 overflow-y-auto custom-scrollbar"
                >
                    {/* INFO VISUAL DEL CLIENTE */}
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-600 to-purple-700 flex items-center justify-center border-2 border-white/10 shadow-lg">
                            <span className="text-xl font-bold text-white uppercase">
                                {client?.name?.charAt(0)}{client?.surname?.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                                {client?.name} {client?.surname}
                            </h3>
                            <p className="text-[10px] text-purple-400 font-mono tracking-widest uppercase">ID: {client?.id?.substring(0, 12)}</p>
                        </div>
                    </div>

                    {/* DATOS DE SOLO LECTURA (Lo que ya viene de la solicitud) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-[9px] font-bold text-purple-500 uppercase mb-1 tracking-widest">Documento DPI</label>
                            <input
                                readOnly
                                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 font-mono text-sm outline-none cursor-not-allowed"
                                {...register("dpi")}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-[9px] font-bold text-purple-500 uppercase mb-1 tracking-widest italic">
                                Teléfono de Contacto
                            </label>
                            <input
                                readOnly
                                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 font-mono text-sm outline-none cursor-not-allowed"
                                {...register("phone")}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-[9px] font-bold text-purple-500 uppercase mb-1 tracking-widest">Ocupación Registrada</label>
                            <input
                                readOnly
                                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 font-mono text-sm outline-none cursor-not-allowed"
                                {...register("jobName")}
                            />
                        </div>

                        <div className="flex flex-col md:col-span-2">
                            <label className="text-[9px] font-bold text-purple-500 uppercase mb-1 tracking-widest">Dirección de Residencia</label>
                            <input
                                readOnly
                                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm outline-none cursor-not-allowed"
                                {...register("address")}
                            />
                        </div>
                    </div>

                    <div className="p-5 bg-pink-600/5 border border-pink-500/20 rounded-2xl shadow-inner">
                        <label className="text-[10px] font-bold text-pink-500 uppercase mb-2 block tracking-[0.2em]">
                            Ingresos Mensuales (Q)
                        </label>
                        <input
                            readOnly
                            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm outline-none cursor-not-allowed"
                            {...register("monthlyIncome")}
                        />
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl text-purple-400 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                        >
                            Cerrar Expediente
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-[10px] uppercase tracking-[0.2em] transition shadow-[0_0_20px_rgba(219,39,119,0.3)] hover:scale-105 hover:brightness-125 disabled:opacity-50 flex items-center justify-center min-w-[180px]"
                        >
                            {loading ? <Spinner /> : "Autorizar Apertura"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};