import { postData, getData } from './api.js';

export async function facility() {
    const token = localStorage.getItem('authToken');    
    
    const response = await getData('registerFacility', null, token);
    
    return response
}