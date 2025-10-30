const express = require('express');
const app = express();
require("dotenv").config({ path: "./env/.env" }); 
const session = require('express-session');

app.use(
    session({
        secret: "secret", 
        resave: false, 
        saveUninitialized: false, 

    })
);

app.listen(4000, () => { 
    console.log("Servidor corriendo en http://localhost:4000");
});

app.use((req, res, next) => {
  res.locals.login = req.session.loggedin || false;
  res.locals.rol = req.session.rol || 'publico';
  res.locals.usuario = req.session.usuario || null;
  next();
});

app.use("/resources", express.static(__dirname + "/public")); 

app.set('view engine', 'ejs'); 
//app.set('views', path.join(__dirname, 'views'));

//middlewares
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

//rutas
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/courses"));

// ✅ Middleware global para variables accesibles en todas las vistas
//app.use((req, res, next) => {
//  res.locals.user = req.session?.usuario || null;        // objeto usuario
//  res.locals.rol = req.session?.rol || 'publico';        // 'publico', 'registrado', 'admin'
//  res.locals.login = !!req.session?.loggedin;            // true / false
//  next();
//});

