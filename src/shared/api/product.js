import axios from "./axios";

export const getProductsRequest = () => axios.get('/products/get');

export const createProductRequest = (data) =>
    axios.post('/products/create', data);

export const updateProductRequest = (id, data) =>
    axios.put(`/products/${id}`, data);

export const changeProductStatusRequest = (id, isActive) =>
    axios.put(`/products/${id}/${isActive ? 'deactivate' : 'activate'}`);