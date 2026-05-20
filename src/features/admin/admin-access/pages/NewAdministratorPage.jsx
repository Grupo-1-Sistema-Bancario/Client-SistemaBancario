import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, updateUserRole } from "../../../../shared/api/auth";

const initialForm = {
  name: "",
  surname: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: ""
};

export const NewAdministratorPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "El nombre es obligatorio.";
    if (!formData.surname.trim()) return "El apellido es obligatorio.";
    if (!formData.username.trim()) return "El usuario es obligatorio.";
    if (!formData.email.trim()) return "El correo es obligatorio.";
    if (!formData.password) return "La contraseña es obligatoria.";
    if (formData.password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (formData.password !== formData.confirmPassword) return "Las contraseñas no coinciden.";
    if (!/^\d{8}$/.test(formData.phone.trim())) return "El teléfono debe tener exactamente 8 dígitos.";

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("Name", formData.name.trim());
      payload.append("Surname", formData.surname.trim());
      payload.append("Username", formData.username.trim());
      payload.append("Email", formData.email.trim().toLowerCase());
      payload.append("Password", formData.password);
      payload.append("Phone", formData.phone.trim());

      const registerResponse = await register(payload);
      const createdUser = registerResponse?.data?.user;

      if (!createdUser?.id) {
        throw new Error("No se pudo obtener el identificador del usuario creado.");
      }

      await updateUserRole(createdUser.id, "ADMIN_ROLE");

      setSuccess("El administrador fue creado y promovido correctamente. Debe verificar su correo para iniciar sesión.");
      setFormData(initialForm);
    } catch (requestError) {
      const apiMessage = requestError?.response?.data?.message || requestError?.message || "No se pudo crear el administrador.";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full p-8 bg-[radial-gradient(circle_at_top,#1A1038,#05010D_55%,#05010D)] text-white">
      <div className="relative overflow-hidden rounded-[28px] border border-purple-900/30 bg-[#0D0618]/70 backdrop-blur-xl shadow-[0_0_80px_rgba(123,47,190,0.18)]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(216,27,96,0.16),transparent_35%,rgba(0,191,165,0.08)_100%)]" />
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-purple-400/70">Administración interna</p>
              <h1 className="mt-3 text-4xl md:text-5xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-400 to-cyan-300">
                Nuevo Administrador
              </h1>
              <p className="mt-3 max-w-2xl text-sm md:text-base text-purple-100/60">
                Crea una cuenta administrativa, asigna el rol correcto y deja preparado el acceso para el equipo de control.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100/80">
              Flujo: registro + promoción a ADMIN_ROLE
            </div>
          </div>

          {(error || success) && (
            <div className={`mb-8 rounded-2xl border px-4 py-4 text-sm ${error ? "border-red-500/30 bg-red-500/10 text-red-200" : "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"}`}>
              {error || success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-[24px] border border-purple-900/30 bg-black/25 p-6 md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2 md:col-span-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-300/70">Nombre</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Anderson"
                    className="w-full rounded-xl border border-purple-900/40 bg-white/5 px-4 py-3 text-white placeholder:text-purple-200/30 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>
                <label className="space-y-2 md:col-span-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-300/70">Apellido</span>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Sosa"
                    className="w-full rounded-xl border border-purple-900/40 bg-white/5 px-4 py-3 text-white placeholder:text-purple-200/30 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>
                <label className="space-y-2 md:col-span-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-300/70">Usuario</span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="admin.lider"
                    className="w-full rounded-xl border border-purple-900/40 bg-white/5 px-4 py-3 text-white placeholder:text-purple-200/30 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>
                <label className="space-y-2 md:col-span-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-300/70">Correo</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@banco.com"
                    className="w-full rounded-xl border border-purple-900/40 bg-white/5 px-4 py-3 text-white placeholder:text-purple-200/30 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>
                <label className="space-y-2 md:col-span-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-300/70">Contraseña</span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full rounded-xl border border-purple-900/40 bg-white/5 px-4 py-3 text-white placeholder:text-purple-200/30 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>
                <label className="space-y-2 md:col-span-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-300/70">Confirmar contraseña</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite la contraseña"
                    className="w-full rounded-xl border border-purple-900/40 bg-white/5 px-4 py-3 text-white placeholder:text-purple-200/30 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-300/70">Teléfono</span>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="8 dígitos"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-purple-900/40 bg-white/5 px-4 py-3 text-white placeholder:text-purple-200/30 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-700 px-5 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creando administrador..." : "Crear administrador"}
              </button>
            </div>

            <aside className="flex flex-col gap-5">
              <div className="rounded-[24px] border border-purple-900/30 bg-[#1A0F2E]/55 p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300/70">Resumen</p>
                <ul className="mt-4 space-y-3 text-sm text-purple-100/65">
                  <li>• El registro crea la cuenta base.</li>
                  <li>• Luego se asigna el rol administrativo.</li>
                  <li>• El usuario deberá verificar su correo.</li>
                </ul>
              </div>

              <div className="rounded-[24px] border border-cyan-500/20 bg-cyan-500/10 p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-100/80">Reglas</p>
                <p className="mt-3 text-sm leading-relaxed text-cyan-50/80">
                  Usa un correo institucional, teléfono válido y una contraseña segura. El rol final del usuario será ADMIN_ROLE.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-2xl border border-purple-900/30 bg-white/5 px-5 py-4 text-sm font-semibold text-purple-100/75 transition hover:border-purple-500/40 hover:bg-white/10"
              >
                Volver al dashboard
              </button>
            </aside>
          </form>
        </div>
      </div>
    </div>
  );
};
