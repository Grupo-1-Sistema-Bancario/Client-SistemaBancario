import { useEffect, useMemo, useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';

const FavoriteFormModal = ({
    isOpen,
    mode,
    loading,
    initialAlias,
    initialAccountNumber,
    onClose,
    onSubmit,
}) => {
    const [favoriteAccountNumber, setFavoriteAccountNumber] = useState('');
    const [alias, setAlias] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        setFavoriteAccountNumber(initialAccountNumber || '');
        setAlias(initialAlias || '');
    }, [isOpen, initialAccountNumber, initialAlias]);

    if (!isOpen) return null;

    const isEdit = mode === 'edit';

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            favoriteAccountNumber: favoriteAccountNumber.trim(),
            alias: alias.trim(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-[var(--color-space-bg)]/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-md rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-deep-purple)] shadow-2xl">
                <div className="px-6 py-4 border-b border-[var(--color-surface-border)] flex items-center justify-between">
                    <h3 className="text-lg font-black text-[var(--color-text-dark-primary)] uppercase tracking-wide">
                        {isEdit ? 'Modificar favorito' : 'Agregar favorito'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-[var(--color-text-dark-tertiary)] hover:text-white cursor-pointer font-bold"
                        type="button"
                    >
                        X
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block mb-2 text-sm text-[var(--color-text-dark-secondary)]">Número de cuenta</label>
                        <input
                            type="text"
                            required
                            disabled={isEdit}
                            value={favoriteAccountNumber}
                            onChange={(e) => setFavoriteAccountNumber(e.target.value)}
                            className="w-full p-3 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-space-bg)] text-[var(--color-text-dark-primary)] outline-none focus:border-[var(--color-fuchsia-vivid)] disabled:opacity-70"
                            placeholder="Ej. 100200300"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm text-[var(--color-text-dark-secondary)]">Alias</label>
                        <input
                            type="text"
                            required
                            value={alias}
                            maxLength={50}
                            onChange={(e) => setAlias(e.target.value)}
                            className="w-full p-3 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-space-bg)] text-[var(--color-text-dark-primary)] outline-none focus:border-[var(--color-fuchsia-vivid)]"
                            placeholder="Nombre para identificar esta cuenta"
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-[var(--color-text-dark-secondary)] hover:text-white cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-mid)] text-white font-bold hover:brightness-110 disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TransferModal = ({ isOpen, loading, favorite, onClose, onSubmit }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        setAmount('');
        setDescription(`Transferencia a ${favorite?.alias || favorite?.favoriteAccountNumber || 'favorito'}`);
    }, [isOpen, favorite]);

    if (!isOpen || !favorite) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ amount, description });
    };

    return (
        <div className="fixed inset-0 z-50 bg-[var(--color-space-bg)]/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-md rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-deep-purple)] shadow-2xl">
                <div className="px-6 py-4 border-b border-[var(--color-surface-border)] flex items-center justify-between">
                    <h3 className="text-lg font-black text-[var(--color-text-dark-primary)] uppercase tracking-wide">
                        Transferir a favorito
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-[var(--color-text-dark-tertiary)] hover:text-white cursor-pointer font-bold"
                        type="button"
                    >
                        X
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-space-bg)] px-4 py-3">
                        <p className="text-xs uppercase tracking-wider text-[var(--color-text-dark-tertiary)]">Destino</p>
                        <p className="text-sm text-[var(--color-text-dark-primary)] font-semibold">
                            {favorite.alias || 'Sin alias'}
                        </p>
                        <p className="text-xs text-[var(--color-cyan-vivid)] font-mono">
                            {favorite.favoriteAccountNumber}
                        </p>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm text-[var(--color-text-dark-secondary)]">Cantidad (Q)</label>
                        <input
                            type="number"
                            min="1"
                            step="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-3 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-space-bg)] text-[var(--color-text-dark-primary)] outline-none focus:border-[var(--color-fuchsia-vivid)]"
                            placeholder="Ej. 150"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm text-[var(--color-text-dark-secondary)]">Descripción</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-space-bg)] text-[var(--color-text-dark-primary)] outline-none focus:border-[var(--color-fuchsia-vivid)] resize-none"
                            placeholder="Motivo de la transferencia"
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-[var(--color-text-dark-secondary)] hover:text-white cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-mid)] text-white font-bold hover:brightness-110 disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? 'Procesando...' : 'Transferir'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Nuevo subcomponente para Confirmar Eliminación ---
const ConfirmDeleteModal = ({ isOpen, favorite, onClose, onConfirm, loading }) => {
    if (!isOpen || !favorite) return null;

    return (
        <div className="fixed inset-0 z-50 bg-[var(--color-space-bg)]/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-deep-purple)] shadow-2xl p-6 space-y-6">
                <div className="text-center">
                    <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2">
                        ¿Eliminar Favorito?
                    </h3>
                    <p className="text-sm text-[var(--color-text-dark-secondary)]">
                        ¿Estás seguro que deseas eliminar a <span className="text-[var(--color-fuchsia-vivid)] font-bold">{favorite.alias || favorite.favoriteAccountNumber}</span> de tus favoritos? Esta acción no se puede deshacer.
                    </p>
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg border border-[var(--color-surface-border)] text-[var(--color-text-dark-secondary)] hover:text-white cursor-pointer disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-[var(--color-fuchsia-deep)]/80 text-white font-bold hover:bg-[var(--color-fuchsia-vivid)] transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const FavoriteCard = ({ favorite, expanded, onToggle, onEdit, onDelete, onTransfer }) => {
    const initials = useMemo(() => {
        const source = favorite.alias || favorite.favoriteAccountNumber || 'FB';
        return source.slice(0, 2).toUpperCase();
    }, [favorite.alias, favorite.favoriteAccountNumber]);

    return (
        <article
            onClick={onToggle}
            className="group relative overflow-hidden rounded-2xl border border-[var(--color-surface-border)] cursor-pointer p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-[0_28px_60px_rgba(216,27,96,0.22)] bg-[linear-gradient(125deg,#120A24_0%,#25154D_40%,#3D1E71_100%)]"
        >
            {/* corazón en la esquina derecha superior (donde va la abreviación) */}
            <button
                onClick={(e) => { e.stopPropagation(); /* toggle favorito placeholder */ }}
                title="Favorito"
                className="absolute top-4 right-4 z-20 flex items-center justify-center h-9 w-9 rounded-full bg-[var(--color-fuchsia-vivid)]/90 text-white shadow-lg border border-white/20 hover:scale-105 transition-transform"
            >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.4 5.4 0 0 1 7.5 3a5.94 5.94 0 0 1 4.5 2.1A5.94 5.94 0 0 1 16.5 3 5.4 5.4 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35Z" />
                </svg>
            </button>
            {/* removed decorative blurred circle below heart as requested */}
            <div className="absolute top-6 left-6 h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--color-cyan-vivid)]/70 to-[var(--color-cyan-deep)]/70 border border-white/30" />
            {/* moved small badge + heart into preview (top-right) */}

            <div className="relative z-10 min-h-44 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-4 pl-12">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-dark-tertiary)]">Favorito</p>
                        <h3 className="text-xl font-black text-[var(--color-text-dark-primary)] uppercase leading-tight mt-1">
                            {favorite.alias || 'Sin alias'}
                        </h3>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-gradient-from)] via-[var(--color-gradient-mid)] to-[var(--color-gradient-to)] flex items-center justify-center text-white text-sm font-black tracking-wider shadow-[0_0_18px_rgba(0,191,165,0.25)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                        {initials}
                    </div>
                </div>

                <div className="mt-8">
                    <p className="font-mono text-lg tracking-[0.18em] text-[var(--color-text-dark-primary)] break-all">
                        {favorite.favoriteAccountNumber}
                    </p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[var(--color-cyan-vivid)] transition-transform duration-300 group-hover:translate-x-1">Sistema Bancario</p>
                </div>

                {expanded ? (
                    <div className="mt-6 flex flex-wrap gap-3 animate-fadeIn">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onTransfer(favorite);
                            }}
                            className="px-4 py-2 rounded-lg bg-[var(--color-cyan-deep)]/70 text-white hover:bg-[var(--color-cyan-deep)] transition-colors cursor-pointer"
                        >
                            Transferir
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(favorite);
                            }}
                            className="px-4 py-2 rounded-lg border border-[var(--color-surface-border)] text-[var(--color-text-dark-secondary)] hover:text-white hover:border-[var(--color-fuchsia-vivid)] transition-colors cursor-pointer"
                        >
                            Modificar
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(favorite);
                            }}
                            className="px-4 py-2 rounded-lg bg-[var(--color-fuchsia-deep)]/80 text-white hover:bg-[var(--color-fuchsia-vivid)] transition-colors cursor-pointer"
                        >
                            Eliminar
                        </button>
                    </div>
                ) : (
                    <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--color-text-dark-tertiary)]">
                        Toca la tarjeta para ver opciones
                    </p>
                )}
            </div>
        </article>
    );
};

