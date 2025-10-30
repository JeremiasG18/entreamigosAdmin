import { postData, getData } from './api.js';

export async function login(email, password) {
    const data = await postData('login', {
        correo: email,
        contrasena: password
    });

    if (data.token) {
        localStorage.setItem('authToken', data.token);
        console.log(`Token guardado ${localStorage.getItem('authToken')}`);
    }

    return data;
}

export async function register(name, lastname, email, password) {
    const data = await postData('register', {
        id_rol: 1,
        nombre: name,
        apellido: lastname,
        correo: email,
        contrasena: password
    });

    return data;
}

export async function sendEmail(email) {
    const data = await postData('forgotPassword', {
        correo: email
    });

    return data;
}

export async function verifyToken(token) {
    const data = await getData('resetPassword', token);

    return data;
}

export async function resetPassword(password, token) {
    const data = await postData(`resetPassword/?token=${token}`, {
        contrasena: password
    });

    return data;
}

export function logout() {
    localStorage.removeItem('authToken');
}