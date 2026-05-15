export const ProductCard = ({ product, onEdit, onToggleStatus }) => {

    return (
        <div className="
            bg-[#0D0618]/70
            border border-cyan-500/10
            rounded-2xl
            p-6
            backdrop-blur-md
            hover:border-fuchsia-500/40
            hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]
            transition-all
        ">

            {/* HEADER */}
            <div className="flex justify-between items-start mb-5">

                <div>
                    <h2 className="text-white text-xl font-black uppercase tracking-tight">
                        {product.name}
                    </h2>

                    <p className="text-cyan-400 text-[10px] uppercase tracking-[0.3em] mt-1">
                        Astra Financial Products
                    </p>
                </div>

                <div className={`
                    px-3 py-1 rounded-full text-[10px]
                    uppercase font-bold tracking-widest border
                    ${product.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'}
                `}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                </div>
            </div>

            {/* INFO */}
            <div className="space-y-4">

                <div>
                    <p className="text-purple-400 text-[10px] uppercase tracking-widest mb-1">
                        Descripción
                    </p>

                    <p className="text-gray-300 text-sm">
                        {product.description}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <p className="text-purple-400 text-[10px] uppercase tracking-widest mb-1">
                            Tipo
                        </p>

                        <p className="text-white font-bold">
                            {product.type}
                        </p>
                    </div>

                    <div>
                        <p className="text-purple-400 text-[10px] uppercase tracking-widest mb-1">
                            Precio
                        </p>

                        <p className="text-cyan-400 font-black">
                            Q {product.price}
                        </p>
                    </div>

                </div>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-8">

                <button
                    onClick={() => onEdit(product)}
                    className="
                        flex-1 py-3 rounded-xl
                        bg-gradient-to-r from-fuchsia-600 to-purple-700
                        text-white text-[10px] uppercase tracking-[0.2em]
                        font-black hover:brightness-125 transition-all
                    "
                >
                    Editar
                </button>

                <button
                    onClick={() =>
                        onToggleStatus(product._id, product.isActive)
                    }
                    className={`
                        flex-1 py-3 rounded-xl text-[10px]
                        uppercase tracking-[0.2em]
                        font-black transition-all
                        ${product.isActive
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}
                    `}
                >
                    {product.isActive ? 'Desactivar' : 'Activar'}
                </button>

            </div>

        </div>
    );
};