export const Favorite = () => {
    const {
        favorites,
        loading,
        isCreateModalOpen,
        closeCreateModal,
        openCreateModal,
        loadFavorites,
        handleAddFavorite,
        handleUpdateAlias,
        handleRemoveFavorite,
        handleTransferToFavorite,
    } = useFavorites();

    const [editingFavorite, setEditingFavorite] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [transferTarget, setTransferTarget] = useState(null);
    // Nuevo estado para controlar el modal de confirmación de eliminación
    const [deletingTarget, setDeletingTarget] = useState(null);

    useEffect(() => {
        loadFavorites();
    }, []);

    const openEditModal = (favorite) => {
        setEditingFavorite(favorite);
    };

    const closeFormModal = () => {
        setEditingFavorite(null);
        closeCreateModal();
    };

    const submitFormModal = async ({ favoriteAccountNumber, alias }) => {
        if (editingFavorite) {
            await handleUpdateAlias(editingFavorite._id, alias, () => {
                setEditingFavorite(null);
            });
            return;
        }

        await handleAddFavorite({ favoriteAccountNumber, alias }, closeCreateModal);
    };

    // Abre el nuevo modal de confirmación en lugar del alert del sistema
    const openDeleteConfirmation = (favorite) => {
        setDeletingTarget(favorite);
    };

    // Ejecuta la eliminación real desde el modal personalizado
    const confirmDeleteFavorite = async () => {
        if (!deletingTarget) return;
        await handleRemoveFavorite(deletingTarget._id);
        setDeletingTarget(null);
    };

    const submitTransfer = async (data) => {
        await handleTransferToFavorite(transferTarget, data, () => setTransferTarget(null));
    };

    const isFormOpen = isCreateModalOpen || !!editingFavorite;

    return (
        <section className="animate-fadeIn">
            {/* Cabecera optimizada con título a la izquierda y botón "+" a la derecha */}
            <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-[var(--color-fuchsia-vivid)] uppercase italic tracking-wider">
                        Mis Favoritos
                    </h1>
                    <p className="text-purple-400/50 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
                        Tarjetas de cuentas frecuentes
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    title="Agregar favorito"
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-mid)] text-white text-2xl font-bold hover:brightness-110 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                    +
                </button>
            </div>

            {loading && favorites.length === 0 ? (
                <p className="text-[var(--color-text-dark-secondary)]">Cargando favoritos...</p>
            ) : favorites.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--color-surface-border)] p-8 text-center bg-[var(--color-deep-purple)]/40">
                    <p className="text-[var(--color-text-dark-secondary)] mb-4">Aún no tienes favoritos guardados.</p>
                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-mid)] text-white font-bold hover:brightness-110 cursor-pointer"
                    >
                        Agregar primer favorito
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {favorites.map((favorite) => (
                        <FavoriteCard
                            key={favorite._id}
                            favorite={favorite}
                            expanded={expandedId === favorite._id}
                            onToggle={() => setExpandedId((prev) => (prev === favorite._id ? null : favorite._id))}
                            onEdit={openEditModal}
                            onDelete={openDeleteConfirmation}
                            onTransfer={setTransferTarget}
                        />
                    ))}
                </div>
            )}

            {/* Modal para Crear/Editar */}
            <FavoriteFormModal
                isOpen={isFormOpen}
                mode={editingFavorite ? 'edit' : 'create'}
                loading={loading}
                initialAlias={editingFavorite?.alias || ''}
                initialAccountNumber={editingFavorite?.favoriteAccountNumber || ''}
                onClose={closeFormModal}
                onSubmit={submitFormModal}
            />

            {/* Modal para Transferencias */}
            <TransferModal
                isOpen={!!transferTarget}
                loading={loading}
                favorite={transferTarget}
                onClose={() => setTransferTarget(null)}
                onSubmit={submitTransfer}
            />      

            {/* Nuevo Modal de Confirmación de Eliminación */}
            <ConfirmDeleteModal
                isOpen={!!deletingTarget}
                favorite={deletingTarget}
                loading={loading}
                onClose={() => setDeletingTarget(null)}
                onConfirm={confirmDeleteFavorite}
            />
        </section>
    );
};