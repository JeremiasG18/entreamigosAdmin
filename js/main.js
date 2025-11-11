import { login, sendEmail, resetPassword, register, verifyToken } from './auth.js';
import { facility, saveAvailability, saveFacility, saveFields } from './admin.js';

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

        if(window.confirm('Quieres cerrar sesión?') === true){
            localStorage.removeItem('authToken');
            window.location.href = '../../index.html';
        }

    });
}

// admin
if (url.includes('dashboard')) {
    
    if (!localStorage.getItem("authToken")) {
        window.location.href = '../../index.html';
    }
}

if (url.includes('facility')) {

    document.addEventListener('DOMContentLoaded', async () => {
        const { status = null, message = null, availability = null, types_fields = null, fields = null, facilities = null, token = null } = await facility();

        if (message === 'Token inválido o expirado') {
            localStorage.removeItem('authToken');
            window.location.href = '../../../index.html';
            return;
        }

        // Campos - Complejos
        const id = document.getElementById('id');
        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const address = document.getElementById('address');
        const uploadImage = document.getElementById('image');
        const imagePreview = document.getElementById('imgfacility');
        const mp = document.getElementById('mp');

        // Campos - Disponibilidad
        const actionAvailability = document.getElementById('actionAvailability');

        if (message !== null) {
            // complejo
            const p = id.nextElementSibling;
            p.textContent = message;
            document.getElementById('fmDataFacility').value = 'registrar';
            document.getElementById('btn-action-facility').value = 'Registrar complejo';
            imagePreview.classList.add('hidden');
        }

        if (availability === null) {
            // disponibilidad
            document.querySelector('.pAvailability').textContent = 'Registra datos de disponibilidad del complejo.';
            document.getElementById('btn-action-availability').value = 'Registrar disponibilidad';
        }

        if (fields === null) {
            // canchas
            document.querySelector('.pFields').textContent = 'Registra datos de la/s canchas que posee su complejo.';
            document.getElementById('btn-action-field').value = 'Registrar canchas';
        }

        // disponibilidad
        actionAvailability.value = availability !== null ? 'actualizar' : 'registrar';

        if(facilities !== null){
            // Información del complejo
            name.value = facilities.nombre;
            phone.value = facilities.telefono;
            address.value = facilities.ubicacion;

            const latitud = '-26.183754998440932';
            const longitud = '-58.2242295528441';
    
            const url = `https://www.google.com/maps?q=${latitud},${longitud}&z=16&hl=es&output=embed`;
            document.getElementById('mapa').src = url;

            mp.value = facilities.id_mp;
            imagePreview.src = `http://localhost:8000/${facilities.foto_url}`;

            // Disponibilidad
            if (availability !== null) {    
                crearDisponibilidad(availability);
            }

            // Canchas del complejo
            if (fields !== null) {
                for (let i = 0; i < fields.length; i++) {
                    crearCanchas(fields[i], types_fields);
                }    
            }
            
        }

        uploadImage.addEventListener('change', (e) => {
            const imagen = e.target.files[0];
            
            if (imagen) {
                imagePreview.classList.remove('hidden');
                const lector = new FileReader();
    
                lector.onload = function(e) {
                    imagePreview.src = e.target.result;
                }
    
                lector.readAsDataURL(imagen);
            }
            
        });

        document.querySelector('.formFacility')
        .addEventListener('submit', async (e) => {
            e.preventDefault();

            const accion = document.getElementById('fmDataFacility');
            const formData = new FormData();

            if (accion.value === 'registrar') {
                formData.append('id_usuario', token.id);
            }else{
                formData.append('id_complejo', facilities.id);
            }

            formData.append('nombre', name.value);
            formData.append('telefono', phone.value);
            formData.append('ubicacion', address.value);
            formData.append('latitud', '-26.183754998440932');
            formData.append('longitud', '-58.2242295528441');
            formData.append('foto_complejo', uploadImage.files[0]);
            formData.append('id_mp', mp.value);

            const response = await saveFacility(formData, accion.value);

            const p = document.createElement('p');
            const next = imagePreview.nextElementSibling;
            if (next?.matches('p')) {
                next.remove();
            }
            imagePreview.insertAdjacentElement('afterend', p);

            if (response.status === 'ok') {
                alert(response.message);
                window.location.reload();
            }else{
                p.setAttribute('class', 'message message-error');
            }

            p.textContent = response.message

            setTimeout(() => {
                p.remove();
            }, 2000);
        });

        // Disponibilidad - agregar o quitar dias
        const days = document.querySelectorAll('.days');
        days.forEach(day => {
            day.addEventListener('change', (e) => {            
                
                const avai = day.parentNode;
                const time = avai.nextElementSibling;
    
                if (day.checked) {                
                    time.innerHTML = `
                        <p>Abre</p>
                        <input type="time" class="open-time">
                        <p>Cierra</p>
                        <input type="time" class="close-time">
                    `;
                }else{
                    time.innerHTML = '';
                }
            }) 
        });
        
        // Disponibilidad - enviar formulario
        document.querySelector('.formAvailability')
        .addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const bloques = document.querySelectorAll('.availability-datetime');
            const disponibilidad = [];
    
            bloques.forEach(bloque => {
                const checkbox = bloque.querySelector('.days');
                const open = bloque.querySelector('.open-time');
                const close = bloque.querySelector('.close-time');
    
                if (checkbox.checked) {
                    disponibilidad.push({
                    dia: checkbox.value,
                    abre: open.value || null,
                    cierra: close.value || null
                    });
                }
            });

            let response;
    
            if (facilities !== null) {
                response = await saveAvailability(facilities.id, disponibilidad, actionAvailability.value);
            }else{
                response = {
                    status: 'error',
                    message: 'Por favor primero registra tu complejo!'
                };
            }
    
            const p = document.createElement('p');
            
            const btnAvailability = document.getElementById('btn-action-availability');

            alerta(response, btnAvailability, p, 'beforebegin');
            setTimeout(() => {
                p.remove();
            }, 4000);
    
        });

        let numberField = 0;
        
        document.getElementById('addField')
        .addEventListener('click', () => {
            if (types_fields !== null) {
                numberField++;
                crearCanchas(null, types_fields, numberField);
            }else{
                const response = {
                    status: 'error',
                    message: 'Por favor primero registra tu complejo!'
                };
                const p = document.createElement('p');
            
                const saveFieldsButton = document.getElementById('btn-action-field');
    
                alerta(response, saveFieldsButton, p, 'beforebegin');
                setTimeout(() => {
                    p.remove();
                }, 4000);
            }
    
        });

        document.querySelector('.formFields')
        .addEventListener('submit', async (e) => {
            e.preventDefault()
            
            const data = [];
    
            const fields = document.querySelector('.fields');
            const id = fields.querySelectorAll('button');
            const precio = fields.querySelectorAll('input');
            const tipo = fields.querySelectorAll('select');            
            for (let i = 0; i < precio.length; i++) {
                data.push({
                    id: id[i].getAttribute('data-id'),
                    precio: precio[i].value,
                    tipo: tipo[i].value
                });
            }

            let response;
            if (facilities !== null) {
                response = await saveFields(facilities.id, data);
            }else{
                response = {
                    status: 'error',
                    message: 'Por favor primero registra tu complejo!'
                };
            }
    
            const p = document.createElement('p');
        
            const saveFieldsButton = document.getElementById('btn-action-field');

            alerta(response, saveFieldsButton, p, 'beforebegin');
            setTimeout(() => {
                p.remove();
            }, 4000);
                
        });

    });

};

