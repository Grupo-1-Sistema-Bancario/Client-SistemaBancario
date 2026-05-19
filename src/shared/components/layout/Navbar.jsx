import { useMemo, useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { createPortal } from "react-dom"
import { useAuthStore } from "../../../features/auth/store/useAuthStore.js"
import AvatarUser from "../ui/AvatarUser.jsx"
import logoAuth from "../../../assets/img/LOGO.png"
import { getMyAccountRequest, updateAccountRequest } from "../../api/admin.js"
import { getProfile as getAuthProfileRequest } from "../../api/auth.js"
import { showError, showSuccess } from "../../utils/toast.js"

const HamburgerIcon = ({ open }) => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" className="origin-center transition-all duration-300" style={{ transform: open ? "rotate(45deg) translate(4px, 6px)" : "none" }} />
    <line x1="3" y1="12" x2="21" y2="12" className="transition-all duration-300" style={{ opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "scaleX(1)" }} />
    <line x1="3" y1="18" x2="21" y2="18" className="origin-center transition-all duration-300" style={{ transform: open ? "rotate(-45deg) translate(4px, -6px)" : "none" }} />
  </svg>
)

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
    <span className="text-[11px] uppercase tracking-[0.32em] text-purple-300/80">{label}</span>
    <span className="max-w-[12rem] break-words text-right text-sm font-semibold text-white">{value}</span>
  </div>
)

