\# Micaela SPA

&#x20;

Aplicación web de una sola página (SPA) construida con \*\*Vite\*\* y \*\*JSON Server\*\*, que implementa autenticación de usuarios, registro, y un sistema CRUD completo de tarjetas de personajes.

&#x20;

\---

&#x20;

\## Tecnologías utilizadas

&#x20;

\- \*\*Vite\*\* — bundler y servidor de desarrollo

\- \*\*JSON Server\*\* — API REST simulada con `db.json`

\- \*\*HTML / CSS / JavaScript vanilla\*\* — sin frameworks de UI

\- \*\*localStorage\*\* — persistencia de sesión y lista de usuarios

\---

&#x20;

\## Estructura del proyecto

&#x20;

```

micaela-spa/

├── README.md

├── index.html

├── db.json

├── package.json

└── src/

\&#x20;   ├── app.js

\&#x20;   ├── style.css

\&#x20;   └── assets/

\&#x20;       └── img/

\&#x20;           └── Trifuerza.png

```

&#x20;

\---

&#x20;

\## Instalación y uso

&#x20;

\### 1. Clonar el repositorio e instalar dependencias

&#x20;

```bash

git clone <url-del-repo>

cd micaela-spa

npm install

```

&#x20;

\### 2. Levantar JSON Server

&#x20;

JSON Server corre en el puerto `3000` y sirve los datos de `db.json`:

&#x20;

```bash

npx json-server --watch db.json --port 3000

```

&#x20;

\### 3. Levantar Vite (en otra terminal)

&#x20;

```bash

npm run dev

```

&#x20;

La app queda disponible en `http://localhost:5173` (o el puerto que asigne Vite).

&#x20;

> \\\*\\\*Importante:\\\*\\\* ambos servidores deben estar corriendo al mismo tiempo para que el CRUD funcione correctamente.

&#x20;

\---

&#x20;

\## Funcionalidades

&#x20;

\### Autenticación

\- \*\*Login\*\* con usuario y contraseña validados contra `localStorage`.

\- \*\*Registro\*\* de nuevos usuarios con los campos: username, password, nombre completo, fecha de nacimiento, email, descripción y foto (URL).

\- \*\*Persistencia de sesión\*\*: si ya había una sesión activa al recargar la página, el usuario es redirigido directamente al dashboard.

\- \*\*Logout\*\* con confirmación, que elimina solo la sesión activa sin borrar la lista de usuarios.

\### Dashboard

\- Muestra la tarjeta de perfil del usuario logueado.

\- Carga y renderiza las tarjetas del endpoint `GET /micaela` de JSON Server.

\### CRUD de tarjetas (JSON Server)

| Acción | Método HTTP | Endpoint |

|---|---|---|

| Listar tarjetas | `GET` | `/micaela` |

| Crear tarjeta | `POST` | `/micaela` |

| Editar tarjeta | `PUT` | `/micaela/:id` |

| Eliminar tarjeta | `DELETE` | `/micaela/:id` |

&#x20;

\- \*\*Crear:\*\* formulario con campos name, lastname, foto, fecha de nacimiento y descripción.

\- \*\*Editar:\*\* mediante prompts que permiten modificar un campo a la vez.

\- \*\*Eliminar:\*\* con confirmación antes de borrar.

\- \*\*Buscar:\*\* filtro en tiempo real sobre las tarjetas ya renderizadas en el DOM (sin hacer un nuevo fetch).

\### Cálculo de edad

La función `calculateAge(birthdate)` calcula la edad exacta en años a partir de una fecha de nacimiento en formato `YYYY-MM-DD`, teniendo en cuenta si el cumpleaños del año actual ya pasó o no.

&#x20;

\---

&#x20;

\## Datos de prueba (usuarios iniciales)

&#x20;

Si `localStorage` no tiene usuarios guardados, se cargan automáticamente estos tres al iniciar la app:

&#x20;

| Username | Password |

|---|---|

| `neyder.ramirez` | `123Admin.\\\*\\\*` |

| `juan.bustamante` | `HJ\\\_503` |

| `kevin.mendoza` | `OnlyEnglish.\\\*\\\*` |

&#x20;

\---

&#x20;

\## Navegación (SPA)

&#x20;

La app tiene tres vistas definidas en el HTML:

&#x20;

\- `#view-login` — pantalla de inicio de sesión

\- `#view-register` — formulario de registro

\- `#view-dashboard` — panel principal con tarjetas

La función `navigate(viewName)` controla qué vista está activa añadiendo/quitando la clase `active`, sin recargar la página en ningún momento.

&#x20;

\---

&#x20;

\## Notas de desarrollo

&#x20;

\- Los `id` de los inputs usan prefijos (`reg-`, `card-`) para evitar colisiones entre el formulario de registro y el de gestión de tarjetas.

\- El atributo `data-name` en cada tarjeta del DOM permite filtrar por nombre sin necesidad de hacer un fetch adicional.

\- El botón "Crear" se deshabilita mientras se envía el formulario para evitar envíos duplicados; `finally` garantiza que siempre se reactive.

&#x20;