// facility funciones
function reenumerarCanchas() {
    const labels = document.querySelectorAll('.field-action p');
    labels.forEach((p, index) => {
        p.textContent = `Cancha ${index + 1}`;
    });
}

function crearCanchas(canchas = null, tipos = null, numberField) {
    const fields = document.querySelector('.fields');        

    const button = document.createElement('button');
    button.textContent = "x";
    button.setAttribute('type', 'button');    
    button.setAttribute('data-id', canchas?.id);
    
    const p = document.createElement('p');
    p.textContent = `Cancha ${numberField}`;
    
    const div = document.createElement('div');
    div.classList.add('field-action');

    div.append(button, p);
    
    const inputField = document.createElement('input');
    
    inputField.setAttribute('placeholder', 'Precio');
    inputField.setAttribute('type', 'text');
    inputField.value = canchas?.precio ? canchas.precio : '';

    const select = document.createElement('select');
    select.classList.add('option');    

    tiposCanchas(canchas?.id_tipo, tipos, select);
    
    fields.append(div, inputField, select);
    
    button.addEventListener('click', () => {
        div.remove();
        inputField.remove();
        select.remove();    
        reenumerarCanchas();
    });

    reenumerarCanchas();
}

function tiposCanchas(tipo = null, tipos = null, select) {
    for (let i = 0; i < tipos.length; i++) {
        const option = document.createElement('option');
        option.textContent = tipos[i]['descripcion'];
        option.value = tipos[i]['id'];
        select.appendChild(option);

        if (tipo !== null && tipo == option.value) {
            option.setAttribute('selected', true)
        }
    }
}

function crearDisponibilidad(disponibilidad) {
    const checkbox = document.querySelectorAll('.days');
    for (let i = 0; i < disponibilidad.length; i++) {
        const dias_semana = disponibilidad[i]['dia_semana'];
        const hora_apertura = disponibilidad[i]['hora_apertura'];
        const hora_cierre = disponibilidad[i]['hora_cierre'];

        for (let j = 0; j < checkbox.length; j++) {
            const diasCheckbox = checkbox[j].value;
            if (diasCheckbox === dias_semana) {
                checkbox[j].checked = true;

                const dayAvailable = checkbox[j].parentNode;
                const time = dayAvailable.nextElementSibling;
                
                time.innerHTML = `
                    <p>Abre</p>
                    <input type="time" class="open-time" value="${hora_apertura}">
                    <p>Cierra</p>
                    <input type="time" class="close-time" value="${hora_cierre}">
                `;
            }
        }
    }
}

function alerta(respuesta, elmt2, elmt3, posicion) {
    elmt2.insertAdjacentElement(posicion, elmt3);
            
    if (respuesta.status === 'ok') {
        elmt3.setAttribute('class', 'message message-ok');
    }else{
        elmt3.setAttribute('class', 'message message-error');
    }

    elmt3.style.gridColumn = 'span 3';
    elmt3.style.fontSize = '1em';

    elmt3.textContent = respuesta.message;
}