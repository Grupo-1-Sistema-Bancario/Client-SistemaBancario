import { axiosProduct } from "./api";

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