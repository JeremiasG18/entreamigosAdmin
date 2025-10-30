const BASE_URL = 'http://localhost:8000/';

export async function postData(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function getData(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}/?token=${data}`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.json();
}