import { postData, getData, putData } from './api.js';

const token = localStorage.getItem('authToken');

export async function facility() {
    const response = await getData('registerFacility', null, token);
    
    return response
}

export async function saveFacility(data, accion='actualizar') {
    let response;
    if (accion === 'actualizar') {       
        response = await postData('updateFacility', data, null, token, 'formData');
    }else{
        response = await postData('registerFacility', data, null, token, 'formData');
    }

    return response;
}

export async function saveAvailability(id_complejo, availability, accion) {
    const data = {
        id_complejo: id_complejo,
        disponibilidad: availability
    };
        
    let response;

    if (accion === 'registrar') {
        response = await postData('saveAvailability', data, null, token);
    }else{
        response = await postData('updateAvailability', data, null, token);
    }

    return response;
    
}

export async function saveFields(id_complejo, fields) {    
    const response = await postData('saveFields', {id_complejo: id_complejo, canchas: fields}, null, token);

    return response;
}