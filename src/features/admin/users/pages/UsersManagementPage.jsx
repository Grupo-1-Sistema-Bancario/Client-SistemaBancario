import { useEffect, useState } from "react";
import { useUsersStore } from "../store/useUsersStore";

export const UsersManagementPage = () => {
    const {
        users,
        loading,
        error,
        getUsers,
        updateUser,
        activateUser,
        deactivateUser
    } = useUsersStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [actionLoading, setActionLoading] = useState(false);
    const [validationError, setValidationError] = useState("");
    const jobOptions = [
        "Explorador Independiente",
        "Tripulante Asalariado",
        "Comandante (Empresario)"
    ];
    useEffect(() => {
        getUsers();
    }, []);

    const getDisplayName = (user) => {
        const name = user.name || user.firstName || "";
        const surname = user.surname || user.lastName || "";
        const fullName = `${name} ${surname}`.trim();
        return fullName || "Sin nombre";
    };

    const getDisplayUsername = (user) => {
        return user.username || user.userName || "Sin usuario";
    };

    const getDisplayEmail = (user) => {
        return user.email || user.userEmail || "Sin email";
    };

    const filteredUsers = users.filter(user =>
        user.accountNumber !== "0000000000" && // Omitir bóveda
        (user.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getDisplayName(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
            getDisplayUsername(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
            getDisplayEmail(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.dpi?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            accountNumber: user.accountNumber || "",
            dpi: user.dpi || "",
            phone: user.phone || "",
            address: user.address || "",
            jobName: user.jobName || "",
            monthlyIncome: user.monthlyIncome || 0,
        });
        setValidationError("");
        setShowModal(true);
    };

    const validateForm = () => {
        if (!/^\d{8}$/.test(formData.phone || "")) {
            setValidationError("El teléfono debe tener exactamente 8 dígitos.");
            return false;
        }

        if (Number(formData.monthlyIncome) < 100) {
            setValidationError("Los ingresos mensuales no pueden ser menores a 100.");
            return false;
        }

        if (!formData.jobName) {
            setValidationError("Debes seleccionar una ocupación.");
            return false;
        }

        setValidationError("");
        return true;
    };

    const handleSaveChanges = async () => {
        if (!validateForm()) return;
        try {
            setActionLoading(true);
            await updateUser(selectedUser._id, formData);
            setShowModal(false);
            setSelectedUser(null);
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            setActionLoading(true);
            if (user.isActive) {
                await deactivateUser(user._id);
            } else {
                await activateUser(user._id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-cyan-400 text-xl">Cargando usuarios...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-[radial-gradient(circle_at_top,#1A1038,#05010D)]">
            {/* HEADER */}
            <div className="mb-8">
                <h1 className="
                    text-4xl
                    font-black
                    uppercase
                    italic
                    tracking-tight
                    text-transparent
                    bg-clip-text
                    bg-gradient-to-r
                    from-cyan-400
                    to-fuchsia-500
                ">
                    Gestión de Usuarios
                </h1>
                <p className="
                    text-cyan-400/50
                    uppercase
                    tracking-[0.4em]
                    text-xs
                    mt-3
                    font-mono
                ">
                    {filteredUsers.length} de {users.length} usuarios
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                    {error}
                </div>
            )}

            {/* SEARCH BAR */}
            <div className="mb-8 relative">
                <div className="relative">
                    <svg
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400/50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por número de cuenta, nombre, usuario, email o DPI..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="
                            w-full
                            bg-black/40
                            border
                            border-purple-900/30
                            rounded-xl
                            px-4
                            py-3
                            pl-12
                            text-white
                            placeholder-purple-400/50
                            focus:outline-none
                            focus:border-cyan-500
                            focus:ring-2
                            focus:ring-cyan-500/20
                            transition-all
                        "
                    />
                </div>
            </div>

            {/* TABLE */}
            <div className="
                bg-black/40
                backdrop-blur-xl
                border
                border-purple-900/30
                rounded-2xl
                overflow-hidden
            ">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-purple-900/30 bg-purple-950/20">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">
                                    Número de Cuenta
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">
                                    Nombre
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">
                                    Usuario
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">
                                    DPI
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">
                                    Balance
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">
                                    Ingresos Mensuales
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-cyan-400">
                                    Estado
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-cyan-400">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user._id}
                                    className="
                                        border-b
                                        border-purple-900/20
                                        hover:bg-purple-900/10
                                        transition-colors
                                    "
                                >
                                    <td className="px-6 py-4 text-sm text-cyan-400 font-mono font-semibold">
                                        {user.accountNumber}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white">
                                        <div className="font-semibold">
                                            {getDisplayName(user)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white">
                                        {getDisplayUsername(user)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-purple-300">
                                        {getDisplayEmail(user)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-cyan-300 font-mono">
                                        {user.dpi || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-cyan-400 font-mono">
                                        ${user.balance?.toFixed(2) || "0.00"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-cyan-400 font-mono">
                                        ${user.monthlyIncome?.toFixed(2) || "0.00"}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`
                                            px-3 py-1 rounded-full text-xs font-semibold
                                            ${user.isActive
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-red-500/20 text-red-400"
                                            }
                                        `}>
                                            {user.isActive ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="
                                                    px-3 py-1 text-xs font-medium
                                                    bg-cyan-500/20
                                                    border border-cyan-500/50
                                                    text-cyan-400
                                                    rounded-lg
                                                    hover:bg-cyan-500/30
                                                    transition-colors
                                                    disabled:opacity-50
                                                "
                                                disabled={actionLoading}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                className={`
                                                    px-3 py-1 text-xs font-medium
                                                    rounded-lg
                                                    transition-colors
                                                    disabled:opacity-50
                                                    ${user.isActive
                                                        ? "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                                                        : "bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30"
                                                    }
                                                `}
                                                disabled={actionLoading}
                                            >
                                                {user.isActive ? "Desactivar" : "Activar"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="
                        bg-black/90
                        border
                        border-purple-900/50
                        rounded-2xl
                        p-8
                        max-w-2xl
                        w-full
                        shadow-2xl
                        max-h-[90vh]
                        overflow-y-auto
                    ">
                        {/* HEADER CON INFO PRINCIPAL */}
                        <div className="mb-8 pb-6 border-b border-purple-900/30">
                            <h2 className="
                                text-2xl
                                font-bold
                                text-transparent
                                bg-clip-text
                                bg-gradient-to-r
                                from-cyan-400
                                to-fuchsia-500
                                mb-4
                            ">
                                Editar Usuario
                            </h2>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                                    <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-1">
                                        Nombre
                                    </p>
                                    <p className="text-lg font-bold text-cyan-400">
                                        {selectedUser.name || selectedUser.firstName || "-"}
                                    </p>
                                </div>
                                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                                    <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-1">
                                        Apellido
                                    </p>
                                    <p className="text-lg font-bold text-cyan-400">
                                        {selectedUser.surname || selectedUser.lastName || "-"}
                                    </p>
                                </div>
                                <div className="col-span-2 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                                    <p className="text-xs text-purple-400/70 uppercase tracking-wider mb-1">
                                        Email
                                    </p>
                                    <p className="text-lg font-bold text-purple-400 truncate">
                                        {selectedUser.email || "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                                    <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-1">
                                        Número de Cuenta
                                    </p>
                                    <p className="text-lg font-bold text-cyan-400 font-mono">
                                        {selectedUser.accountNumber}
                                    </p>
                                </div>
                                <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-lg p-4">
                                    <p className="text-xs text-fuchsia-400/70 uppercase tracking-wider mb-1">
                                        Saldo Actual
                                    </p>
                                    <p className="text-lg font-bold text-fuchsia-400 font-mono">
                                        ${selectedUser.balance?.toFixed(2) || "0.00"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-cyan-400 mb-2">
                                    Número de Cuenta
                                </label>
                                <input
                                    type="number"
                                    value={formData.accountNumber || ""}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        accountNumber: e.target.value
                                    })}
                                    className="
                                        w-full
                                        bg-purple-950/30
                                        border
                                        border-purple-900/50
                                        rounded-lg
                                        px-4
                                        py-2
                                        text-white
                                        focus:outline-none
                                        focus:border-cyan-500
                                    "
                                    disabled={true}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-cyan-400 mb-2">
                                    DPI
                                </label>
                                <input
                                    type="number"
                                    value={formData.dpi || ""}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        dpi: e.target.value
                                    })}
                                    className="
                                        w-full
                                        bg-purple-950/30
                                        border
                                        border-purple-900/50
                                        rounded-lg
                                        px-4
                                        py-2
                                        text-white
                                        focus:outline-none
                                        focus:border-cyan-500
                                    "
                                    disabled={true}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-cyan-400 mb-2">
                                    Teléfono
                                </label>
                                <input
                                    type="number"
                                    value={formData.phone || ""}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");

                                        if (value.length <= 8) {
                                            setFormData({
                                                ...formData,
                                                phone: value
                                            });
                                        }
                                    }}
                                    maxLength={8}
                                    pattern="\d{8}"
                                    className="
                                        w-full
                                        bg-purple-950/30
                                        border
                                        border-purple-900/50
                                        rounded-lg
                                        px-4
                                        py-2
                                        text-white
                                        focus:outline-none
                                        focus:border-cyan-500
                                        "
                                    disabled={actionLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-cyan-400 mb-2">
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    value={formData.address || ""}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        address: e.target.value
                                    })}
                                    className="
                                        w-full
                                        bg-purple-950/30
                                        border
                                        border-purple-900/50
                                        rounded-lg
                                        px-4
                                        py-2
                                        text-white
                                        focus:outline-none
                                        focus:border-cyan-500
                                    "
                                    disabled={actionLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-cyan-400 mb-2">
                                    Tipo de Trabajo
                                </label>

                                <select
                                    value={formData.jobName || ""}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        jobName: e.target.value
                                    })}
                                    className="
                                        w-full
                                        bg-purple-950/30
                                        border
                                        border-fuchsia-500
                                        rounded-lg
                                        px-4
                                        py-2
                                        text-white
                                        focus:outline-none
                                        focus:border-cyan-500
                                    "
                                    disabled={actionLoading}
                                >
                                    <option value="">
                                        Selecciona tu rango
                                    </option>

                                    {jobOptions.map((job) => (
                                        <option key={job} value={job}>
                                            {job}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-cyan-400 mb-2">
                                    Ingresos Mensuales
                                </label>
                                <input
                                    type="number"
                                    min={100}
                                    value={formData.monthlyIncome || 100}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);

                                        setFormData({
                                            ...formData,
                                            monthlyIncome: value
                                        });
                                    }}
                                    className="
                                        w-full
                                        bg-purple-950/30
                                        border
                                        border-purple-900/50
                                        rounded-lg
                                        px-4
                                        py-2
                                        text-white
                                        focus:outline-none
                                        focus:border-cyan-500
                                    "
                                    disabled={actionLoading}
                                />
                            </div>
                        </div>
                        <p>
                            .
                        </p>
                        {validationError && (
                                <div className="
                                    mb-6
                                    p-3
                                    rounded-lg
                                    bg-red-500/20
                                    border
                                    border-red-500/50
                                    text-red-400
                                    text-sm
                                ">
                                    {validationError}
                                </div>
                            )}

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowModal(false)}
                                className="
                                    flex-1
                                    px-4
                                    py-2
                                    rounded-lg
                                    border
                                    border-purple-900/50
                                    text-purple-400
                                    font-semibold
                                    hover:bg-purple-900/20
                                    transition-colors
                                    disabled:opacity-50
                                "
                                disabled={actionLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                className="
                                    flex-1
                                    px-4
                                    py-2
                                    rounded-lg
                                    bg-gradient-to-r
                                    from-cyan-500
                                    to-fuchsia-500
                                    text-white
                                    font-semibold
                                    hover:brightness-110
                                    transition-all
                                    disabled:opacity-50
                                "
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
