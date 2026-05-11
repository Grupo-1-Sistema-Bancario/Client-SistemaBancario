import { useBenefitsStore } from '../store/useBenfitsStore';

export const BenefitTable = ({
  benefits,
  setSelectedBenefit
}) => {

  const { deleteBenefit } = useBenefitsStore();

  return (

    <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden">

      <div className="p-6 border-b border-white/10">

        <h2 className="text-2xl font-black">
          Beneficios Registrados
        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-white/5">

            <tr className="text-left text-sm uppercase tracking-widest text-gray-400">

              <th className="p-5">Beneficio</th>
              <th className="p-5">% Cashback</th>
              <th className="p-5">Descripción</th>
              <th className="p-5">Acciones</th>

            </tr>

          </thead>

          <tbody>

            {benefits.map((benefit) => (

              <tr
                key={benefit.id}
                className="border-t border-white/5 hover:bg-white/5 transition-all"
              >

                <td className="p-5 font-semibold text-fuchsia-300">
                  {benefit.titulo}
                </td>

                <td className="p-5 text-cyan-300 font-bold">
                  {benefit.porcentaje}%
                </td>

                <td className="p-5 text-gray-300">
                  {benefit.descripcion}
                </td>

                <td className="p-5 flex gap-3">

                  <button
                    onClick={() => setSelectedBenefit(benefit)}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/20 hover:bg-cyan-500/30"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => deleteBenefit(benefit.id)}
                    className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-400/20 hover:bg-red-500/30"
                  >
                    Eliminar
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};