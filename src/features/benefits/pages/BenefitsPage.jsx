import { useState } from 'react';
import { BenefitForm } from '../components/BenefitForm';
import { BenefitTable } from '../components/BenefitTable';
import { useBenefitsStore } from '../store/useBenfitsStore';

export const BenefitsPage = () => {

  const { benefits } = useBenefitsStore();

  const [selectedBenefit, setSelectedBenefit] = useState(null);

  return (
    <div className="min-h-screen bg-[#06010F] text-white relative overflow-hidden p-8">

      {/* EFECTOS DE FONDO */}
      <div className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-fuchsia-600/20 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-cyan-500/20 blur-[140px] rounded-full"></div>

      {/* GRID FUTURISTA */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <div className="relative z-10">

        {/* HEADER */}
        <div className="mb-10">

          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_#00FFFF]"></div>

            <p className="uppercase tracking-[0.35em] text-xs text-cyan-300 font-bold">
              Sistema Galáctico de Beneficios
            </p>
          </div>

          <h1 className="text-5xl font-black leading-tight">

            Beneficios de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-400 to-cyan-400">
              Transferencias
            </span>

          </h1>

          <p className="text-gray-400 mt-4 max-w-2xl leading-relaxed">
            Gestiona promociones, recompensas y ventajas interestelares
            aplicadas a transferencias financieras dentro del ecosistema Astra Bank.
          </p>

        </div>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden">

            <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/10 blur-3xl"></div>

            <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">
              Beneficios Activos
            </p>

            <h2 className="text-4xl font-black text-fuchsia-400">
              {benefits.length}
            </h2>

          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden">

            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-3xl"></div>

            <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">
              Cashback Total
            </p>

            <h2 className="text-4xl font-black text-cyan-400">
              15%
            </h2>

          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden">

            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-3xl"></div>

            <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">
              Transferencias VIP
            </p>

            <h2 className="text-4xl font-black text-purple-400">
              248
            </h2>

          </div>

        </div>

        {/* FORMULARIO */}
        <BenefitForm
          selectedBenefit={selectedBenefit}
          setSelectedBenefit={setSelectedBenefit}
        />

        {/* TABLA */}
        <BenefitTable
          benefits={benefits}
          setSelectedBenefit={setSelectedBenefit}
        />

      </div>

    </div>
  );
};