const express = require('express');
const app = express();
require("dotenv").config({ path: "./env/.env" }); 
if (process.env.NODE_ENV === "production") {
    require ("dotenv").config({ path: "./env/.env"});
}
//const session = require('express-session');
const http = require ("http");
const server = http.createServer(app);
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

app.use(cookieSession({
    name: 'session',
    keys: ['clave_secreta'],  // pon llaves fuertes
    maxAge: 24 * 60 * 60 * 1000 // 1 día
}));

server.listen(3000, () => { 
    console.log("Servidor corriendo en http://localhost:3000");
});

app.use((req, res, next) => {
  res.locals.login = req.session.loggedin || false;
  res.locals.rol = req.session.rol || 'publico';
  res.locals.usuario = req.session.usuario || null;
  next();
});

//express-session
//app.use(
//    session({
//        secret: "secret", 
//        resave: false, 
//        saveUninitialized: false, 
//    })
//);

app.use("/resources", express.static(__dirname + "/public")); 

app.set('view engine', 'ejs'); 
//app.set('views', path.join(__dirname, 'views'));

//middlewares
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cookieParser());

//rutas
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/courses"));


