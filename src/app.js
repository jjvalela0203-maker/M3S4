// ═══════════════════════════════════════════════════════
//  NAVEGACIÓN ENTRE VISTAS
// ═══════════════════════════════════════════════════════

/*
  Guardamos referencias a las tres vistas en un objeto.
  Así podemos acceder a cualquiera con views['login'], views['dashboard'], etc.
  Es más limpio que hacer getElementById cada vez que queremos navegar.
*/
const views = {
  login:     document.getElementById('view-login'),
  register:  document.getElementById('view-register'),
  dashboard: document.getElementById('view-dashboard'),
};

/*
  navigate(viewName) es la función central de la SPA.
  Lo que hace:
  1. Recorre TODAS las vistas y les quita la clase "active" (las oculta)
  2. Le pone "active" solo a la vista que queremos mostrar
  3. Hace scroll al tope para que siempre empiece desde arriba

  Gracias a esto nunca recargamos la página, solo mostramos/ocultamos divs.
*/
function navigate(viewName) {
  Object.values(views).forEach(v => v.classList.remove('active'));
  views[viewName].classList.add('active');
  window.scrollTo(0, 0);
}


// ═══════════════════════════════════════════════════════
//  USUARIOS (login con localStorage)
// ═══════════════════════════════════════════════════════

/*
  Lista de usuarios de prueba.
  Solo se usa la primera vez que alguien abre la app,
  cuando localStorage todavía no tiene nada guardado.
*/
const initialUsers = [
  {
    username: "neyder.ramirez",
    password: "123Admin.**",
    fullname: "Neyder Ramirez",
    age: 22,
    email: "neyderramirez@gmail.com",
    description: "un valecita de riwi",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtTOnh2HTt1VNUg6Bc-0PXGioqjs0yHiDsxw&s"
  },
  {
    username: "juan.bustamante",
    password: "HJ_503",
    fullname: "Juan Bustamante",
    age: 24,
    email: "juanbustamante@gmail.com",
    description: "un pá de riwi",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMfANTCUetDzc96ibKIOHc0BRQ5Ax9_bCKFA&s"
  },
  {
    username: "kevin.mendoza",
    password: "OnlyEnglish.**",
    fullname: "Kevin Mendoza",
    age: 22,
    email: "kevinmendoza@gmail.com",
    description: "un bilingue de riwi",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmukQvYkn42kSsuHU91OyhVDie4lmRUNFzcg&s"
  }
];

/*
  Si localStorage no tiene usuarios guardados todavía,
  metemos la lista inicial. Esto solo pasa la primera vez.
  Las siguientes veces ya encuentra datos y no sobreescribe nada.
*/
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(initialUsers));
}


// ═══════════════════════════════════════════════════════
//  FORMULARIO DE LOGIN
// ═══════════════════════════════════════════════════════

document.getElementById("registerLink").addEventListener("click", (e) => {
  e.preventDefault(); // Evita que el <a> navegue a otra página
  navigate('register');
});

document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que el form recargue la página al enviarse

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Por favor ingresa usuario y contraseña.");
    return;
  }

  const currentUsers = JSON.parse(localStorage.getItem("users")) || [];

  /*
    find() recorre el array y devuelve el primer elemento
    que cumpla la condición. Si no encuentra ninguno, devuelve undefined.
    Aquí buscamos un usuario cuyo username Y password coincidan.
  */
  const user = currentUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    /*
      Guardamos el usuario activo en localStorage bajo la clave "user" (singular).
      Así cuando el usuario recargue la página, sabemos que ya estaba logueado.
    */
    localStorage.setItem("user", JSON.stringify(user));
    loadDashboard(); // Carga el contenido del dashboard
    navigate('dashboard'); // Muestra la vista dashboard
  } else {
    alert("Usuario o contraseña incorrectos.");
  }
});


// ═══════════════════════════════════════════════════════
//  FORMULARIO DE REGISTRO
// ═══════════════════════════════════════════════════════

document.getElementById("cancel").addEventListener("click", () => {
  navigate('login');
});

