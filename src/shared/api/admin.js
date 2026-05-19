import { axiosAdmin } from "./api";

export const createAccountRequest = async (accountData) => {
    return await axiosAdmin.post("/pendingAccounts/account-request", accountData);
};

export const getMyAccountRequest = async () => {
    return await axiosAdmin.get("/accounts/my-account");
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
    return await axiosAdmin.get('/products/get');
};

export const createProductRequest = async (data) => {
    return await axiosAdmin.post('/products/create', data);
};

export const updateProductRequest = async (id, data) => {
    return await axiosAdmin.put(`/products/${id}`, data);
};

export const changeProductStatusRequest = async (id, isActive) => {
    return await axiosAdmin.put(
        `/products/${id}/${isActive ? 'deactivate' : 'activate'}`
    );
};

export const getAccountsRequest = async () => {
    return await axiosAdmin.get("/accounts");
};

export const updateAccountRequest = async (id, data) => {
    return await axiosAdmin.put(`/accounts/${id}`, data);
};

export const activateAccountRequest = async (id) => {
    return await axiosAdmin.put(`/accounts/${id}/activate`, { isActive: true });
};

export const deactivateAccountRequest = async (id) => {
    return await axiosAdmin.put(`/accounts/${id}/desactivate`, { isActive: false });
};

export const makeDepositRequest = async (depositData) => {
    return await axiosAdmin.post('/transactions/deposit', depositData);
};

export const getDepositsRequest = async () => {
    return await axiosAdmin.get('/transactions/deposits');
};

export const revertDepositRequest = async (transactionId) => {
    return await axiosAdmin.put(`/transactions/reverse/${transactionId}`);
};

export const makeTransferRequest = async (transferData) => {
    return await axiosAdmin.post('/transactions/transfer', transferData);
};

export const makePaymentRequest = async (paymentData) => {
    return await axiosAdmin.post('/transactions/payment', paymentData);
};

export const getActiveProductsRequest = async () => {
    return await axiosAdmin.get('/products/get?isActive=true');
};

export const acquireProductRequest = async (productId) => {
    return await axiosAdmin.post('/products/acquire', { productId });
};

export const getMyProductsRequest = async () => {
    return await axiosAdmin.get('/products/my-products');
};

export const getFavoritesRequest = async () => {
    return await axiosAdmin.get('/favorites');
};

export const addFavoriteRequest = async (favoriteData) => {
    return await axiosAdmin.post('/favorites', favoriteData);
};

export const updateFavoriteAliasRequest = async (favoriteId, alias) => {
    return await axiosAdmin.put(`/favorites/${favoriteId}`, { alias });
};

export const removeFavoriteRequest = async (favoriteId) => {
    return await axiosAdmin.delete(`/favorites/${favoriteId}`);
};

export const transferByAliasRequest = async (transferData) => {
    return await axiosAdmin.post('/favorites/transfer', transferData);
};