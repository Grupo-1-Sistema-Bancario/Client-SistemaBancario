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

export const rejectAccount = async (authAccountId) => {
    return await axiosAdmin.put(`/pendingAccounts/reject/${authAccountId}`);
};

export const getProductsRequest = async () => {
    return await axiosProduct.get('/products/get');
};

export const createProductRequest = async (data) => {
    return await axiosProduct.post('/products/create', data);
};

export const updateProductRequest = async (id, data) => {
    return await axiosProduct.put(`/products/${id}`, data);
};

export const changeProductStatusRequest = async (id, isActive) => {
    return await axiosProduct.put(
        `/products/${id}/${isActive ? 'deactivate' : 'activate'}`
    );
};