/*
  Aplicamos el límite de fecha máxima (hoy) a TODOS los inputs de tipo date
  usando querySelectorAll. Así no importa cuántos haya en el documento,
  todos quedan limitados con una sola línea en lugar de hacerlo uno por uno.
*/
document.querySelectorAll("input[type='date']").forEach(input => {
  input.max = new Date().toISOString().split("T")[0];
});

/*
  calculateAge recibe una fecha de nacimiento en formato "YYYY-MM-DD"
  y devuelve la edad en años completos.
  La lógica del mes y día sirve para no contar el año actual
  si el cumpleaños todavía no ha llegado.
*/
const calculateAge = (birthdate) => {
  if (!birthdate) return "N/A";
  const birthDateObj = new Date(birthdate);
  if (isNaN(birthDateObj.getTime())) return "N/A";
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  return age;
};

document.getElementById("registerForm").addEventListener("submit", (event) => {
  event.preventDefault();

  /*
    Nota: los id del formulario de registro ahora tienen prefijo "reg-"
    para no chocar con los id del formulario de gestión de tarjetas.
  */
  const newusername = document.getElementById("newusername").value;
  const newpassword = document.getElementById("newpassword").value;
  const name        = document.getElementById("fullname").value;
  const birthdate   = document.getElementById("reg-birthdate").value;
  const email       = document.getElementById("email").value;
  const description = document.getElementById("reg-description").value;
  const url         = document.getElementById("reg-url").value;

  if (!newusername || !newpassword || !name || !birthdate || !email || !description || !url) {
    alert("Hey completa la información");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(user => user.username === newusername)) {
    alert("El usuario ya existe, por favor elige otro nombre de usuario.");
    return;
  }

  users.push({
    username: newusername,
    password: newpassword,
    fullname: name,
    age: calculateAge(birthdate),
    email,
    description,
    url
  });

  localStorage.setItem("users", JSON.stringify(users));
  alert("Usuario registrado exitosamente. Ahora puedes iniciar sesión.");
  document.getElementById("registerForm").reset();
  navigate('login');
});


// ═══════════════════════════════════════════════════════
//  DASHBOARD: tarjeta del usuario logueado
// ═══════════════════════════════════════════════════════

/*
  loadDashboard hace dos cosas:
  1. Pinta la tarjeta del usuario logueado (lo que ya hacía antes)
  2. Llama a refreshCards() para cargar las tarjetas del JSON
     (esto es lo nuevo que agregamos)

  Es async porque refreshCards() usa fetch, que es una operación
  asíncrona, y necesitamos esperar a que termine con "await".
*/
async function loadDashboard() {
  const userString = localStorage.getItem("user");
  let user = null;

  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {
      console.error("Error al parsear el usuario:", e);
      localStorage.removeItem("user");
    }
  }

  if (!user || !user.fullname || !user.username || !user.password || !user.age || !user.email || !user.description || !user.url) {
    navigate('login');
    return;
  }

  // Pinta la tarjeta del usuario logueado (igual que antes)
  document.getElementById("dashboard-title").textContent = `Bienvenido/a, ${user.fullname}`;
  document.getElementById("dashboard-container").innerHTML = `
    <div class="card">
      <article>
        <h3 class="card-title">${user.fullname}</h3>
      </article>
      <figure class="card-figure">
        <img src="${user.url}" alt="${user.fullname}" class="card-image" />
        <span class="card-age">Edad: ${user.age}</span>
      </figure>
      <article class="card-description">
        <p><b>Email:</b> ${user.email}</p>
        <p><b>Description:</b><br>${user.description}</p>
      </article>
    </div>`;

  /*
    Después de pintar la tarjeta del usuario,
    cargamos las tarjetas del JSON.
    "await" hace que JavaScript espere a que refreshCards() termine
    antes de continuar. Sin await, las tarjetas podrían intentar
    pintarse antes de que el fetch haya respondido.
  */
  await refreshCards();
}


// ═══════════════════════════════════════════════════════
//  GESTIÓN DE TARJETAS (JSON-server)
// ═══════════════════════════════════════════════════════

