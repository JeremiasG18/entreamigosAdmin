import { postData, getData } from './api.js';

export async function facility() {
    const token = localStorage.getItem('authToken');    
    
    const response = await getData('registerFacility', null, token);
    
    return response
}

export async function saveFacility(name, phone, address, lat, long, img, mp, accion='actualizar') {
    const token = localStorage.getItem('authToken');    
    
    const data = {
        name: name,
        phone: phone,
        address: address,
        latitude: lat,
        longitude: long,
        image: img,
        mercado_pago: mp
    };    

    const response = await postData('registerFacility', data, null, token);

    return response;
}