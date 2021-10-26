import { makeFetchClient } from 'so-fetch-js';
import { getJwt, logout } from './utils';

const addAuthHeader = (config: any) => {
    let tokenType = 'Bearer';
    let accessToken = getJwt();
    if (accessToken) {
        config.headers.Authorization = `${tokenType} ${accessToken}`;
    }
    return config;
};

const baseAuthUrl = process.env.REACT_APP_AUTH_APP_URL ? process.env.REACT_APP_AUTH_APP_URL : '/server';
const baseOrderUrl = process.env.REACT_APP_ORDER_APP_URL ? process.env.REACT_APP_ORDER_APP_URL : '/server';


const handleApiResponse = (response: any) => {
    console.log(response);
    if ([401, 403].includes(response.status)) {
        console.log('logout due to 403')
        logout();
        window.location.reload();
    }
    return response;
};


const addJsonHeaders = (config: any) => {
    config.headers = {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store',
        'Content-Type': 'application/json',
    };
    return config;
};

export const authApiClient = makeFetchClient({
    rootUrl: () => baseAuthUrl,
    requestInterceptors: [addJsonHeaders],
    responseInterceptors: [handleApiResponse]
});

export const orderApiClient = makeFetchClient({
    rootUrl: () => baseOrderUrl,
    requestInterceptors: [addJsonHeaders, addAuthHeader],
    responseInterceptors: [handleApiResponse]
});