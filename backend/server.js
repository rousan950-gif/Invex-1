// =============================================================
// server.js
// Evidencia: GA7-220501096-AA5-EV01
// Rol: Integrante 1 - Backend Developer (Servidor y API)
//
// Este archivo contiene la lógica del servidor Node.js y los
// endpoints del servicio web para el caso "Login y Registro".
// =============================================================

// Importamos Express, el framework que nos permite crear el
// servidor y definir las rutas (endpoints) de la API REST.
const express = require("express");

// Importamos el middleware CORS, necesario para que el frontend
// (que corre en otro origen/puerto) pueda hacer peticiones a
// este backend sin ser bloqueado por el navegador.
const cors = require("cors");

// Creamos la aplicación de Express.
const app = express();

// Puerto en el que escuchará el servidor. El frontend consumirá
// la API en http://localhost:3000 según lo definido en la guía.
const PORT = 3000;

// -------------------------------------------------------------
// MIDDLEWARES
// -------------------------------------------------------------

// Habilitamos CORS para todas las rutas, permitiendo que el
// frontend (index.html + script.js) consuma esta API sin
// restricciones de origen cruzado.
app.use(cors());

// Middleware que le permite a Express interpretar el cuerpo
// (body) de las peticiones que llegan en formato JSON. Sin esto,
// req.body llegaría undefined al intentar leer los datos del
// formulario de registro o login.
app.use(express.json());

// -------------------------------------------------------------
// "BASE DE DATOS" TEMPORAL EN MEMORIA
// -------------------------------------------------------------
// Para esta evidencia usamos un arreglo en memoria que simula el
// almacenamiento de usuarios. Cada usuario registrado se guarda
// aquí como un objeto { usuario, contrasena }.
// (En un proyecto real esto se reemplazaría por una base de
// datos como MySQL).
const usuarios = [];

// -------------------------------------------------------------
// ENDPOINT: POST /api/register
// -------------------------------------------------------------
// Recibe los datos de registro enviados desde el formulario del
// frontend (usuario y contraseña) y los almacena en el arreglo
// "usuarios" para que luego puedan usarse en el login.
app.post("/api/register", (req, res) => {
  // Aceptamos ambos nombres de campo para conectar con el frontend actual
  // y con la API del backend. El frontend usa correo/password, mientras que
  // la lógica del servidor usa usuario/contrasena.
  const usuario = req.body.usuario ?? req.body.correo ?? req.body.email;
  const contrasena = req.body.contrasena ?? req.body.password;

  // Validación básica: si falta algún campo, respondemos con error.
  if (!usuario || !contrasena) {
    return res.status(400).json({
      error: "Debe enviar usuario y contraseña para registrarse",
    });
  }

  // Verificamos que el usuario no exista ya en el arreglo.
  const existe = usuarios.find((u) => u.usuario === usuario);
  if (existe) {
    return res.status(400).json({
      error: "El usuario ya se encuentra registrado",
    });
  }

  // Guardamos el nuevo usuario en la "base de datos" en memoria.
  usuarios.push({ usuario, contrasena });

  // Respondemos confirmando que el registro fue exitoso.
  return res.status(201).json({
    mensaje: "Usuario registrado correctamente",
  });
});

// -------------------------------------------------------------
// ENDPOINT: POST /api/login
// -------------------------------------------------------------
// Recibe usuario y contraseña, valida las credenciales contra el
// arreglo "usuarios" y responde según el resultado de la
// autenticación, tal como lo exige la guía:
//   - Éxito  -> 200 OK  { "mensaje": "Autenticación satisfactoria" }
//   - Fallo  -> 401 Unauthorized { "error": "Error en la autenticación" }
app.post("/api/login", (req, res) => {
  const usuario = req.body.usuario ?? req.body.correo ?? req.body.email;
  const contrasena = req.body.contrasena ?? req.body.password;

  // Buscamos un usuario cuyo usuario y contraseña coincidan
  // exactamente con los datos recibidos.
  const usuarioValido = usuarios.find(
    (u) => u.usuario === usuario && u.contrasena === contrasena
  );

  if (usuarioValido) {
    // Credenciales correctas: respondemos con HTTP 200 OK.
    return res.status(200).json({
      mensaje: "Autenticación satisfactoria",
    });
  } else {
    // Credenciales incorrectas: respondemos con HTTP 401 Unauthorized.
    return res.status(401).json({
      error: "Error en la autenticación",
    });
  }
});

// -------------------------------------------------------------
// INICIO DEL SERVIDOR
// -------------------------------------------------------------
// Ponemos el servidor a escuchar peticiones en el puerto definido.
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});