// Inicializa Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD22qirUR1ovtQot0vduWqey4TLYiE70HQ",
    authDomain: "examenlenguaje-7f960.firebaseapp.com",
    projectId: "examenlenguaje-7f960",
    storageBucket: "examenlenguaje-7f960.appspot.com",
    messagingSenderId: "539910255176",
    appId: "1:539910255176:web:f4c4da5620c18e621b1e7d"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Funciones de marcado
function markPresent(element) {
    const cell = element.parentElement;
    cell.innerHTML = '<span class="present">Presente</span>';
    showMessage('Asistencia marcada como presente', 'success');
}

function markAbsent(element) {
    const cell = element.parentElement;
    cell.innerHTML = '<span class="absent">Ausente</span>';
    showMessage('Asistencia marcada como ausente', 'error');
}

// Mostrar mensajes
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = type;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Remover fila
function removeRow(element) {
    const row = element.parentElement.parentElement;
    const dni = row.children[3].textContent;

    // Eliminar de Firestore
    db.collection('alumnos').where('dni', '==', dni).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            doc.ref.delete().then(() => {
                showMessage('Alumno eliminado correctamente', 'success');
                row.remove();
            }).catch((error) => {
                console.error('Error removing student: ', error);
            });
        });
    });
}

// Obtiene y muestra los estudiantes desde Firestore
db.collection('alumnos').get().then((querySnapshot) => {
    const tbody = document.getElementById('alumnos-tbody');
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="https://api.multiavatar.com/${data.nombre}.png" alt="avatar"></td>
            <td>${data.nombre}</td>
            <td>${data.apellidos}</td>
            <td>${data.dni}</td>
            <td>${data.telefono}</td>
            <td class="verificar">
                <span class="tick" onclick="markPresent(this)">✔</span>
                <span class="trash" onclick="markAbsent(this)">🗑</span>
            </td>
            <td><button onclick="removeRow(this)">Eliminar</button></td>
        `;
        tbody.appendChild(row);
    });
});

// Agrega un estudiante a Firestore
document.getElementById('añadir').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const dni = document.getElementById('dni').value;
    const telefono = document.getElementById('telefono').value;

    if (nombre === '' || apellidos === '' || dni === '' || telefono === '') {
        showMessage('Todos los campos son obligatorios', 'error');
        return;
    }

    db.collection('alumnos').add({
        nombre: nombre,
        apellidos: apellidos,
        dni: dni,
        telefono: telefono
    }).then(() => {
        showMessage('Alumno agregado correctamente', 'success');
        location.reload(); // Recargar la página para ver el nuevo alumno
    }).catch((error) => {
        console.error('Error adding student: ', error);
    });
});