/*
  getData hace un fetch al servidor local de json-server.
  fetch devuelve una Promise, por eso usamos async/await.
  .json() también devuelve una Promise, por eso también tiene await.
  Al final, data es un array de objetos con las tarjetas.
*/
async function getData() {
  const response = await fetch("http://localhost:3000/micaela");
  const data = await response.json();
  return data;
}

/*
  refreshCards es la función principal de la gestión.
  Cada vez que se llama:
  1. Limpia el contenedor de tarjetas
  2. Pide los datos al servidor
  3. Por cada elemento del array, crea una tarjeta HTML y la agrega al DOM
*/
async function refreshCards() {
  const container = document.getElementById("card-data");
  container.innerHTML = ""; // Limpiamos antes de volver a pintar

  try {
    const data = await getData();

    if (data.length === 0) {
      container.innerHTML = "<p style='color:var(--text-muted); padding: 2rem;'>No hay tarjetas todavía.</p>";
      return;
    }

    data.forEach((element) => {
      const { name, lastname, url, description, birthdate } = element;

      /*
        Creamos un div vacío y le metemos HTML con innerHTML.
        Usamos template literals (backticks) para poder meter
        variables directamente dentro del HTML con ${variable}.
      */
      const card = document.createElement("div");
      card.className = "card";

      /*
        dataset.name guarda el nombre en el elemento HTML como atributo de datos.
        Esto lo usamos después en el buscador para filtrar sin hacer otro fetch.
      */
      card.dataset.name = `${name} ${lastname}`.toLowerCase();

      card.innerHTML = `
        <article>
          <h3 class="card-title">${name} ${lastname}</h3>
        </article>
        <figure class="card-figure">
          <img src="${url}" alt="${name} ${lastname}" class="card-image" />
          <span class="card-age">Edad: ${calculateAge(birthdate)}</span>
        </figure>
        <article class="card-description">
          <p>${description}</p>
        </article>
        <div class="card-actions">
          <button class="btn-edit">Editar</button>
          <button class="btn-delete">Eliminar</button>
        </div>`;

      /*
        Buscamos los botones DENTRO de esta tarjeta específica con card.querySelector.
        Si usáramos document.querySelector encontraría siempre el primero del documento,
        no el de esta tarjeta. Por eso es importante buscar dentro de "card".
      */
      card.querySelector(".btn-delete").addEventListener("click", async () => {
        const confirm1 = confirm(`¿Eliminar a ${name}?`);
        if (!confirm1) return;
        await fetch(`http://localhost:3000/micaela/${element.id}`, { method: "DELETE" });
        refreshCards(); // Recargamos las tarjetas después de eliminar
      });

      card.querySelector(".btn-edit").addEventListener("click", async () => {
        if (!confirm("¿Deseas editar esta tarjeta?")) return;

        const validFields = ["name", "lastname", "description", "birthdate", "url"];
        const fieldToEdit = prompt("¿Qué campo deseas editar?\n(name, lastname, description, birthdate, url)");

        if (!fieldToEdit || !validFields.includes(fieldToEdit)) {
          alert("Campo no válido.");
          return;
        }

        const newValue = prompt(`Nuevo valor para "${fieldToEdit}":`, element[fieldToEdit]);
        if (!newValue) return;

        /*
          Con el spread operator (...element) copiamos todos los campos del elemento.
          Luego con [fieldToEdit]: newValue sobreescribimos solo el campo que queremos editar.
          Esto es necesario porque json-server con PUT reemplaza el objeto completo,
          no solo el campo que cambiamos.
        */
        await fetch(`http://localhost:3000/micaela/${element.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...element, [fieldToEdit]: newValue }),
        });

        refreshCards();
      });

      container.appendChild(card);
    });

  } catch (e) {
    container.innerHTML = "<p style='color:var(--danger); padding:2rem;'>Error al conectar con el servidor. ¿Está corriendo json-server?</p>";
  }
}

/*
  Botón "Nueva tarjeta": muestra el formulario y deshabilita el botón
  para que no se pueda abrir dos formularios a la vez.
*/
document.getElementById("card-new-btn").addEventListener("click", () => {
  document.getElementById("card-form").classList.remove("hidden");
  document.getElementById("card-new-btn").disabled = true;
});

/*
  Botón "Cancelar" del formulario de tarjetas:
  oculta el formulario, lo limpia y reactiva el botón "Nueva tarjeta".
  type="button" en el HTML evita que este botón haga submit del form.
*/
document.getElementById("card-cancel-btn").addEventListener("click", () => {
  document.getElementById("card-form").classList.add("hidden");
  document.getElementById("card-form").reset();
  document.getElementById("card-new-btn").disabled = false;
});

/*
  El formulario de creación escucha el evento "submit".
  Esto se dispara cuando el usuario hace clic en "Crear"
  o presiona Enter dentro del formulario.
*/
document.getElementById("card-form").addEventListener("submit", async (event) => {
  event.preventDefault(); // Evita recarga de página
  document.getElementById("card-create-btn").disabled = true; // Evita doble envío

  const name        = document.getElementById("card-name").value;
  const lastname    = document.getElementById("card-lastname").value;
  const url         = document.getElementById("card-url").value;
  const birthdate   = document.getElementById("card-birthdate").value;
  const description = document.getElementById("card-description").value;

  try {
    const response = await fetch("http://localhost:3000/micaela", {
      method: "POST",
      /*
        Sin este header, json-server no sabe que le estamos mandando JSON
        y no guarda nada. Es un error común y silencioso.
      */
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, lastname, url, birthdate, description }),
    });

    if (response.ok) {
      document.getElementById("card-form").reset();
      document.getElementById("card-form").classList.add("hidden");
      document.getElementById("card-new-btn").disabled = false;
      await refreshCards(); // Recargamos para mostrar la tarjeta nueva
    }
  } catch (e) {
    alert("Error al crear la tarjeta. ¿Está corriendo json-server?");
  } finally {
    /*
      finally siempre se ejecuta, haya error o no.
      Lo usamos para asegurarnos de reactivar el botón pase lo que pase.
    */
    document.getElementById("card-create-btn").disabled = false;
  }
});

/*
  Buscador: filtra las tarjetas que ya están en el DOM.
  NO hace un nuevo fetch, solo muestra u oculta las que ya existen.
  Compara el texto buscado con el data-name que guardamos en cada tarjeta.
*/
document.getElementById("card-search-btn").addEventListener("click", () => {
  const query = document.getElementById("card-search-input").value.toLowerCase().trim();
  const cards = document.querySelectorAll("#card-data .card");

  cards.forEach((card) => {
    const matches = !query || card.dataset.name.includes(query);
    card.style.display = matches ? "" : "none";
  });
});


// ═══════════════════════════════════════════════════════
//  LOGOUT
// ═══════════════════════════════════════════════════════

document.getElementById("logout").addEventListener("click", () => {
  if (!confirm("¿Estás seguro que quieres cerrar sesión?")) return;
  localStorage.removeItem("user"); // Eliminamos solo el usuario activo, no la lista de usuarios
  navigate('login');
});


// ═══════════════════════════════════════════════════════
//  INICIALIZACIÓN
// ═══════════════════════════════════════════════════════

/*
  Esta función se ejecuta inmediatamente cuando carga el script.
  Es una IIFE (Immediately Invoked Function Expression).
  La sintaxis (function() { ... })() significa: define la función y ejecútala ya.

  Su trabajo es revisar si ya había una sesión activa.
  Si hay usuario en localStorage y tiene todos los campos, carga el dashboard.
  Si no, muestra el login.

  Es async porque loadDashboard() ahora usa await internamente.
*/
(async function init() {
  const userString = localStorage.getItem("user");
  if (userString) {
    try {
      const user = JSON.parse(userString);
      if (user && user.fullname && user.username && user.password && user.age && user.email && user.description && user.url) {
        await loadDashboard();
        navigate('dashboard');
        return;
      }
    } catch (e) {
      localStorage.removeItem("user");
    }
  }
  navigate('login');
})();
