const express = require('express');
const router = express.Router();
const db = require("../config/db");

router.get('/', (req, res) => {
   const usuario = req.session.usuario;

    res.render("index", {
        nombre: "THOT",
        experiencia: "Los milagros llegan a tu lado cuando empieces a aprender",
        login: req.session.loggedin || false,
        name: usuario ? usuario.nombre : "Invitado"
    });
});


module.exports = router;