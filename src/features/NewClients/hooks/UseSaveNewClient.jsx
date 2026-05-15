import { useAccountRequestStore } from "../store/useNewClientStore.js";

export const useApproveClient = () => {

    const approveAccount = useAccountRequestStore((state) => state.approveAccount);


    const saveClient = async (data, authAccountId) => {
        try {
            // No usamos FormData porque enviamos un JSON con los datos del Admin
            const accountData = {
                authAccountId: authAccountId,
                dpi: data.dpi,
                address: data.address,
                phone: data.phone,
                jobName: data.jobName,
                monthlyIncome: Number(data.monthlyIncome) // Aseguramos que sea numérico
            };

            // Llamamos a la función del store que hace el POST a Node.js
            const result = await approveAccount(authAccountId, accountData);
            
            return result; // Retorna { success: true/false }
        } catch (error) {
            console.error("Error en el hook de aprobación:", error);
            return { success: false, error };
        }
    }

    return { saveClient };
}