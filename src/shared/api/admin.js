import { axiosAdmin } from "./api";


export const createAccountRequest = async (accountData) => {
    return await axiosAdmin.post("/pendingAccounts/account-request", accountData);
};

export const getFullPendingInfo = async () => {
    return await axiosAdmin.get("/pendingAccounts/get");
};

export const approveAccount = async (authAccountId, accountData) => {
    return await axiosAdmin.post(`accounts/create`, accountData);
};
//Metodo para implementarlo en un futuro, por ahora no se muestra en el frontend
export const rejectAccount = async (authAccountId) => {
    return await axiosAdmin.delete(`/pendingAccounts/reject/${authAccountId}`);
};