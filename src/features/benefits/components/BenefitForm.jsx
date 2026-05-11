import { useForm } from 'react-hook-form';
import { useBenefitsStore } from '../store/useBenfitsStore';

export const BenefitForm = ({
  selectedBenefit,
  setSelectedBenefit
}) => {

  const { addBenefit, updateBenefit } = useBenefitsStore();

  const {
    register,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: selectedBenefit || {}
  });

  const onSubmit = (data) => {

    if (selectedBenefit) {
      updateBenefit(selectedBenefit.id, data);
      setSelectedBenefit(null);
    } else {
      addBenefit(data);
    }

    reset();
  };

  return (

    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 mb-10 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-0 left-0 w-52 h-52 bg-fuchsia-600/10 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-52 h-52 bg-cyan-500/10 blur-3xl"></div>

      <div className="relative z-10">

        <h2 className="text-2xl font-black mb-6">
          {selectedBenefit
            ? 'Actualizar Beneficio'
            : 'Crear Nuevo Beneficio'}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid md:grid-cols-2 gap-6"
        >

          <input
            {...register("titulo")}
            placeholder="Título del beneficio"
            className="bg-[#130E26]/70 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-fuchsia-500"
          />

          <input
            type="number"
            {...register("porcentaje")}
            placeholder="% Cashback"
            className="bg-[#130E26]/70 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-cyan-400"
          />

          <textarea
            {...register("descripcion")}
            placeholder="Descripción"
            className="md:col-span-2 bg-[#130E26]/70 border border-white/10 rounded-xl p-4 h-32 resize-none focus:outline-none focus:border-purple-500"
          />

          <button
            className="md:col-span-2 py-4 rounded-2xl font-bold uppercase tracking-[0.2em]
            bg-gradient-to-r from-fuchsia-600 to-cyan-500
            hover:scale-[1.02]
            transition-all
            shadow-[0_0_25px_rgba(0,255,255,0.2)]"
          >
            {selectedBenefit ? 'Actualizar' : 'Crear Beneficio'}
          </button>

        </form>

      </div>

    </div>
  );
};