const EditAccountModal = ({ isOpen, onClose, onSubmit, defaultValues, saving }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: "",
      phone: "",
      jobName: "",
      monthlyIncome: "",
    },
  })

  // Extraemos el primer error para mostrarlo en la caja global
  const validationError =
    errors.phone?.message ||
    errors.jobName?.message ||
    errors.address?.message ||
    errors.monthlyIncome?.message

  const jobOptions = [
    "Explorador Independiente",
    "Tripulante Asalariado",
    "Comandante (Empresario)"
  ]

  useEffect(() => {
    if (!isOpen) return

    reset({
      address: defaultValues?.address || "",
      phone: defaultValues?.phone || "",
      jobName: defaultValues?.jobName || "",
      monthlyIncome:
        defaultValues?.monthlyIncome !== undefined && defaultValues?.monthlyIncome !== null
          ? String(defaultValues.monthlyIncome)
          : "",
    })
  }, [isOpen, defaultValues, reset])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-3 backdrop-blur-md sm:px-4" onClick={onClose}>
      <div
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-fuchsia-500/20 bg-[#0B0717] shadow-[0_0_50px_rgba(168,85,247,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-white/5 bg-gradient-to-r from-fuchsia-900/20 to-transparent p-6">
          <h3 className="text-2xl font-black uppercase italic tracking-tight text-white">Editar cuenta</h3>
          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-cyan-400">
            Astra Bank / Perfil bancario
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-h-[78vh] overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase text-purple-400">Teléfono</label>
              <input
                type="number"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                placeholder="12345678"
                onInput={(e) => {
                  // Forzamos un máximo de 8 caracteres al escribir
                  if (e.target.value.length > 8) {
                    e.target.value = e.target.value.slice(0, 8);
                  }
                }}
                {...register("phone", {
                  required: "El teléfono debe tener exactamente 8 dígitos.",
                  pattern: {
                    value: /^\d{8}$/,
                    message: "El teléfono debe tener exactamente 8 dígitos."
                  }
                })}
              />
            </div>

            <div>
              <label className="text-xs uppercase text-purple-400">Trabajo</label>
              <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                {...register("jobName", {
                  required: "Debes seleccionar una ocupación.",
                })}
              >
                <option value="" className="text-gray-400 bg-[#0B0717]">Selecciona tu rango</option>
                {jobOptions.map((job) => (
                  <option key={job} value={job} className="bg-[#0B0717] text-white">
                    {job}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase text-purple-400">Dirección</label>
              <textarea
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                placeholder="Tu dirección actual"
                {...register("address", {
                  required: "La dirección es obligatoria",
                })}
              />
            </div>

            <div>
              <label className="text-xs uppercase text-purple-400">Ingreso mensual (Q)</label>
              <input
                type="number"
                step="0.01"
                min="100"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                placeholder="1000"
                {...register("monthlyIncome", {
                  required: "Los ingresos mensuales no pueden ser menores a 100.",
                  min: {
                    value: 100,
                    message: "Los ingresos mensuales no pueden ser menores a 100.",
                  },
                })}
              />
            </div>

            {/* Caja global de errores copiada exactamente de tu vista de Users */}
            {validationError && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                {validationError}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-white/5 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-400 transition-all hover:bg-white/10 sm:w-auto"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-700 px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:brightness-125 disabled:opacity-60 sm:w-auto"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default function Navbar({ sidebarOpen, onToggleSidebar }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [bankProfile, setBankProfile] = useState(null)
  const [authProfile, setAuthProfile] = useState(null)
  const { user, logout } = useAuthStore()
  const profileContainerRef = useRef(null)
  const isAdmin = user?.role === "ADMIN_ROLE"
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [settingsOpen, setSettingsOpen] = useState(false)

  const applyTheme = (mode) => {
    const root = document.documentElement.style
    if (mode === 'light') {
      root.setProperty('--color-space-bg', '#F7F4F0')
      root.setProperty('--color-sky-bg', '#F7F4F0')
      root.setProperty('--color-hero-from', '#EBE0D8')
      root.setProperty('--color-hero-to', '#DFD7CC')
      root.setProperty('--color-card-light', '#EDE4D8')
      root.setProperty('--color-border-light', '#D9CCBB')
      root.setProperty('--color-surface-border', '#D9CCBB')
      root.setProperty('--color-text-dark-primary', '#211B2C')
      root.setProperty('--color-text-light-primary', '#2A2420')
      root.setProperty('--color-text-light-secondary', '#5E534A')
      root.setProperty('--color-text-light-tertiary', '#94897E')
      root.setProperty('--color-fuchsia-vivid', '#D81B60')
      root.setProperty('--color-cyan-vivid', '#00BFA5')
      root.setProperty('--color-gradient-from', '#D81B60')
      root.setProperty('--color-gradient-mid', '#7B2FBE')
      root.setProperty('--color-gradient-to', '#4A1D9E')
      root.setProperty('--color-surface-overlay', 'rgba(247,244,240,0.80)')
    } else {
      root.setProperty('--color-space-bg', '#0D0A14')
      root.setProperty('--color-deep-purple', '#1A0F2E')
      root.setProperty('--color-surface-dark', '#2D1B5E')
      root.setProperty('--color-surface-border', '#4A2D8A')
      root.setProperty('--color-text-dark-primary', '#F8F5FF')
      root.setProperty('--color-fuchsia-vivid', '#D81B60')
      root.setProperty('--color-cyan-vivid', '#00BFA5')
      root.setProperty('--color-gradient-from', '#D81B60')
      root.setProperty('--color-gradient-mid', '#7B2FBE')
      root.setProperty('--color-gradient-to', '#4A1D9E')
      root.setProperty('--color-surface-overlay', 'rgba(13,10,20,0.75)')
    }
  }

  useEffect(() => {
    applyTheme(theme)
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSettingsOpen(false)
        setProfileOpen(false)
        setEditModalOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [theme])

  useEffect(() => {
    if (!profileOpen || editModalOpen) return

    const handleOutsideClick = (event) => {
      if (profileContainerRef.current && !profileContainerRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [profileOpen, editModalOpen])

  useEffect(() => {
    if (!profileOpen || isAdmin) return

    let active = true

    const loadBankProfile = async () => {
      try {
        setLoadingProfile(true)
        const response = await getMyAccountRequest()
        if (!active) return
        setBankProfile(response?.data?.data || null)
      } catch (error) {
        if (!active) return
        setBankProfile(null)
        showError(error?.response?.data?.message || "No se pudo cargar tu cuenta bancaria")
      } finally {
        if (active) {
          setLoadingProfile(false)
        }
      }
    }

    loadBankProfile()

    return () => {
      active = false
    }
  }, [profileOpen, isAdmin])

  useEffect(() => {
    if (!profileOpen) return

    let active = true

    const loadAuthProfile = async () => {
      try {
        const response = await getAuthProfileRequest()
        if (!active) return
        setAuthProfile(response?.data?.data || null)
      } catch {
        if (!active) return
        setAuthProfile(null)
      }
    }

    loadAuthProfile()

    return () => {
      active = false
    }
  }, [profileOpen])

  const handleSetTheme = (mode) => {
    setTheme(mode)
    localStorage.setItem('theme', mode)
    setSettingsOpen(false)
  }

  const displayName = useMemo(() => {
    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim()
    }

    if (user?.name || user?.surname) {
      return `${user?.name || ""} ${user?.surname || ""}`.trim()
    }

    return user?.username || user?.email || (isAdmin ? "ADMIN" : "CLIENTE")
  }, [user, isAdmin])

  const email = authProfile?.email || user?.email || user?.userEmail || "Sin correo"
  const username = user?.username || "Sin usuario"
  const phone = bankProfile?.phone || user?.phone || "Sin teléfono"
  const address = bankProfile?.address || user?.address || "Sin dirección"
  const accountNumber = bankProfile?.accountNumber || user?.accountNumber || user?.account?.number || "Sin número"
  const jobName = bankProfile?.jobName || "Sin trabajo"
  const monthlyIncome = bankProfile?.monthlyIncome ?? null

  const handleUpdateAccount = async (formData) => {
    if (!bankProfile?._id) {
      showError("No se encontró una cuenta para editar")
      return
    }

    try {
      setSavingProfile(true)

      const incomeValue = Number(formData.monthlyIncome)
      if (Number.isNaN(incomeValue) || incomeValue < 100) {
        showError("Los ingresos mensuales no pueden ser menores a 100.")
        return
      }

      const payload = {
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        jobName: formData.jobName.trim(),
        monthlyIncome: incomeValue,
      }

      const response = await updateAccountRequest(bankProfile._id, payload)
      const updated = response?.data?.data

      if (updated) {
        setBankProfile((prev) => ({ ...prev, ...updated }))
      }

      showSuccess("Cuenta actualizada correctamente")
      setEditModalOpen(false)
    } catch (error) {
      showError(error?.response?.data?.message || "No se pudo actualizar la cuenta")
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <nav className="relative z-50 flex w-full items-center justify-between border-b border-purple-900/30 bg-[#0D0618]/80 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-900/40 bg-white/5 text-purple-300 transition-all duration-200 hover:border-purple-500 hover:bg-purple-700/20 hover:text-white"
          type="button"
          aria-label="Alternar menú"
        >
          <HamburgerIcon open={sidebarOpen} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center">
            <img src={logoAuth} alt="Astra Bank Logo" className="h-full w-full object-contain" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              ASTRA BANK
            </p>
            <p className="text-[11px] uppercase tracking-[0.26em] text-purple-200/70">
              Banca inteligente y futurista
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={profileContainerRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition-all hover:border-pink-500/50 hover:bg-white/10"
            type="button"
            aria-label="Abrir perfil"
          >
            <AvatarUser
              name={displayName}
              profilePicture={isAdmin ? null : user?.profilePicture}
              imageSrc={isAdmin ? logoAuth : undefined}
              fallbackLabel={isAdmin ? "AB" : displayName}
              isAdmin={isAdmin}
              size="md"
            />

            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold uppercase leading-tight text-white">
                {displayName}
              </p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300/80">
                {isAdmin ? "Administrador" : "Usuario"}
              </p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 max-h-[calc(100vh-6.5rem)] w-[340px] overflow-y-auto rounded-[2rem] border border-white/10 bg-[#13081C]/95 p-4 shadow-[0_30px_80px_rgba(92,27,149,0.45)] backdrop-blur-2xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-[#2A123D] via-[#150A24] to-[#091A1C] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-3">
                  <AvatarUser
                    name={displayName}
                    profilePicture={isAdmin ? null : user?.profilePicture}
                    imageSrc={isAdmin ? logoAuth : undefined}
                    fallbackLabel={isAdmin ? "AB" : displayName}
                    isAdmin={isAdmin}
                    size="lg"
                  />

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-300/80">
                      Perfil
                    </p>
                    <h3 className="text-xl font-black leading-tight text-white">
                      {displayName}
                    </h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-pink-300/80">
                      {"Perfil de usuario"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <DetailRow label="Nombre" value={displayName} />
                {isAdmin ? (
                  <>
                    <DetailRow label="Usuario" value={username} />
                    <DetailRow label="Correo" value={email} />
                    <DetailRow label="Rol" value="Administrador" />
                  </>
                ) : (
                  <>
                    <DetailRow label="Número de cuenta" value={accountNumber} />
                    <DetailRow label="Correo" value={email} />
                    <DetailRow label="Teléfono" value={phone} />
                    <DetailRow label="Dirección" value={address} />
                    <DetailRow label="Trabajo" value={jobName} />
                    <DetailRow
                      label="Ingreso mensual"
                      value={monthlyIncome !== null ? `Q${Number(monthlyIncome).toFixed(2)}` : "Sin dato"}
                    />
                  </>
                )}
              </div>

              <div className="mt-4">
                {!isAdmin && (
                  <button
                    onClick={() => setEditModalOpen(true)}
                    className="mb-3 w-full rounded-2xl bg-[#7B3FEC] px-4 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#6732C9] disabled:opacity-60"
                    type="button"
                    disabled={loadingProfile || !bankProfile?._id}
                  >
                    {loadingProfile ? "Cargando cuenta..." : "Editar cuenta"}
                  </button>
                )}

                <button
                  onClick={() => {
                    logout()
                    setProfileOpen(false)
                    setEditModalOpen(false)
                  }}
                  className="w-full rounded-2xl bg-[#D81B60] px-4 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#B3154C]"
                  type="button"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}

          <EditAccountModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleUpdateAccount}
            defaultValues={bankProfile}
            saving={savingProfile}
          />
        </div>
      </div>
    </nav>
  )
}