document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reservation-form");
  const dateInput = document.getElementById("date");
  const timeSelect = document.getElementById("time");
  const phoneInput = document.getElementById("phone");
  const messageDiv = document.getElementById("message");
  const phoneErrorDiv = document.getElementById("phone-error");

  // Generar opciones de tiempo en intervalos de 30 minutos
  const generateTimeOptions = () => {
    const start = 8; // Hora de inicio: 8:00 AM
    const end = 20; // Hora de fin: 8:00 PM

    for (let hour = start; hour < end; hour++) {
      let period = hour < 12 ? "AM" : "PM";
      let hourFormatted = hour % 12 === 0 ? 12 : hour % 12;

      timeSelect.appendChild(
        new Option(
          `${hourFormatted}:00 ${period}`,
          `${hourFormatted}:00 ${period}`
        )
      );
    }
  };

  generateTimeOptions();

  // Cargar reservas desde localStorage
  const reservations = JSON.parse(localStorage.getItem("reservations")) || {};

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const date = dateInput.value;
    const time = timeSelect.value;
    const phone = phoneInput.value;

    // Validaciones
    if (!date) {
      showAlert("Por favor, selecciona una fecha.", "error");
      return;
    }

    if (!time) {
      showAlert("Por favor, selecciona una hora.", "error");
      return;
    }

    // Validación del teléfono
    const phonePattern = /^\d{8,13}$/; // Asegúrate de que sea entre 8 y 13 dígitos
    if (!phonePattern.test(phone)) {
      phoneErrorDiv.textContent =
        "El número de teléfono debe contener solo números y entre 8 y 13 dígitos.";
      return;
    } else {
      phoneErrorDiv.textContent = ""; // Limpiar mensaje de error
    }

    // Crear una clave combinada para fecha y hora
    const reservationKey = `${date}T${time}`;

    // Si ya hay una reserva para esa fecha y hora
    if (reservations[reservationKey]) {
      showAlert(
        "Lo sentimos, ya se ha realizado una reserva para esta hora. Por favor, elige otra hora.",
        "error"
      );
      return;
    }

    // Si no hay reserva para esa fecha y hora
    reservations[reservationKey] = true;

    // Guardar reservas en localStorage
    localStorage.setItem("reservations", JSON.stringify(reservations));

    // Si todas las validaciones han pasado, enviar los datos
    const data_info = {
      nombre: document.getElementById("first-name").value,
      apellido: document.getElementById("last-name").value,
      correo_electronico: document.getElementById("email").value,
      numero_telefono: phone, // Usar el número validado
      fecha: date,
      hora: time,
    };

    // Llamar a la función para enviar los datos a la API
    get_parameter(data_info);

    showAlert("¡Reserva realizada con éxito!", "success");
    form.reset();
  });

  function showAlert(message, type) {
    const icon = type === "error" ? "error" : "success"; // Establecer icono según el tipo
    Swal.fire({
      icon: icon,
      title: type === "error" ? "Error" : "Éxito",
      text: message,
      confirmButtonText: "Aceptar",
    });
  }

  async function get_parameter(data) {
    const url = "http://Clinica.somee.com/api/Insert";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
        redirect: "follow",
      });

      if (!response.ok) {
        console.log("sucedio un error con la respuesta");
        showAlert("Error al enviar los datos. Inténtalo de nuevo.", "error");
      }

      const result = await response.json();
      console.log(result);
    } catch {
      console.log("sucedio un error deserealizando la data");
      showAlert("Error en el envío de datos. Inténtalo más tarde.", "error");
    }
  }

  // Cambiar la apariencia de la barra de navegación al hacer scroll
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Desplazamiento suave al hacer clic en los enlaces del navbar
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
});
