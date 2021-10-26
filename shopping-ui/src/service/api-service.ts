import { authApiClient, orderApiClient } from './fetch-helper';

export function getAllItems(offSet: number): Promise<any> {
    return orderApiClient.fetch(`/item/list?offSet=${offSet}`);
}

export function callAuthToken(email: string, password: string): Promise<any> {
    return authApiClient.post(`/auth/token`, { username: email, password: password });
}

export function registerUser(email: string, password: string): Promise<any> {
    return authApiClient.post(`/user/register`, { username: email, password: password });
}

export function getCartItems(): Promise<any> {
    return orderApiClient.fetch(`/cart/list`);
}

export function checkoutCart(): Promise<any> {
    return orderApiClient.fetch(`/cart/complete`);
}

export function addToCart(cartId): Promise<any> {
    return orderApiClient.fetch(`/cart/add?cart=${cartId}`);
}

export function getOrderHistory(): Promise<any> {
    return orderApiClient.fetch(`/order/list`);
}