const BASE_URL = 'http://localhost:8000/';

export async function postData(endpoint, data = null, dataUrl = null, token = null, type = 'json') {
    
    let response;

    if (type === 'json') {
        response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        
    }else{
        response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: data
        });
    }
    
    return response.json();
}

export async function getData(endpoint, dataUrl = null, token = null) {
    let response;

    if (dataUrl !== null) {
        response = await fetch(`${BASE_URL}${endpoint}/?token=${dataUrl}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
    }else{
        response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
    }

    return response.json();
}

export async function putData(endpoint, data = null, dataUrl = null, token = null) {
    let response;

    if (dataUrl !== null) {
        response = await fetch(`${BASE_URL}${endpoint}/?token=${dataUrl}`, {
            method: 'put',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: data,
        });
    }else{
        response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'put',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: data,
        })
    }

    return response.json();
}