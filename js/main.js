import { login, sendEmail, resetPassword, register, verifyToken } from './auth.js';
import { facility, saveFacility } from './admin.js';

const url = window.location.href;

// auth
if (url.includes('index.html') || url === 'http://127.0.0.1:5500/') {

    const token = localStorage.getItem('authToken');
    
    if (token) {
        window.location.href="./html/admin/dashboard.html";
    }

    document.querySelector('#btn-login').addEventListener('click', async (e) => {
        e.preventDefault();
    
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        const response = await login(email, password);        

        const message = document.getElementById('password').nextElementSibling;
        
        message.setAttribute('class', 'message');
        
        if (response.status === 'error') {
            message.classList.add('message-error');
            message.textContent = response.message;
        }else{
            window.location.href = './html/admin/dashboard.html';
        }
    });
}

if (url.includes('register')) {
    document.getElementById('btn-register').addEventListener('click', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await register(name, lastname, email, password);

        const message = document.getElementById('password').nextElementSibling;
        message.setAttribute('class', 'message');

        if (response.status === 'error') {
            message.classList.add('message-error')
            message.textContent = response.message;
        }else{
            window.location.href = '../../index.html';
        }

    })
}

if (url.includes('forgotPassword')) {
    document.querySelector('#btn-send-email').addEventListener('click', async (e) => {
        e.preventDefault();
    
        const email = document.getElementById('email').value;
    
        const response = await sendEmail(email);
        
        const message = document.getElementById('email').nextElementSibling;
        message.setAttribute('class', 'message');

        if (response.status === 'error') {
            message.classList.add('message-error');
            message.textContent = response.message;
        }else{
            message.classList.add('message-ok');
            message.textContent = response.message;
        }
    });
}

if (url.includes('resetPassword')) {

    document.addEventListener('DOMContentLoaded', async (e) => {        
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        
        const response = await verifyToken(token);

        if (response.status === 'ok') {
            document.querySelector('form').innerHTML = `
                <input type="password" name="password" id="password" placeholder="Ingrese su nueva contraseña" required>
                <input type="password" name="passwordConfirm" id="passwordConfirm" placeholder="Confirme su nueva contraseña" required>
                <p></p>
                <input type="button" value="Restablecer contraseña" class="btn btn_important" id="btn-reset-password">
            `;

            document.querySelector('#btn-reset-password').addEventListener('click', async (e) => {
                e.preventDefault();

                const password = document.getElementById('password').value;
                const passwordConfirm = document.getElementById('passwordConfirm').value;

                const message = document.getElementById('passwordConfirm').nextElementSibling;
                message.setAttribute('class', 'message');

                let response;                

                if (password === passwordConfirm) {
                    response = await resetPassword(password, token);
                }else{
                    response = {
                        status: 'error',
                        message: 'Las contraseñas que ingreso no coinciden!'
                    };
                }                

                if (response.status === 'error') {
                    message.classList.add('message-error');
                    message.textContent = response.message;
                }else{
                    message.classList.add('message-ok');
                    message.textContent = response.message;
                }
            });
        }else{
            document.querySelector('.auth-message').textContent = response.message;
        }
        
    })
}

// logout
if (url.includes('dashboard') || url.includes('facility')) {
    document.getElementById('logout')
    .addEventListener('click', (e) => {
        e.preventDefault();
        
        localStorage.removeItem('authToken');
        window.location.href = '../../index.html';
    });
}

// admin
if (url.includes('dashboard')) {
    
    if (!localStorage.getItem("authToken")) {
        window.location.href = '../../index.html';
    }
}

if (url.includes('facility')) {
    
    addEventListener('DOMContentLoaded', async () => {
        const response = await facility();

        if (response.message === 'Token inválido o expirado') {
            localStorage.removeItem('authToken');
            window.location.href = '../../../index.html';
        }
    
        if (response.message === 'Por favor registra tu complejo!') {
            const p = document.querySelector('.formFacility').nextElementSibling;
            p.textContent = response.message;
        }
        
        document.getElementById('name').value = response.facility.nombre;
        document.getElementById('phone').value = response.facility.telefono;
        document.getElementById('address').value = response.facility.ubicacion;
        document.getElementById('mp').value = response.facility.id_mp;

        const latitud = '-26.183754998440932';
        const longitud = '-58.2242295528441';

        console.log(latitud, longitud);
        

        const url = `https://www.google.com/maps?q=${latitud},${longitud}&z=16&hl=es&output=embed`;
        document.getElementById('mapa').src = url;
        
    });

}

  // AIzaSyCw1sulYiZqKQHyHqxlE2Ej3IhYnmrrSZA