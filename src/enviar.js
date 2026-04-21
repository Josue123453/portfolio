// Inicializar EmailJS
emailjs.init("IcltBfSefidwqii4E");

const btn = document.getElementById('button');
const form = document.getElementById('form');
const inputNombre = document.getElementById("name");
const inputCorreo = document.getElementById("email");
const inputMensaje = document.getElementById("mensaje");

const errorNombre = document.getElementById("errorNombre");
const errorCorreo = document.getElementById("errorCorreo");
const errorMensaje = document.getElementById("errorMensaje");

// Expresiones regulares
const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexMensaje = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ.,;:!¡?¿()\s]+$/;

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo = "success") {
    const div = document.getElementById("mensajeExito");
    if (!div) return;

    div.className = "mt-4 px-4 py-3 rounded-xl text-white font-medium transition-all duration-300";

    if (tipo === "success") {
        div.classList.add("bg-green-500", "opacity-100");
    } else {
        div.classList.add("bg-red-500", "opacity-100");
    }

    div.textContent = texto;
    div.classList.remove("hidden");

    setTimeout(() => {
        div.classList.add("hidden");
    }, 3000);
}

// Validación de formulario
function validarFormulario() {
    let valido = true;

    // Limpiar errores
    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorMensaje.textContent = "";

    // Validar Nombre
    if (inputNombre.value.trim() === "" || !regexNombre.test(inputNombre.value.trim())) {
        errorNombre.textContent = "El nombre solo puede contener letras y espacios ni estar vacio";
        valido = false;
    }

    // Validar Correo
    if (inputCorreo.value.trim() === "" || !regexEmail.test(inputCorreo.value.trim())) {
        errorCorreo.textContent = "Correo inválido ni estar vacio";
        valido = false;
    }
    // Validar Mensaje
    if (inputMensaje.value.trim() === "" || !regexMensaje.test(inputMensaje.value.trim())) {
        errorMensaje.textContent = "El mensaje contiene caracteres no permitidos ni puede estar vacío";
        valido = false;
    }

    return valido;
}


// Enviar formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    btn.disabled = true;
    btn.textContent = "Enviando...";

    const serviceID = 'default_service';
    const templateID = 'template_pps2puv';

    try {
        await emailjs.sendForm(serviceID, templateID, form);
        mostrarMensaje("Mensaje enviado correctamente ✅", "success");
        form.reset();
    } catch (err) {
        console.error(err);
        mostrarMensaje("Error al enviar ❌", "error");
    } finally {
        btn.disabled = false;
        btn.textContent = "Enviar mensaje";
    }
});

// cargar pdf
function openPDF(file, title) {
  localStorage.setItem("pdf_url", file);
  localStorage.setItem("pdf_title", title);
  window.location.href = "viewer.html";
}

// Scroll
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    links.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});
//descarga de CV
function descargarCV() {
    const link = document.createElement("a");
    link.href = "/docs/cv_josue_cruz.pdf";
    link.download = "CV_Josue_Cruz.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}