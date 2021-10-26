export function getJwt() {
    const jtoken = localStorage.getItem('jtoken');
    if (jtoken !== null) {
        return jtoken;
    }
    return null;
}
export function saveInfo(key: string, value: any) {
    if (value !== undefined && value !== null) {
        localStorage.setItem(key, value);
    }
}


export function getEmail() {
    const user = localStorage.getItem('user');
    return user;
}

export function logout() {
    console.log('logging out user');
    localStorage.clear();
}