const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs"); 
const db = require("../config/db");
const { body, validationResult } = require("express-validator");


router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register', { register: true});
});

//register-validation
router.post("/register",
  [
    body("nombre")
    .exists()
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres"),

    body("email")
    .exists()
    .isEmail()
    .withMessage("El email debe ser válido"),

    body("password")
    .exists()
    .isLength({ min: 4 })
    .withMessage("La contraseña debe tener al menos 4 caracteres")
  ],
  async (req, res) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
      res.render("register", {
        validaciones: errors.array(),
        valores: req.body
      });
    } else {

      const { nombre, email, password, rol } = req.body;
      const passwordHash = await bcrypt.hash(password, 8);

      db.query(
        "INSERT INTO usuarios SET ?",
        {
          nombre: nombre,
          email: email,
          password: passwordHash,
          rol: rol || 'registrado',
        },
        (error, results) => { 
          if (error) {
            console.log(error);
          } else {
            res.render("register", { 
              alert: true,
              alertTitle: 'Registro exitoso',
              alertMessage: 'Tu cuenta fue creada',
              alertIcon: 'success',
              showConfirmButton: false,
              timer: 2500,
              ruta: 'login' 
            });
          }
        }
      );
    }
  }
);

//login-autenticacion
router.post('/auth', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
  
     if (email && password) {
     db.query(
         "SELECT * FROM usuarios WHERE email = ?", 
         [email], 
         async (error, results) => {
             if (results.length == 0 ||
              !(await bcrypt.compare(password, results[0].password))
             ) {
                 res.render('login', {
                     alert: true,
                     alertTitle: 'Error',
                     alertMessage: 'Usuario y/o contraseña incorrectos',
                     alertIcon: 'error',
                     showConfirmButton: true,
                     timer: false,
                     ruta: 'login',
                     login: false,
                 });
             } else {

              const usuario = results[0];
            
              req.session.loggedin = true;
              req.session.usuario = results[0];
              req.session.rol = usuario.rol;

                 res.render('login', {
                     alert: true,
                     alertTitle: 'Conexion exitosa',
                     alertMessage: 'Has iniciado sesión correctamente',
                     alertIcon: 'success',
                     showConfirmButton: false,
                     timer: 1500,
                     ruta: '',
                     login: false,
                 });
             }
         }
     );
 } else {
     res.render('login', {
         alert: true,
         alertTitle: 'Advertencia',
         alertMessage: 'Ingrese el usuario y/o contraseña',
         alertIcon: 'error',
         showConfirmButton: true,
         timer: false,
         ruta: '',
         login: false,  
     });
    }
 });

//cerrar sesion
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});


module.exports = router;