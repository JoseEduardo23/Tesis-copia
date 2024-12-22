// Función para manejar el registro
document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const email = document.getElementById('emailRegistro').value;
    const password = document.getElementById('passwordRegistro').value;

    // Llamar al endpoint de registro en el backend
    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, nombre, apellido, telefono, direccion }),
        });

        const data = await response.json();
        alert(data.msg); 
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        alert('Hubo un error al registrar el usuario.');
    }
    
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.msg || 'Error desconocido');
            return;
        }

        const data = await response.json();

        localStorage.setItem('token', data.token);

        alert(`¡Login exitoso! \nNombre: ${data.user.nombre}\nCorreo: ${data.user.email}`)
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Hubo un error al iniciar sesión.');
    }
});