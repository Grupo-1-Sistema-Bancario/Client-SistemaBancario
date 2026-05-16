import { useForm } from "react-hook-form";
import { useEffect } from "react";

export const ProductModal = ({
    isOpen,
    onClose,
    onSubmit,
    product
}) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {

        if (product) {
            reset(product);
        } else {
            reset({
                name: '',
                description: '',
                type: 'PRODUCT',
                price: 0
            });
        }

    }, [product]);

    if (!isOpen) return null;

    return (
        <div className="
            fixed inset-0 z-50
            bg-black/80 backdrop-blur-md
            flex justify-center items-center px-4
        ">

            <div className="
                w-full max-w-2xl
                bg-[#0B0717]
                border border-fuchsia-500/20
                rounded-3xl
                overflow-hidden
            ">

                {/* HEADER */}
                <div className="
                    p-6 border-b border-white/5
                    bg-gradient-to-r from-fuchsia-900/20 to-transparent
                ">

                    <h2 className="text-3xl font-black text-white uppercase italic">
                        {product ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>

                    <p className="text-cyan-400 text-[10px] uppercase tracking-[0.3em] mt-2">
                        Astra Bank Product Terminal
                    </p>

                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-5"
                >

                    <div>
                        <label className="text-purple-400 text-xs uppercase">
                            Nombre
                        </label>

                        <input
                            {...register("name", {
                                required: "Nombre obligatorio"
                            })}
                            className="
                                w-full mt-2 px-4 py-3 rounded-xl
                                bg-white/5 border border-white/10
                                text-white outline-none
                            "
                        />

                        {errors.name && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-purple-400 text-xs uppercase">
                            Descripción
                        </label>

                        <textarea
                            {...register("description")}
                            rows="4"
                            className="
                                w-full mt-2 px-4 py-3 rounded-xl
                                bg-white/5 border border-white/10
                                text-white outline-none
                            "
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">

                        <div>
                            <label className="text-purple-400 text-xs uppercase">
                                Tipo
                            </label>

                            <select
                                {...register("type")}
                                className="
                                    w-full mt-2 px-4 py-3 rounded-xl
                                    bg-[#120A22]
                                    border border-white/10
                                    text-white
                                "
                            >
                                <option value="PRODUCT">Producto</option>
                                <option value="SERVICE">Servicio</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-purple-400 text-xs uppercase">
                                Precio
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                {...register("price")}
                                className="
                                    w-full mt-2 px-4 py-3 rounded-xl
                                    bg-white/5 border border-white/10
                                    text-white
                                "
                            />
                        </div>

                    </div>

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-4 pt-5">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                px-6 py-3 rounded-xl
                                bg-white/5 text-gray-400
                                uppercase text-xs tracking-widest
                            "
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="
                                px-8 py-3 rounded-xl
                                bg-gradient-to-r from-fuchsia-600 to-purple-700
                                text-white uppercase text-xs
                                tracking-[0.2em] font-black
                            "
                        >
                            Guardar
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};